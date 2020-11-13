import { area, curveBasis, scaleLinear, select } from "d3";
import * as R from "ramda";
import React, { useEffect, useRef, useState } from "react";

console.log("shoesonaasd");

const SAMPLES = 40;
const MAX_CHANNELS = 2;

const width = 800;
const height = 200;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const xScale = scaleLinear()
  .domain([0, SAMPLES - 1])
  .range([0, innerWidth]);
const yScale = scaleLinear().domain([0, 10]).range([innerHeight, 0]);
const shape = area<number>()
  .x((_, i) => xScale(i))
  .y0(innerHeight)
  .y1((d) => yScale(d))
  .curve(curveBasis);

// ----------------------------------------------------------------

const rms = R.compose(
  Math.sqrt,
  R.mean,
  R.map((x: number) => x ** 2),
);

const processChannel = (channelData: number[]): number[] =>
  R.compose(
    R.map(rms),
    R.splitEvery(Math.ceil(channelData.length / SAMPLES)),
  )(channelData);

// @todo send this process to a worker
const loadFile = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => resolve(reader.result as ArrayBuffer);
    reader.onerror = (e) => reject(new Error("Couldn't load file."));
  });

const getChannels = async (file: File): Promise<number[][]> => {
  const channels: number[][] = [];
  const audioContext = new AudioContext();
  const buffer = await loadFile(file);
  const audioData = await audioContext.decodeAudioData(buffer);
  for (let i = 0; i < Math.min(audioData.numberOfChannels, MAX_CHANNELS); i++) {
    channels.push(Array.from(audioData.getChannelData(i)));
  }
  return channels;
};

const loadAudioData = async (file: File): Promise<number[][]> => {
  const audioData = await getChannels(file);
  return audioData.map(processChannel);
};

// ----------------------------------------------------------------
type CurveProps = {
  file: File;
};
export default function Curve({ file }: CurveProps) {
  const [data, setData] = useState();
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const initialData = R.times((_) => 1, SAMPLES);
    const path = select(pathRef.current!)
      .datum(initialData)
      .transition()
      // @ts-ignore
      .attr("d", shape);
  }, [data]);

  useEffect(() => {
    const path = select(pathRef.current).datum(data);
  }, [data]);

  useEffect(() => {
    console.log("Audio data", loadAudioData(file));
  }, [file]);

  function shuffle() {
    console.log("XUFULE");
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      onClick={shuffle}
      style={{ border: "1px solid orange" }}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <path ref={pathRef} fill="tomato" />
      </g>
    </svg>
  );
}
