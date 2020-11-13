import { area, curveBasis, scaleLinear, select } from "d3";
import R from "ramda";
import React, { useEffect, useRef, useState } from "react";

const samples = 40;
function randomArray() {
  return Array(samples)
    .fill(0)
    .map((_) => (Math.random() * 10) >> 0);
}

const width = 800;
const height = 200;
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const xScale = scaleLinear()
  .domain([0, samples - 1])
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

const processChannel = (channelData: number[]) =>
  R.compose(
    R.map(rms),
    R.splitEvery(Math.ceil(R.length(channelData) / samples)),
  )(channelData);

// ----------------------------------------------------------------

type CurveProps = {
  file: File;
};
export default function Curve({ file }: CurveProps) {
  const [data, setData] = useState(randomArray());
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = select(pathRef.current!)
      .datum(data)
      .transition()
      .attr("d", shape)
      .end();
  }, [data]);

  useEffect(() => {
    const path = select(pathRef.current).datum(data);
  }, [data]);

  function shuffle() {
    setData(randomArray());
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
