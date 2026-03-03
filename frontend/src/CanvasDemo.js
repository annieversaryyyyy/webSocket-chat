import React, { useEffect, useRef, useState } from "react";
import { apiUrl } from "./api/apiUrl";

function CanvasDemo() {
  const [state, setState] = useState({
    mouseDown: false,
    pixelsArray: [],
  });

  const ws = useRef(null);
  const canvas = useRef(null);
  const prevPos = useRef(null);

  useEffect(() => {
    const socket = new WebSocket(apiUrl);
    ws.current = socket;

    socket.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data);

      if (decodedMessage.type === "CONNECTED") {
        prevPos.current = null;
        decodedMessage.pixelsArray.forEach((coordinate) => {
          if (coordinate?.break) {
            prevPos.current = null;
            return;
          }
          updateCanvas(coordinate.x, coordinate.y);
        });
        setState((prevState) => ({
          ...prevState,
          pixelsArray: decodedMessage.pixelsArray,
        }));
      }

      if (decodedMessage.type === "NEW_PIXELS") {
        updateCanvas(decodedMessage.pixels.x, decodedMessage.pixels.y);

        setState((prevState) => ({
          ...prevState,
          pixelsArray: [...prevState.pixelsArray, decodedMessage.pixels],
        }));
      }

      if (decodedMessage.type === "STROKE_END") {
        prevPos.current = null;
      }
    };

    return () => {
      socket.close();
    };
  }, []);

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
    prevPos.current = null;
    ws.current?.send(
      JSON.stringify({
        type: "STROKE_END",
      }),
    );
  };

  const canvasMouseMoveHandler = (event) => {
    if (state.mouseDown) {
      const rect = canvas.current.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;

      updateCanvas(clientX, clientY);
      setState((prevState) => {
        return {
          ...prevState,
          pixelsArray: [
            ...prevState.pixelsArray,
            {
              x: clientX,
              y: clientY,
            },
          ],
        };
      });
      ws.current.send(
        JSON.stringify({
          type: "ADD_PIXELS",
          pixels: {
            x: clientX,
            y: clientY,
          },
        }),
      );
    }
  };

  const updateCanvas = (x, y) => {
    const context = canvas.current.getContext("2d");

    if (!prevPos.current) {
      prevPos.current = { x, y };
      return;
    }

    context.beginPath();
    context.moveTo(prevPos.current.x, prevPos.current.y);
    context.lineTo(x, y);
    context.strokeStyle = "black";
    context.lineWidth = 3;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

    prevPos.current = { x, y };
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
