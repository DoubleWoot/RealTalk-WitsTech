import './Homepage.css'
import title_logo from './large_logo_transparent_cropped.png'

export default function Homepage(){
    return (
    <>
        <div className="realtalk_head">
            <img className="page_logo" src={title_logo} />
            <h2 className="realtalk_subhead">Powered by Wit's Tech</h2>
            <div>
            <p className="realtalk_paragraph">Welcome to RealTalk, your frontline defense against the 
                spread of misinformation online. With cutting-edge deepfake 
                detection technology, we're committed to safeguarding the 
                truth for a safer and more honest digital world.</p>
            </div>
        </div>
    </>
    )
}