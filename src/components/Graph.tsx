import {
  area,
  curveBasis,
  easeCubicOut,
  extent,
  scaleLinear,
  select,
} from "d3";
import { map, min, pipe, toNumber, unzip } from "lodash/fp";
import { useEffect, useRef, useState } from "react";
import { processChannel } from "../util/audio";
import "./Graph.css";

const width = 1200;
const height = 120;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

type GraphData = [left: number[], right: number[], center: number[]];

type GraphProps = {
  rawChannels: RawChannels | null;
  currentTime: number;
  duration: number;
  trim: [start: number, end: number];
};

export default function Graph({
  rawChannels,
  currentTime,
  duration,
  trim,
}: GraphProps) {
  const samples = 200;

  const [data, setData] = useState<GraphData | null>(null);
  useEffect(() => {
    setData(null);
    if (rawChannels) {
      createGraphData(rawChannels, samples).then(setData);
    }
  }, [rawChannels, samples]);

  // update the graph when de data changes
  const pathsRef = useRef<SVGGElement>(null);
  useEffect(() => {
    const graphData = data ?? createEmptyData(samples);
    const xScale = scaleLinear([0, samples - 1], [0, innerWidth]);
    const yDomain =
      data === null ? [0, 1] : (extent(graphData.flat()) as [number, number]);
    const yScale = scaleLinear(yDomain, [innerHeight, 0]);
    const shape = area<number>()
      .curve(curveBasis)
      .x((d, i) => xScale(i))
      .y0(innerHeight)
      .y1(yScale);
    const delay = (n: number) => {
      const pos =
        data === null
          ? graphData.length - n // reverse
          : n;
      return pos * 200;
    };

    const selection = select(pathsRef.current).selectAll("path");
    selection
      .data(graphData)
      .join("path")
      .transition()
      .duration(700)
      .delay((d, i) => delay(i))
      .ease(easeCubicOut)
      .attr("d", shape);
  }, [data, samples]);

  // playhead
  const playheadRef = useRef<SVGLineElement>(null);
  const playheadScale = scaleLinear([0, duration], [1, innerWidth - 1]);
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

        <rect
          x="0"
          y="0"
          height={innerHeight}
          width={innerWidth}
          className="graph__grayscale-overlay"
          mask="url(#overlayMask)"
        />
        <rect
          x="0"
          y="0"
          height={innerHeight}
          width={innerWidth}
          className="graph__opacity-overlay"
          mask="url(#overlayMask)"
        />

        <line ref={playheadRef} className="graph__playhead" />
      </g>
    </svg>
  );
}

const getBaseline = pipe(unzip, map(min), map(toNumber));

/**
 * @todo when the audio is too short, take fewer samples.
 */
async function createGraphData(
  channels: RawChannels,
  samples: number,
): Promise<GraphData> {
  const left = processChannel(channels[0], samples);
  const right =
    channels[0] === channels[1] ? left : processChannel(channels[1], samples);
  const center =
    channels[0] === channels[1] ? left : getBaseline([left, right]);

  return [left, right, center];
}

function createEmptyData(samples: number): GraphData {
  return [
    Array(samples).fill(0),
    Array(samples).fill(0),
    Array(samples).fill(0),
  ];
}
