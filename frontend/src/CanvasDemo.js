import React, { useRef, useState } from "react";

function CanvasDemo() {
  const [state, setState] = useState({
    mouseDown: false,
    pixelsArray: [],
  });

  const canvas = useRef(null);
  const prevPos = useRef(null);

  const mouseDownHandler = (event) => {
    const rect = canvas.current.getBoundingClientRect();

    prevPos.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    setState({ ...state, mouseDown: true });
  };

  const mouseUpHandler = (event) => {
    setState({ ...state, mouseDown: false, pixelsArray: [] });
  };

  const canvasMouseMoveHandler = (event) => {
    if (state.mouseDown) {
      const rect = canvas.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setState((prevState) => {
        return {
          ...prevState,
          pixelsArray: [
            ...prevState.pixelsArray,
            {
              x: x,
              y: y,
            },
          ],
        };
      });
      const context = canvas.current.getContext("2d");
     
      context.beginPath();
      context.moveTo(prevPos.current.x, prevPos.current.y);
      context.lineTo(x, y);
      context.strokeStyle = "black";
      context.lineWidth = 3;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();

      prevPos.current = { x, y };
    }
  };

  return (
    <>
      <canvas
        ref={canvas}
        style={{ border: "1px solid black" }}
        width={400}
        height={400}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onMouseMove={canvasMouseMoveHandler}
      />
    </>
  );
}

export default CanvasDemo;
