import { Mp3Encoder } from "lamejs";
import * as _ from "lodash/fp";
import { chunk, map, mean, pipe } from "lodash/fp";

export type Channels = [left: Int16Array, right?: Int16Array];

export const rms = pipe(
  map((x: number) => x * x),
  pipe(mean, Math.sqrt),
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

// export const getBaseline = (channels: number[][]) => unzip(channels)
const getBaseline = _.pipe(_.unzip, _.map(_.min), _.map(_.toNumber));

export const loadAudioData = async (
  file: File,
  samples: number,
): Promise<number[][]> => {
  const audioData = await getChannels(file);
  const processedChannels = audioData.map(processChannel(samples));

  return processedChannels.length === 1
    ? processedChannels
    : [...processedChannels, getBaseline(processedChannels)];
};

export function float32ArraytoInt16Array(
  floatbuffer: Float32Array,
): Int16Array {
  var int16Buffer = new Int16Array(floatbuffer.length);
  for (var i = 0, len = floatbuffer.length; i < len; i++) {
    if (floatbuffer[i] < 0) {
      int16Buffer[i] = 0x8000 * floatbuffer[i];
    } else {
      int16Buffer[i] = 0x7fff * floatbuffer[i];
    }
  }
  return int16Buffer;
}

export async function encodeMp3(
  channels: Channels,
  buffer: AudioBuffer,
  bitrate: number = 128,
): Promise<Blob> {
  const encoder = new Mp3Encoder(
    buffer.numberOfChannels,
    buffer.sampleRate,
    bitrate,
  );

  switch (channels.length) {
    case 1:
    case 2: {
      const encoded = encoder.encodeBuffer(...channels);
      return new Blob([encoded], { type: "audio/mp3" });
    }
    default:
      throw new Error(`Wrong number of channels: ${buffer.numberOfChannels}`);
  }
}

export function extractChannels(audioBuffer: AudioBuffer): Channels {
  switch (audioBuffer.numberOfChannels) {
    case 1: {
      const mono = float32ArraytoInt16Array(audioBuffer.getChannelData(0));
      return [mono];
    }
    case 2: {
      const left = float32ArraytoInt16Array(audioBuffer.getChannelData(0));
      const right = float32ArraytoInt16Array(audioBuffer.getChannelData(1));
      return [left, right];
    }
    default:
      throw new Error(
        `Wrong number of channels: ${audioBuffer.numberOfChannels}`,
      );
  }
}

export function clipChannels(
  buffer: AudioBuffer,
  start: number,
  end: number,
): Channels {
  const { sampleRate } = buffer;
  const channels = extractChannels(buffer);
  return channels.map((channel) =>
    channel!.subarray(sampleRate * start, sampleRate * end),
  ) as Channels;
}

// REFACTOR

/**
 * @deprecated Converting array from buffer is too expensive. Variadic channels are hard to work with.
 */
export const getChannels = async (file: File): Promise<number[][]> => {
  const channels: number[][] = [];
  const buffer = await loadFileAsArrayBuffer(file);
  const audioData = await decodeAudio(buffer);
  for (let i = 0; i < audioData.numberOfChannels; i++) {
    channels.push(Array.from(audioData.getChannelData(i)));
  }
  return channels;
};

export async function decodeAudio(
  arrayBuffer: ArrayBuffer,
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    const contextClass = window.AudioContext ?? window.webkitAudioContext;
    const audioContext = new contextClass();
    audioContext.decodeAudioData(arrayBuffer, resolve, () =>
      reject(new Error("Couldn't decode audio")),
    );
  });
}

export async function getRawChannels(file: File): Promise<RawChannels> {
  const buffer = await loadFileAsArrayBuffer(file);
  const audioData = await decodeAudio(buffer);
  return [
    audioData.getChannelData(0),
    audioData.numberOfChannels > 1
      ? audioData.getChannelData(1)
      : audioData.getChannelData(0),
  ];
}
