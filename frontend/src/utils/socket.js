import io from "socket.io-client"
import { BASE_URL } from "./constants" //where  BASE_URL = "http://localhost:3003"


export const createSocketConnection = ()=>{
    if(location.hostname==="localhost"){
       return io(BASE_URL)   // create a client socket that connects to the socketIO server
    }else{
        return io(); // this is for when you upload on aws
    }
}


// ✅ When this function is called:
// The browser opens a WebSocket connection to the server.

// Socket.IO runs a handshake using HTTP (first), then upgrades to WebSocket protocol.

// After the handshake, the connection is persistent and bi-directional.

