const express = require("express");
const router = express.Router();
const patientsController = require("../controllers/patientsController");
const verifyToken = require("../middlewares/verifyToken");

const {
    checkIDNumber,
    checkPhoneNumber,
    checkMedicalRecord,
    checkAddress,
    checkEmail,
    checkUserName,
} = require("../middlewares/checkInputs");

router.post(
    "/registerpatient",
    verifyToken,
    checkIDNumber,
    checkUserName,
    checkEmail,
    checkAddress,
    checkPhoneNumber,
    checkMedicalRecord,
    patientsController.registerPatient
);

router.get("/search",patientsController.searchPatient);

router.post(
    "/addnewmedicalrecord",
    verifyToken,
    checkIDNumber,
    checkMedicalRecord,
    patientsController.addNewMedicalRecord
);

router.post(
    "/updatecontact",
    verifyToken,
    checkIDNumber,
    checkEmail,
    checkPhoneNumber,
    patientsController.updateContact
);

router.use((err, req, res, next) => {
    console.log("FROM patients route middleware", err.message);
});
module.exports = router;
