import React, { useCallback, useState } from "react";
import Clipper from "./clipper";
import DropArea from "./droparea";
import FullScreenDrop from "./full-screen-drop";

export default function App() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length < 1) return;
    setFile(acceptedFiles[0]);
  }, []);

  return (
    <div className="app">
      <FullScreenDrop>
        {({ isHidden }) => (
          <DropArea isHidden={isHidden} onDrop={onDrop}>
            🔥 drop it like it's hot 🔥
          </DropArea>
        )}
      </FullScreenDrop>

      {file && <Clipper file={file} />}

      {/* {file && <Curve file={file} />} */}
    </div>
  );
}
