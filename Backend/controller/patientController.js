const Patient = require('../model/Patient');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const multer = require('multer');
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

class PatientController {
    constructor (db) {
        this.db = db;
    }
    getAllPatients = async (req, res) => {
        try {
            const patientCollection = await this.db.getDB().collection('patients');
    
            const patients = await patientCollection.find({}, {
                projection: {
                    _id: 0,
                    userId: "$_userId",
                    username: "$_username",
                    password: "$_password",
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    patientId: "$_patientId",
                    role: "$_role",
                },
            }).toArray();
    
            const count = await patientCollection.countDocuments();
    
            if (!patients.length) return res.status(204).json({ 'message': 'No patients found' });
            
            res.json({ count, patients });
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch patients' });
        }
    }
    
    
      getPatient = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const patientCollection = await this.db.getDB().collection('patients');
            const patient = await patientCollection.findOne({ _patientId: req.params.id },
                {projection: {
                    _id: 0, 
                    userId: "$_userId", 
                    username: "$_username",
                    password: "$_password",
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    patientId: "$_patientId",
                    role: "$_role",
                  },
        });
        
            if (!patient) {
                return res.status(404).json({ 'message': 'Patient not found' });
            }
            res.json(patient);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch patient' });
            }
      }

      getPatientByUserId = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const patientCollection = await this.db.getDB().collection('patients');
            const patient = await patientCollection.findOne({ _userId: req.params.id },
                {projection: {
                    _id: 0, 
                    userId: "$_userId", 
                    username: "$_username",
                    password: "$_password",
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    patientId: "$_patientId",
                    role: "$_role",
                  },
        });
        
            if (!patient) {
                return res.status(404).json({ 'message': 'Patient not found' });
            }
            console.log(patient)
            res.json(patient);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch patient' });
            }
      }
        
    createPatient = async (req, res) => {
        try {
            //data we get from request
            const patientData = req.body;

            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            //checking if the patient has entered all the data
            if (!patientData.username || !patientData.password || !patientData.email || !patientData.name || !patientData.dateOfBirth || !patientData.phoneNumber) {
                return res.status(400).json({ 'message': 'Missing required fields' });
            }

            //check for duplicate username
            const duplicatePatientUsername = await patientCollection.findOne({ _username: patientData.username});
            const duplicateTherapistUsername = await therapistCollection.findOne({ _username: patientData.username});
            const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: patientData.username});
            const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: patientData.username});
            if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});

            //check for duplicate email
            const duplicatePatientEmail = await patientCollection.findOne({ _email: patientData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: patientData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: patientData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: patientData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            //hash the password
            const hashedPassword = await bcrypt.hash(patientData.password, 10);
            
            const patient = new Patient();
            patient.userId = uuidv4();
            patient.username = patientData.username;
            patient.password = hashedPassword;
            patient.email = patientData.email;
            patient.name = patientData.name;
            patient.dateOfBirth = patientData.dateOfBirth;
            patient.phoneNumber = patientData.phoneNumber;
            patient.registrationDate = Date.now();
            patient.profilePic = null
            patient.patientId = uuidv4();

            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                patient.profilePic = profilePic;
            }
        
            const createdPatient = await patientCollection.insertOne(patient);

            res.status(201).json({ 'message': 'Patient created successfully' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to create patient' });
            }
      }
        
    updatePatient = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
        
            const patientId = req.params.id;
            const patientData = req.body;
        
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            const existingPatient = await patientCollection.findOne({ _patientId: patientId });
        
            if (!existingPatient) {
                return res.status(404).json({ 'message': 'Patient not found' });
            }

            //check for duplicate username but first check if user is updating
            if (patientData.username && patientData.username !== existingPatient._username) {
                const duplicatePatientUsername = await patientCollection.findOne({ _username: patientData.username});
                const duplicateTherapistUsername = await therapistCollection.findOne({ _username: patientData.username});
                const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: patientData.username});
                const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: patientData.username});
                if((duplicatePatientUsername && duplicatePatientUsername._patientId !== patientId) || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});
    
            }
    
            // Check for duplicate email but first check if it is being updated
            if (patientData.email && patientData.email !== existingPatient._email) {
            const duplicatePatientEmail = await patientCollection.findOne({ _email: patientData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: patientData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: patientData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: patientData.email});
            if((duplicatePatientEmail && duplicatePatientEmail._patientId !== patientId) || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            }
            
            // to make updating optional
            const updatedPatientData = {
                _username: patientData.username || existingPatient._username,
                _password: existingPatient._password, // no or cause it is done below
                _email: patientData.email || existingPatient._email,
                _name: patientData.name || existingPatient._name,
                _dateOfBirth: patientData.dateOfBirth || existingPatient._dateOfBirth,
                _phoneNumber: patientData.phoneNumber || existingPatient._phoneNumber,
                _profilePic: existingPatient._profilePic
            };

            //first check if the profile pic has been changed
            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                updatedPatientData._profilePic = profilePic;
            }
            //updated password is hashed but this is done only if password is updated
            if (patientData.password) {
                const hashedPassword = await bcrypt.hash(patientData.password, 10);
                updatedPatientData._password = hashedPassword;
            }


            const result = await patientCollection.updateOne(
                { _patientId: patientId },
                { $set: updatedPatientData }
            );

            // Check if the update was successful
            if (result.modifiedCount === 0) {
                return res.status(400).json({ 'message': 'No fields updated' });
            }

            res.json({ 'message': 'Patient updated successfully', 'updatedPatient': updatedPatientData });
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to update patient' });
            console.log(error)
            }

      }

    deletePatient = async (req, res) => {
        try {
            if (!req?.params?.id) {
              return res.status(400).json({ 'message': 'ID parameter is required' });
            }
      
            const patientId = req.params.id;
            const patientCollection = await this.db.getDB().collection('patients');
            const patient = await patientCollection.findOne({ _patientId: patientId });

            if(!patient) {
                return res.status(204).json({ "message": `No patient matches ID ${req.body.id}.` })
            }
            await patientCollection.deleteOne({ _patientId: patientId });
            res.json( { "message": 'Patient successfully deleted ' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to delete patient' });
            }
        }
    }

    




module.exports = PatientController;