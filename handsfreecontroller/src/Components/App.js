import * as faceapi from 'face-api.js';
import React from 'react';
// import Webcam from "react-webcam";
import Header from './Header';

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
  const [cursorDirection, setCursorDirection] = React.useState(null)

  //Establish references for webcam and canvas
  const videoRef = React.useRef();
  const videoHeight = 240;
  const videoWidth = 320;
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
        // canvasRef && canvasRef.current && faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

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
    //Deadzone radius for directionality
    const deadZone = 5;
    //Finds center of webcam input
    const canvasCenter = {
      "x": videoHeight / 2,
      "y": videoWidth / 2
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
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                  <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                  <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                </div>
              </div>
              :
              <div>loading...</div>
            :
            <>
            </>
        }
      </div >
      <h3>Coordinate Tracker</h3>
      <div>
        Cursor Direction: {cursorDirection}
      </div>
      {/* Eventually replace with coordinate tracking component */}
      <div>
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
      </div>

    </React.Fragment>

  );
}

export default App;