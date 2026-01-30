import { useState, useEffect } from "react";

const MOBILE_LAYOUT_THRESHOLD = 480;

function getWindowDimensions() {
  if (globalThis.window === undefined) {
    return { width: 0, height: 0 };
  }
  const vv = globalThis.window.visualViewport;
  const innerWidth = globalThis.window.innerWidth;
  const innerHeight = globalThis.window.innerHeight;
  const useVisualViewport =
    vv &&
    (innerWidth < MOBILE_LAYOUT_THRESHOLD || innerHeight < MOBILE_LAYOUT_THRESHOLD);

  if (useVisualViewport && vv) {
    return { width: vv.width, height: vv.height };
  }
  return { width: innerWidth, height: innerHeight };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions);

  useEffect(() => {
    function updateDimensions() {
      setWindowDimensions(getWindowDimensions());
    }

    globalThis.window.addEventListener("resize", updateDimensions);
    const vv = globalThis.window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", updateDimensions);
      vv.addEventListener("scroll", updateDimensions);
    }

    return () => {
      globalThis.window.removeEventListener("resize", updateDimensions);
      vv?.removeEventListener("resize", updateDimensions);
      vv?.removeEventListener("scroll", updateDimensions);
    };
  }, []);

  return windowDimensions;
}
