const express = require('express');
const router = express.Router();
const multer = require('multer');
const TherapistController= require('../controller/therapistController');
const ROLES_LIST = require('../config/roles_list');
const upload = multer({
    limits: {
        fileSize: 500 * 1024 * 1024 // 10 MB limit
    },
    storage: multer.memoryStorage()
}).fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'educationCertificate', maxCount: 1 },
    { name: 'license', maxCount: 1 }
]);


const therapistRouter = (db) => {
    const therapistController = new TherapistController(db);

    router.route('/')
        .get(therapistController.getAllTherapists)
        .post(upload, therapistController.createTherapist);

    router.route('/name')
        .get(therapistController.getTherapistByName);

    router.route('/address')
        .get(therapistController.getTherapistByAddress);

    router.route('/experience')
        .get(therapistController.getTherapistByExperience);

    router.route('/specialization')
        .get(therapistController.getTherapistBySpecialization);

    router.route('/userId/:id')
        .get(therapistController.getTherapistByUserId);

    router.route('/number')
        .get(therapistController.therapistNumber);

    router.route('/unapproved')
        .get(therapistController.getUnapprovedTherapists);

    router.route('/approve/:id')
        .put(therapistController.approveTherapist);
    
    router.route('/:id')
    .get(therapistController.getTherapistById)
    .put(upload, therapistController.updateTherapist)
    .delete(therapistController.deleteTherapist)
    

    return router;
}

module.exports = therapistRouter;