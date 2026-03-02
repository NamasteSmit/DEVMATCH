const dotenv = require('dotenv');
dotenv.config();

const http = require('http');
const connectDB = require('./config/db');
const initializeSocket = require('./socket/socket');

const app = require('./app');

const PORT = 3003;

require('./utils/cronjob');

const server = http.createServer(app);

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Database connected Successfully");

    server.listen(PORT, () => {
      console.log("Server listening on port:", PORT);
    });
  })
  .catch(() => {
    console.log("Error connecting Database");
  });
