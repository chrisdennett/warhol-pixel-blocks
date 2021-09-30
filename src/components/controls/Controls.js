import React, { useEffect } from "react";
import { folder, Leva, useControls } from "leva";
import {
  useQueryParams,
  NumberParam,
  StringParam,
  BooleanParam,
} from "use-query-params";

export default function Controls({ showControls, onChange }) {
  const [query, setQuery] = useQueryParams({
    inputType: StringParam,
    canvasShape: StringParam,
    blocksAcross: NumberParam,
    pixelShape: StringParam,
    lineThickness: NumberParam,
    showImage: BooleanParam,
    imageTransparency: NumberParam,
    showPixels: BooleanParam,
    useOriginalColour: BooleanParam,
    pixelColour: StringParam,
    bgColour: StringParam,
    showGrid: BooleanParam,
    gridThickness: NumberParam,
    gridColour: StringParam,
  });

  const [values, set] = useControls(() => ({
    Input: folder({
      inputType: {
        value: "img",
        onChange: (value) => setQuery({ inputType: value }),
        options: ["video", "webcam", "img"],
      },
      image: {
        image: "./Dorothy-Wordsworth-face.png",
        render: (get) => get("Input.inputType") === "img",
      },
      canvasShape: {
        value: "square",
        options: ["circle", "square"],
        onChange: (option) => setQuery({ canvasShape: option }),
      },
      blocksAcross: {
        value: 42,
        min: 10,
        max: 500,
        onChange: (value) => setQuery({ blocksAcross: value }),
      },
    }),

    Brightness_Size_Options: folder({
      pixelShape: {
        value: "square",
        options: [
          "circle",
          "square",
          "squareCorner",
          "triangle",
          "star",
          "cross",
          "line-vertical",
          "line-horizontal",
          "beaded-curtain-1",
          "beaded-curtain-2",
          "insect-legs",
          "spindle-vertical",
          "spindle-horizontal",
        ],
        onChange: (value) => setQuery({ pixelShape: value }),
      },
      lineThickness: {
        value: 2,
        min: 1,
        max: 10,
        onChange: (value) => setQuery({ lineThickness: value.toFixed(2) }),
        render: (get) =>
          get("pixelShape") === "line-vertical" ||
          get("pixelShape") === "line-horizontal",
      },
    }),

    Layers: folder({
      showImage: {
        value: false,
        onChange: (value) => setQuery({ showImage: value }),
      },
      imageTransparency: {
        value: 0.5,
        min: 0.1,
        max: 1,
        onChange: (value) => setQuery({ imageTransparency: value.toFixed(2) }),
        render: (get) => get("Layers.showImage") === true,
      },
      showPixels: {
        value: true,
        onChange: (value) => setQuery({ showPixels: value }),
      },
    }),
    Colour: folder({
      useOriginalColour: {
        value: false,
        onChange: (value) => setQuery({ useOriginalColour: value }),
      },
      pixelColour: {
        value: "#6d5972",
        onChange: (value) => setQuery({ pixelColour: value }),
        render: (get) => get("Colour.useOriginalColour") === false,
      },
      bgColour: {
        value: "#ddccde",
        onChange: (value) => setQuery({ bgColour: value }),
      },
    }),
    Grid: folder({
      showGrid: {
        value: false,
        onChange: (value) => setQuery({ showGrid: value }),
      },
      gridThickness: {
        value: 0.1,
        step: 0.01,
        min: 0.1,
        max: 1,
        onChange: (value) => setQuery({ gridThickness: value }),
        render: (get) => get("Grid.showGrid") === true,
      },
      gridColour: {
        value: "#ddccde",
        onChange: (value) => setQuery({ gridColour: value }),
        render: (get) =>
          get("Grid.showGrid") === true && get("Grid.usePixelColour") === false,
      },
    }),
  }));

  useEffect(() => {
    const updatedKeys = Object.keys(query);
    if (updatedKeys.length > 0) {
      const updates = {};
      for (let key of updatedKeys) {
        updates[key] = query[key];
      }

      // set the controls based on the query
      set(updates);

      // update the app based on the query
      onChange({ ...values, ...updates });
    }
  }, [query]);

  return <Leva hidden={!showControls} />;
}

//#286f5f
//#a32323
