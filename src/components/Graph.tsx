import { area, curveBasis, extent, scaleLinear, select } from "d3";
import { useEffect, useRef } from "react";
import styled from "styled-components";

// .curve {
//   /* background: var(--color-4); */
// }
// .curve__paths path:nth-last-child(1) {
//   fill: var(--color-1);
// }
// .curve__paths path:nth-last-child(2) {
//   fill: var(--color-2);
//   opacity: 0.5;
//   /* fill: none; */
// }
// .curve__paths path:nth-last-child(3) {
//   fill: var(--color-3);
//   opacity: 0.5;
//   /* fill: none; */
// }
// .curve__playhead {
//   stroke-width: 2;
//   stroke: var(--color-text);
// }

const RectBGOverlay = styled.rect`
  mix-blend-mode: saturation;
  fill: #ffffff;
`;
const RectBrightnessOverlay = styled.rect`
  fill: #ffffff;
  opacity: 0.5;
`;
const LinePlayhead = styled.line`
  stroke-width: 2;
  stroke: currentColor;
`;

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
export default function Curve({
  graphData,
  samples,
  currentTime,
  duration,
  trim,
}: CurveProps) {
  const pathsRef = useRef<SVGGElement>(null);

  // update the graph when de data changes
  useEffect(() => {
    const paths = pathsRef.current!;
    const data = graphData !== null ? graphData : [Array(samples).fill(0.5)];
    const yDomain =
      graphData !== null
        ? (extent(graphData.flat(2)) as [number, number])
        : [0, 1];
    yScale.domain(yDomain);
    xScale.domain([0, samples]);

    select(paths)
      .selectAll("path")
      .data(data)
      .join("path")
      .transition()
      .attr("d", shape);
  }, [graphData, samples]);

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

  useEffect(() => {
    console.log(JSON.stringify(graphData));
  }, [graphData]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="curve"
    >
      <defs>
        <mask id="selectionMask">
          <rect width="300" height="100%" fill="white" ref={startMaskRef} />
          <rect x="100%" y="0" height="100%" fill="white" ref={endMaskRef} />
        </mask>
      </defs>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <g ref={pathsRef} className="curve__paths">
          <rect
            x="0"
            y="0"
            width={innerWidth}
            height={innerHeight}
            fill="#eadbf6"
          />
        </g>

        <g id="overlay">
          <RectBGOverlay
            x="0"
            y="0"
            height={innerHeight}
            width={innerWidth}
            mask="url(#selectionMask)"
          />
          <RectBrightnessOverlay
            x="0"
            y="0"
            height={innerHeight}
            width={innerWidth}
            mask="url(#selectionMask)"
          />
        </g>

        <LinePlayhead ref={playheadRef} />
      </g>
    </svg>
  );
}
