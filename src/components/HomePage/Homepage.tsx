import { Link } from "react-router-dom";
import "./Homepage.css";
import title_logo from "./large_logo_transparent_cropped.png";
import homepage_img from "./homepage_image.png";

export default function Homepage() {
  const upload_string = "Upload Your Audio Here →";

  return (
    <>
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
      <img className="background_image" src={homepage_img} />
    </>
  );
}
