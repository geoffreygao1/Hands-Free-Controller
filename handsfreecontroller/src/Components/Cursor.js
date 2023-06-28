import React, { useState, useEffect } from 'react';
import './App.css';


const Cursor = ({ cursorDirection, mouthOpen }) => {
  //Cursor Position and movement states
  const [cursorTop, setCursorTop] = useState(window.innerHeight / 2);
  const [cursorLeft, setCursorLeft] = useState(window.innerWidth / 2);
  const cursorSize = 25; // Width and height of the cursor element
  const cursorStep = 0.05; // Adjust this value to change cursor movement speed

  //Cursor interaction states
  const [interactionEnabled, setInteractionEnabled] = useState(false);
  const [cursorColor, setcursorColor] = useState('blue');

  //Handles updating cursor position
  useEffect(() => {
    handleMove();
  }, [cursorDirection]);

  //Handles moving the HTML cursor element
  useEffect(() => {
    moveCursor();
  }, [cursorTop, cursorLeft]);

  //Handles cursor click functionaity
  useEffect(() => {
    cursorClick();
    handleInteraction();
  }, [mouthOpen]);

  const moveCursor = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Constrain cursor movement within the window boundaries
    const constrainedTop = Math.max(Math.min(cursorTop, windowHeight - cursorSize), 0);
    const constrainedLeft = Math.max(Math.min(cursorLeft, windowWidth - cursorSize), 0);
    setCursorTop(constrainedTop);
    setCursorLeft(constrainedLeft);
  };

  const handleMove = () => {
    const [direction, magnitude] = cursorDirection;
    //exponentially scales movement farther you drag
    const moveDistance = cursorStep * Math.pow(magnitude / 2, 1.5);
    //Easier to move left and right than up and own
    const upDownMoveDistance = moveDistance * 2.5;
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
  };

  const cursorClick = () => {
    mouthOpen ? setcursorColor('red') : setcursorColor('blue');
    setInteractionEnabled(mouthOpen);
  }

  const handleInteraction = () => {
    if (interactionEnabled) {
      const cursorX = cursorLeft + cursorSize / 2; // Adjusted X coordinate
      const cursorY = cursorTop + cursorSize / 2; // Adjusted Y coordinate
      const hoveredElement = document.elementFromPoint(cursorX, cursorY);
      if (
        hoveredElement &&
        hoveredElement.tagName.toLowerCase() !== 'div' &&
        hoveredElement !== document.body
      ) {
        hoveredElement.style.backgroundColor = '#0f0'; // Change background color
        console.log('Clicked!');
      }
    }
  };


  return (
    <React.Fragment>
      <div
        className="cursor"
        style={{
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          top: `${cursorTop - cursorSize / 2}px`, // Subtract half of cursorSize
          left: `${cursorLeft - cursorSize / 2}px`, // Subtract half of cursorSize
          background: `${cursorColor}`
        }
        }
      />
    </React.Fragment>
  );
};

export default Cursor;






