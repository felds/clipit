import { area, brushX, curveBasis, extent, scaleLinear, select } from "d3";
import React, { useEffect, useRef, useState } from "react";
import { loadAudioData } from "../util/sound";

/**
 * @todo send the audio processing to a worker
 */

const width = 1200;
const height = 120;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const numberOfSamples = width / 5;

// d3 configs
const xScale = scaleLinear()
  .domain([0, numberOfSamples - 1])
  .range([0, innerWidth]);
const yScale = scaleLinear().domain([0, 10]).range([innerHeight, 0]);
const timeScale = scaleLinear().domain([0, innerWidth]).range([0, 1]);
const shape = area<number>()
  .x((_, i) => xScale(i))
  .y0(innerHeight)
  .y1((d) => yScale(d))
  .curve(curveBasis);

type CurveProps = {
  file: File;
  currentTime: number;
  duration: number;
  onSelect?(range: [start: number, end: number] | null): void;
};
export default function Curve({
  file,
  currentTime,
  duration,
  onSelect,
}: CurveProps) {
  const [data, setData] = useState<number[][]>([]);
  const pathsRef = useRef<SVGGElement>(null);

  // update the graph when de data changes
  useEffect(() => {
    const dom = extent(data.flat(2)) as [number, number];
    yScale.domain(dom);

    select(pathsRef.current!)
      .selectAll("path")
      .data(data)
      .join("path")
      .transition()
      .attr("d", shape);
  }, [data]);

  // update data when file changes
  useEffect(() => {
    loadAudioData(file, numberOfSamples).then(setData);
  }, [file]);

  // playhead
  const playheadRef = useRef<SVGLineElement>(null);
  const playheadScale = scaleLinear()
    .domain([0, duration])
    .range([1, innerWidth - 1]);
  useEffect(() => {
    select(playheadRef.current!)
      .datum(currentTime)
      .attr("x1", playheadScale)
      .attr("x2", playheadScale)
      .attr("y1", 0)
      .attr("y2", innerHeight);
  }, [currentTime, duration, playheadScale]);

  // brush
  const brushRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const brush = brushX().extent([
      [0, 0],
      [innerWidth, innerHeight],
    ]);
    brush.on("start brush end", (e) => {
      if (!onSelect) return;
      if (Array.isArray(e.selection)) {
        onSelect(e.selection.map(timeScale));
      } else {
        onSelect(null);
      }
    });
    select(brushRef.current!).call(brush);
  }, [onSelect]);
  // ---------------------------

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="curve"
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g ref={pathsRef} className="curve__paths" />
        <line ref={playheadRef} className="curve__playhead" />
        <g ref={brushRef} />
      </g>
    </svg>
  );
}
