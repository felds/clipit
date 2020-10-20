import classNames from "classnames";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type DropAreaProps = {
  children: React.ReactNode;
};
function DropArea({ children }: DropAreaProps) {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, accept: "audio/*", multiple: false });

  return (
    <div
      className={classNames(
        "drop-area",
        isDragActive && "drop-area--active",
        isDragReject && "drop-area--rejected"
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <DropArea>Larga a parada aqui</DropArea>
    </div>
  );
}
