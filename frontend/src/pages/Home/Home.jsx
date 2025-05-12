import {useSelector} from "react-redux";
import "./Home.css";

const Home = () => {
  const userSelector = useSelector((state) => state.user);
  return (
    <div className="home-container">
      <h2>Welcome to Patient Management System</h2>
      <h3>
        {userSelector.username ?  (
            <p>
              welcome <span style={{color : "red" }}> {userSelector.username}</span>
            </p>
        ):(
            <p> you are not logged in </p>
        )}
      </h3>
      <div className="features">
        <div className="feature">
          <h3>Patient Register</h3>
          <p>Register new patients into the system</p>
          <a href="/registerpatient">Register Patient</a>
        </div>
        <div className="feature">
          <h3>Search Patient</h3>
          <p>View and manage medical history of patients</p>
          <a href="/searchpatient">View Medical History</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
