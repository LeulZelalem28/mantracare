const Booking = require('../model/Booking');
const { v4: uuidv4 } = require('uuid');
const schedule = require('node-schedule');
const NotificationController = require('./notificationController');
 class BookingController {
    constructor (db) {
        this.db = db;
    } 
    getBookingsByLocation = async(req, res) => {
        try {

            const sessionMode = req.params.sessionMode;
            const sessionLocation = req.params.sessionLocation

            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            
            if (!req?.body?.userId) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const patient = await patientCollection.findOne({_userId : req.body.userId });
            const therapist = await therapistCollection.findOne({_userId : req.body.userId });
            

            const bookingCollection = await this.db.getDB().collection('bookings');

            //if userId is that of a patient
            if(patient){
                const bookings = await bookingCollection.find({'_patientInfo.id': patient._patientId, _sessionMode: sessionMode, _sessionLocation: sessionLocation },{
                    projection: {
                        bookingId: '$_bookingId',
                        patientInfo: '$_patientInfo',
                        therapistId: '$_therapistId',
                        therapistName: '$_therapistName',
                        sessionTitle: '$_sessionTitle',
                        date: '$_date',
                        timeSlot: '$_timeSlot',
                        sessionType: '$_sessionType',
                        sessionMode: '$_sessionMode',
                        sessionLocation: '$_sessionLocation',
                        isCanceled: '$_isCanceled',
                        canceledBy: '$_canceledBy',
                    }
                }).toArray()
                
    
                if (!bookings.length) return res.status(204).json({ 'message': 'No bookings found' });
                    res.json(bookings);
    
            }

            //if userId is of a therapist
            if (therapist) {
                const bookings = await bookingCollection.find({_therapistId: therapist._therapistId, _sessionMode: sessionMode, _sessionLocation: sessionLocation },{
                    projection: {
                        bookingId: '$_bookingId',
                        patientInfo: '$_patientInfo',
                        therapistId: '$_therapistId',
                        therapistName: '$_therapistName',
                        sessionTitle: '$_sessionTitle',
                        date: '$_date',
                        timeSlot: '$_timeSlot',
                        sessionType: '$_sessionType',
                        sessionMode: '$_sessionMode',
                        sessionLocation: '$_sessionLocation',
                        isCanceled: '$_isCanceled',
                        canceledBy: '$_canceledBy',
    
                    }
                }).toArray()
    
                if (!bookings.length) return res.status(204).json({ 'message': 'No bookings found' });
                    res.json(bookings);
            }
            
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to fetch bookings' });
        }
}

    getBookingsBySessionType = async (req, res) => {
        try {
            const sessionType = req.params.sessionType;
            const sessionMode = req.params.sessionMode;

            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            
            if (!req?.body?.userId) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const patient = await patientCollection.findOne({_userId : req.body.userId });
            const therapist = await therapistCollection.findOne({_userId : req.body.userId });

            const bookingCollection = await this.db.getDB().collection('bookings');

            //if userId is that of a patient
            if(patient){
                const bookings = await bookingCollection.find({ '_patientInfo.id': patient._patientId, _sessionType: sessionType, _sessionMode: sessionMode, _sessionLocation: 'online' },{
                    projection: {
                        bookingId: '$_bookingId',
                        patientInfo: '$_patientInfo',
                        therapistId: '$_therapistId',
                        therapistName: '$_therapistName',
                        sessionTitle: '$_sessionTitle',
                        date: '$_date',
                        timeSlot: '$_timeSlot',
                        sessionType: '$_sessionType',
                        sessionMode: '$_sessionMode',
                        sessionLocation: '$_sessionLocation',
                        isCanceled: '$_isCanceled',
                        canceledBy: '$_canceledBy',
    
                    }
                }).toArray()
                console.log(bookings)
                if (!bookings.length) return res.status(204).json({ 'message': 'No bookings found' });
                    res.json(bookings);
    
            }

            //if userId is of a therapist
            if (therapist) {
                const bookings = await bookingCollection.find({ _therapistId: therapist._therapistId, _sessionType: sessionType, _sessionMode: sessionMode, _sessionLocation: 'online' },{
                    projection: {
                        bookingId: '$_bookingId',
                        patientInfo: '$_patientInfo',
                        therapistId: '$_therapistId',
                        therapistName: '$_therapistName',
                        sessionTitle: '$_sessionTitle',
                        date: '$_date',
                        timeSlot: '$_timeSlot',
                        sessionType: '$_sessionType',
                        sessionMode: '$_sessionMode',
                        sessionLocation: '$_sessionLocation',
                        isCanceled: '$_isCanceled',
                        canceledBy: '$_canceledBy',
    
                    }
                }).toArray()
    
                if (!bookings.length) return res.status(204).json({ 'message': 'No bookings found' });
                    res.json(bookings);
            }       

        } catch(error) {
            res.status(500).json({ 'message': 'Failed to fetch bookings' });
            console.log(error)
        }
    }

    getBookingById = async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'Booking ID parameter is required' });
            }

            const bookingCollection = await this.db.getDB().collection('bookings');
            const booking = await bookingCollection.findOne({ _bookingId: req.params.id }, {
                    projection: {
                        bookingId: '$_bookingId',
                        patientInfo: '$_patientInfo',
                        therapistId: '$_therapistId',
                        therapistName: '$_therapistName',
                        sessionTitle: '$_sessionTitle',
                        date: '$_date',
                        timeSlot: '$_timeSlot',
                        sessionType: '$_sessionType',
                        sessionMode: '$_sessionMode',
                        sessionLocation: '$_sessionLocation',
                        isCanceled: '$_isCanceled',
                        canceledBy: '$_canceledBy',
    
                    }
            });

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            res.json(booking);
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({ 'message': 'Failed to fetch booking' });
        }
    }
    createBooking = async (req, res) => {
        try {
            const bookingData = req.body;
    
            // Check if all fields are present
            const requiredFields = ['therapistId', 'therapistName', 'date', 'timeSlot'];
            if (!requiredFields.every(field => bookingData[field])) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
    
            const bookingDate = new Date(bookingData.date);
            const currentDate = new Date();
            if (bookingDate < currentDate) {
                return res.status(400).json({ message: 'Booking date cannot be in the past' });
            }
    
            const db = this.db.getDB();
            const [patient, therapist, therapistSchedule] = await Promise.all([
                db.collection('patients').findOne({ _userId: bookingData.userId }),
                db.collection('therapists').findOne({ _therapistId: bookingData.therapistId }),
                db.collection('schedules').findOne({ _therapistId: bookingData.therapistId })
            ]);
    
            if (!patient) {
                return res.status(400).json({ message: 'Patient not found' });
            }
    
            if (!therapist) {
                return res.status(400).json({ message: 'Therapist not found' });
            }
    
            // Check therapist's availability for the specified day and time slot
            const bookingWeekday = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
    
            let sessionMode = '';
            let sessionLocation = '';
            let sessionTitle = '';
    
            if (therapistSchedule) {
                const { _oneOnOneAvailability, _groupAvailability } = therapistSchedule;
                const availabilityForDay = _oneOnOneAvailability.find(avail => avail.day.toLowerCase() === bookingWeekday.toLowerCase());
    
                if (availabilityForDay && availabilityForDay.timeSlots.includes(bookingData.timeSlot)) {
                    sessionMode = 'one-on-one';
                } else {
                    const _groupAvailabilityForDay = _groupAvailability.find(avail => avail.day.toLowerCase() === bookingWeekday.toLowerCase());
                    if (_groupAvailabilityForDay && _groupAvailabilityForDay.timeSlots.includes(bookingData.timeSlot)) {
                        sessionMode = 'group';
                        sessionLocation = _groupAvailabilityForDay.sessionLocation;
                        sessionTitle = _groupAvailabilityForDay.title;
                    }
                }
            }
    
            if (!sessionMode) {
                return res.status(400).json({ message: 'Therapist not available at the specified time' });
            }
    
            // If the session is in-person and one-on-one, set sessionType to null
            if (bookingData.sessionLocation === 'in-person' && sessionMode === 'one-on-one') {
                bookingData.sessionType = null;
            }
    
            // Check if the booking exists for one-on-one
            const bookingCollection = await this.db.getDB().collection('bookings');

            if (sessionMode === 'one-on-one') {
                const existingBooking = await bookingCollection.findOne({
                    _therapistId: bookingData.therapistId,
                    _date: bookingData.date,
                    _timeSlot: bookingData.timeSlot,
                    _sessionType: bookingData.sessionType
                });
    
                if (existingBooking) {
                    return res.status(400).json({ message: 'Slot already booked' });
                }
            }
    
            // Check if there is an existing group booking
            let existingGroupBooking = await bookingCollection.findOne({
                _therapistId: bookingData.therapistId,
                _date: bookingData.date,
                _timeSlot: bookingData.timeSlot,
                _sessionType: bookingData.sessionType,
                _sessionMode: 'group'
            });
    
            // If a group booking exists, update it to include the new patient if not already included
            if (existingGroupBooking) {
                if (existingGroupBooking._patientInfo.some(p => p.id === patient._patientId)) {
                    return res.status(400).json({ message: 'Patient already included in this group booking' });
                } else {
                    await bookingCollection.updateOne(
                        { _id: existingGroupBooking._id },
                        { $push: { _patientInfo: { id: patient._patientId, name: patient._name } } }
                    );
                    return res.status(200).json({ message: 'Patient added to existing group booking' });
                }
            }
    
            // Create a new booking object if there's no existing group booking
            const booking = {
                _bookingId: uuidv4(),
                _patientInfo: [{ id: patient._patientId, name: patient._name }],
                _therapistId: bookingData.therapistId,
                _therapistName: bookingData.therapistName,
                _date: bookingData.date,
                _timeSlot: bookingData.timeSlot,
                _sessionType: bookingData.sessionType,
                _sessionMode: sessionMode,
                _sessionLocation: bookingData.sessionLocation
            };
    
            // Set sessionTitle for group sessions
            if (sessionMode === 'group') {
                booking._sessionLocation = sessionLocation;
                booking._sessionTitle = sessionTitle;
                if (sessionLocation === 'in-person') {
                    booking._sessionType = null;
                }
                if (!sessionTitle) {
                    return res.status(400).json({ message: 'sessionTitle is required for group sessions' });
                }
            }
    
            await bookingCollection.insertOne(booking);
    
            // To send notification mail
            const reminderDate = new Date();
            reminderDate.setMinutes(reminderDate.getMinutes() + 1);
            const commonNotifDetails = {
                date: booking._date,
                time: booking._timeSlot,
                location: booking._sessionLocation,
            };
    
            const notification_patient = new NotificationController();
            const notification_therapist = new NotificationController();
    
            schedule.scheduleJob(reminderDate, () => {
                notification_patient.sendNotification(commonNotifDetails, therapist._name, patient._email, patient._name, patient._role); // for patient
                notification_therapist.sendNotification(commonNotifDetails, patient._name, therapist._email, therapist._name, therapist._role); // for therapist
            });

            console.log('hiiii',booking)
    
            res.status(201).json({ message: 'Booking created successfully', 'booking': booking.bookingId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to create booking' });
        }
    }
    

    // createBooking = async (req, res) => {
    //     try {
    //         const bookingCollection = await this.db.getDB().collection('bookings');
    //         const patientCollection = await this.db.getDB().collection('patients');
    //         const scheduleCollection = await this.db.getDB().collection('schedules');
    
    //         const bookingData = req.body;
    
    //         const patient = await patientCollection.findOne({_userId : bookingData.userId });
    //         if(!patient) {
    //             return res.status(400).json({message: 'Patient not found'});
    //         }
    
    //         // Check if all fields are present
    //         const requiredFields = ['therapistId', 'therapistName', 'date', 'timeSlot'];
    //         if(!requiredFields.every(field => bookingData[field])) {
    //             return res.status(400).json({ 'message': 'Missing required fields' });
    //         }

    //         const bookingDate = new Date(bookingData.date);
    //         const currentDate = new Date();
    //         if (bookingDate < currentDate) {
    //         return res.status(400).json({ message: 'Booking date cannot be in the past' });
    //         }
    
    //         // Check if the booking exists
    //         const existingBooking = await bookingCollection.findOne({
    //             _therapistId: bookingData.therapistId,
    //             _date: bookingData.date,
    //             _timeSlot: bookingData.timeSlot,
    //             _sessionType: bookingData.sessionType
    //         });
    
    //         if(existingBooking) {
    //             return res.status(400).json({'message': 'Slot already booked'});
    //         }
    
    //         // Find therapist to check availability
    //         const therapist = await this.db.getDB().collection('therapists').findOne({
    //             _therapistId: bookingData.therapistId,
    //         });
    
    //         if (!therapist) {
    //             return res.status(400).json({ message: 'Therapist not found' });
    //         }
            
    //         // Check therapist's availability for the specified day and time slot
            
    //         const bookingWeekday = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });
    //         const therapistSchedule = await scheduleCollection.findOne({_therapistId: therapist._therapistId});
            
    
    //         let sessionMode = '';
    
    //         if (therapistSchedule) {
    //             const { _oneOnOneAvailability, _groupAvailability } = therapistSchedule;
    //             const availabilityForDay = _oneOnOneAvailability.find(avail => avail.day.toLowerCase() === bookingWeekday.toLowerCase());
                
    //             if (availabilityForDay && availabilityForDay.timeSlots.includes(bookingData.timeSlot)) {
    //                 sessionMode = 'one-on-one';
    //             } else {
    //                 const _groupAvailabilityForDay = _groupAvailability.find(avail => avail.day.toLowerCase() === bookingWeekday.toLowerCase());
    //                 if (_groupAvailabilityForDay && _groupAvailabilityForDay.timeSlots.includes(bookingData.timeSlot)) {
    //                     sessionMode = 'group';
    //                 }
    //             }
    //         }
    
    //         if (!sessionMode) {
    //             return res.status(400).json({ message: 'Therapist not available at the specified time' });
    //         }
    
    //         // Create a booking object
    //         const booking = new Booking();
    //         booking.bookingId = uuidv4();
    //         booking.patientInfo = { id: patient._patientId, name: patient._name };
    //         booking.therapistId = bookingData.therapistId; 
    //         booking.therapistName = bookingData.therapistName;
    //         booking.date = bookingData.date; 
    //         booking.timeSlot = bookingData.timeSlot;
    //         booking.sessionType = bookingData.sessionType;
    //         booking.sessionMode = sessionMode; 
    
    //         await bookingCollection.insertOne(booking);
    
    //         res.status(201).json({ 'message': 'Booking created successfully' });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ 'message': 'Failed to create booking' });
    //     }
    // }
    

    // createBooking = async (req, res) => {
    //     try {
    //         const bookingCollection = await this.db.getDB().collection('bookings');
    //         const patientCollection = await this.db.getDB().collection('patients');

    //         const bookingData = req.body;

    //         const patient = await patientCollection.findOne({_userId : bookingData.userId });
    //         if(!patient) {
    //             return res.status(400).json({message: 'patient not found'})
    //         }

    //         //check if all fields are there
    //         if(
    //         !bookingData.therapistId || !bookingData.therapistName ||
    //         !bookingData.date || !bookingData.timeSlot){
    //             return res.status(400).json({ 'message': 'Missing required fields' });
    //         }

    //         //check if the booking exists
    //         const existingBooking = await bookingCollection.findOne({
    //             _therapistId: bookingData.therapistId,
    //             _date: bookingData.date,
    //             _timeSlot: bookingData.timeSlot,
    //             _sessionType: bookingData.sessionType
    //         })

    //         if(existingBooking) {
    //             return res.status(400).json({'message': 'Slot already booked'});
    //         }

    //         const therapist = await this.db.getDB().collection('therapists').findOne({
    //             _therapistId: bookingData.therapistId,
    //         });
    
    //         if (!therapist) {
    //             return res.status(400).json({ message: 'Therapist not found' });
    //         }
            
    //         // To check if an appropriate date has been filled by patient
    //         const bookingDate = new Date(bookingData.date);
    //         const bookingWeekday = bookingDate.toLocaleDateString('en-US', { weekday: 'long' });

    //         const therapistAvailability = therapist._availability;
    //         // Find the availability for the weekday
    //         const availabilityForDay = therapistAvailability.find(availability => availability.day.toLowerCase() === bookingWeekday.toLowerCase());

    //         if (!availabilityForDay) {
    //         return res.status(400).json({ message: 'Therapist not available on the specified day' });
    //         }

    //         // Check if the specified time slot is available
    //         if (!availabilityForDay.timeSlots.includes(bookingData.timeSlot)) {
    //         return res.status(400).json({ message: 'Therapist not available at the specified time' });
    //         }



    //         //create a booking object 
    //         const booking = new Booking();
    //         booking.bookingId = uuidv4()
    //         booking.patientId = patient._patientId;
    //         booking.patientName = patient._name; 
    //         booking.therapistId = bookingData.therapistId; 
    //         booking.therapistName = bookingData.therapistName;
    //         booking.date = bookingData.date; 
    //         booking.timeSlot = bookingData.timeSlot;
    //         booking.sessionType = bookingData.sessionType;

    //         await bookingCollection.insertOne(booking);

    //         res.status(201).json({ 'message': 'Booking created successfully' });
    //     } catch (error) {
    //         console.log(error)
    //         res.status(500).json({ 'message': 'Failed to create booking' });
    //     }
    // }

    cancelBooking = async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'Booking ID parameter is required' });
            }
            const { userId } = req.body;

            const bookingCollection = await this.db.getDB().collection('bookings');
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');

            //try to find who canceled
            const therapist = await therapistCollection.findOne({_userId : userId });
            const patient = await patientCollection.findOne({_userId : userId });

            let canceledBy;
            if (therapist) {
                canceledBy = therapist._name;
            }
            if (patient) {
                canceledBy = patient._name;
            }

            //check if booking is already canceled
            const existingBooking = await bookingCollection.findOne(
                { _bookingId: req.params.id,  _isCanceled: true }
            )
            
            if (existingBooking) {
                return res.status(409).json({ 'message': 'Booking is already canceled' });
            }


            const booking = await bookingCollection.updateOne(
                { _bookingId: req.params.id },
                { $set: { _isCanceled: true, _canceledBy: canceledBy } }
            );

            if (!booking) {
                return res.status(404).json({ 'message': 'Booking not found' });
            }


            res.json({ 'message': 'Booking canceled successfully' });
        } catch (error) {
            
            console.error('Error canceling booking:', error);
            res.status(500).json({ 'message': 'Server Error in canceling booking' });
        }
    }

}

module.exports = BookingController;