import React from "react";
import { useDropzone } from "react-dropzone";
import { dropzone } from "../settings";

export default function SelectFile({ onDrop }) {
  const dropz = useDropzone({
    ...dropzone,
    noClick: true,
    onDrop,
  });

  return (
    <div>
      <button onClick={dropz.open}>Selecione um arquivo</button>
      <input {...dropz.getInputProps()} />
    </div>
  );
}
