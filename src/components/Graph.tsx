import { area, curveBasis, easeBounceOut, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import "./Graph.css";

const width = 1200;
const height = 120;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// type GraphDada = [left: number[], right: number[]] ;
type GraphData = number[][];
type GraphProps = {
  rawChannels: RawChannels | null;
  graphData: GraphData | null;
  currentTime: number;
  duration: number;
  trim: [start: number, end: number];
};
export default function Curve({
  rawChannels,
  graphData,
  currentTime,
  duration,
  trim,
}: GraphProps) {
  const samples = 300;

  const xScale = scaleLinear([0, samples], [0, innerWidth]);
  const yScale = scaleLinear([0, 10], [innerHeight, 0]);
  const shape = area<number>()
    .curve(curveBasis)
    .x((d, i) => xScale(i))
    .y0(innerHeight)
    .y1(yScale);
  const delay = (n: number) => n * 333;

  // update the graph when de data changes
  const pathsRef = useRef<SVGGElement>(null);
  useEffect(() => {
    console.log("ZERA TUDO");
    const selection = select(pathsRef.current).selectAll("path");
    selection
      .data([
        new Array(samples).fill(0),
        new Array(samples).fill(0),
        new Array(samples).fill(0),
      ])
      .join("path")
      .transition()
      .duration(1000)
      .delay((d, i) => delay(i))
      .ease(easeBounceOut)
      .attr("d", shape);
  }, []);

  useEffect(() => {
    console.log("vai dispara");
    setTimeout(() => {
      console.log("DISPARO");
      const selection = select(pathsRef.current).selectAll("path");
      selection
        .data([
          new Array(samples).fill(5),
          new Array(samples).fill(5),
          new Array(samples).fill(5),
        ])
        .join("path")
        .transition()
        .duration(1000)
        .delay((d, i) => delay(i))
        .ease(easeBounceOut)
        .attr("d", shape);
    }, 2000);
  }, []);

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

  // mask
  const startMaskRef = useRef<SVGRectElement>(null);
  const endMaskRef = useRef<SVGRectElement>(null);
  useEffect(() => {
    const durationScale = scaleLinear([0, duration], [0, innerWidth]);
    const [start, end] = trim;
    const startMask = startMaskRef.current;
    const endMask = endMaskRef.current;

    select(startMask)
      .datum(start)
      .attr("width", (d) => durationScale(d));
    select(endMask)
      .datum(end)
      .attr("x", (d) => durationScale(d))
      .attr("width", (d) => durationScale(duration - d));
  }, [trim, duration]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="graph"
    >
      <defs>
        <mask id="overlayMask">
          <rect width="300" height="100%" fill="white" ref={startMaskRef} />
          <rect x="100%" y="0" height="100%" fill="white" ref={endMaskRef} />
        </mask>
      </defs>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g ref={pathsRef} className="graph__paths" />

        <g mask="url(#overlayMask)">
          <rect
            x="0"
            y="0"
            height={innerHeight}
            width={innerWidth}
            className="graph__grayscale-overlay"
          />
          <rect
            x="0"
            y="0"
            height={innerHeight}
            width={innerWidth}
            className="graph__opacity-overlay"
          />
        </g>

        <line ref={playheadRef} className="graph__playhead" />
      </g>
    </svg>
  );
}
