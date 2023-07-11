import * as faceapi from 'face-api.js';
import React, { useEffect } from 'react';
import './App.css';
import Cursor from './Cursor.js';
import HTML from './HTML.js';

function App() {

  //State for face recognition remodel loaded, captureVideo started, and videoLoaded to web page
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);
  const [videoLoaded, setVideoLoaded] = React.useState(false);

  //States for face coordinates
  const [faceCoordinates, setFaceCoordinates] = React.useState({
    "leftEye": { 'x': 0, 'y': 0 },
    "rightEye": { 'x': 0, 'y': 0 },
    "nose": { 'x': 0, 'y': 0 },
    "mouthBot": { 'x': 0, 'y': 0 },
    "mouthTop": { 'x': 0, 'y': 0 }
  });
  const [avgFacePosition, setavgFacePosition] = React.useState([]);

  //States for mouth status (open/close)
  const [mouthOpen, setmouthOpen] = React.useState(false);

  //State for cursor control
  const deadZone = 15;
  const mouthClickThreshold = 10;
  const [distanceToCenter, setdistanceToCenter] = React.useState(0);
  const [cursorDirection, setCursorDirection] = React.useState([]);

  //Establish references for webcam and canvas
  const videoRef = React.useRef();
  const videoHeight = 90;
  const videoWidth = 120;
  const canvasRef = React.useRef();

  //Load Models on startup. This will change in the chrome extension version
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    }
    loadModels()
      .then(() => {
        startVideo();
      })
      .catch(error => {
        console.error('Error loading models:', error);
      });
  }, []);

  //Updates face position and mouth open status when face moves
  useEffect(() => {
    calculateAvgFacePosition();
    processDirection();
    processMouthTrigger();
  }, [faceCoordinates]);

  //Handle initiate Webcam
  const startVideo = () => {
    setCaptureVideo(true);
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        setTimeout(function () {
          video.play();
          setVideoLoaded(true);
        }, 100);
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  //Handle Video Processing
  const handleVideoOnPlay = () => {
    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        //Create display on page to match video dimensions
        canvasRef.current.innerHTML = faceapi.createCanvas(videoRef);
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }
        faceapi.matchDimensions(canvasRef.current, displaySize);

        //initiate detections
        const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        //Draw on canvas
        canvasRef.current.getContext('2d', { willReadFrequently: true });
        canvasRef && canvasRef.current && canvasRef.current.getContext('2d', { willReadFrequently: true });
        canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);


        //Output points
        if (resizedDetections[0] && resizedDetections[0]['landmarks']._positions.length === 68) {
          collectLandmarks(resizedDetections);
        }

      }
    }, 100)
  }

  //Save face landmark coordinates to state
  const collectLandmarks = (resizedDetections) => {
    var landmarksOutput = resizedDetections[0]['landmarks']._positions;
    setFaceCoordinates({
      "nose": landmarksOutput[31],
      "mouthBot": landmarksOutput[58],
      "mouthTop": landmarksOutput[52]
    });
  }

  // Calculates center of face based on landmark locations
  const calculateAvgFacePosition = () => {
    setavgFacePosition([videoWidth - Number.parseFloat(faceCoordinates.nose.x).toFixed(2), Number.parseFloat(faceCoordinates.nose.y).toFixed(2)]);
  }

  //Calculate direction based on landmark coordinates and dead zone
  const processDirection = () => {
    //Finds center of webcam input
    const canvasCenter = {
      "x": videoWidth / 2,
      "y": videoHeight / 2
    }
    const faceCenter = {
      "x": avgFacePosition[0],
      "y": avgFacePosition[1]
    }
    //Coordinate of average face point relative to center of canvas
    const normalizedFaceCoordinate = {
      "x": faceCenter.x - canvasCenter.x,
      "y": faceCenter.y - canvasCenter.y
    }
    //Find distance from center and compare to deadzone
    setdistanceToCenter(Math.sqrt(Math.pow((normalizedFaceCoordinate.x), 2) + Math.pow((normalizedFaceCoordinate.y), 2)));
    const angle = (Math.atan2(normalizedFaceCoordinate.y, normalizedFaceCoordinate.x) * 180 / Math.PI);
    if (distanceToCenter <= deadZone) {
      setCursorDirection(["deadzone", 0]);
    } else if (angle > -112 && angle < -68) {
      setCursorDirection(["up", distanceToCenter]);
    } else if (angle > -157 && angle < -113) {
      setCursorDirection(["up-left", distanceToCenter]);
    } else if (angle > 158 || angle < -158) {
      setCursorDirection(["left", distanceToCenter]);
    } else if (angle > 113 && angle < 157) {
      setCursorDirection(["down-left", distanceToCenter]);
    } else if (angle > 68 && angle < 112) {
      setCursorDirection(["down", distanceToCenter]);
    } else if (angle > 23 && angle < 67) {
      setCursorDirection(["down-right", distanceToCenter]);
    } else if (angle > -22 && angle < 22) {
      setCursorDirection(["right", distanceToCenter]);
    } else if (angle > -67 && angle < -23) {
      setCursorDirection(["up-right", distanceToCenter]);
    }
  }

  const processMouthTrigger = () => {
    const mouthTop = [faceCoordinates.mouthTop.x, faceCoordinates.mouthTop.y];
    const mouthBot = [faceCoordinates.mouthBot.x, faceCoordinates.mouthBot.y];
    const mouthOpenDistance = Math.sqrt(Math.pow((mouthTop[0] - mouthBot[0]), 2) + Math.pow((mouthTop[1] - mouthBot[1]), 2));
    (mouthOpenDistance > mouthClickThreshold) ? setmouthOpen(true) : setmouthOpen(false);
  }

  return (
    <React.Fragment>
      <div >
        {
          captureVideo ?
            (
              modelsLoaded ?
                (<div className="webcam-container">
                  <div className="videoBox">
                    <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} />
                    <canvas ref={canvasRef} />
                    {
                      videoLoaded ? (<span className="deadzone" style={{ top: videoHeight / 2, right: videoWidth / 2 }} />) : <></>
                    }
                  </div>
                </div>)
                :
                <div>loading...</div>
            ) : <></>
        }
      </div >
      {videoLoaded ? (<Cursor cursorDirection={cursorDirection} mouthOpen={mouthOpen} avgFacePosition={avgFacePosition} videoWidth={videoWidth} videoHeight={videoHeight} />) : <></>}
      <HTML />
    </React.Fragment>
  );

}

export default App;
