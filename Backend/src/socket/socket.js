const socket = require("socket.io");
const { Chat } = require("../models/chat");
const { ConnectionRequeset } = require("../models/connectionRequest");

const onlinesUsers = new Map();

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
      "http://localhost:5173",
      "http://staging-devmatch.smitdev.live",
      "https://staging-devmatch.smitdev.live",
      "https://devmatch.smitdev.live"
    ],
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("joinChat", ({ targetUserId, userId, firstname }) => {
      const roomId = [userId, targetUserId].sort().join("_");
      console.log("joining room ... ", roomId);
      socket.join(roomId);
      onlinesUsers.set(userId , socket.id);
      io.emit('online-users',[...onlinesUsers.keys()]);
    });

    socket.on("sendMessage", async (data) => {
      const { from, to, message, firstname, lastname, photoUrl, about } = data;
      console.log(`Message from ${from} to ${to}: ${message}`);
      const roomId = [to, from].sort().join("_");

      // save message to DB :
      // there can be two cases :
      // 1.the message send is the first message ever in that room
      // 2. chat already exists in that room
      // so , if exist push the message , if doesnt then create a new one
      try {
        // check wether the userId and targetUserId are friends :

        const isFriends = await ConnectionRequeset.findOne({
          $or: [
            { fromUserId: from, toUserId: to, status: "accepted" },
            { fromUserId: to, toUserId: from, status: "accepted" },
          ],
        });
        if (!isFriends) {
          return socket.emit("error", {
            message: "You must be friends to chat with this user.",
          });
        }

        let chat = await Chat.findOne({
          participants: {
            $all: [to, from],
          },
        });

        // if not chat , means this is the first time someone sending the message
        if (!chat) {
          chat = await Chat.create({
            participants: [to, from],
            messages: [],
          });
        }
        console.log("chat", chat);

        console.log("senderId", from);
        console.log("text", message);

        chat.messages.push({
          senderId: from,
          text: message,
        });

        await chat.save();
      } catch (err) {
        console.log(err);
      }

      //So everyone, including the sender, receives the message via the socket.
      io.to(roomId).emit("message-recieved", {
        from,
        to,
        message,
        firstname,
        lastname,
        photoUrl,
        about,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected : ", socket.id);

      for(let [userId , socketId] of onlinesUsers.entries()){
        if(socketId === socket.id){
            onlinesUsers.delete(userId)
            io.emit('online-users',[...onlinesUsers.keys()])
            break;
        }
      }

    });
  });
};

module.exports = initializeSocket;
