import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useDropzone } from "react-dropzone";
import "./styles.css";

function App() {
  return (
    <div>
      <MyDropzone />
    </div>
  );
}

type PlayerProps = {
  file: File;
};
function Player({ file }: PlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // audioRef?.current.src = reader.result
      audioRef.current!.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  }, [file]);

  // function onChange(event) {
  //   var file = event.target.files[0];
  //   var reader = new FileReader();
  //   reader.onload = function(event) {
  //     // The file's text will be printed here
  //     console.log(event.target.result)
  //   };

  //   reader.readAsText(file);
  // }

  return (
    <>
      <audio controls ref={audioRef} autoPlay />
    </>
  );
}

function MyDropzone() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <section className="drag" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </section>

      {file && (
        <div className="player">
          {file.name}
          <hr />
          <Player file={file} />
        </div>
      )}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// import * as serviceWorker from './serviceWorker';
// serviceWorker.unregister();
