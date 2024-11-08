import { useEffect, useRef, useState } from "react";
import "./Realtalk.css";
import axios from "axios";
import gear_loading from "./gear_loading.gif";
import feedback_icon from "./feedback_icon.png";

export default function RealTalk() {
  {
    /*Variables*/
  }
  const [file, setFile] = useState<File | null>(null);
  const [spectrogramUrl, setSpectrogramUrl] = useState<string | null>(null);
  const [showSpectrogram, setShowSpectrogram] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<string | null>(null);
  const [showScore, setShowScore] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  {
    /*Checks if the uploaded file is a .wav file*/
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile && selectedFile.type === "audio/wav") {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("The system does not allow .wav files that are over 5MB.");
      } else {
        checkAudioDuration(selectedFile);
      }
    } else {
      alert("Please upload a .wav file");
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      setShowResult(null);
      setShowScore(null);
      const formData = new FormData();
      console.log("File uploaded", file.name);
      formData.append("file", file);
      setIsLoading(true);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            responseType: "json", //'blob'
          }
        );

        const data = response.data;
        const base64Image = data.spectrogram_url;
        const imageBlob = await fetch(
          `data:image/png;base64,${base64Image}`
        ).then((res) => res.blob());
        const imageUrl = URL.createObjectURL(imageBlob);

        setSpectrogramUrl(imageUrl);
        setShowSpectrogram(true);
        setShowResult(data.result);
        setShowScore(data.score);
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const selectedFile =
      event.dataTransfer.files && event.dataTransfer.files[0];
    if (selectedFile && selectedFile.type === "audio/wav") {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("The system does not allow .wav files that are over 5MB.");
      } else {
        checkAudioDuration(selectedFile);
      }
    } else {
      alert("Please upload a .wav file only.");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const checkAudioDuration = (selectedFile: File) => {
    const audio = new Audio(URL.createObjectURL(selectedFile));
    audio.addEventListener("loadedmetadata", () => {
      if (audio.duration > 16) {
        alert(
          "The audio file is over 15 seconds. Please upload a shorter audio file."
        );
      } else {
        setFile(selectedFile);
        setAudioUrl(URL.createObjectURL(selectedFile));
      }
    });
  };

  const handleSpectrogramGuideClick = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  return (
    <>
      <div className="box_container">
        <div className="file_uploads">
          <div
            className="file_upload_box"
            onClick={handleBoxClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <h2>
              {file
                ? "Upload Another File Here..."
                : "Drag Your Speech Audio File..."}
            </h2>
            <input
              type="file"
              id="file-input"
              accept=".wav"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <p
            className="convert_warning"
            onClick={() => {
              window.open("https://audio-convert.com", "_blank");
            }}
          >
            (?) Click here for a .wav converter
          </p>
          <h3 className="file_name_title">FILE NAME</h3>
          <div className="file_name_container">
            {file && <h3 className="file_name"> {file.name} </h3>}
          </div>
          <h3 className="file_playhead_title">PLAYHEAD</h3>
          <div className="file_playhead">
            {audioUrl && (
              <audio controls ref={audioRef} style={{ width: "100%" }}>
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support this audio element.
              </audio>
            )}
          </div>
          <button className="upload_button" onClick={handleFileUpload}>
            Generate Authenticity Report
          </button>
        </div>
        <div className="file_reports">
          <div className="file_report_header">
            <h1 className="file_report_title">Mel-Spectrogram Conversion</h1>
            <p
              className="spectrogram_guide"
              onClick={handleSpectrogramGuideClick}
            >
              ⓘ
            </p>
          </div>
          <div className="spectrogram_box">
            {isLoading ? (
              <img src={gear_loading} />
            ) : (
              spectrogramUrl && (
                <img
                  className="spectrogram_image"
                  src={spectrogramUrl}
                  alt="The Spectrogram"
                />
              )
            )}
          </div>
          <div className="result_container">
            <h1 className="result_title">Result:</h1>
            {showResult && <h1>{showResult}</h1>}
          </div>
          <div className="confidence_container">
            <h2 className="confidence_title">Confidence Score:</h2>
            {showResult && <h2>{showScore}</h2>}
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <div className="dialog_box">
          <div className="dialog_content">
            <span className="close_button" onClick={handleCloseDialog}>
              &times;
            </span>
            <h2>What is a Mel-Spectrogram?</h2>
            <p>
              A mel-spectrogram is a visual representation of the spectrum of
              frequencies in a sound signal as they vary with time. It is often
              used in audio processing and deep learning applications to analyze
              and classify audio data.
            </p>
          </div>
        </div>
      )}
      <div className="operation_container">
        <h1>How RealTalk Works</h1>
        <div className="operation_inner_container">
          <div className="operation_item">
            <h2>Audio Preprocessing:</h2>
            <p>
              RealTalk transforms audio signals into spectrograms, visual
              representations of sound frequencies over time, allowing the use
              of Vision Transformers (ViTs) for audio analysis. The spectrogram
              is divided into smaller patches to capture the audio's frequency
              and temporal features.
            </p>
          </div>
          <div className="operation_item">
            <h2>ViT Application:</h2>
            <p>
              Each spectrogram patch is treated as a token, embedded into a
              higher-dimensional space with added positional information. The
              attention mechanism in ViTs focuses on the relationships between
              audio snippets, capturing nuances and dependencies crucial for
              identifying deepfake manipulations.
            </p>
          </div>
          <div className="operation_item">
            <h2>Feature Extraction:</h2>
            <p>
              RealTalk utilizes multiple transformer layers to analyze
              spectrogram patches, extracting detailed features and identifying
              inconsistencies and unnatural patterns typical of deepfake audio.
              The system detects subtle anomalies like irregular pitch,
              frequency shifts, and inconsistencies in speech rhythm and tone.
            </p>
          </div>
          <div className="operation_item">
            <h2>Decision Making:</h2>
            <p>
              Processed features are fed into a classification module that
              determines whether the audio is genuine or a deepfake based on
              learned patterns. RealTalk achieves an accuracy rate of 86.2%,
              ensuring reliable detection of deepfake audio in Tagalog and
              protecting against misinformation and fraudulent audio
              manipulations.
            </p>
          </div>
        </div>
      </div>
      <div className="feedback_container">
        <h1>Feedback</h1>
        <div className="feedback_inner_container">
          <img
            className="feedback_icon"
            src={feedback_icon}
            onClick={() =>
              window.open(
                "https://docs.google.com/forms/d/e/1FAIpQLSd-wrHB4fLb5DweKcjTlsIxadta3mqyC0DpncTZwLK6CRBb-g/viewform",
                "_blank"
              )
            }
          />
          <p>
            Want to send us feedback? Click on the icon above to submit your
            thoughts!
          </p>
        </div>
      </div>
    </>
  );
}
