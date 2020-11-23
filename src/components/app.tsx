import React, { useCallback, useState } from "react";
import useDraggingOver from "../hooks/useDraggingOver";
import Clipper from "./clipper";
import DropArea from "./droparea";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const isDraggingOver = useDraggingOver();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length < 1) return;
    setFile(acceptedFiles[0]);
  }, []);

  return (
    <div className="app">
      <DropArea isHidden={!isDraggingOver} onDrop={onDrop}>
        🔥 drop it like it's hot 🔥
      </DropArea>

      {file && <Clipper file={file} />}

      {/* {file && <Curve file={file} />} */}
    </div>
  );
}
