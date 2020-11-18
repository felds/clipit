import * as _ from "lodash/fp";
import { chunk, map, mean, pipe } from "lodash/fp";

export const rms = pipe(
  map((x: number) => x * x),
  mean,
  Math.sqrt,
);

export const processChannel = (samples: number) => (
  channelData: number[],
): number[] =>
  pipe(chunk(Math.ceil(channelData.length / samples)), map(rms))(channelData);

export const loadFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => resolve(reader.result as ArrayBuffer);
    reader.onerror = (e) => reject(new Error("Couldn't read file."));
  });

export const getChannels = async (file: File): Promise<number[][]> => {
  const channels: number[][] = [];
  const audioContext = new AudioContext();
  const buffer = await loadFileAsArrayBuffer(file);
  const audioData = await audioContext.decodeAudioData(buffer);
  for (let i = 0; i < audioData.numberOfChannels; i++) {
    channels.push(Array.from(audioData.getChannelData(i)));
  }
  return channels;
};

// export const getBaseline = (channels: number[][]) => unzip(channels)
const getBaseline = _.pipe(_.unzip, _.map(_.min), _.map(_.toNumber));

export const loadAudioData = async (
  file: File,
  samples: number,
): Promise<number[][]> => {
  const audioData = await getChannels(file);
  const processedChannels = audioData.map(processChannel(samples));

  const baseline = getBaseline(processedChannels);

  return processedChannels.length === 1
    ? processedChannels
    : [...processedChannels, getBaseline(processedChannels)];
};
