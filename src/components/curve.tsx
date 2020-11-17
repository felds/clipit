import { area, curveBasis, extent, scaleLinear, select } from "d3";
import React, { useEffect, useRef, useState } from "react";
import { loadAudioData } from "../util/sound";

/**
 * @todo send the audio processing to a worker
 */

const SAMPLES = 100;

const width = 1200;
const height = 200;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
console.log({ margin, width, height, innerWidth, innerHeight });

const xScale = scaleLinear()
  .domain([0, SAMPLES - 1])
  .range([0, innerWidth]);
const yScale = scaleLinear().domain([0, 10]).range([innerHeight, 0]);
const shape = area<number>()
  .x((_, i) => xScale(i))
  .y0(innerHeight)
  .y1((d) => yScale(d))
  .curve(curveBasis);

type CurveProps = {
  file: File;
  currentTime: number;
  duration: number;
};
export default function Curve({ file, currentTime, duration }: CurveProps) {
  const initialData = Array(SAMPLES).fill(0);
  const [data, setData] = useState(initialData);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const newDomain = extent(data) as [number, number];
    yScale.domain(newDomain);
    select(pathRef.current!).datum(data).transition().attr("d", shape);
  }, [data]);

  useEffect(() => {
    select(pathRef.current).datum(data);
  }, [data]);

  useEffect(() => {
    loadAudioData(file, SAMPLES).then((channels) => {
      const consolidate = channels[0];
      setData(consolidate);
    });
  }, [file]);

  // ---------------------------
  const playheadRef = useRef<SVGLineElement>(null);
  const playheadScale = scaleLinear()
    .domain([0, duration])
    .range([0, innerWidth]);
  useEffect(() => {
    select(playheadRef.current!)
      .datum(currentTime)
      .attr("x1", playheadScale)
      .attr("x2", playheadScale)
      .attr("y1", 0)
      .attr("y2", innerHeight);
  }, [currentTime, duration]);
  // ---------------------------

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ background: "whitesmoke" }}
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <path ref={pathRef} fill="rebeccapurple" />
        <line ref={playheadRef} strokeWidth="2" stroke="black" />
      </g>
    </svg>
  );
}
