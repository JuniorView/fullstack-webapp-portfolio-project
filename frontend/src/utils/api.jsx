import axios from "axios";

export const makeGETrequest = async (url, token = "") => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // response.json() method parses the JSON data from the response body of a Fetch API request and converts it into a JavaScript object.
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error);
    return error;
  }
};

export const makePOSTrequest = async (url, data, token = "") => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error posting data:", data);
    return error;
  }
};

// I use axios instead of built-in fetch function because, fetch has problems with sending multiple form data properly, axios works different, and the response we get has response.data object in it which has properties like message,error,status we get from the backend
export const makePOSTrequestForMultipleFormData = async (
  url,
  formData,
  token = ""
) => {
  try {
    // axios returns a data object on the response and we extract it using destructuring syntax below and data gives us data coming from backend
    const { data } = await axios.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error posting data:", error);
    // error.response.data gives us the data from the backend
    return error.response.data;
  }
};
