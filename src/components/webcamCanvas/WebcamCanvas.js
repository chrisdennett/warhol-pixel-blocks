import React, { useRef } from "react";
import Webcam from "react-webcam";
import useInterval from "../../hooks/useInterval.js";

export const WebcamCanvas = ({
  showVideo = false,
  grabInterval = 100,
  setFrame,
}) => {
  const webcamRef = useRef(null);

  useInterval(() => {
    onFrameUpdate();
  }, grabInterval);

  const onFrameUpdate = () => {
    if (!webcamRef || !webcamRef.current) return;
    const frameCanvas = webcamRef.current.getCanvas();
    if (frameCanvas) {
      setFrame((prev) => {
        return { canvas: frameCanvas, counter: prev.counter + 1 };
      });
    }
  };

  return (
    <Webcam
      audio={false}
      height={320}
      style={!showVideo && { position: "fixed", left: -10000 }}
      ref={webcamRef}
      mirrored={true}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
    />
  );
};

const videoConstraints = {
  width: 800,
  height: 600,
  facingMode: "user",
};
