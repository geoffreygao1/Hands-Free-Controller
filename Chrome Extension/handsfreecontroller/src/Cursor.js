import React, { useState, useEffect, useRef } from 'react';
import { KeyboardReact as Keyboard } from "react-simple-keyboard";
import './App.css';
import "react-simple-keyboard/build/css/index.css";

const Cursor = ({ cursorDirection, mouthOpen, avgFacePosition, videoWidth, videoHeight }) => {
  //Cursor Position and movement states
  const [cursorTop, setCursorTop] = useState(window.innerHeight / 2);
  const [cursorLeft, setCursorLeft] = useState(window.innerWidth / 2);
  const cursorSize = 25; // Width and height of the cursor element
  const cursorStep = 0.07; // Adjust this value to change cursor movement speed

  //Cursor interaction states
  const [cursorControlMode, setCursorControlMode] = useState('absolute');
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const [cursorColor, setCursorColor] = useState('blue');

  //Keyboard States
  const [keyboardInput, setKeyboardInput] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [layout, setLayout] = useState("default");
  const [activeTextInput, setActiveTextInput] = useState(null);
  const [keyboardPosition, setKeyboardPosition] = useState({ top: 0, left: 0 });
  const keyboard = useRef();

  //Scroll States
  const [scrollAmt, setScrollAmt] = useState(0);

  //Keyboard Display customizations
  const customDisplay = {
    "{shift}": "⇧",
    "{space}": " ",
    "{bksp}": "⌫",
    "{enter}": "Submit",
    "{lock}": "Hide",
    "{tab}": "Clear"
  };

  //Mouse overlay, allows user to use a mouse as well as webcam input
  useEffect(() => {
    const overlayDiv = document.getElementById('overlayDiv');
    overlayDiv.addEventListener('mousemove', handleMouseMovement);
    overlayDiv.addEventListener('mousedown', handleMouseClick);
    overlayDiv.addEventListener('mouseup', handleMouseRelease);
    window.addEventListener("scroll", handleScroll);

    return () => {
      overlayDiv.removeEventListener('mousemove', handleMouseMovement);
      overlayDiv.removeEventListener('mousedown', handleMouseClick);
      overlayDiv.removeEventListener('mouseup', handleMouseRelease);
    };

  }, []);

  //Handles updating cursor position
  useEffect(() => {
    handleMove();
  }, [cursorDirection]);

  //Handles moving the HTML cursor element
  useEffect(() => {
    moveCursor();
  }, [cursorTop, cursorLeft]);

  //Handles cursor click functionaity and changes color
  useEffect(() => {
    if (mouthOpen) {
      setInteractionEnabled(mouthOpen);
      handleInteraction();
    }
    mouthOpen ? setCursorColor('red') : setCursorColor('blue');
  }, [mouthOpen]);

  //Handles executing the interaction when an cursor is triggered
  useEffect(() => {
    handleInteraction();
  }, [interactionEnabled]);

  //Updates active text box when keyboardInput changes
  useEffect(() => {
    if (activeTextInput) {
      activeTextInput.value = keyboardInput;
    }
  }, [keyboardInput]);

  // Updates active text box when keyboardInput changes or when keyboard visibility is toggled
  useEffect(() => {
    if (activeTextInput && keyboardVisible) {
      // Get the position of the active text input element
      const { top, left, height } = activeTextInput.getBoundingClientRect();
      // Set the position for the keyboard
      setKeyboardPosition({ top: top + height, left });
    }
  }, [keyboardInput, keyboardVisible, activeTextInput]);

  //Handles Scroll Changing
  useEffect(() => {
    handleScroll();
  }, [scrollAmt, cursorTop]);

  useEffect(() => {
    const deadzone = document.querySelector('.deadzone');
    (cursorControlMode === 'absolute') ? deadzone.style.display = 'none' : deadzone.style.display = 'block';
  }, [cursorControlMode])

  //Moves the cursor within limitations of window
  const moveCursor = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = document.body.scrollHeight;
    // Calculate the maximum top position to stay within the visible window
    const maxTop = document.documentElement.clientHeight;

    // Constrain cursor movement within the window boundaries
    const constrainedTop = Math.max(Math.min(cursorTop, maxTop), 0);
    const constrainedLeft = Math.max(Math.min(cursorLeft, windowWidth), 0);
    setCursorTop(constrainedTop);
    setCursorLeft(constrainedLeft);
  };

  //Controls cursor movement parameters such as speed and direction
  const handleMove = () => {
    if (cursorControlMode === 'relative') {
      const [direction, magnitude] = cursorDirection;
      //exponentially scales movement farther you drag
      const moveDistance = cursorStep * Math.pow(magnitude / 2, 2);
      //Easier to move left and right than up and own
      const upDownMoveDistance = moveDistance * 4;
      //Cursor Movement Logic
      if (magnitude) {
        switch (direction) {
          case 'up':
            setCursorTop((prevTop) => prevTop - upDownMoveDistance);
            break;
          case 'down':
            setCursorTop((prevTop) => prevTop + upDownMoveDistance);
            break;
          case 'left':
            setCursorLeft((prevLeft) => prevLeft - moveDistance);
            break;
          case 'right':
            setCursorLeft((prevLeft) => prevLeft + moveDistance);
            break;
          case 'up-left':
            setCursorTop((prevTop) => prevTop - upDownMoveDistance);
            setCursorLeft((prevLeft) => prevLeft - moveDistance);
            break;
          case 'up-right':
            setCursorTop((prevTop) => prevTop - upDownMoveDistance);
            setCursorLeft((prevLeft) => prevLeft + moveDistance);
            break;
          case 'down-left':
            setCursorTop((prevTop) => prevTop + upDownMoveDistance);
            setCursorLeft((prevLeft) => prevLeft - moveDistance);
            break;
          case 'down-right':
            setCursorTop((prevTop) => prevTop + upDownMoveDistance);
            setCursorLeft((prevLeft) => prevLeft + moveDistance);
            break;
          default:
            break;
        }
      }
    } else if (cursorControlMode === 'absolute') {
      const [x, y] = avgFacePosition;
      //scaling factor so you don't have to move your head so far
      const scalingFactor = 2;
      const viewCenterX = window.innerWidth / 2;
      const viewCenterY = window.innerHeight / 2;
      const offsetY = scalingFactor * 1.4 * viewCenterY * (y - (videoHeight / 2)) / (videoHeight / 2);
      const offsetX = scalingFactor * viewCenterX * (x - (videoWidth / 2)) / (videoWidth / 2);
      setCursorTop(viewCenterY + offsetY);
      setCursorLeft(viewCenterX + offsetX);
    }
  };


  const handleInteraction = () => {
    if (interactionEnabled) {
      const cursorX = cursorLeft + cursorSize / 2;
      const cursorY = cursorTop + cursorSize / 2;
      const radius = 50; // Adjust the radius value as needed
      const elements = document.elementsFromPoint(cursorLeft, cursorTop);

      //Checks if cursor is over button or keyboard container
      const buttonContainer = document.querySelector('.button-container');
      const isCursorOverButtonContainer =
        buttonContainer &&
        cursorX >= buttonContainer.offsetLeft &&
        cursorX <= buttonContainer.offsetLeft + buttonContainer.offsetWidth &&
        cursorY >= buttonContainer.offsetTop &&
        cursorY <= buttonContainer.offsetTop + buttonContainer.offsetHeight;

      const keyboardContainer = (document.querySelector('.keyboard-container')) ? document.querySelector('.keyboard-container').parentNode : null;
      const isCursorOverKeyboardContainer =
        keyboardContainer &&
        cursorX >= keyboardContainer.offsetLeft &&
        cursorX <= keyboardContainer.offsetLeft + keyboardContainer.offsetWidth &&
        cursorY >= keyboardContainer.offsetTop &&
        cursorY <= keyboardContainer.offsetTop + keyboardContainer.offsetHeight;


      elements.forEach((element) => {
        const elementRect = element.getBoundingClientRect();
        const elementX = elementRect.left + elementRect.width / 2;
        const elementY = elementRect.top + elementRect.height / 2;


        //Blocks interaction if the cursor is over the button or keyboard containers and the element is not within them
        if (isCursorOverButtonContainer && !buttonContainer.contains(element)) {
          return true;
        }

        if (isCursorOverKeyboardContainer && !keyboardContainer.contains(element)) {
          return true;
        }

        //radius of click
        const distance = Math.sqrt(
          Math.pow(cursorX - elementX, 2) + Math.pow(cursorY - elementY, 2)
        );

        if (distance <= radius) {
          //Checks if element is an text input to open keyboard
          if (element.tagName === 'INPUT' && element.getAttribute('type') === 'text') {
            setActiveTextInput(element); // Set the active text input
            setKeyboardVisible(true);
          } else if (element.getAttribute('data-skbtn')) {
            //Implemented because react-simple-keyboard won't interact with mouth triggered click
            const buttonValue = element.getAttribute('data-skbtn');
            switch (buttonValue) {
              case '{bksp}':
                setKeyboardInput((prevInput) => prevInput.slice(0, -1));
                break;
              case '{space}':
                setKeyboardInput((prevInput) => prevInput + ' ');
                break;
              //Caps was renamed to hide
              case '{lock}':
                handleKeyboardSubmit();
                break;
              case '{shift}':
                handleKeyPress('{shift}')
                break;
              //Tab was renaimed to clear
              case '{tab}':
                setKeyboardInput('');
                activeTextInput.value = ('');
                break;
              case '{enter}':
                handleKeyboardSubmit();
                break;
              default:
                setKeyboardInput((prevInput) => prevInput + buttonValue);
                break;
            }
          } else {
            element.click();
          }
        }
      });
    }
  };

  const handleMouseMovement = (event) => {
    setCursorTop(event.clientY);
    setCursorLeft(event.clientX);
  };

  const handleMouseClick = () => {
    setCursorColor('red');
    setInteractionEnabled(true);
  };

  const handleMouseRelease = () => {
    setCursorColor('blue');
    setInteractionEnabled(false);
  };

  //If submit button is pressed, clears and minimizes keyboard input and resets active text input control
  const handleKeyboardSubmit = () => {
    setActiveTextInput(null);
    setKeyboardInput('');
    setKeyboardVisible(false);
  };

  //Toggles caps display of keyboard
  const handleKeyPress = (button) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayout((layout === "default") ? "shift" : "default");
    }
  }

  const handleScroll = () => {
    setScrollAmt(window.scrollY);
  }

  const scrollUp = () => {
    window.scrollBy(0, window.innerHeight * -0.8);
    setKeyboardVisible(false);
  }

  const scrollDown = () => {
    window.scrollBy(0, window.innerHeight * 0.8);
    setKeyboardVisible(false);
  }

  const toggleCursorControlMode = () => {
    cursorControlMode === 'absolute' ? setCursorControlMode('relative') : setCursorControlMode('absolute');
  }

  return (
    <React.Fragment>
      <div className="button-container">
        <button className="button-56 cursorControl" style={
          { backgroundColor: cursorControlMode === 'absolute' ? '#DAE9FF' : '#FFDEDA' }
        } onClick={toggleCursorControlMode}>
          <a className="text">{cursorControlMode === "absolute" ? 'A' : 'R'}</a>
        </button>
        <button className="button-56 scrollUp" onClick={scrollUp}>
          <a className="text">&uarr;</a>
        </button>
        <button className="button-56 scrollDown" onClick={scrollDown}>
          <a className="text">&darr;</a>
        </button>
      </div >
      < div
        id="overlayDiv"
        className="overlay" >
        <div
          className="cursor"
          style={{
            width: `${cursorSize}px`,
            height: `${cursorSize}px`,
            top: `${cursorTop - cursorSize / 2}px`,
            left: `${cursorLeft - cursorSize / 2}px`,
            background: `${cursorColor}`
          }}>
        </div>

        {
          keyboardVisible ? (
            <div
              style={{
                position: 'fixed',
                top: `${keyboardPosition.top}px`,
                left: `${keyboardPosition.left}px`,
              }}
            >
              <div className="keyboard-container">
                <Keyboard
                  keyboardRef={r => (keyboard.current = r)}
                  theme={"hg-theme-default hg-layout-default myTheme"}
                  layoutName={layout}
                  onKeyPress={handleKeyPress}
                  display={customDisplay}
                  buttonTheme={[
                    {
                      class: "hg-red",
                      buttons: "{tab}"
                    },
                    {
                      class: "hg-green",
                      buttons: "{enter}"
                    },
                    {
                      class: "hg-yellow",
                      buttons: "{lock}"
                    }
                  ]}
                />
              </div>
            </div>
          ) : <></>
        }
      </div>
    </React.Fragment >
  );
};

export default Cursor;