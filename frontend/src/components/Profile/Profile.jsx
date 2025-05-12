import { useSelector } from 'react-redux'
import "./Profile.css";

const Profile = () => {
    const userSelector = useSelector(state => state.user);

    return (
        <div className="profile-container">
            {localStorage.getItem("image") && (
                <img className="profile-image-container" src={localStorage.getItem("image")} alt="Example"/>
            )}

            <p>
                <span style={{ fontWeight: "bold" }}> idnumber:</span> {userSelector.idnumber}
            </p>
            <p>
                <span style={{fontWeight: "bold"}}> phone:</span> {userSelector.phone}
            </p>

            <p>
                <span style={{fontWeight: "bold"}}> email:</span> {userSelector.email}
            </p>
            <p>
                <span style={{ fontWeight: "bold" }}> username:</span> {userSelector.username}
            </p>
        </div>
    )
};
export default Profile;