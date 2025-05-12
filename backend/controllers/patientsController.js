const {getDatabase, client} = require("../helpers/connectDB");
const returnStatus = require("../helpers/returnStatus");

const patientsController = {
    registerPatient: async (req, res, next) => {
        try {
            const db = await getDatabase();

            // When registering a patient, we also need to check the idnumber and email of doctors to make sure that patient idnumber and email don't exist for a doctor
            const doctorid = await db.collection("doctors").findOne({
                $or: [{email: req.body.email}, {idnumber: req.body.idnumber}],
            });

            if (doctorid) {
                return returnStatus(
                    res,
                    400,
                    true,
                    "You can't register a patient using this id number or email"
                );
            }

            const doctor = await db.collection("doctors").findOne({
                email: req.decodedtoken.email,
            });

            const admin = await db.collection("admin").findOne({
                email: req.decodedtoken.email,
            });

            // If the email that is used to register a patient exists in the admin collection,reject the request
            const emailExistsForAdmin = await db.collection("admin").findOne({
                email: req.body.email,
            });

            if (emailExistsForAdmin) {
                return returnStatus(
                    res,
                    400,
                    true,
                    "You can't register a patient using this email"
                );
            }

            // using ternary operator,we check if doctor is registering a patient,doctor can add a medical record.If admin is registering a patient,admin can't add a medical record
            const medicalrecord = doctor
                ? [
                    {
                        date: new Date().toLocaleDateString("en-GB"),
                        record: req.body.medicalrecord,
                    },
                ]
                : [];

            // If doctor or admin made this request,then we can register the patient
            if (doctor || admin) {
                const patients_collection = db.collection("patients");
                // If id or email already exists for the patient in the patients collection then don't register this patient
                const patient = await patients_collection.findOne({
                    $or: [{email: req.body.email}, {idnumber: req.body.idnumber}],
                });

                if (patient) {
                    return returnStatus(res, 400, true, "Patient already exists");
                }

                const result = await patients_collection.insertOne({
                    idnumber: req.body.idnumber,
                    username: req.body.username,
                    email: req.body.email,
                    address: req.body.address,
                    phone: req.body.phone,
                    medicalrecord: medicalrecord,
                });

                // ALWAYS make sure to return this json format where we send status code and have a message property because we will use this in the frontend
                return returnStatus(res, 200, false, "Patient added");
            }

            return returnStatus(
                res,
                401,
                true,
                "You aren't allowed to register a patient"
            );
        } catch (error) {
            console.log(error);
            return returnStatus(res, 500, true, "Internal server error");
        } finally {
            if (client) {
                await client.close();
            }
        }
    },

    searchPatient: async (req, res) => {
        try {
            const db = await getDatabase();

            const patient = await db.collection("patients").findOne(
                {idnumber: req.query.idnumber},
                {projection: {_id: 0, password: 0}}
            );

            if (patient) {
                const patientJson = JSON.stringify(patient);
                return returnStatus(res, 200, false, "Patient found", {
                    patient: patientJson,
                })
            } else {
                return returnStatus(res, 404, true, "Patient not found");
            }
        } catch (error) {
            console.error(error);
            return returnStatus(res, 500, true, "Internal server error");
        } finally {
            if (client) {
                await client.close();
            }
        }
    },

    addNewMedicalRecord: async (req, res) => {
        try {
            const db = await getDatabase();

            const doctor = await db.collection("doctors").findOne({
                email: req.decodedtoken.email,
            });

            if (doctor) {
                const patient = await db.collection("patients").findOneAndUpdate(
                    { idnumber: req.body.idnumber },
                    {
                        $push: {
                            medicalrecord: {
                                date: new Date().toLocaleDateString("en-GB"),
                                record: req.body.medicalrecord,
                            },
                        },
                    },
                    { returnDocument: "after", projection: { _id: 0, password: 0 } }
                );

                if (!patient) {
                    return returnStatus(res, 404, true, "Patient was not found");
                }

                const patientJson = JSON.stringify(patient);

                return returnStatus(res, 201, false, "New Record for patient added", {
                    patient: patientJson,
                });
            }

            return returnStatus(res, 404, true, "Doctor was not found");
        } catch (error) {
            console.log(error);
            return returnStatus(res, 500, true, "Internal server error");
        } finally {
            if (client) {
                await client.close();
            }
        }
    },

    updateContact : async (req, res) => {
        try {
            const db = await getDatabase();
            const {phone , email, idnumber} = req.body;

            const admin = await db.collection("admin").findOne({ email: req.decodedtoken.email, });

            if (admin){
                const adminEmailExists = await db.collection("admin").findOne({email: email});

                const doctorsExists = await db.collection("doctors").findOne({email:email});

                if (doctorsExists || adminEmailExists) {
                    return returnStatus(res, 404, true, "you can't use this email");
                }
                const patient = await db.collection("patients").findOneAndUpdate(
                    {idnumber:idnumber},
                    {
                        $set:{
                            phone:phone,
                            email:email,
                        },
                    },
                    { returnDocument: "after", projection: { _id: 0, password: 0 }
                });

                if (!patient) {
                    return returnStatus(res, 404, true, "Patient was not found");
                }

                const patientJson = JSON.stringify(patient);
                return returnStatus(res, 201, false, "Patient updated", {patient : patientJson})
            }

            return returnStatus(res, 401, true, "Unauthorized");
        }catch (error) {
            console.log(error);
            return returnStatus(res, 500, true, "Internal server error");
        } finally {
            if (client) {
                await client.close();
            }
        }
    }
};

module.exports = patientsController;
