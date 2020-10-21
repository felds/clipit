import React, { useEffect, useRef } from "react";
import { clamp } from "../util/math";

type TchanananProps = {
  onChange?(values: [number, number]): void;
};
export default function Tchananan({ onChange }: TchanananProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(function canvasStuff() {
    let animationFrame: number | null = null;
    let isDragging = false;
    let startX: number | null = null;
    let endX: number | null = null;
    const canvas = canvasRef.current!;

    function mouseMove(e: MouseEvent) {
      if (!isDragging) return;
      endX = clamp(0, canvas.width, e.pageX - canvas.offsetLeft);
    }

    function mouseUp() {
      if (!isDragging) return;
      isDragging = false;
      onChange?.([-12, 14]);
    }

    function mouseDown(e: MouseEvent) {
      startX = clamp(0, canvas.width, e.pageX - canvas.offsetLeft);
      endX = startX;
      isDragging = true;
    }

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
    canvas.addEventListener("mousedown", mouseDown);

    function tick() {
      const { offsetWidth: width, offsetHeight: height } = canvas;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, width, height);

      if (startX !== null && endX !== null) {
        ctx.beginPath();
        ctx.rect(startX, 10, endX - startX, height - 20);
        ctx.fillStyle = "#ffffff80";
        ctx.fill();
      }

      animationFrame = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
      canvas.removeEventListener("mousedown", mouseDown);
      animationFrame && cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <canvas className="tchananan" ref={canvasRef} />
    </>
  );
}
