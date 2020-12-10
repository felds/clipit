import { area, curveBasis, extent, scaleLinear, select } from "d3";
import React, { useEffect, useRef } from "react";

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
const shape = area<number>()
  .x((_, i) => xScale(i))
  .y0(innerHeight)
  .y1((d) => yScale(d))
  .curve(curveBasis);

type CurveProps = {
  samples: number;
  graphData: number[][] | null;
  currentTime: number;
  duration: number;
  trim: [start: number, end: number];
};
export default function Curve({ graphData, samples, currentTime, duration, trim }: CurveProps) {
  const pathsRef = useRef<SVGGElement>(null);

  // update the graph when de data changes
  useEffect(() => {
    const paths = pathsRef.current!;
    const data = graphData !== null ? graphData : [Array(samples).fill(0.5)];
    const yDomain = graphData !== null ? (extent(graphData.flat(2)) as [number, number]) : [0, 1];
    yScale.domain(yDomain);
    xScale.domain([0, samples]);

    select(paths).selectAll("path").data(data).join("path").transition().attr("d", shape);
  }, [graphData, samples]);

  // playhead
  const playheadRef = useRef<SVGLineElement>(null);
  const playheadScale = scaleLinear()
    .domain([0, duration])
    .range([1, innerWidth - 1]);
  useEffect(() => {
    select(playheadRef.current!).datum(currentTime).attr("x1", playheadScale).attr("x2", playheadScale).attr("y1", 0).attr("y2", innerHeight);
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

  useEffect(() => {
    console.log(JSON.stringify(graphData));
  }, [graphData]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="curve">
      <defs>
        <g id="filterMask">
          <rect x="0" y="0" width="0" height="500" ref={startMaskRef} />
          <rect x="1200" y="0" width="500" height="500" ref={endMaskRef} />
        </g>

        <filter id="filter" colorInterpolationFilters="linearRGB">
          <feImage id="feimage" href="#filterMask" x="0" y="0" result="mask" />
          <feFlood floodColor="#ffffff" floodOpacity="1" x="0%" y="0%" width="100%" height="100%" result="flood" />
          <feBlend mode="color" x="0%" y="0%" width="100%" height="100%" in="flood" in2="SourceGraphic" result="blend" />
          <feFlood floodColor="#ffffff" floodOpacity="0.666" x="0%" y="0%" width="100%" height="100%" result="flood1" />
          <feBlend mode="screen" x="0%" y="0%" width="100%" height="100%" in="blend" in2="flood1" result="blend1" />
          <feComposite in2="mask" in="blend1" operator="in" result="comp" />
          <feMerge result="merge">
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="comp" />
          </feMerge>
        </filter>
      </defs>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g ref={pathsRef} className="curve__paths" filter="url(#filter)">
          <rect x="0" y="0" width={innerWidth} height={innerHeight} fill="whitesmoke" />
        </g>
        <line ref={playheadRef} className="curve__playhead" />
      </g>
    </svg>
  );
}
