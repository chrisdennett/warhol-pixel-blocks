const DEFAULT_CROP_VALUES = {
  leftPercent: 0,
  rightPercent: 1,
  topPercent: 0,
  bottomPercent: 1,
};

export const createCroppedCanvas = (
  sourceCanvas,
  cropData,
  backgroundColour = "red"
) => {
  // if there's no cropping just return the sourceCanvas unchanged
  if (!cropData || cropData === DEFAULT_CROP_VALUES) {
    return sourceCanvas;
  }

  const { top, right, bottom, left } = cropData;
  const { width: sourceWidth, height: sourceHeight } = sourceCanvas;

  const outputCanvas = document.createElement("canvas");

  const leftCrop = sourceWidth * left;
  const rightCrop = sourceWidth * (1 - right);
  const topCrop = sourceHeight * top;
  const bottomCrop = sourceHeight * (1 - bottom);
  let croppedWidth = sourceCanvas.width - (leftCrop + rightCrop);
  let croppedHeight = sourceCanvas.height - (topCrop + bottomCrop);

  outputCanvas.width = croppedWidth;
  outputCanvas.height = croppedHeight;

  const ctx = outputCanvas.getContext("2d");

  ctx.fillStyle = backgroundColour;
  ctx.clearRect(0, 0, croppedWidth, croppedHeight);

  ctx.drawImage(
    sourceCanvas,
    leftCrop,
    topCrop,
    croppedWidth,
    croppedHeight,
    0,
    0,
    croppedWidth,
    croppedHeight
  );

  return outputCanvas;
};
