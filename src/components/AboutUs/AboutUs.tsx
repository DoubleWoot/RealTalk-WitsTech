import "./AboutUs.css";
import gymuel from "./gymuel.jpg";
import harold from "./harold.png";
import jonas from "./jonas.jpg";
import josh from "./josh.png";

export default function AboutUs() {
  const witstechMembers = [
    { name: "Gymuel De Guzman", role: "Project Manager", imgSrc: gymuel },
    { name: "Josh Quiogue", role: "Systems Expert", imgSrc: josh },
    { name: "Harold Maralit", role: "Model Engineer", imgSrc: harold },
    { name: "Jonas Balajadia", role: "Dataset Expert", imgSrc: jonas },
  ];

  return (
    <>
      <div>
        <h1 className="aboutus_title">Our Team Members</h1>
        <div className="profile_containers">
          {witstechMembers.map((witstechMembers, index) => (
            <div key={index} className="profile_card">
              <img
                src={witstechMembers.imgSrc}
                alt={`${witstechMembers.name}`}
                className="profile_image"
              />
              <div className="profile_details">
                <p className="profile_name">{witstechMembers.name}</p>
                <p className="profile_role">{witstechMembers.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="paragraph">
          <p>
            Welcome to RealTalk, a pioneering web-based platform developed by
            WitsTech, a dedicated group of researchers from Far Eastern
            University - Alabang. RealTalk aims to combat the sophisticated and
            growing threat of deepfake media in the Philippines, particularly
            focusing on the detection of deepfake audio in Tagalog.{" "}
          </p>

          <p>
            With this, WitsTech’s study titled ‘RealTalk: Tagalog Speech
            Deepfake Detection System using Vision Transformer Algorithm’,
            leverages the advanced Vision Transformer Algorithm to explore its
            capabilities in speech verification. The Vision Transformer, a model
            originally designed for image recognition, excels in processing data
            with high accuracy and speed. By adapting this powerful tool, we can
            identify subtle nuances in audio that are often missed by
            traditional detection methods, making the system particularly robust
            against the increasingly complex audio deepfake manipulations.{" "}
          </p>

          <p>
            WitsTech embarked on this project motivated by the alarming rise in
            deepfake-related cases and the conspicuous absence of effective
            detection methods tailored for Tagalog. Through our work, we aim to
            safeguard the integrity of digital communications in the Philippines
            and contribute to the global efforts in deepfake detection.
          </p>

          <p>
            At RealTalk, we are committed to the pursuit of truth and safety in
            the digital age. Join us in our mission to ensure that authenticity
            prevails in our interconnected world. Let us know your thoughts and
            opinions to help our system and research grow!
          </p>
        </div>
      </div>
    </>
  );
}
