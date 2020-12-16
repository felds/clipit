interface Window {
  webkitAudioContext: typeof AudioContext;
}

type RawChannels = [left: Float32Array, right: Float32Array];
