import classNames from "classnames";
import React from "react";
import { useDropzone } from "react-dropzone";

type DropAreaProps = {
  children: React.ReactNode;
  onDrop: (acceptedFiles: File[]) => void;
};
export default function DropArea({ children, onDrop }: DropAreaProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
  } = useDropzone({ onDrop, accept: "audio/mpeg", multiple: false });

  return (
    <div
      className={classNames(
        "drop-area",
        isDragActive && "drop-area--active",
        isDragReject && "drop-area--rejected",
      )}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {children}
    </div>
  );
}
