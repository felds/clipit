import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosInfinite, IoIosPlay } from "react-icons/io";
import { formatNumber } from "../util/formatting";
import Curve from "./curve";
import ToggleButton from "./toggle-button";

type ClipperProps = {
  file: File;
};
export default function Clipper({ file }: ClipperProps) {
  const [isPlaying, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [loop, setLoop] = useState(false);

  const updateMetadata = (e) => {
    const audio = audioRef.current!;
    setDuration(audio.duration);
    setStartTime(0);
    audio.currentTime = startTime;
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    audioRef.current!.onloadedmetadata = updateMetadata;
    audioRef.current!.onplay = () => setPlaying(true);
    audioRef.current!.onpause = () => setPlaying(false);
  });

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
    if (currentTime >= endTime) {
      audio.currentTime = startTime;
      if (!loop) {
        audio.pause();
      }
    }
  }, [currentTime, endTime, loop, startTime]);

  // load dropped file into the audio element
  useEffect(() => {
    const audio = audioRef.current!;
    audio.src = URL.createObjectURL(file);
    const revokeUrl = () => {
      URL.revokeObjectURL(audio.src);
      audio.removeEventListener("load", revokeUrl);
    };
    audio.addEventListener("load", revokeUrl);
  }, [file]);

  // sync current time with start time
  useEffect(() => {
    const audio = audioRef.current!;
    audio.currentTime = startTime;
  }, [startTime]);

  const handleSelection = (range: [start: number, end: number] | null) => {
    if (!range) {
      setStartTime(0);
      setEndTime(duration);
    } else {
      setStartTime(range[0] * duration);
      setEndTime(range[1] * duration);
    }
  };

  return (
    <div className="clipper">
      <div className="clipper__view">
        <Curve
          file={file}
          currentTime={currentTime}
          duration={duration}
          onSelect={handleSelection}
        />
        <audio ref={audioRef} controls />
      </div>
      <div className="clipper__controls">
        <ToggleButton
          status={isPlaying}
          onContent={<IoIosPlay />}
          offContent={<IoIosPlay />}
          onChange={playPause}
        />{" "}
        <ToggleButton
          status={loop}
          onContent={<IoIosInfinite />}
          offContent={<IoIosInfinite />}
          onChange={(loop) => setLoop(loop)}
        />
      </div>

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
          End time ({formatNumber(endTime)})<br />
          <input
            type="range"
            value={endTime}
            min={0}
            max={duration}
            step="any"
            onChange={(e) => setEndTime(Number(e.target.value))}
          />
        </label>
      </p>
    </div>
  );
}
