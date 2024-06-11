import { useState } from 'react'
import './Realtalk.css'
import axios from 'axios'


export default function RealTalk(){
    {/*Variables*/}
    const [file, setFile] = useState<File | null>(null);
    const [spectrogramUrl, setSpectrogramUrl] = useState<string | null>(null);
    const [showSpectrogram, setShowSpectrogram] = useState<boolean>(false);
    const [showResult, setShowResult] = useState<string | null>(null);
    const [showScore, setShowScore] = useState<string | null>(null);
    

    {/*Checks if the uploaded file is a .wav file*/}
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile && selectedFile.type === 'audio/wav'){
            setFile(selectedFile);
        } else {
            alert("Please upload a .wav file");
        }
    };

    const handleFileUpload = async () => {
        if (file) {
            const formData = new FormData();
            console.log('File uploaded', file.name);
            formData.append('file', file);

            try {
                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data'},
                    responseType: 'json' //'blob'
                });

                const data = response.data;
                const base64Image = data.spectrogram_url;
                const imageBlob = await fetch(`data:image/png;base64,${base64Image}`).then(res => res.blob());
                const imageUrl = URL.createObjectURL(imageBlob);

                setSpectrogramUrl(imageUrl)
                setShowSpectrogram(true);
                setShowResult(data.result)
                setShowScore(data.score)
            } catch(error) {
                console.error('Error uploading file: ', error);
            }
        }
    };

    return (
        <>
        {/*Title Header*/}
        <h1 className="header1">RealTalk</h1>

        {/*Left Panel - Upload Audio*/}
        <div className="container">
            <div className="file_upload">
                <h2>Upload Your Audio</h2>
                <input type="file" accept=".wav" onChange={handleFileChange} />
                {file && <p> Select file: {file.name} </p>}
                <button className="upload_button" onClick={handleFileUpload}>Upload</button>
            </div>

        {/*Right Panel - Show spectrogram*/}
            <div className="file_report">
                <h2>Authenticity Report</h2>
                {spectrogramUrl && (
                    <div>
                        <h3>Spectrogram</h3>
                        <img src={
                            spectrogramUrl} alt="The spectrogram" />
                    </div>
                )}
                {showResult && (
                    <div>
                        <h3>Result: {showResult}</h3>
                    </div>
                )}
                {showResult && (
                    <div>
                        <h3>Cofidence Score: {showScore}</h3>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}