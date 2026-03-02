const dotenv = require('dotenv')
dotenv.config();
const express = require('express');
const app = express();

const UserRouter = require('./routes/auth');
const ProfileRouter = require('./routes/profile');
const ConnectionRequestRouter = require('./routes/requests')
const ChatRouter = require('./routes/chat')
const viewRouter = require('./routes/view');
const ImageUploadRouter = require('./routes/upload');
const PaymentRouter = require("./routes/payment")
const cookieParser = require('cookie-parser'); 
const cors = require('cors')

app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true,
    methods : ['GET','POST','PUT','DELETE','PATCH']
}))
app.use(cookieParser());
app.use(express.json());

app.use('/api/v1/user' , UserRouter);
app.use('/api/v1/profile', ProfileRouter);
app.use('/api/v1/request' , ConnectionRequestRouter);
app.use('/api/v1/view/user', viewRouter);
app.use('/api/v1/user/chat',ChatRouter)
app.use('/api/v1/image' , ImageUploadRouter)
app.use("/api/v1/payment", PaymentRouter)

module.exports = app;