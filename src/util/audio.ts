import { Mp3Encoder } from "lamejs";
import { map, mean, pipe } from "lodash/fp";

export type Channels = [left: Int16Array, right?: Int16Array];

export const rms = pipe(
  map((x: number) => x * x),
  pipe(mean, Math.sqrt),
);

export const loadFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => resolve(reader.result as ArrayBuffer);
    reader.onerror = (e) => reject(new Error("Couldn't read file."));
  });

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

/**
 * Get the decoded audio buffer from a file's array buffer.
 */
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

/**
 * Extract the first and second channels from the audio data.
 * If the sound is mono, return the first channel twice.
 */
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

/**
 * Parse the raw channel data into graphable data.
 */
export function processChannel(channel: Float32Array, samples: number) {
  const len = channel.length;
  const chunkSize = Math.ceil(len / samples);
  const chunks = new Array(samples);

  for (let i = 0; i < samples; i++) {
    const xs = channel.subarray(chunkSize * i, chunkSize * (i + 1));
    chunks[i] = rms(xs);
  }

  return chunks;
}
