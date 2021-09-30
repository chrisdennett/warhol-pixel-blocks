import React, { useEffect, useRef } from "react";
import {
  createBrightnessKeyCanvas,
  getBlockData,
  getSquareCanvas,
} from "../../logic/createBlockCanvas";
import styles from "./blockMirror.module.css";

export default function BlockMirror({
  frame,
  id,
  showImage,
  showShadow,
  blocksAcross,
  pixelColour1,
  pixelColour2,
  pixelColour3,
  pixelColour4,
  bg1,
  bg2,
  bg3,
  bg4,
  canvasShape,
  imageTransparency,
  effectType,
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame.canvas) return;

    const inputCanvas = frame.canvas; // getSquareCanvas(frame.canvas);
    const imgRes = Math.round(inputCanvas.width / blocksAcross);

    // make the block size the correct size to fit screen height
    const blockSize = Math.ceil(window.innerHeight / blocksAcross);
    let blockCanvas1 = null;
    let blockCanvas2 = null;
    let blockCanvas3 = null;
    let blockCanvas4 = null;

    const palleteSize = 20;
    const blockData = getBlockData(inputCanvas, imgRes, palleteSize);
    blockCanvas1 = createBrightnessKeyCanvas({
      blockData,
      blockSize,
      palleteSize,
      pixelColour: pixelColour1,
      bgColour: bg1,
      ...rest,
    });
    blockCanvas2 = createBrightnessKeyCanvas({
      blockData,
      blockSize,
      palleteSize,
      pixelColour: pixelColour2,
      bgColour: bg2,
      ...rest,
    });
    blockCanvas3 = createBrightnessKeyCanvas({
      blockData,
      blockSize,
      palleteSize,
      pixelColour: pixelColour3,
      bgColour: bg3,
      ...rest,
    });
    blockCanvas4 = createBrightnessKeyCanvas({
      blockData,
      blockSize,
      palleteSize,
      pixelColour: pixelColour4,
      bgColour: bg4,
      ...rest,
    });

    if (!blockCanvas1) return null;

    const canvas = canvasRef.current;
    canvas.width = blockCanvas1.width * 2;
    canvas.height = blockCanvas1.height * 2;
    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (canvasShape === "circle") {
      const circleRadius = canvas.width / 2;
      const canvasMiddle = { x: circleRadius, y: circleRadius };
      ctx.beginPath();
      ctx.arc(canvasMiddle.x, canvasMiddle.y, circleRadius, 0, Math.PI * 2);
      ctx.clip();
    }

    if (showImage) {
      ctx.save();
      ctx.globalAlpha = imageTransparency;
      ctx.drawImage(
        squareCanvas,
        0,
        0,
        squareCanvas.width,
        squareCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      ctx.restore();
    }

    ctx.drawImage(blockCanvas1, 0, 0);
    ctx.drawImage(blockCanvas2, blockCanvas1.width, 0);
    ctx.drawImage(blockCanvas3, 0, blockCanvas1.height);
    ctx.drawImage(blockCanvas4, blockCanvas1.width, blockCanvas1.height);
  });

  return (
    <div className={styles.blockMirror} id={id}>
      <canvas ref={canvasRef} />
    </div>
  );
}
