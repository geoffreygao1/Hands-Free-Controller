import * as faceapi from 'face-api.js';
import React from 'react';
// import Webcam from "react-webcam";
import Header from './Header';
import './App.css';
import Cursor from './Cursor';

function App() {

  //State for model loaded and capture video
  const [modelsLoaded, setModelsLoaded] = React.useState(false);
  const [captureVideo, setCaptureVideo] = React.useState(false);

  //States for face coordinates
  //May need to change to single object to simplify
  const [leftEyeCoordinate, setleftEyeCoordinate] = React.useState([]);
  const [rightEyeCoordinate, setrightEyeCoordinate] = React.useState([]);
  const [noseCoordinate, setnoseCoordinate] = React.useState([]);
  const [mouthCoordinate, setmouthCoordinate] = React.useState([]);
  const [avgFacePosition, setavgFacePosition] = React.useState([]);

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
  React.useEffect(() => {
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

  //Calculates average face position when face moves
  React.useEffect(() => {
    calculateAvgFacePosition();
    processDirection();
  }, [noseCoordinate])

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
        if (resizedDetections[0] && resizedDetections[0]['landmarks']._positions.length == 68) {
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
    setmouthCoordinate(landmarksOutput[58]);
  }


  // Calculates center of face based on landmark locations
  const calculateAvgFacePosition = () => {
    const avgX = (leftEyeCoordinate.x + rightEyeCoordinate.x + noseCoordinate.x + mouthCoordinate.x) / 4;
    const avgY = (leftEyeCoordinate.y + rightEyeCoordinate.y + noseCoordinate.y + mouthCoordinate.y) / 4;
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

  // //Handle stop webcam
  // const closeWebcam = () => {
  //   videoRef.current.pause();
  //   videoRef.current.srcObject.getTracks()[0].stop();
  //   setCaptureVideo(false);
  // }

  return (
    <React.Fragment>
      <Header />
      < div >
        {
          captureVideo ?
            modelsLoaded ?
              <div class="container">
                <div style={{ display: 'flex', justifyContent: 'left', padding: '10px' }}>
                  <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                  <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                  <span class="deadzone"></span>
                </div>
              </div>
              :
              <div>loading...</div>
            :
            <>
            </>
        }
      </div >

      <Cursor cursorDirection={cursorDirection} />
      {cursorDirection}
      <h3>Coordinate Tracker</h3>
      <div>
        Cursor Direction: {cursorDirection[0]}, Magnitude: {Number.parseFloat(cursorDirection[1]).toFixed(0)}
      </div>
      <div>
        Center: {videoWidth / 2}, {videoHeight / 2}
      </div>
      {/* <div>
        Distance from deadzone: {Number.parseFloat(distanceToCenter - deadZone).toFixed(0)}
      </div> */}
      {/* Eventually replace with coordinate tracking component */}
      {/* <div>
        Average Face Position = [{avgFacePosition[0]}, {avgFacePosition[1]}]
      </div>
      <div>
        Left Eye:[{Number.parseFloat(leftEyeCoordinate._x).toFixed(1)},{Number.parseFloat(leftEyeCoordinate._y).toFixed(1)}]
      </div>
      <div>
        Right Eye: [{Number.parseFloat(rightEyeCoordinate._x).toFixed(1)},{Number.parseFloat(rightEyeCoordinate._y).toFixed(1)}]
      </div>
      <div>
        Nose: [{Number.parseFloat(noseCoordinate._x).toFixed(1)},{Number.parseFloat(noseCoordinate._y).toFixed(1)}]
      </div>
      <div>
        Mouth: [{Number.parseFloat(mouthCoordinate._x).toFixed(1)}, {Number.parseFloat(mouthCoordinate._y).toFixed(1)}]
      </div> */}

    </React.Fragment>

  );
}

export default App;