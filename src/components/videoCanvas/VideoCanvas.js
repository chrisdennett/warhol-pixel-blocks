import React, { useRef } from "react";
import useInterval from "../../hooks/useInterval";
import styles from "./videoCanvas.module.css";

export default function VideoCanvas({
  showVideo = false,
  grabInterval = 100,
  setFrame,
}) {
  const videoRef = useRef(null);

  useInterval(() => {
    onFrameUpdate();
  }, grabInterval);

  const onFrameUpdate = () => {
    if (!videoRef.current) return;
    const vid = videoRef.current;

    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = vid.width;
    frameCanvas.height = vid.height;
    const ctx = frameCanvas.getContext("2d");
    ctx.drawImage(vid, 0, 0);

    if (frameCanvas) {
      setFrame((prev) => {
        return { canvas: frameCanvas, counter: prev.counter + 1 };
      });
    }
  };

  return (
    <video
      className={styles.videoCanvas}
      ref={videoRef}
      style={!showVideo && { position: "fixed", opacity: 0 }}
      src="eye-edit.webm"
      autoPlay
      loop
      muted
      playsInline
      width="900"
      height="900"
    />
  );
}
