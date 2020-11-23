import React, { useEffect, useState } from "react";

type FullScreenDropProps = {
  children: React.ElementType;
  [k: string]: any;
};
export default function FullScreenDrop({
  children,
  ...props
}: FullScreenDropProps) {
  const [isHidden, setHidden] = useState(true);

  useEffect(() => {
    let dragCount = 0;

    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }
    function handleDragEnter(e: DragEvent) {
      dragCount++;
      updateHidden();
    }
    function handleDragLeave(e: DragEvent) {
      dragCount--;
      updateHidden();
    }
    function handleDrop(e: DragEvent) {
      dragCount = 0;
      updateHidden();
    }
    function updateHidden() {
      setHidden(dragCount < 1);
    }

    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  console.log(children);

  return React.createElement(children, { ...props, isHidden });
}
