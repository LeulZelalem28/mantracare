const Schedule = require('../model/Schedule');
const { v4: uuidv4 } = require('uuid');

class ScheduleController {
    constructor (db) {
        this.db = db;
    }

    getScheduleByTherapistId = async (req, res) => {
        try {
            if (!req?.params?.id) {
                
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            console.log('1')
            const therapistId = req.params.id;
            const scheduleCollection = await this.db.getDB().collection('schedules');
            const schedule = await scheduleCollection.findOne({ _therapistId: therapistId },
                {projection: {
                    _id: 0, 
                    scheduleId: "$_scheduleId",
                    therapistId: "$_therapistId",
                    oneOnOneAvailability: "$_oneOnOneAvailability",
                    groupAvailability: "$_groupAvailability"
                }});
                console.log('2')
                console.log('hi', schedule)
                if (!schedule) {
                    return res.status(404).json({ 'message': 'schedule not found' });
                }
                
            res.json(schedule);
        } catch (error) {
            console.error('Error fetching schedule by therapist ID:', error);
            res.status(500).json({ message: 'Failed to fetch schedule by therapist ID' });
        }
    }

    createSchedule = async(req, res) => {
        try {
            const scheduleData = req.body;
            const scheduleCollection = await this.db.getDB().collection('schedules');
    
            // Check if the therapist is approved before allowing them to create a schedule
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _therapistId: scheduleData.therapistId });
            
            if (!therapist) {
                return res.status(401).json({ message: 'Therapist not found'});
            }
            if(therapist._approved !== true) {
                return res.status(401).json({ 'message': 'Therapist is not approved to create a schedule' });
            }
    
            //checking if the therapist has entered all the data
            if (!scheduleData.therapistId || !scheduleData.oneOnOneAvailability || !scheduleData.groupAvailability) {
                return res.status(400).json({ 'message': 'Missing required fields' });
            }
    
            // Check for conflicts between one-on-one and group availability
            if (this.hasScheduleConflict(scheduleData.oneOnOneAvailability, scheduleData.groupAvailability)) {
                return res.status(400).json({ 'message': 'Schedule conflicts between one-on-one and group availability' });
            }
    
            const schedule = new Schedule();
            schedule.scheduleId = uuidv4();
            schedule.therapistId = scheduleData.therapistId;
            schedule.oneOnOneAvailability = scheduleData.oneOnOneAvailability;
            schedule.groupAvailability = scheduleData.groupAvailability;
    
            await scheduleCollection.insertOne(schedule);
    
            res.status(201).json({ 'message': 'Schedule created successfully' });
        } catch (error) {
            console.error('Error creating schedule:', error);
            res.status(500).json({ 'message': 'Failed to create schedule' });
        }
    }
    
    updateSchedule = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
        
            const scheduleId = req.params.id;
            const scheduleData = req.body;
        
            const scheduleCollection = await this.db.getDB().collection('schedules');
            const therapistCollection = await this.db.getDB().collection('therapists');

            const existingSchedule = await scheduleCollection.findOne({ _scheduleId: scheduleId });
        
            if (!existingSchedule) {
                return res.status(404).json({ 'message': 'Schedule not found' });
            }

            // Check if the authenticated user is the owner of the schedule
            const therapist = await therapistCollection.findOne({ _userId: req.body.userId });
            if (existingSchedule._therapistId !== therapist?._therapistId) {
                return res.status(403).json({ 'message': 'You are not authorized to update this schedule' });
            }


            const updatedScheduleData = {
                _oneOnOneAvailability: scheduleData.oneOnOneAvailability || existingSchedule._oneOnOneAvailability,
                _groupAvailability: scheduleData.groupAvailability || existingSchedule._groupAvailability,
            };

            // Check for conflicts between one-on-one and group availability
            if (this.hasScheduleConflict(updatedScheduleData._oneOnOneAvailability, updatedScheduleData._groupAvailability)) {
                return res.status(400).json({ 'message': 'Schedule conflicts between one-on-one and group availability' });
                }

            
            const result = await scheduleCollection.updateOne(
                { _scheduleId: scheduleId },
                { $set: updatedScheduleData }
            );

            res.json({ 'message': 'Schedule updated successfully', 'updatedSchedule': updatedScheduleData });
        } catch (error) {
            console.error('Error updating schedule:', error);
            res.status(500).json({ 'message': 'Failed to update schedule' });
        }
    }

    deleteSchedule = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
    
            const scheduleId = req.params.id;
    
            const scheduleCollection = await this.db.getDB().collection('schedules');
    
            const existingSchedule = await scheduleCollection.findOne({ _scheduleId: scheduleId });
    
            if (!existingSchedule) {
                return res.status(404).json({ 'message': 'Schedule not found' });
            }
    
            const result = await scheduleCollection.deleteOne({ _scheduleId: scheduleId });
    
            if (result.deletedCount === 1) {
                return res.json({ 'message': 'Schedule deleted successfully' });
            } else {
                return res.status(500).json({ 'message': 'Failed to delete schedule' });
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            res.status(500).json({ 'message': 'Failed to delete schedule' });
        }
    }
    
    hasScheduleConflict = (oneOnOneAvailability, groupAvailability) => {
        for (const oneOnOneSlot of oneOnOneAvailability) {
            for (const groupSlot of groupAvailability) {
                if (oneOnOneSlot.day === groupSlot.day) {
                    const oneOnOneTimeSlots = new Set(oneOnOneSlot.timeSlots);
                    const groupTimeSlots = new Set(groupSlot.timeSlots);
                    const intersection = [...oneOnOneTimeSlots].filter(timeSlot => groupTimeSlots.has(timeSlot));
                    if (intersection.length > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}




module.exports = ScheduleController