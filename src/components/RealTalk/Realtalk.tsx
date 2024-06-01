import { useState } from 'react'
import './Realtalk.css'

export default function RealTalk(){
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files && event.target.files[0];
        if (selectedFile && selectedFile.type == 'audio/wav'){
            setFile(selectedFile);
        } else {
            alert("Please upload a .wav file");
        }
    };

    const handleFileUpload = () => {
        if (file) {
            // Figuring out how to integrate the model first
            console.log('File uploaded', file.name);
            // This for confirmation for file upload
        }
    }

    return (
        <>
        <div>
            <h1 className="header1">RealTalk</h1>
            <div className="container">
                <div className="sqaure file_upload">
                    <h2>Upload Your Audio</h2>
                    <input type="file" accept=".wav" onChange={handleFileChange} />
                    {file && <p> Select file: {file.name} </p>}
                    <button className="upload_button" onClick={handleFileUpload}>Upload</button>
                </div>
                <div className="sqaure file_report">
                    <h2>Authenticity Report</h2>
                </div>
            </div>
        </div>
        </>
    )
}