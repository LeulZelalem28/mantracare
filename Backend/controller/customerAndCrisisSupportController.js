const CustomerAndCrisisSupport = require('../model/CustomerAndCrisisSupport');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const multer = require('multer');
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

class CustomerandCrisisSupportController {
    constructor (db) {
        this.db = db;
    }
    getAllCustomerAndCrisisSupport = async (req, res) => {
        try {
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');

            // Find and also do projection
            const customerAndCrisisSupport = await customerAndCrisisSupportCollection.find({},  {
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
                    customerSupportId: "$_customerSupportId",
                    role: "$_role",
                },
            }).toArray();

            const count = customerAndCrisisSupport.length;

            if (!customerAndCrisisSupport.length) return res.status(204).json({ 'message': 'No customerAndCrisisSupport found' });
            res.json({ count, customerAndCrisisSupport });
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch customerAndCrisisSupport' });
        }
    }
    
      getCustomerAndCrisisSupport = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const customerAndCrisisSupport = await customerAndCrisisSupportCollection.findOne({ _customerSupportId: req.params.id },
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
                    customerSupportId: "$_customerSupportId",
                    role: "$_role",
                  },
        });
        
            if (!customerAndCrisisSupport) {
                return res.status(404).json({ 'message': 'CustomerAndCrisisSupport not found' });
            }
        
            res.json(customerAndCrisisSupport);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch customerAndCrisisSupport' });
            }
      }
        
    createCustomerAndCrisis = async (req, res) => {
        try {
            console.log('hi')
            //data we get from request
            const customerAndCrisisSupportData = req.body;
            
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            //checking if the customerAndCrisisSupport has entered all the data
            if (!customerAndCrisisSupportData.username || !customerAndCrisisSupportData.password || !customerAndCrisisSupportData.email || !customerAndCrisisSupportData.name || !customerAndCrisisSupportData.dateOfBirth || !customerAndCrisisSupportData.phoneNumber) {
                return res.status(400).json({ 'message': 'Missing required fields' });
            }

            //check for duplicate username
            const duplicatePatientUsername = await patientCollection.findOne({ _username: customerAndCrisisSupportData.username});
            const duplicateTherapistUsername = await therapistCollection.findOne({ _username: customerAndCrisisSupportData.username});
            const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: customerAndCrisisSupportData.username});
            const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: customerAndCrisisSupportData.username});

            if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});

            //check for duplicate email
            const duplicatePatientEmail = await patientCollection.findOne({ _email: customerAndCrisisSupportData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: customerAndCrisisSupportData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: customerAndCrisisSupportData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: customerAndCrisisSupportData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            //hash the password
            const hashedPassword = await bcrypt.hash(customerAndCrisisSupportData.password, 10);
            
            const customerAndCrisisSupport = new CustomerAndCrisisSupport();
            customerAndCrisisSupport.userId = uuidv4();
            customerAndCrisisSupport.username = customerAndCrisisSupportData.username;
            customerAndCrisisSupport.password = hashedPassword;
            customerAndCrisisSupport.email = customerAndCrisisSupportData.email;
            customerAndCrisisSupport.name = customerAndCrisisSupportData.name;
            customerAndCrisisSupport.dateOfBirth = customerAndCrisisSupportData.dateOfBirth;
            customerAndCrisisSupport.phoneNumber = customerAndCrisisSupportData.phoneNumber;
            customerAndCrisisSupport.registrationDate = Date.now();
            customerAndCrisisSupport.profilePic = null
            customerAndCrisisSupport.customerSupportId = uuidv4();

            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                customerAndCrisisSupport.profilePic = profilePic;
            }
        
            await customerAndCrisisSupportCollection.insertOne(customerAndCrisisSupport);

            res.status(201).json({ 'message': 'CustomerAndCrisisSupport created successfully' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to create customerAndCrisisSupport' });
                console.log(error)
            }
      }
        
    updateCustomerAndCrisisSupport = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
        
            const customerSupportId = req.params.id;
            const customerAndCrisisSupportData = req.body;
        
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            const existingCustomerAndCrisisSupport = await customerAndCrisisSupportCollection.findOne({ _customerSupportId: customerSupportId });
        
            if (!existingCustomerAndCrisisSupport) {
                return res.status(404).json({ 'message': 'CustomerAndCrisisSupport not found' });
            }

            //check for duplicate username but first check if user is updating
            if (customerAndCrisisSupportData.username && customerAndCrisisSupportData.username !== existingCustomerAndCrisisSupport._username) {
                const duplicatePatientUsername = await patientCollection.findOne({ _username: customerAndCrisisSupportData.username});
                const duplicateTherapistUsername = await therapistCollection.findOne({ _username: customerAndCrisisSupportData.username});
                const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: customerAndCrisisSupportData.username});
                const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: customerAndCrisisSupportData.username});
                if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});
    
            }
    
            // Check for duplicate email but first check if it is being updated
            if (customerAndCrisisSupportData.email && customerAndCrisisSupportData.email !== existingCustomerAndCrisisSupport._email) {
            const duplicatePatientEmail = await patientCollection.findOne({ _email: customerAndCrisisSupportData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: customerAndCrisisSupportData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: customerAndCrisisSupportData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: customerAndCrisisSupportData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            }
            
            // to make updating optional
            const updatedCustomerAndCrisisSupportData = {
                _username: customerAndCrisisSupportData.username || existingCustomerAndCrisisSupport._username,
                _password: existingCustomerAndCrisisSupport._password, // no or cause it is done below
                _email: customerAndCrisisSupportData.email || existingCustomerAndCrisisSupport._email,
                _name: customerAndCrisisSupportData.name || existingCustomerAndCrisisSupport._name,
                _dateOfBirth: customerAndCrisisSupportData.dateOfBirth || existingCustomerAndCrisisSupport._dateOfBirth,
                _phoneNumber: customerAndCrisisSupportData.phoneNumber || existingCustomerAndCrisisSupport._phoneNumber,
                _profilePic: existingCustomerAndCrisisSupport._profilePic
            };

            //first check if the profile pic has been changed
            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                updatedCustomerAndCrisisSupportData._profilePic = profilePic;
            }
            //updated password is hashed but this is done only if password is updated
            if (customerAndCrisisSupportData.password) {
                const hashedPassword = await bcrypt.hash(customerAndCrisisSupportData.password, 10);
                updatedCustomerAndCrisisSupportData._password = hashedPassword;
            }


            const result = await customerAndCrisisSupportCollection.updateOne(
                { _customerSupportId: customerSupportId },
                { $set: updatedCustomerAndCrisisSupportData }
            );

            // Check if the update was successful
            if (result.modifiedCount === 0) {
                return res.status(400).json({ 'message': 'No fields updated' });
            }

            res.json({ 'message': 'CustomerAndCrisisSupport updated successfully', 'updatedCustomerAndCrisis': updatedCustomerAndCrisisSupportData });
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to update customerAndCrisisSupport' });
            }
      }

    deleteCustomerAndCrisisSupport = async (req, res) => {
        try {
            if (!req?.params?.id) {
              return res.status(400).json({ 'message': 'ID parameter is required' });
            }
      
            const customerSupportId = req.params.id;
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const customerAndCrisisSupport = await customerAndCrisisSupportCollection.findOne({ _customerSupportId: customerSupportId });

            if(!customerAndCrisisSupport) {
                return res.status(404).json({ "message": `No customerAndCrisisSupport matches ID ${req.body.id}.` })
            }
            const deletedCustomerAndCrisisSupport = await customerAndCrisisSupportCollection.deleteOne({ _customerSupportId: customerSupportId });
            res.json( { "message": 'CustomerAndCrisisSupport successfully deleted ' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to delete customerAndCrisisSupport' });
            }
        }
    }

    




module.exports = CustomerandCrisisSupportController;