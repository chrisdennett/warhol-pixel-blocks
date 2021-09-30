import React, { useState } from "react";
import "./styles.css";
import { WebcamCanvas } from "./components/webcamCanvas/WebcamCanvas";
import BlockMirror from "./components/blockMirror/BlockMirror";
import useImageCanvas from "./hooks/useImageCanvas";
import VideoCanvas from "./components/videoCanvas/VideoCanvas";
import Controls from "./components/controls/Controls";

export default function App() {
  const [showControls, setShowControls] = useState(true);
  const [params, setParams] = useState({});
  const [frame, setFrame] = useState({ canvas: null, counter: 0 });

  const url = params && params.inputType === "img" ? params.image : null;

  useImageCanvas(url, (canvas) => {
    if (params.inputType !== "img") return;

    setFrame((prev) => {
      return { canvas, counter: prev + 1 };
    });
  });

  const toggleControls = (e) => {
    if (e.target.id === "app" || e.target.id === "canvas") {
      setShowControls((prev) => !prev);
    }
  };

  const onParamsChange = (newParams) => {
    setParams(newParams);
  };

  return (
    <div
      className="app"
      onClick={toggleControls}
      id="app"
      style={{ background: params.bgColour }}
    >
      <Controls showControls={showControls} onChange={onParamsChange} />

      <BlockMirror id="canvas" frame={frame} {...params} />

      {params.inputType === "video" && (
        <VideoCanvas showVideo={false} setFrame={setFrame} grabInterval={80} />
      )}

      {params.inputType === "webcam" && (
        <WebcamCanvas showVideo={false} setFrame={setFrame} grabInterval={80} />
      )}
    </div>
  );
}
