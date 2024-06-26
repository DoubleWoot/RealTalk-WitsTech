import { Link } from "react-router-dom";
import "./Homepage.css";
import title_logo from "./large_logo_transparent_cropped.png";
import homepage_img from "./homepage_image.png";
import upload_icon from "./upload_icon.png";
import spec_icon from "./spec_icon.png";
import report_icon from "./report_icon.png";
import filesize_icon from "./filesize_icon.png";
import seconds_icon from "./seconds_icon.png";
import speech_icon from "./speech_icon.png";
import audio_icon from "./audio_icon.png";
import gear_loading from "./gear_loading.gif";
import feedback_icon from "./feedback_icon.png";

export default function Homepage() {
  const upload_string = "Upload Your Audio Here →";

  return (
    <>
      <div className="homepage_container">
        <div className="realtalk_head">
          <img className="page_logo" src={title_logo} />
          <h2 className="realtalk_subhead">Powered by Wit's Tech</h2>
          <div>
            <p className="realtalk_paragraph">
              Welcome to RealTalk, your frontline defense against the spread of
              misinformation online. With cutting-edge deepfake detection
              technology, we're committed to safeguarding the truth for a safer
              and more honest digital world.
            </p>
          </div>
          <Link to="/realtalk">
            <button className="realtalk_button">{upload_string}</button>
          </Link>
        </div>
        <div className="background_image_container">
          <img className="background_image" src={homepage_img} />
        </div>
        <div className="scroll_indicator_container">
          <div className="scroll_text">Scroll Down</div>
          <div className="arrow">&#x2193;</div>
        </div>
      </div>
      <div className="guide_container">
        <h1>User Guide</h1>
        <div className="guide_inner_container">
          <div className="guide_item">
            <img className="user_guide_icon" src={upload_icon} />
            <h2>Upload Audio</h2>
            <p>
              Users can upload or drop their audio files directly onto the
              platform, supporting commonly used WAV format, making it
              accessible for a variety of Tagalog audio content.
            </p>
          </div>
          <div className="guide_item">
            <img className="user_guide_icon" src={spec_icon} />
            <h2>Audio Preprocessing</h2>
            <p>
              User-submitted audio data will then undergo a series of
              preprocessing to convert audio format into a visual format through
              a log-mel spectrogram.
            </p>
          </div>
          <div className="guide_item">
            <img className="user_guide_icon" src={report_icon} />
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
            <img className="limit_icon" src={filesize_icon} />
            <p>
              Audio files submitted must <u>be at most 5MB</u>.
            </p>
          </div>
          <div className="limitations_item">
            <img className="limit_icon" src={seconds_icon} />
            <p>
              Desirable length of audio data submitted is{" "}
              <u>15 seconds and below</u>.
            </p>
          </div>
          <div className="limitations_item">
            <img className="limit_icon" src={audio_icon} />
            <p>
              The system has <u>no control over noise and variance in volume</u>{" "}
              that may hinder and affect its authentication.
            </p>
          </div>
          <div className="limitations_item">
            <img className="limit_icon" src={speech_icon} />
            <p>
              <u>Tagalog speech only</u>. The system cannot properly detect for
              singing, and other languages.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
