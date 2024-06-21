import { useEffect, useRef, useState } from "react";
import "./Realtalk.css";
import axios from "axios";

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

  {
    /*Checks if the uploaded file is a .wav file*/
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile && selectedFile.type === "audio/wav") {
      checkAudioDuration(selectedFile);
    } else {
      alert("Please upload a .wav file");
    }
  };

  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData();
      console.log("File uploaded", file.name);
      formData.append("file", file);
      setIsLoading(true);

      try {
        const response = await axios.post(
          "https://GymNotWell.pythonanywhere.com/upload",
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
      checkAudioDuration(selectedFile);
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
      if (audio.duration > 15) {
        alert(
          "The audio file is over 15 seconds. Please upload a shorter audio file."
        );
      } else {
        setFile(selectedFile);
        setAudioUrl(URL.createObjectURL(selectedFile));
      }
    });
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
          <h1 className="file_report_title">Mel-Spectrogram Conversion</h1>
          <div className="spectrogram_box">
            {isLoading ? (
              <h2>Mel-Spectrogram is Generating...</h2>
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
            {showResult && <h3>{showScore}</h3>}
          </div>
        </div>
      </div>
      <div className="guide_container">
        <h1>User Guide</h1>
        <div className="guide_inner_container">
          <div className="guide_item">
            <h2>Upload Audio</h2>
            <p>
              Users can upload or drop their audio files directly onto the
              platform, supporting commonly used WAV format, making it
              accessible for a variety of Tagalog audio content.
            </p>
          </div>
          <div className="guide_item">
            <h2>Audio Preprocessing</h2>
            <p>
              User-submitted audio data will then undergo a series of
              preprocessing to convert audio format into a visual format through
              a log-mel spectrogram.
            </p>
          </div>
          <div className="guide_item">
            <h2>Authenticity Report</h2>
            <p>
              RealTalk generates and prompts its processing results, recognizing
              deepfake audio in the Tagalog language, in a simple and digestible
              format.
            </p>
          </div>
        </div>
      </div>
      <div className="limitations_container">
        <h1>Limitations</h1>
        <p>
          Note that there are certain limitations and requirements that should
          be met for smooth use of the system and to generate more reliable
          results
        </p>
        <div className="limitations_inner_container">
          <div className="limitations_item">
            <p>
              Audio files submitted must<strong> be at most 5MB</strong>
            </p>
          </div>
          <div className="limitations_item">
            <p>
              Desirable length of audio data submitted is
              <strong> 15 seconds and below</strong>
            </p>
          </div>
          <div className="limitations_item">
            <p>
              The system has
              <strong> no control over noise and variance in volume </strong>
              that may hinder and affect its authentication.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
