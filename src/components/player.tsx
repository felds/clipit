import React, { useEffect, useRef } from "react";

type PlayerProps = {
  file: File;
};
export default function Player({ file }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = () => {
      audioRef.current!.src = reader.result as string;
      audioRef.current!.volume = 0.01;
    };
    reader.readAsDataURL(file);
  }, [file]);

  return (
    <div>
      <audio src="" ref={audioRef} controls />
    </div>
  );
}
