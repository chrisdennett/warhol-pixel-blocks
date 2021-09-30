import React, { useEffect, useState } from "react";
import styles from "./imgPicker.module.css";

export default function ImgPicker({ setFrame }) {
  // const [imgSrc, setImgSrc] = useState("./linear-gradient.png");
  // const [imgSrc, setImgSrc] = useState("./plant.jpg");
  const [imgSrc, setImgSrc] = useState("./pexels-rompalli-harish-2235924.jpg");

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);

      setFrame((prev) => {
        return { canvas: c, counter: prev.counter + 1 };
      });
    };
    img.src = imgSrc;
  }, [imgSrc]);

  return (
    <div className={styles.imgPicker} style={{ display: "none" }}>
      <h1>imgPicker</h1>
      <img src="./pexels-rompalli-harish-2235924.jpg" />
    </div>
  );
}
