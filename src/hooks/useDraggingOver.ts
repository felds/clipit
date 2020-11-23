import { useEffect, useState } from "react";

export default function useDraggingOver() {
  const [isDraggingOver, setDraggingOver] = useState(false);

  useEffect(() => {
    let dragCount = 0;

    function handleDragOver(e: DragEvent) {
      e.preventDefault();
    }
    function handleDragEnter(e: DragEvent) {
      dragCount++;
      update();
    }
    function handleDragLeave(e: DragEvent) {
      dragCount--;
      update();
    }
    function handleDrop(e: DragEvent) {
      dragCount = 0;
      update();
    }
    function update() {
      setDraggingOver(dragCount > 0);
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

  return isDraggingOver;
}
