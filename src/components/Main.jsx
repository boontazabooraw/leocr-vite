import { useEffect, useState, useRef } from "react";
import Tesseract from "tesseract.js";

export default function Main() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(null);

  const fileInputRef = useRef(null);

  const imgPreprocessing = (file) => {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Upscaling
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.drawImage(img, 0, 0);

        // // Greyscale + Theshold ------- TBD
        // const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // const data = imageData.data;

        // for (let i = 0; i < data.length; i += 4) {
        //   const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        //   const val = avg > 128 ? 255 : 0;
        //   data[i] = data[i + 1] = data[i + 2] = val;
        // }
        // ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => res(blob), "image/png");
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const runOCR = async (file) => {
    const processed = await imgPreprocessing(file);
    Tesseract.recognize(processed, "eng", {
      langPath: "/tessdata",
      tessedit_pegseg_mode: 6,
      logger: (prgrs) => {
        if (prgrs.status === "recognizing text") {
          setProgress(Math.round(prgrs.progress * 100));
        }
      },
    })
      .then(({ data: { text } }) => {
        setText(text);
        setProgress(100);
      })
      .catch((err) => console.error(err));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const handlePaste = (event) => {
      const items = event.clipboardData.items;
      for (const item of items) {
        if (item.type.indexOf("image") !== -1) {
          const file = item.getAsFile();
          if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
          }
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
      <h1 className="text-center text-2xl tracking-tight font-quicksand">
        Fast, lightweight OCR — turn images into editable text in seconds.
      </h1>

      <div className="flex flex-col gap-4 min-w-full xl:px-60 2xl:px-90">
        <div
          onClick={openFileDialog}
          className="relative border rounded-md min-h-60 xl:min-h-70 flex flex-col justify-center items-center hover:bg-(--text)/10 cursor-pointer transition-all duration-300"
        >
          {!image ? (
            <div className="flex flex-col text-center relative">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="pointer-events-none">
                Drag n' Drop the image here
              </span>
              <span className="opacity-70 text-sm pointer-events-none">
                or Paste (CTRL + V)
              </span>
            </div>
          ) : (
            <img
              src={imagePreview}
              className="absolute overflow-none h-full w-full object-cover blur-[2px] saturate-20"
              alt="Uploaded image"
            />
          )}
        </div>
        <button
          onClick={() => runOCR(image)}
          disabled={!image || progress === 0 || progress === 100 ? true : false}
          className={`
            ${image ? "opacity-100" : "opacity-0"} 
            border border-(--text) place-self-center-safe min-w-30 min-h-10 rounded-md disabled:pointer-events-none cursor-pointer transition-all duration-700`}
        >
          <span>{!progress ? "Process" : progress + "%"}</span>
        </button>

        {/* TEXT AREA */}

        <textarea
          className="relative p-2 outline-dashed outline-2 rounded-md min-h-60 xl:min-h-70 min-w-70 flex flex-col justify-center items-center"
          value={text}
          readOnly={!image}
        />
      </div>
    </main>
  );
}
