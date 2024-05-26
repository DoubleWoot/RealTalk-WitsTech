import './AboutUs.css'
import placeholder from './league.jpg'

export default function AboutUs(){

    const witstechMembers = [
        {name: "Gymuel De Guzman", role: "Project Manager", imgSrc: placeholder},
        {name: "Josh Quiogue", role: "Systems Expert", imgSrc: placeholder},
        {name: "Harold Maralit", role: "Model Engineer", imgSrc: placeholder},
        {name: "Jonas Balajadia", role: "Dataset Expert", imgSrc: placeholder}
    ]

    return(
        <>
        <div>
            <h1 className="aboutUs_title">About Us</h1>
            <div className="profile_containers">
                {witstechMembers.map((witstechMembers, index) => (
                    <div key={index} className="profile_card">
                    <img src={witstechMembers.imgSrc} alt={`${witstechMembers.name}`} className="profile_image" />
                    <div className="profile_details">
                      <p className="profile_name">{witstechMembers.name}</p>
                      <p className="profile_role">{witstechMembers.role}</p>
                    </div>
                  </div>
                ))}
            </div>
            <h1 className="abstract_title">Abstract</h1>
            <p>In the heart of the bustling city, amidst 
                the clamor of daily commuters and the 
                rhythmic pulsing of street lights, there 
                lies a quaint little café known for its 
                aromatic brews and rustic charm. This hidden 
                gem, tucked away on the corner of Maple and 
                Third, offers a sanctuary for those seeking 
                solace from the urban frenzy. Inside, the 
                air is filled with the rich scent of freshly 
                ground coffee beans and the soothing hum of 
                soft jazz, creating an ambiance perfect for 
                contemplation or a peaceful break during a 
                hectic day. Patrons, ranging from weary office 
                workers to curious tourists, find themselves 
                drawn to the café's warm embrace, where every 
                sip seems to slow time itself.</p>
        </div>
        </>
    )
}