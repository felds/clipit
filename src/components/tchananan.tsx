import React, { useEffect, useRef } from "react";
import { clamp } from "../util/math";

type TchanananProps = {
  file: File;
  onChange?(values: [number, number]): void;
};
export default function Tchananan({ onChange, file }: TchanananProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(
    function canvasStuff() {
      let animationFrame: number | null = null;
      let isDragging = false;
      let start: number | null = null;
      let end: number | null = null;
      const canvas = canvasRef.current!;

      function mouseMove(e: MouseEvent) {
        if (!isDragging) return;
        end = clamp((e.pageX - canvas.offsetLeft) / canvas.width);
      }

      function mouseUp() {
        if (!isDragging) return;
        isDragging = false;
        if (start !== null && end !== null) onChange?.([start, end]);
      }

      function mouseDown(e: MouseEvent) {
        start = clamp((e.pageX - canvas.offsetLeft) / canvas.width);
        end = start;
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

        if (start !== null && end !== null) {
          const startX = start * width;
          const endX = end * width;

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
    },
    [file]
  );

  return (
    <>
      <canvas className="tchananan" ref={canvasRef} />
    </>
  );
}
