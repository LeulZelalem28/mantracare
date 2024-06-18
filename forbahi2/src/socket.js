import { io } from 'socket.io-client';

const URL = 'http://localhost:3500'

export const socket = io(URL);