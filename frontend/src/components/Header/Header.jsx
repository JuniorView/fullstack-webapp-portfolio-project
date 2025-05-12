import {useEffect} from "react";
import {makeGETrequest} from "../../utils/api.jsx";
import {login , logout} from "../../redux/user/userSlice.jsx";
import { useDispatch, useSelector} from "react-redux";
import {isTokenExpired} from "../../utils/isTokenExpired.jsx";
import {jwtDecode} from "jwt-decode";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);

  useEffect(()=>{
    /// We want to perform this check below by sending the token back to backend with JWT so the backend checks if this user is logged in,
    // remember we store data like idnumber,phone,email,username in redux but redux loses data when page reloads so we need to set these back when page reloads.
    // Remember when we sign in, we only set the username, because if we sign in as admin we don't want to store all admin data in redux so we do the check here in headers.js
    // because header exists on each page so this is the best place to perform if user logged in when page reloads.Also notice the dependency array takes dispatch function
    // and username,because depending on those two,if they change, useEffect runs again.

    if (localStorage.getItem("token")) {
      const checkIfLoggedIn = async ()=>{

        const res = await makeGETrequest("http://localhost:5000/users/checkifloggedin", localStorage.getItem("token"));
        if (res.status === 200 && res.admin === true) {
          dispatch(login({
            username: "admin",
            admin:res.admin,
            tokenexpiration: jwtDecode(localStorage.getItem("token")).exp,
          }));
        }

        if(res.status === 200 && res.doctor === true ) {
          dispatch(login({
            idnumber: res.idnumber,
            phone:res.phone,
            email:res.email,
            username: res.username,
            doctor:res.doctor,
            tokenexpiration: jwtDecode(localStorage.getItem("token")).exp,
          }));
          const dataUrl = `data:image/jpeg;base64,${res.image}` ; // dataUrl has the image text
          localStorage.setItem("image", dataUrl);
        }
      }

      checkIfLoggedIn();
    }
  }, [dispatch, userSelector.username ]) ;// if those two change , useEffect will  run again. som when we refresh the page the store-state wille change or reset
                                              // to empty string and then userSelector is changed so useEffect will run again
  function removeLocalStorageAndRedux(){
    localStorage.clear();
    //we also need to clear the redux store
    dispatch(logout());
  }
  function checkIfTokenExpired(){
    if(isTokenExpired(localStorage.getItem("token"))){
      removeLocalStorageAndRedux()
    }
  }
  return (
    <header className="header">
      <nav className="navbar">
        {/* Make sure logo.svg is inside the public folder */}
        <img src="/logo.svg" className="App-logo" alt="logo" />
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" onClick={checkIfTokenExpired}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" onClick={checkIfTokenExpired}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/searchpatient" onClick={checkIfTokenExpired}>Search</Link>
          </li>

          { userSelector.username && (
              <li className="nav-item">
                <Link to={"/profile"} onClick={checkIfTokenExpired}> Profile </Link>
              </li>
          )}
          {userSelector.username ? (
              <li className="nav-item">
                <Link to="/" onClick={removeLocalStorageAndRedux}> SignOut </Link>
              </li>
          ) :(
              <li className="nav-item">
                <Link to="/signin" >SignIn</Link>
              </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
