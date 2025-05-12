// Make sure to always pass: code,error,message values and in addition to those,if you want to pass more data, just pass an object as the fourth argument
function returnStatus(res, code, error, message, additionalData) {
  return res.status(code).json({
    error: error,
    message: message,
    status: code,
    ...additionalData,
  });
}

//res is the response parameters that enables the server to send a reply to the client
//Including error inside the JSON brackets provides a structured, client-friendly response
module.exports = returnStatus;
