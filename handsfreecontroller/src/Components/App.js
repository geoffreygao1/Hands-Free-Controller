import './App.css';
import React, { useRef, useEffect } from "react";
import Header from "./Header";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js"



function App() {
  //Setup references for on-screen components
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  return (
    <React.Fragment>
      <Header />
      <div className="App">
        <Webcam ref={webcamRef} style={
          {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }
        }
        />
        <canvas ref={canvasRef} style={
          {
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480
          }
        }
        />
      </div>
    </React.Fragment>

  );
}

export default App;
