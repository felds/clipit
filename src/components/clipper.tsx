import React, { useCallback, useEffect, useRef, useState } from "react";
import { formatNumber } from "../util/formatting";
import Curve from "./curve";

type ClipperProps = {
  file: File;
};
export default function Clipper({ file }: ClipperProps) {
  const [isPlaying, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState(2);
  const [duration, setDuration] = useState(0);
  const [clipDuration, setClipDuration] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [loop, setLoop] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const playPause = useCallback(() => {
    const audio = audioRef.current!;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [isPlaying]);

  // update currentTime
  useEffect(() => {
    const audio = audioRef.current!;
    let animationFrame = 0;
    const tick = () => {
      setCurrentTime(audio.currentTime);
      animationFrame = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  // go back to start time after playing
  useEffect(() => {
    const audio = audioRef.current!;
    if (currentTime >= startTime + clipDuration) {
      audio.currentTime = startTime;
      if (!loop) {
        audio.pause();
      }
    }
  }, [currentTime, clipDuration, loop, startTime]);

  const updateMetadata = (e) => {
    const audio = audioRef.current!;
    setDuration(audio.duration);
    audio.currentTime = startTime;
    console.log({ startTime });
  };

  useEffect(() => {
    const audio = audioRef.current!;
    audio.src = URL.createObjectURL(file);
    const revokeUrl = () => {
      URL.revokeObjectURL(audio.src);
      audio.removeEventListener("load", revokeUrl);
    };
    audio.addEventListener("load", revokeUrl);
  }, [file]);

  return (
    <div className="clipper">
      <Curve file={file} />
      <div className="clipper__view">
        View
        <br />
        Current time: {formatNumber(currentTime)}
      </div>
      <div className="clipper__controls">
        <button onClick={updateMetadata}>shablau</button>
        <audio
          ref={audioRef}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onLoadedMetadata={updateMetadata}
          controls
        ></audio>
        <button onClick={playPause}>Play/pause</button>
        tocando: {isPlaying ? "s" : "n"}
        <label>
          <input
            type="checkbox"
            onChange={(e) => setLoop(e.target.checked)}
            checked={loop}
          />
          Repeato
        </label>
        <p>
          <label>
            Start time ({formatNumber(startTime)}) <br />
            <input
              type="range"
              value={startTime}
              min={0}
              max={duration}
              step="any"
              onChange={(e) => setStartTime(Number(e.target.value))}
            />
          </label>
        </p>
        <p>
          <label>
            Clip duration ({formatNumber(clipDuration)})<br />
            <input
              type="range"
              value={clipDuration}
              min={0}
              max={duration - startTime}
              step="any"
              onChange={(e) => setClipDuration(Number(e.target.value))}
            />
          </label>
        </p>
      </div>
    </div>
  );
}
