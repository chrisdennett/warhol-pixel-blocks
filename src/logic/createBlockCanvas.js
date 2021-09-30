const getIndividualBlockData = ({
  pixels,
  inputWidth,
  inputHeight,
  pixelsPerBlock = 100,
  blockCornerX = 0,
  blockCornerY = 0,
  palleteKeyIndexValues,
}) => {
  let totalPixels = 0;

  let totalRed = 0;
  let totalGreen = 0;
  let totalBlue = 0;

  // when at 38 blocks wide it seems to include more pixels for col
  // on far right

  // const pixelsPerCol =

  for (let y = blockCornerY; y < blockCornerY + pixelsPerBlock; y++) {
    for (let x = blockCornerX; x < blockCornerX + pixelsPerBlock; x++) {
      const i = (y * inputWidth + x) * 4;

      if (x < inputWidth && y < inputHeight) {
        totalRed += pixels[i];
        totalGreen += pixels[i + 1];
        totalBlue += pixels[i + 2];

        totalPixels++;
      }
    }
  }

  const r = totalRed / totalPixels;
  const g = totalGreen / totalPixels;
  const b = totalBlue / totalPixels;

  const brightness =
    totalRed * 0.2126 + totalGreen * 0.7152 + totalBlue * 0.0722;
  const decimalPercentage = 1 - brightness / (totalPixels * 255);

  const palleteKeyIndex = findClosestIndex(
    palleteKeyIndexValues,
    decimalPercentage
  );

  return { brightness: decimalPercentage, r, g, b, palleteKeyIndex };
};

function findClosestIndex(arr, num) {
  let nearestIndex = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > num) {
      break;
    }
    nearestIndex = i;
  }
  return nearestIndex;
}

export const getBlockData = (inputCanvas, pixelsPerBlock = 10, palleteSize) => {
  const { width: inputW, height: inputH } = inputCanvas;
  const palleteKeyIndexValues = [];
  const quantSize = 1 / palleteSize;

  for (let i = 0; i < palleteSize; i++) {
    palleteKeyIndexValues.push(i * quantSize);
  }
  const cols = Math.round(inputW / pixelsPerBlock);
  const rows = Math.round(inputH / pixelsPerBlock);

  const inputCtx = inputCanvas.getContext("2d");
  let imgData = inputCtx.getImageData(0, 0, inputW, inputH);
  let pixels = imgData.data;

  const blockData = [];

  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      const blockCornerX = x * pixelsPerBlock;
      const blockCornerY = y * pixelsPerBlock;

      const blockBrightness = getIndividualBlockData({
        pixels,
        inputWidth: inputW,
        inputHeight: inputH,
        pixelsPerBlock,
        blockCornerX,
        blockCornerY,
        palleteKeyIndexValues,
      });

      row.push(blockBrightness);
    }
    blockData.push(row);
  }

  return blockData;
};

export const createBrightnessSizeBlockCanvas = ({
  blockData,
  blockSize = 10,
  showPixels,
  pixelShape,
  pixelColour,
  useOriginalColour,
  lineThickness,
  showGrid = true,
  gridType = "square",
  gridThickness = 1,
  gridColour = "black",
  usePixelColour = false,
  // canvasShape,
}) => {
  const cols = blockData[0].length; // use first row
  const rows = blockData.length;

  const outWidth = cols * blockSize;
  const outHeight = rows * blockSize;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outWidth;
  outputCanvas.height = outHeight;
  const ctx = outputCanvas.getContext("2d");

  ctx.fillStyle = pixelColour;

  ctx.lineWidth = gridThickness * blockSize;
  ctx.lineCap = "round";

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const row = blockData[y];
      const blockCorner = { x: x * blockSize, y: y * blockSize };
      const { brightness, r, g, b } = row[x];

      const brightnessAbove = y === 0 ? 0 : blockData[y - 1][x].brightness;
      const brightnessLeft = x === 0 ? 0 : row[x - 1].brightness;
      const isLastRow = y === rows - 1;
      const isLastCol = x === cols - 1;

      ctx.strokeStyle = usePixelColour ? `rgb(${r}, ${g}, ${b})` : null;
      // draw grid under
      if (showGrid) {
        drawGridSquare({ ctx, blockCorner, blockSize, gridType });
      }

      if (showPixels) {
        drawBrightnessShape({
          ctx,
          type: pixelShape,
          blockSize,
          blockCorner,
          brightness,
          colour: useOriginalColour ? { r, g, b } : null,
          lineThickness,
          brightnessAbove,
          brightnessLeft,
          isLastRow,
          isLastCol,
        });
      }
    }
  }

  if (showGrid) {
    drawGrid({ ctx, blockSize, gridType, cols, rows });
  }

  return outputCanvas;
};

