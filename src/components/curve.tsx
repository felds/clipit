import { area, curveBasis, extent, scaleLinear, select } from "d3";
import React, { useEffect, useRef, useState } from "react";
import { loadAudioData } from "../util/sound";

/**
 * @todo send the audio processing to a worker
 */

const SAMPLES = 100;

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

type CurveProps = {
  file: File;
};
export default function Curve({ file }: CurveProps) {
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
