import {
  area,
  curveBasis,
  extent,
  range,
  scaleLinear,
  scaleOrdinal,
  select,
} from "d3";
import React, { useEffect, useRef, useState } from "react";
import { loadAudioData } from "../util/sound";

/**
 * @todo send the audio processing to a worker
 */

const width = 1200;
const height = 120;
const margin = { top: 5, right: 5, bottom: 5, left: 5 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const numberOfSamples = width / 5;

// d3 configs
const xScale = scaleLinear()
  .domain([0, numberOfSamples - 1])
  .range([0, innerWidth]);
const yScale = scaleLinear().domain([0, 10]).range([innerHeight, 0]);
const shape = area<number>()
  .x((_, i) => xScale(i))
  .y0(innerHeight)
  .y1((d) => yScale(d))
  .curve(curveBasis);

type Fill = {
  color: string;
  mixBlendMode: string;
};
const fillScale = scaleOrdinal<number, Fill>().range([
  { color: "#6342bd", mixBlendMode: "normal" },
  { color: "#0050ff80", mixBlendMode: "normal" },
  { color: "#ff009080", mixBlendMode: "normal" },
]);

type CurveProps = {
  file: File;
  currentTime: number;
  duration: number;
};
export default function Curve({ file, currentTime, duration }: CurveProps) {
  const [data, setData] = useState<number[][]>([]);
  const pathsRef = useRef<SVGGElement>(null);

  // update the graph when de data changes
  useEffect(() => {
    const dom = extent(data.flat(2)) as [number, number];
    yScale.domain(dom);
    fillScale.domain(range(data.length).reverse());
    // fillScale.domain(range(data.length, 0))

    select(pathsRef.current!)
      .selectAll("path")
      .data(data)
      .join("path")
      .transition()
      .attr("d", shape)
      .attr("fill", (d, i) => fillScale(i).color);
    // .style("mix-blend-mode", (d, i) => fillScale(i).mixBlendMode);
  }, [data]);

  // update data when file changes
  useEffect(() => {
    loadAudioData(file, numberOfSamples).then(setData);
  }, [file]);

  // playhead
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
        <g ref={pathsRef} />
        {/* <path ref={pathRef} fill="rebeccapurple" /> */}
        <line ref={playheadRef} strokeWidth="2" stroke="black" />
      </g>
    </svg>
  );
}
