import React, { useState, useEffect } from 'react';

const Cursor = ({ cursorDirection }) => {
  const [cursorTop, setCursorTop] = useState(0);
  const [cursorLeft, setCursorLeft] = useState(0);
  const cursorSize = 50; // Width and height of the cursor element
  const cursorStep = 0.1; // Adjust this value to change cursor movement speed

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
    const moveDistance = cursorStep * Math.pow(magnitude, 3) / 9;
    if (magnitude) {
      switch (direction) {
        case 'up':
          setCursorTop((prevTop) => prevTop - moveDistance);
          break;
        case 'down':
          setCursorTop((prevTop) => prevTop + moveDistance);
          break;
        case 'left':
          setCursorLeft((prevLeft) => prevLeft - moveDistance);
          break;
        case 'right':
          setCursorLeft((prevLeft) => prevLeft + moveDistance);
          break;
        case 'up-left':
          setCursorTop((prevTop) => prevTop - moveDistance);
          setCursorLeft((prevLeft) => prevLeft - moveDistance);
          break;
        case 'up-right':
          setCursorTop((prevTop) => prevTop - moveDistance);
          setCursorLeft((prevLeft) => prevLeft + moveDistance);
          break;
        case 'down-left':
          setCursorTop((prevTop) => prevTop + moveDistance);
          setCursorLeft((prevLeft) => prevLeft - moveDistance);
          break;
        case 'down-right':
          setCursorTop((prevTop) => prevTop + moveDistance);
          setCursorLeft((prevLeft) => prevLeft + moveDistance);
          break;
        default:
          break;
      }
    }
  };


  useEffect(() => {
    moveCursor();
  }, [cursorTop, cursorLeft]);

  useEffect(() => {
    handleMove();
  }, [cursorDirection]);

  return (
    <React.Fragment>
      <div
        style={{
          position: 'absolute',
          backgroundColor: '#000',
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          borderRadius: '50%',
          top: `${cursorTop}px`,
          left: `${cursorLeft}px`,
          transition: 'top 0.5s, left 0.5s', // Add transition for smooth movement
        }}
      />
      <div>
        {cursorTop}
        {cursorLeft}
      </div>

    </React.Fragment>
  );
};

export default Cursor;






