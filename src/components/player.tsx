import React, { useEffect, useRef, useState } from "react";

type PlayerProps = {
  file: File;
};
export default function Player({ file }: PlayerProps) {
  const [duration, setDuration] = useState<number>(0);
  const [start, setStart] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      audioRef.current!.src = reader.result as string;
      audioRef.current!.volume = 0.01;
      setStart(0);
    };
    reader.readAsDataURL(file);
  }, [file]);

  function changeStart(e) {
    const newStart = parseFloat((e.target as HTMLInputElement).value);
    setStart(newStart);
    audioRef.current!.currentTime = duration * newStart;
    audioRef.current!.play();
  }

  function updateDuration(e) {
    setDuration((e.target as HTMLAudioElement).duration);
  }

  return (
    <div>
      <audio src="" ref={audioRef} onDurationChange={updateDuration} controls />
      <p>Duração do áudio: {duration.toFixed(2)} segundos</p>
      <label>
        Início
        <input
          type="range"
          onMouseUp={changeStart}
          min={0}
          max={1}
          step={0.01}
          defaultValue={start}
        />
        {start.toFixed(2)}
      </label>
    </div>
  );
}
