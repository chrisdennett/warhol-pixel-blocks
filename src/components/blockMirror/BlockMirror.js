import React, { useEffect, useRef } from "react";
import {
  createBrightnessKeyCanvas,
  getBlockData,
  getSquareCanvas,
} from "../../logic/createBlockCanvas";
import { createCroppedCanvas } from "../../logic/createCroppedCanvas";
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
  flipX,
  flipY,
  canvasShape,
  imageTransparency,
  effectType,
  cropLeft,
  cropRight,
  cropTop,
  cropBottom,
  palleteSize,
  ...rest
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!frame.canvas) return;

    const inputCanvas = frame.canvas; // getSquareCanvas(frame.canvas);
    const croppedCanvas = createCroppedCanvas(inputCanvas, {
      top: cropTop,
      left: cropLeft,
      bottom: cropBottom,
      right: cropRight,
    });

    const imgRes = Math.round(croppedCanvas.width / blocksAcross);

    // make the block size the correct size to fit screen height
    const blockSize = Math.ceil(window.innerHeight / blocksAcross);
    let blockCanvas1 = null;
    let blockCanvas2 = null;
    let blockCanvas3 = null;
    let blockCanvas4 = null;

    // const palleteSize = 20;
    const blockData = getBlockData(croppedCanvas, imgRes, palleteSize);
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

    const blockCanvasW = blockCanvas1.width;
    const blockCanvasH = blockCanvas1.height;

    const canvas = canvasRef.current;
    canvas.width = blockCanvasW * 2;
    canvas.height = blockCanvasH * 2;
    const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (canvasShape === "circle") {
      const circleRadiusX = canvas.width / 2;
      const circleRadiusY = canvas.height / 2;
      const canvasMiddle = { x: circleRadiusX, y: circleRadiusY };
      ctx.beginPath();
      ctx.ellipse(
        canvasMiddle.x,
        canvasMiddle.y,
        circleRadiusX,
        circleRadiusY,
        0,
        Math.PI * 2,
        0
      );
      ctx.clip();
    }

    if (showImage) {
      ctx.save();
      ctx.globalAlpha = imageTransparency;
      ctx.drawImage(
        croppedCanvas,
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
      ctx.restore();
    }

    // top left
    ctx.drawImage(blockCanvas1, 0, 0);

    let scaleX = 1;
    let rightTranslatedX = blockCanvasW;
    let scaleY = 1;
    let bottomTranslateY = blockCanvasH;

    // top right
    if (flipX) {
      rightTranslatedX = -2 * blockCanvasW;
      scaleX = -1;
    }
    if (flipY) {
      bottomTranslateY = -2 * blockCanvasH;
      scaleY = -1;
    }

    ctx.save();
    // ctx.translate(rightTranslatedX, 0);
    ctx.scale(scaleX, 1);
    ctx.drawImage(blockCanvas2, rightTranslatedX, 0);
    ctx.restore();

    // bottom left
    ctx.save();
    ctx.scale(1, scaleY);
    ctx.drawImage(blockCanvas3, 0, bottomTranslateY);
    ctx.restore();

    // bottom right
    ctx.save();
    ctx.scale(scaleX, scaleY);
    ctx.drawImage(blockCanvas4, rightTranslatedX, bottomTranslateY);
    ctx.restore();
  });

  return (
    <div className={styles.blockMirror} id={id}>
      <canvas ref={canvasRef} />
    </div>
  );
}
