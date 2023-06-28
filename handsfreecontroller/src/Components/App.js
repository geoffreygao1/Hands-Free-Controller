import * as faceapi from 'face-api.js';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.js';
import './App.css';
import Cursor from './Cursor.js';
import HTML from './HTML.js';

function App() {

  //State for model loaded and capture video
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  //States for face coordinates
  //May need to change to single object to simplify
  const [leftEyeCoordinate, setleftEyeCoordinate] = React.useState([]);
  const [rightEyeCoordinate, setrightEyeCoordinate] = React.useState([]);
  const [noseCoordinate, setnoseCoordinate] = React.useState([]);
  const [mouthBottomCoordinate, setmouthBottomCoordinate] = React.useState([]);
  const [mouthTopCoordinate, setmouthTopCoordinate] = React.useState([]);
  const [avgFacePosition, setavgFacePosition] = React.useState([]);

  //States for mouth status (open/close)
  const [mouthOpen, setmouthOpen] = React.useState(false);

  //State for cursor control
  const deadZone = 15;
  const [distanceToCenter, setdistanceToCenter] = React.useState(0);
  const [cursorDirection, setCursorDirection] = React.useState([]);

  //Establish references for webcam and canvas
  const videoRef = React.useRef();
  const videoHeight = 120;
  const videoWidth = 160;
  const canvasRef = React.useRef();

  //Load Models on startup
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]).then(setModelsLoaded(true));
    }
    loadModels();
    startVideo();
  }, []);

  //Updates face position and mouth open status when face moves
  useEffect(() => {
    calculateAvgFacePosition();
    processDirection();
    processMouthTrigger();
  }, [noseCoordinate]);

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
        // canvasRef && canvasRef.current && canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
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
    setleftEyeCoordinate(landmarksOutput[20]);
    setrightEyeCoordinate(landmarksOutput[25]);
    setnoseCoordinate(landmarksOutput[31]);
    setmouthBottomCoordinate(landmarksOutput[58]);
    setmouthTopCoordinate(landmarksOutput[52]);
  }


  // Calculates center of face based on landmark locations
  const calculateAvgFacePosition = () => {
    const avgX = (leftEyeCoordinate.x + rightEyeCoordinate.x + noseCoordinate.x + mouthBottomCoordinate.x) / 4;
    const avgY = (leftEyeCoordinate.y + rightEyeCoordinate.y + noseCoordinate.y + mouthBottomCoordinate.y) / 4;
    setavgFacePosition([Number.parseFloat(avgX).toFixed(1), Number.parseFloat(avgY).toFixed(1)]);
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
      setCursorDirection(["up-right", distanceToCenter]);
    } else if (angle > 158 || angle < -158) {
      setCursorDirection(["right", distanceToCenter]);
    } else if (angle > 113 && angle < 157) {
      setCursorDirection(["down-right", distanceToCenter]);
    } else if (angle > 68 && angle < 112) {
      setCursorDirection(["down", distanceToCenter]);
    } else if (angle > 23 && angle < 67) {
      setCursorDirection(["down-left", distanceToCenter]);
    } else if (angle > -22 && angle < 22) {
      setCursorDirection(["left", distanceToCenter]);
    } else if (angle > -67 && angle < -23) {
      setCursorDirection(["up-left", distanceToCenter]);
    }
  }

  const processMouthTrigger = () => {
    const mouthTop = [mouthTopCoordinate._x, mouthTopCoordinate._y];
    const mouthBot = [mouthBottomCoordinate._x, mouthBottomCoordinate._y];
    const mouthOpenDistance = Math.sqrt(Math.pow((mouthTop[0] - mouthBot[0]), 2) + Math.pow((mouthTop[1] - mouthBot[1]), 2));
    (mouthOpenDistance > 12) ? setmouthOpen(true) : setmouthOpen(false);
  }

  // //Handle stop webcam
  // const closeWebcam = () => {
  //   videoRef.current.pause();
  //   videoRef.current.srcObject.getTracks()[0].stop();
  //   setCaptureVideo(false);
  // }

  return (
    <React.Fragment>
      <div >
        {
          captureVideo ?
            modelsLoaded ?
              <div className="container">
                <div className="videoBox" style={{ display: 'flex', justifyContent: 'left', padding: '10px' }}>
                  <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                  <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                  <span className="deadzone" style={{ left: videoWidth / 2 }}></span>
                </div>
              </div>
              :
              <div>loading...</div>
            :
            <>
            </>
        }
      </div >
      <Cursor cursorDirection={cursorDirection} mouthOpen={mouthOpen} />
      <HTML />
    </React.Fragment>
  );
}

export default App;
