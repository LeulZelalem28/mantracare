require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const Database = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

const patientRouter = require('./routes/patientRoute');
const therapistRouter = require('./routes/therapistRoute');
const administratorRouter = require('./routes/adminstratorRoute');
const customerAndCrisisSupportRouter = require('./routes/customerAndCrisisSupportRoute');
const bookingRouter = require('./routes/bookingRoute');
const therapySessionRouter = require('./routes/therapySessionRoute');
const scheduleRouter = require('./routes/scheduleRoute');
const groupSessionRouter = require('./routes/groupSessionRoute');
const feedbackRouter = require('./routes/feedbackAndRatingRoute');
const authRouter = require('./routes/authRoute');
const messageRouter = require('./routes/messageRoute');
const sessionNoteRouter = require('./routes/sessionNoteRoute');
const resourceRouter = require('./routes/resourceRoute');
const forumRouter = require('./routes/forumRoute');
const forumPostRouter = require('./routes/forumPostRoute');

const PORT = process.env.PORT || 3500;

app.use(credentials);

app.use(cors());

app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(express.json({ limit: '500mb' }));

app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173"],
        methods: ["GET", "POST"],
    },
});


const db = new Database();

// Asynchronously connect to the database before server runs
(async () => {
    try {
        await db.connectToDB();
    } catch (error) {
        console.error(`Error connecting to the database: ${error}`);
        return; // Stop further execution if the database connection fails
    }
})();

app.use('/patients', patientRouter(db));
app.use('/therapists', therapistRouter(db));
app.use('/administrators', administratorRouter(db));
app.use('/customerAndCrisisSupport', customerAndCrisisSupportRouter(db));
app.use('/auth', authRouter(db));

app.use(verifyJWT);
app.use('/schedule', scheduleRouter(db));
app.use('/bookings', bookingRouter(db));
app.use('/messages', messageRouter(db))
app.use('/sessions', therapySessionRouter(db));
app.use('/groupSessions', groupSessionRouter(db));
app.use('/feedbackAndRating', feedbackRouter(db));
app.use('/notes', sessionNoteRouter(db));
app.use('/resources', resourceRouter(db));
app.use('/forums', forumRouter(db));
app.use('/forumposts', forumPostRouter(db))

const usersInRooms = {};

io.on('connection', socket => {
    socket.on('join-video-room', (roomId, userId) => {
        socket.join(roomId);
        console.log(`User ${userId} joined video room ${roomId}`);

        if (!usersInRooms[roomId]) {
            usersInRooms[roomId] = new Set();
        }
        usersInRooms[roomId].add(userId);

        socket.broadcast.to(roomId).emit('user-connected', userId);

        socket.on('leave-room', async () => {
            usersInRooms[roomId].delete(userId);
            socket.leave(roomId);
            console.log(`User ${userId} left video room ${roomId}`);
            socket.broadcast.to(roomId).emit('user-disconnected', userId);

            if (usersInRooms[roomId].size === 0) {
                // No users left in the room, update the session end time
                const endTime = new Date().toISOString();
                const therapySessionsCollection = await db.getDB().collection('therapysessions');
                const y = await therapySessionsCollection.findOne({_sessionId: roomId})
                const x = await therapySessionsCollection.updateOne(
                    { _sessionId: roomId },
                    { $set: { _sessionEndTime: endTime } }
                );
              
                delete usersInRooms[roomId];
                console.log(`Session ${roomId} ended at ${endTime}`);
            }
        });

        socket.on('disconnect', async () => {
            if (usersInRooms[roomId]) {
                usersInRooms[roomId].delete(userId);
                socket.broadcast.to(roomId).emit('user-disconnected', userId);

                if (usersInRooms[roomId].size === 0) {
                    // No users left in the room, update the session end time
                    const endTime = new Date().toISOString();
                    const therapySessionsCollection = await db.getDB().collection('therapysessions');
                    await therapySessionsCollection.updateOne(
                        { _sessionId: roomId },
                        { $set: { sessionEndTime: endTime } }
                    );
                    delete usersInRooms[roomId];
                    console.log(`Session ${roomId} ended at ${endTime}`);
                }
            }
        });
    });

    socket.on('join-chat-room', (roomId) => {
        socket.join(roomId);
        console.log(`User with ID: ${socket.id} joined room: ${roomId}`);

        socket.on('send-message', (messageData) => {
            socket.to(roomId).emit('receive-message', messageData);
        });

        socket.on("disconnect", () => {
            console.log("User Disconnected", socket.id);
        });
    });

    // To check the last user to update end time of video session
    socket.on('check-last-user', async (roomId) => {
        console.log('Checking last user for room:', roomId);
        const room = io.sockets.adapter.rooms.get(roomId);
        if (!room || room.size === 0) {
            try {
                const therapySessionsCollection = await db.getDB().collection('therapysessions');
                const x = await therapySessionsCollection.updateOne(
                    { _sessionId: roomId },
                    { $set: { _sessionEndTime: new Date() } }
                );
                console.log(`Updated end time for session ${roomId}`);
                console.log(x);
            } catch (error) {
                console.error('Error updating session end time:', error);
            }
        } else {
            console.log('Room still has users');
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
