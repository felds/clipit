import Slider from "@material-ui/core/Slider";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoIosInfinite, IoIosPlay } from "react-icons/io";
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

  const updateMetadata = () => {
    const audio = audioRef.current!;
    setDuration(audio.duration);
    setEndTime(audio.duration);
    setStartTime(0);
    audio.currentTime = 0;
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
          trim={[startTime, endTime]}
        />
        <Slider
          value={[startTime, endTime]}
          onChange={(e, newValue) => {
            const [start, end] = newValue as [number, number];
            setStartTime(start);
            setEndTime(end);
          }}
          min={0}
          max={duration}
          step={0.001}
        />
        <audio ref={audioRef} />
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
    </div>
  );
}
