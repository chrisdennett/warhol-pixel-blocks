import { useRef, useEffect } from "react";

export const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]); // Make sure the effect runs only once
};

// const thing = (cb, deps) => {
//   const frame = useRef();
//   const last = useRef(performance.now());
//   const init = useRef(performance.now());

//   const animate = () => {
//     const now = performance.now();
//     const time = (now - init.current) / 1000;
//     const delta = (now - last.current) / 1000;
//     // In seconds ~> you can do ms or anything in userland
//     cb({ time, delta });
//     last.current = now;
//     frame.current = requestAnimationFrame(animate);
//   };

//   useEffect(() => {
//     frame.current = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(frame.current);
//   }, deps); // Make sure to change it if the deps change
// };
