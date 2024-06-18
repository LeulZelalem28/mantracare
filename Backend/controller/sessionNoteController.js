const SessionNote = require('../model/SessionNote');
const { v4: uuidv4 } = require('uuid');

class SessionNoteController {
    constructor(db) {
        this.db = db;
    }

    getNotes = async (req, res) => {
        try{
            if (!req?.params?.sessionId) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const sessionNotes = await sessionNoteCollection.find({ _sessionId: req.params.sessionId }, {
                projection: {
                    _id: 0,
                    noteId: "$_noteId",
                    sessionId: "$_sessionId",
                    note: "$_note", 
                    creatorId: "$_creatorId", 
                    timeStamp: "$_timeStamp",
                }
            }).toArray();
    
            if(!sessionNotes.length) return res.status(204).json({ message: 'No notes found' });
            console.log('hi',sessionNotes)

            res.json(sessionNotes);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch notes' });
            console.log(error)
        }
       
    }

    getNoteById = async (req, res) =>{
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const sessionNote = await sessionNoteCollection.findOne({ _noteId: req.params.id }, {
                projection: {
                    _id: 0,
                    noteId: "$_noteId",
                    sessionId: "$_sessionId",
                    note: "$_note", 
                    creatorId: "$_creatorId", 
                    timeStamp: "$_timeStamp",
                }
            });
    
            if(!sessionNote) return res.status(404).json({ message: 'Session Note not found' });

            res.json(sessionNote);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch note' });
        }
    
    }

    createNote = async (req, res) => {
        try {
            const noteData = req.body;
    
            const sessionNoteCollection = await this.db.getDB().collection('notes');
    
            // Check for missing fields
            if (!noteData.sessionId || !noteData.note) {
                throw new Error('Missing required fields: sessionId and note');
            }
    
            const sessionNote = new SessionNote();
    
            sessionNote.noteId = uuidv4();
            sessionNote.sessionId = noteData.sessionId;
            sessionNote.note = noteData.note;
            sessionNote.creatorId = noteData.userId;
            sessionNote.timeStamp = new Date();
    
            // Insert in the database
            await sessionNoteCollection.insertOne(sessionNote);
            console.log(sessionNote);
            res.status(201).json({ message: 'Note created successfully', 'createdNote': sessionNote });
    
        } catch (error) {
            console.error('Failed to create note:', error);
            res.status(400).json({ message: error.message }); // Send the error message as the response
        }
    }
    

    updateNote = async (req, res) =>{
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const noteData = req.body;

            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const existingNote = await sessionNoteCollection.findOne({ _noteId: req.params.id });

            if(!existingNote) {
                return res.status(404).json({ message: 'Note not found'});
            }

            const updatedNote = await sessionNoteCollection.updateOne(
                { _noteId: req.params.id },
                { $set: { _note: noteData.note}}
            );

            res.json({ message: 'Note updated successfully', updatedNote: updatedNote });

        } catch (error) {
            res.status(500).json({ message: 'Failed to update note' });
        }
    }

    deleteNote = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            
            const sessionNoteCollection = await this.db.getDB().collection('notes');

            const existingNote = await sessionNoteCollection.findOne({ _noteId: req.params.id });

            if(!existingNote) {
                return res.status(404).json({ message: 'Note not found'});
            }

            await sessionNoteCollection.deleteOne({ _noteId: req.params.id });

            res.json({ message: 'Note deleted successfully' });

        } catch (error) {
            res.status(500).json({ message: 'Failed to delete note' });
        }
    }
}

module.exports = SessionNoteController;