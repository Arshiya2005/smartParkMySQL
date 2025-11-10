// socket.js
import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const socket = io(`${BASE_URL}`, {
  withCredentials: true,  // if using cookies/auth
  autoConnect: false,     // you control when to connect
});

export default socket;