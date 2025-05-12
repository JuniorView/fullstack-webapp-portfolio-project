import CustomForm from "../../components/CustomForm/CustomForm";
import { useState } from "react";
import Button from "../../components/Button/Button";
import { makePOSTrequestForMultipleFormData } from "../../utils/api";
import "./RegisterDoctor.css";

const RegisterDoctor = () => {
  const [image, setImage] = useState(null);
  const [idnumber, setIDNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submitDoctor = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage("No image selected");
      return;
    }

    const formData = new FormData();
    // file below will then be received from the backend using formidable, 'file' below is a made up key name so it is a form data key.
    // A formData in JavaScript is an instance of the FormData class, which is used to construct a set of key/value pairs representing form fields and their values.
    // It's commonly used to construct data to be sent in an HTTP request, particularly when dealing with forms or file uploads.
    formData.append("file", image);

    // data below will then be received from the backend using req.body.data, 'data' below is a form data key,a made up name.
    formData.append(
      "data",
      JSON.stringify({
        idnumber,
        phone,
        email,
        username,
        password,
      })
    );

    console.log(formData);
    const res = await makePOSTrequestForMultipleFormData(
      "http://localhost:5000/doctors/registerdoctor",
      formData,
      localStorage.getItem("token")
    );

    setMessage(res.message);
  };

  return (
    <div className="registerdoctor-container">
      <CustomForm>
        <span>Doctor Image:</span>
        <br />
        <CustomForm.Image onChange={(e) => setImage(e.target.files[0])} />
        <br />
        <br />
        <CustomForm.IDNumber
          value={idnumber}
          onChange={(e) => setIDNumber(e.target.value)}
        />

        <CustomForm.Phone
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <CustomForm.Email
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <CustomForm.UserName
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />

        <CustomForm.Password
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button value="Register Doctor" onClick={submitDoctor} />
      </CustomForm>
      {message}
    </div>
  );
};

export default RegisterDoctor;
