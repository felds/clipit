import React, { useCallback, useState } from "react";
import Clipper from "./clipper";
import DropArea from "./droparea";

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length < 1) return;
    setFile(acceptedFiles[0]);
  }, []);

  return (
    <div className="app">
      <DropArea onDrop={onDrop}>Larga a parada aqui</DropArea>

      {file && <Clipper file={file} />}

      {/* {file && <Curve file={file} />} */}
    </div>
  );
}
