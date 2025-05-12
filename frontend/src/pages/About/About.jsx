import "./About.css";
import {useSelector} from "react-redux";

const About = () => {
  const userSelector = useSelector ((state)=> state.user); //state.user greift auf den "user"-Slice des Redux-States zu
     console.log(userSelector.username);

  return (
    <div className="about-container">
      <h2>About</h2>
      <p>This is a patient registration system</p>
    </div>
  );
};

export default About;
