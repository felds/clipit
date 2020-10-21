import React, { useEffect, useRef } from "react";

const SAMPLES = 100;

function chunkify(audioBuffer: AudioBuffer): number[] {
  const rawData = audioBuffer.getChannelData(0);
  const blockSize = Math.floor(rawData.length / SAMPLES);
  const filteredData: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    filteredData.push(rawData[i * blockSize]);
  }

  return filteredData;
}

export default function Graph({ file }: { file: File }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(
    function audioGraph() {
      const audioContext = new AudioContext();
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as ArrayBuffer;
        audioContext
          .decodeAudioData(result)
          .then((decoded) => chunkify(decoded))
          .then((chunks) => {
            console.log(chunks);

            return chunks.map((chunk) => Math.pow(Math.abs(chunk), 1 / 2));
          })
          .then((chunks) => {
            console.log(chunks);

            const canvas = canvasRef.current!;
            const { offsetHeight: height, offsetWidth: width } = canvas;
            const ctx = canvas.getContext("2d")!;

            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();

            for (const [n, chunk] of chunks.entries()) {
              ctx.rect(n * 15, height, 10, -chunk * height);
              ctx.fillStyle = "tomato";
              ctx.fill();
            }
          });
      };
      reader.readAsArrayBuffer(file);
    },
    [file]
  );

  return (
    <canvas
      ref={canvasRef}
      width="1200"
      height="120"
      style={{ backgroundColor: "whitesmoke" }}
    />
  );
}