export const createBrightnessKeyCanvas = ({
  blockData,
  blockSize = 10,
  showPixels,
  pixelColour,
  useOriginalColour,
  lineThickness,
  showGrid = true,
  gridType = "square",
  pixelShape,
  gridThickness = 1,
  gridColour = "black",
  usePixelColour = false,
  palleteSize,
}) => {
  const cols = blockData[0].length;
  const rows = blockData.length;
  const outWidth = cols * blockSize;
  const outHeight = rows * blockSize;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outWidth;
  outputCanvas.height = outHeight;
  const ctx = outputCanvas.getContext("2d");

  ctx.fillStyle = pixelColour;

  ctx.lineWidth = gridThickness * blockSize;
  ctx.lineCap = "round";

  const paletteGreyStep = Math.round(255 / palleteSize);

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const row = blockData[y];
      const blockCorner = { x: x * blockSize, y: y * blockSize };
      const { palleteKeyIndex, r, g, b } = row[x];

      const brightnessAbove = y === 0 ? 0 : blockData[y - 1][x].brightness;
      const brightnessLeft = x === 0 ? 0 : row[x - 1].brightness;
      const isLastRow = y === rows - 1;
      const isLastCol = x === cols - 1;

      const nearestColour = {
        r: 255 - palleteKeyIndex * paletteGreyStep,
        g: 255 - palleteKeyIndex * paletteGreyStep,
        b: 255 - palleteKeyIndex * paletteGreyStep,
      };

      // if (y === 0 && x === 0) {
      //   console.log("palleteKeyIndex: ", palleteKeyIndex);
      //   console.log("paletteGreyStep: ", paletteGreyStep);
      //   console.log("nearestColour: ", nearestColour);
      // }

      ctx.strokeStyle = usePixelColour ? `rgb(${r}, ${g}, ${b})` : gridColour;
      // draw grid under
      if (showGrid) {
        drawGridSquare({ ctx, blockCorner, blockSize, gridType });
      }

      if (showPixels) {
        drawBrightnessShape({
          ctx,
          type: pixelShape,
          blockSize,
          blockCorner,
          brightness: 1,
          colour: useOriginalColour ? { r, g, b } : nearestColour,
          lineThickness,
          brightnessAbove,
          brightnessLeft,
          isLastRow,
          isLastCol,
        });
      }
    }
  }

  if (showGrid) {
    drawGrid({ ctx, blockSize, gridType, cols, rows });
  }

  return outputCanvas;
};

const drawGrid = ({ ctx, blockSize, gridType, cols, rows }) => {
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const blockCorner = { x: x * blockSize, y: y * blockSize };
      drawGridSquare({ ctx, blockCorner, blockSize, gridType });
    }
  }
};

const drawGridSquare = ({ ctx, blockCorner, blockSize, gridType }) => {
  const top = blockCorner.y;
  const left = blockCorner.x;
  const bottom = blockCorner.y + blockSize;
  const right = blockCorner.x + blockSize;
  const halfBlock = blockSize / 2;
  const middle = { x: left + halfBlock, y: top + halfBlock };

  if (gridType === "square") {
    ctx.strokeRect(left, top, blockSize, blockSize);
  } else if (gridType === "middleSquare") {
    ctx.strokeRect(middle.x, middle.y, blockSize, blockSize);
  } else if (gridType === "diagonal") {
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(right, bottom);
    ctx.stroke();
  }
};

