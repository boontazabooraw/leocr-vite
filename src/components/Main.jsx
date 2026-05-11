import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

export default function Main() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  const runOCR = (file) => {
    Tesseract.recognize(file, "eng")
      .then(({ data: { text } }) => setText(text))
      .catch((err) => console.error(err));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          setImage(URL.createObjectURL(file));
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  return (
    <main
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className="section flex flex-col justify-center items-center gap-4 min-h-screen"
    >
      <h1 className="text-center font-semibold text-5xl tracking-tight">
        LeOCR
      </h1>

      <div className="flex flex-col gap-4 min-w-full">
        <div className="relative border rounded-md min-h-50 flex flex-col justify-center items-center">
          {!image ? (
            <div className="flex flex-col text-center">
              <span>Drag n' Drop the image here</span>
              <span className="opacity-70 text-sm">or Paste (CTRL + V)</span>
            </div>
          ) : (
            <img
              src={image}
              className="absolute overflow-none object-cover max-h-full"
              alt="Uploaded image"
            />
          )}
        </div>
        <button
          onClick={runOCR}
          className="border place-self-center-safe min-w-30 min-h-10 rounded-md bg-(--text) text-(--bg)"
        >
          Process
        </button>
        <textarea
          className="relative p-2 border rounded-md min-h-50 min-w-70 flex flex-col justify-center items-center"
          value={text}
        />
      </div>
    </main>
  );
}
