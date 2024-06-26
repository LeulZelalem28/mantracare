const Therapist = require('../model/Therapist');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const multer = require('multer');
const NotificationController = require('./notificationController');
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

class TherapistController {
    constructor (db) {
        this.db = db;
    } 
    getAllTherapists = async (req, res) => {
        try {
            const therapistCollection = await this.db.getDB().collection('therapists');
    
            // Find and also do projection
            const therapists = await therapistCollection.find({_approved: true}, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                },
            }).toArray();
    
            const therapistsPlusRating = [];
    
            for (const therapist of therapists) {
                const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
                const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
                const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
                const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
                const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
                therapistsPlusRating.push({
                    ...therapist,
                    rating: roundedRating,
                });
            }
            console.log(therapistsPlusRating)
            if (!therapistsPlusRating.length) return res.status(204).json({ 'message': 'No therapists found' });
            res.json(therapistsPlusRating);
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapists' });
            console.log(error)
        }
    };

    therapistNumber = async (req, res) => {
        try {
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapistCount = await therapistCollection.countDocuments({ _approved: true });
            res.json({ count: therapistCount });
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist count' });
            console.log(error);
        }
    };
    
    getTherapistById = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _therapistId: req.params.id }, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                    description: "$_description",
                    approved: "$_approved"
                },
            });
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found or not approved' });
            }
    
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
            const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
            const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
            const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
            const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
    
            res.json({ ...therapist, rating: roundedRating });
            console.log('hi', therapist)
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
        }
    };

    getTherapistByUserId = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _userId: req.params.id, _approved: true }, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                    description: "$_description",
                    approved: "$_approved"
                },
            });
    
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found or not approved' });
            }
    
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
            const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
            const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
            const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
            const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
    
            res.json({ ...therapist, rating: roundedRating });
            
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
        }
    };
    getTherapistByName = async (req, res) => {
        try {
            const name = req.query.name || '';
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapists = await therapistCollection.find({ _name: { $regex: new RegExp(name, 'i') }, _approved: true }, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                },
            }).toArray();
    
            if (!therapists.length) {
                return res.status(204).json({ 'message': 'Therapist not found' });
            }
    
            const therapistsPlusRating = [];
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
    
            for (const therapist of therapists) {
                const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
                const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
                const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
                const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
                therapistsPlusRating.push({
                    ...therapist,
                    rating: roundedRating,
                });
            }
    
            res.json(therapistsPlusRating);
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
            console.log(error);
        }
    };
    
    
    getTherapistByAddress = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapists = await therapistCollection.find({ _address: new RegExp(req.body.address, 'i'), _approved: true }, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                },
            }).toArray();
    
            if (!therapists.length) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
    
            const therapistsPlusRating = [];
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
    
            for (const therapist of therapists) {
                const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
                const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
                const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
                const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
                therapistsPlusRating.push({
                    ...therapist,
                    rating: roundedRating,
                });
            }
    
            res.json(therapistsPlusRating);
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
        }
    };
    
    getTherapistByExperience = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapists = await therapistCollection.find({ _experience: req.body.experience, _approved: true }, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                },
            }).toArray();
    
            if (!therapists.length) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
    
            const therapistsPlusRating = [];
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
    
            for (const therapist of therapists) {
                const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
                const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
                const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
                const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
                therapistsPlusRating.push({
                    ...therapist,
                    rating: roundedRating,
                });
            }
    
            res.json(therapistsPlusRating);
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
        }
    };
    
    getTherapistBySpecialization = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapists = await therapistCollection.find({ _specialization: req.body.specialization, _approved: true }, {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                },
            }).toArray();
    
            if (!therapists.length) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
    
            const therapistsPlusRating = [];
            const feedbackAndRatingCollection = await this.db.getDB().collection('feedbacksandratings');
    
            for (const therapist of therapists) {
                const feedbacks = await feedbackAndRatingCollection.find({ _therapistId: therapist.therapistId }).toArray();
                const totalRating = feedbacks.reduce((sum, rating) => sum + parseFloat(rating._rating), 0);
                const averageRating = feedbacks.length > 0 ? totalRating / feedbacks.length : 0;
                const roundedRating = Math.round(averageRating * 100) / 100; // Rounding to two decimal places
                therapistsPlusRating.push({
                    ...therapist,
                    rating: roundedRating,
                });
            }
    
            res.json(therapistsPlusRating);
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
        }
    };
    
        
    createTherapist = async (req, res) => {
        try {
            //data we get from request
            const therapistData = req.body;
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            //checking if the therapist has entered all the data
            if (!therapistData.username || !therapistData.password || !therapistData.email || !therapistData.name || !therapistData.dateOfBirth || !therapistData.phoneNumber || !therapistData.address || !therapistData.specialization || !therapistData.experience || !therapistData.education || !therapistData.description || !req.files['profilePic'] || !req.files['educationCertificate'] || !req.files['license']) {
                return res.status(400).json({ 'message': 'Missing required fields' });
            }

            //check for duplicate username
            const duplicatePatientUsername = await patientCollection.findOne({ _username: therapistData.username});
            const duplicateTherapistUsername = await therapistCollection.findOne({ _username: therapistData.username});
            const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: therapistData.username});
            const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: therapistData.username});
            if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});

            //check for duplicate email
            const duplicatePatientEmail = await patientCollection.findOne({ _email: therapistData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: therapistData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: therapistData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: therapistData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            //hash the password
            const hashedPassword = await bcrypt.hash(therapistData.password, 10);
            
            const therapist = new Therapist();
            therapist.userId = uuidv4();
            therapist.username = therapistData.username;
            therapist.password = hashedPassword;
            therapist.email = therapistData.email;
            therapist.name = therapistData.name;
            therapist.dateOfBirth = therapistData.dateOfBirth;
            therapist.phoneNumber = therapistData.phoneNumber;
            therapist.registrationDate = Date.now();
            therapist.profilePic = null
            therapist.therapistId = uuidv4();
            therapist.address = therapistData.address;
            therapist.specialization = therapistData.specialization;
            therapist.experience = therapistData.experience;
            therapist.education = therapistData.education;
            therapist.description = therapistData.description;

            therapist.profilePic = {
                data: req.files['profilePic'][0].buffer,
                contentType: req.files['profilePic'][0].mimetype
            };

            therapist.educationCertificate = {
                data: req.files['educationCertificate'][0].buffer,
                contentType: req.files['educationCertificate'][0].mimetype
            };
            therapist.license = {
                data: req.files['license'][0].buffer,
                contentType: req.files['license'][0].mimetype
            };

        
            await therapistCollection.insertOne(therapist);

            res.status(201).json({ 'message': 'Therapist created successfully', 'id':therapist._therapistId });
            } catch (error) {
                console.error('Error creating therapist:', error);
                res.status(500).json({ 'message': 'Failed to create therapist' });
            }
      }
        
    updateTherapist = async (req, res) => {
        try {
            
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
        
            const therapistId = req.params.id;
            const therapistData = req.body;
            console.log(therapistData)
        
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            const existingTherapist = await therapistCollection.findOne({ _therapistId: therapistId });
        
            if (!existingTherapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }

            //check for duplicate username but first check if user is updating
            if (therapistData.username && therapistData.username !== existingTherapist._username) {
                const duplicatePatientUsername = await patientCollection.findOne({ _username: therapistData.username});
                const duplicateTherapistUsername = await therapistCollection.findOne({ _username: therapistData.username});
                const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: therapistData.username});
                const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: therapistData.username});
                if(duplicatePatientUsername || (duplicateTherapistUsername && duplicateTherapistUsername._therapistId !== therapistId)  || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});
    
            }
    
            // Check for duplicate email but first check if it is being updated
            if (therapistData.email && therapistData.email !== existingTherapist._email) {
            const duplicatePatientEmail = await patientCollection.findOne({ _email: therapistData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: therapistData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: therapistData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: therapistData.email});
            if(duplicatePatientEmail || (duplicateTherapistEmail && duplicateTherapistEmail._therapistId !== therapistId) || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            }
            
            // to make updating optional
            const updatedTherapistData = {
                _username: therapistData.username || existingTherapist._username,
                _password: existingTherapist._password, // no or cause it is done below
                _email: therapistData.email || existingTherapist._email,
                _name: therapistData.name || existingTherapist._name,
                _dateOfBirth: therapistData.dateOfBirth || existingTherapist._dateOfBirth,
                _phoneNumber: therapistData.phoneNumber || existingTherapist._phoneNumber,
                _profilePic: existingTherapist._profilePic,
                _address: therapistData.address || existingTherapist._address,
                _specialization: therapistData.specialization || existingTherapist._specialization,
                _experience: therapistData.experience || existingTherapist._experience,
                _education: therapistData.education || existingTherapist._education,
                _description: therapistData.description || existingTherapist._description
            };
            

            //first check if the profile pic has been changed
            if (req.files && req.files['profilePic']) {
                const profilePic = {
                    data: req.files['profilePic'][0].buffer, // Store the image buffer directly
                    contentType: req.files['profilePic'][0].mimetype // Capture the content type
                };
                updatedTherapistData._profilePic = profilePic;
            }
            //updated password is hashed but this is done only if password is updated
            if (therapistData.password) {
                const hashedPassword = await bcrypt.hash(therapistData.password, 10);
                updatedTherapistData._password = hashedPassword;
            }


            const result = await therapistCollection.updateOne(
                { _therapistId: therapistId },
                { $set: updatedTherapistData }
            );

            // Check if the update was successful
            if (result.modifiedCount === 0) {
                return res.status(400).json({ 'message': 'No fields updated' });
            }

            res.json({ 'message': 'Therapist updated successfully', 'updatedPatient': updatedTherapistData });
            } catch (error) {
            console.log(error)
            res.status(500).json({ 'message': 'Failed to update therapist' });
            }
      }

    deleteTherapist = async (req, res) => {
        try {
            if (!req?.params?.id) {
              return res.status(400).json({ 'message': 'ID parameter is required' });
            }
      
            const therapistId = req.params.id;
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _therapistId: therapistId });

            if(!therapist) {
                return res.status(404).json({ "message": `No therapist matches ID ${req.body.id}.` })
            }
            await therapistCollection.deleteOne({ _therapistId: therapistId });
            res.json( { "message": 'Therapist successfully deleted ' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to delete therapist' });
            }
        }

        getUnapprovedTherapists = async (req, res) => {
            try {
                const therapistCollection = await this.db.getDB().collection('therapists');
                const unapprovedTherapists = await therapistCollection.find({ _approved: false }, {
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
                        therapistId: "$_therapistId",
                        role: "$_role",
                        address: "$_address",
                        specialization: "$_specialization",
                        experience: "$_experience",
                        education: "$_education",
                        approved: "$_approved"
                    },
                }).toArray();
    
                if (!unapprovedTherapists.length) {
                    return res.status(204).json({ 'message': 'No unapproved therapists found' });
                }
    
                res.json(unapprovedTherapists);
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to fetch unapproved therapists' });
            }
        }

        getUnapprovedTherapistById = async (req, res) => {
            try {
                if (!req.params.id) {
                    return res.status(400).json({ message: 'ID parameter is required' });
                }
        
                const therapistCollection = await this.db.getDB().collection('therapists');
                const therapist = await therapistCollection.findOne(
                    { _therapistId: req.params.id, _approved: false },
                    {
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
                            therapistId: "$_therapistId",
                            role: "$_role",
                            address: "$_address",
                            specialization: "$_specialization",
                            experience: "$_experience",
                            education: "$_education",
                            description: "$_description",
                            approved: "$_approved",
                            educationCertificate: "$_educationCertificate",
                            license: "$_license"
                        },
                    }
                );
        
                if (!therapist) {
                    return res.status(404).json({ message: 'Unapproved therapist not found' });
                }
        
                res.json(therapist);
            } catch (error) {
                res.status(500).json({ message: 'Failed to fetch unapproved therapist' });
            }
        };
        
    
        approveTherapist = async (req, res) => {
            try {
                if (!req?.params?.id) {
                    return res.status(400).json({ 'message': 'ID parameter is required' });
                }
    
                const therapistCollection = await this.db.getDB().collection('therapists');
                const therapist = await therapistCollection.findOne({_therapistId: req.params.id})
                const result = await therapistCollection.updateOne(
                    { _therapistId: req.params.id },
                    { $set: { _approved: true } }
                );
    
                if (result.modifiedCount === 0) {
                    return res.status(404).json({ 'message': 'Therapist not found or already approved' });
                }


                const notif = new NotificationController()
                notif.sendTherapistApprovalNotification(therapist._therapistId, therapist._name)

                res.json({ 'success': 'Therapist approved successfully' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to approve therapist' });
            }
        }
    }

    




module.exports = TherapistController;