const drawBrightnessShape = ({
  type = "square",
  blockCorner,
  brightness,
  blockSize,
  ctx,
  colour,
  lineThickness,
  brightnessAbove,
  brightnessLeft,
  isLastRow,
  isLastCol,
}) => {
  const brightnessSize = blockSize * brightness;
  const halfBlockSize = blockSize / 2;
  // const top = blockCorner.y;
  // const left = blockCorner.x;
  // const bottom = blockCorner.y + blockSize;
  // const right = blockCorner.x + blockSize;
  const middle = {
    x: blockCorner.x + halfBlockSize,
    y: blockCorner.y + halfBlockSize,
  };
  const offset = (blockSize - brightnessSize) / 2;

  const topOffset = blockCorner.y + offset;
  const bottomOffset = blockCorner.y + blockSize - offset;
  const leftOffset = blockCorner.x + offset;
  const rightOffset = blockCorner.x + blockSize - offset;

  if (colour) {
    ctx.fillStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
    // ctx.strokeStyle = `rgb(${colour.r}, ${colour.g}, ${colour.b})`;
  }

  // SHAPES
  // CENTER SQUARE
  if (type === "square") {
    ctx.fillRect(leftOffset, topOffset, brightnessSize, brightnessSize);
  }
  // SQUARE FROM CORNER
  else if (type === "squareCorner") {
    ctx.fillRect(blockCorner.x, blockCorner.y, brightnessSize, brightnessSize);
  }
  // CIRCLE
  else if (type === "circle") {
    ctx.beginPath();
    ctx.arc(middle.x, middle.y, brightnessSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  } else if (type === "star") {
    const inset = brightnessSize / 4;
    ctx.beginPath();
    ctx.moveTo(middle.x, bottomOffset);
    ctx.lineTo(leftOffset, topOffset + inset);
    ctx.lineTo(rightOffset, topOffset + inset);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(middle.x, topOffset);
    ctx.lineTo(rightOffset, bottomOffset - inset);
    ctx.lineTo(leftOffset, bottomOffset - inset);
    ctx.fill();
    ctx.closePath();
  } else if (type === "triangle") {
    ctx.beginPath();
    ctx.moveTo(middle.x, topOffset);
    ctx.lineTo(rightOffset, bottomOffset);
    ctx.lineTo(leftOffset, bottomOffset);
    ctx.fill();
    ctx.closePath();
  } else if (type === "cross") {
    const crossThickness = brightnessSize / 2.5;
    const halfCrossThickness = crossThickness / 2;

    ctx.fillRect(
      leftOffset,
      middle.y - halfCrossThickness,
      brightnessSize,
      crossThickness
    );
    ctx.fillRect(
      middle.x - halfCrossThickness,
      topOffset,
      crossThickness,
      brightnessSize
    );
  }
  // LINES
  else if (type === "line-vertical") {
    ctx.fillRect(middle.x, blockCorner.y, lineThickness, brightnessSize);
  } else if (type === "line-horizontal") {
    ctx.fillRect(blockCorner.x, middle.y, brightnessSize, lineThickness);
  } else if (type === "beaded-curtain-1") {
    // start from ^ at the top, widen to brightnes
    ctx.beginPath();

    // square bead
    ctx.moveTo(middle.x, blockCorner.y);
    ctx.lineTo(leftOffset, middle.y);
    ctx.lineTo(middle.x, blockCorner.y + blockSize);
    ctx.lineTo(rightOffset, middle.y);
    ctx.fill();
    ctx.closePath();
  } else if (type === "beaded-curtain-2") {
    // start from ^ at the top, widen to brightnes
    ctx.beginPath();
    ctx.moveTo(middle.x, blockCorner.y);
    // ctx.lineTo(leftOffset, middle.y);
    ctx.quadraticCurveTo(
      leftOffset,
      middle.y,
      middle.x,
      blockCorner.y + blockSize
    );
    ctx.quadraticCurveTo(rightOffset, middle.y, middle.x, blockCorner.y);
    ctx.fill();
    ctx.closePath();
  } else if (type === "insect-legs") {
    // start from ^ at the top, widen to brightnes
    const prevBrightness = 0.3;
    const prevBrightnessWidth = blockSize * prevBrightness;
    const prevOffset = (blockSize - prevBrightnessWidth) / 2;
    ctx.beginPath();
    ctx.moveTo(blockCorner.x + prevOffset, blockCorner.y);
    ctx.lineTo(blockCorner.x + blockSize - prevOffset, blockCorner.y);
    ctx.lineTo(rightOffset, blockCorner.y + blockSize);
    ctx.lineTo(leftOffset, blockCorner.y + blockSize);
    ctx.fill();
    ctx.closePath();
  } else if (type === "spindle-vertical") {
    // start from ^ at the top, widen to brightnes
    const prevBrightnessWidth = blockSize * brightnessAbove;
    const prevOffset = (blockSize - prevBrightnessWidth) / 2;
    ctx.beginPath();
    ctx.moveTo(blockCorner.x + prevOffset, blockCorner.y);
    ctx.lineTo(blockCorner.x + blockSize - prevOffset, blockCorner.y);

    if (isLastRow) {
      ctx.lineTo(middle.x, blockCorner.y + blockSize);
    } else {
      ctx.lineTo(rightOffset, blockCorner.y + blockSize);
      ctx.lineTo(leftOffset, blockCorner.y + blockSize);
    }
    ctx.fill();
    ctx.closePath();
  } else if (type === "spindle-horizontal") {
    // start from ^ at the top, widen to brightnes
    const prevBrightnessSize = blockSize * brightnessLeft;
    const prevOffset = (blockSize - prevBrightnessSize) / 2;

    ctx.beginPath();
    ctx.moveTo(blockCorner.x, blockCorner.y + prevOffset);

    if (isLastCol) {
      ctx.lineTo(blockCorner.x + blockSize, middle.y);
      ctx.lineTo(blockCorner.x, blockCorner.y + blockSize - prevOffset);
    } else {
      ctx.lineTo(blockCorner.x + blockSize, topOffset);
      ctx.lineTo(blockCorner.x + blockSize, bottomOffset);
      ctx.lineTo(blockCorner.x, blockCorner.y + blockSize - prevOffset);
    }
    ctx.fill();
    ctx.closePath();
  }
};

export const createBlockDifferenceCanvas = (
  blockData,
  prevBlockData,
  blockSize = 10,
  threshold = 0.2
) => {
  const cols = blockData[0].length;
  const rows = blockData.length;

  const outWidth = cols * blockSize;
  const outHeight = rows * blockSize;

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = outWidth;
  outputCanvas.height = outHeight;

  const outputCtx = outputCanvas.getContext("2d");

  let blockX, blockY;
  outputCtx.fillStyle = "black";
  const halfBlockSize = blockSize / 2;

  for (let y = 0; y < rows; y++) {
    const row = blockData[y];
    const prevBlockRow = prevBlockData[y];
    for (let x = 0; x < cols; x++) {
      // average the pixels in the area by looping through

      const blockCornerX = x * blockSize;
      const blockCornerY = y * blockSize;

      const blockBrightness = row[x];
      const prevBlockBrightness = prevBlockRow[x];
      const diff = Math.abs(blockBrightness - prevBlockBrightness);

      if (diff >= threshold) {
        // block width deterimined by brightness
        const brightnessSize = blockSize * blockBrightness;
        const offset = (blockSize - brightnessSize) / 2;

        // TODO this Block pos only works for vertical cetner alignment
        blockX = offset + blockCornerX;
        blockY = offset + blockCornerY;

        outputCtx.fillStyle = "black";

        outputCtx.beginPath();

        outputCtx.arc(
          blockX + halfBlockSize,
          blockY + halfBlockSize,
          brightnessSize / 2,
          0,
          Math.PI * 2
        );
        outputCtx.fill();

        outputCtx.closePath();
      } else {
        const redDotSize = 1;
        const offset = (blockSize - redDotSize) / 2;

        blockX = offset + blockCornerX;
        blockY = offset + blockCornerY;

        // outputCtx.fillStyle = "red";
        outputCtx.beginPath();

        outputCtx.arc(blockX, blockY, redDotSize, 0, Math.PI * 2);
        outputCtx.fill();

        outputCtx.closePath();
      }
    }
  }

  return outputCanvas;
};

// bizare finding - flipping x and y like this rotates the image
// ctx.fillRect(blockCorner.y, middle.x, 3, brightnessSize);

// use if don't want to clip blocks this is handy
// const checkIfPointIsInCircle = (a, b, x, y, r) => {
//   var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
//   r *= r;
//   if (dist_points < r) {
//     return true;
//   }
//   return false;
// };

export const getSquareCanvas = (inputCanvas) => {
  const outCanvas = document.createElement("canvas");
  const { width: inW, height: inH } = inputCanvas;
  const maxSize = inW > inH ? inH : inW;

  outCanvas.width = maxSize;
  outCanvas.height = maxSize;

  const xOffset = (inW - maxSize) / 2;
  const yOffset = (inH - maxSize) / 2;

  const ctx = outCanvas.getContext("2d");
  ctx.drawImage(
    inputCanvas,
    xOffset,
    yOffset,
    maxSize,
    maxSize,
    0,
    0,
    maxSize,
    maxSize
  );

  return outCanvas;
};
