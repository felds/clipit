import React, { useCallback, useState } from "react";
import useDraggingOver from "../hooks/useDraggingOver";
import Clipper from "./Clipper";
import DropArea from "./droparea";
import SelectFile from "./select-file";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const isDraggingOver = useDraggingOver();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length < 1) return;
    setFile(acceptedFiles[0]);
  }, []);

  return (
    <div className="app">
      <div className="layout">
        {/* <nav className="layout__nav"></nav> */}
        <main className="layout__content">
          <h1>Clipit</h1>
          {!file && (
            <div className="begin text--center">
              <p>
                Para começar, selecione um arquivo MP3 no seu computador. Você
                também pode arrastar e soltar o arquivo em qualquer lugar da
                página.
              </p>
              <SelectFile onDrop={onDrop} />
              <p></p>
            </div>
          )}
          {file && <Clipper file={file} />}
        </main>
        {/* <footer className="layout__footer"></footer> */}
      </div>

      <DropArea isHidden={!isDraggingOver} onDrop={onDrop}>
        🔥 drop it like it's hot 🔥
      </DropArea>
    </div>
  );
}
