import React, { useEffect, useRef, useState } from "react";

export default function Tchananan() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);

  function md(e) {
    console.log("Mouse Down", e.nativeEvent.offsetX);
    setStart(e.nativeEvent.offsetX);
    setEnd(null);
  }
  function mu(e) {
    console.log("Mouse Up", e.nativeEvent.offsetX);
    setEnd(e.nativeEvent.offsetX);
  }

  useEffect(() => {
    let meh: number;

    function tick() {
      const { width, height } = canvasRef.current!;
      const ctx = canvasRef.current!.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);

      if (start !== null && end !== null) {
        ctx.beginPath();
        ctx.rect(start, 10, end - start, height - 20);
        ctx.fillStyle = "gold";
        ctx.fill();
      }

      meh = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      console.log("CANCELANI");
      cancelAnimationFrame(meh);
    };
  }, [start, end]);

  return (
    <>
      <canvas
        className="tchananan"
        onMouseDown={md}
        onMouseUp={mu}
        ref={canvasRef}
      />
    </>
  );
}
