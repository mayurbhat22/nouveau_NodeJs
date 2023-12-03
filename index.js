const express = require("express");
const cors = require("cors");
const { createServer } = require("http"); // Import createServer from http module
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");
const {
  saveSession,
  findSession,
  findAllSessions,
} = require("./services/sessionStorage.js");

const {
  saveMessage,
  findMessageForUser,
} = require("./services/messageStorage.js");

const app = express();
const PORT = 8080;
// Attach Express app to the HTTP server
app.use(cors({ origin: "https://nouveauhealth.azurewebsites.net"}));
app.use(express.json());
const httpServer = createServer(app); // Create HTTP server using express app
const io = new Server(httpServer, {
  cors: {
    origin: "https://nouveauhealth.azurewebsites.net/",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const sessionId = socket.handshake.auth.sessionId;
  if (sessionId) {
    //find my session
    const session = findSession(sessionId);
    if (session) {
      socket.sessionId = sessionId;
      socket.userId = session.userId;
      socket.username = session.username;
      return next();
    } else {
      return next(new Error("Invalid Session"));
    }
  }

  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("Invalid username"));
  }

  socket.username = username;
  socket.userId = uuidv4();
  socket.sessionId = uuidv4();

  next();
});
function getMessagesForUser(userId) {
  const messagesPerUser = new Map();
  findMessageForUser(userId).forEach((message) => {
    const { from, to } = message;
    const otherUser = userId === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
}

io.on("connection", async (socket) => {
  saveSession(socket.sessionId, {
    userId: socket.userId,
    username: socket.username,
    connected: true,
  });

  socket.join(socket.userId);
  const users = [];
  const userMessages = getMessagesForUser(socket.userId);

  findAllSessions().forEach((session) => {
    if (session.userId !== socket.userId) {
      users.push({
        userId: session.userId,
        username: session.username,
        connected: session.connected,
        messages: userMessages ? userMessages.get(session.userId) : [],
      });
    }
  });
  socket.emit("users", users);
  socket.emit("session", {
    sessionId: socket.sessionId,
    userId: socket.userId,
    username: socket.username,
  });

  //new user event
  socket.broadcast.emit("user connected", {
    userId: socket.userId,
    username: socket.username,
  });

  //private message event
  socket.on("private message", ({ content, to }) => {
    const message = {
      from: socket.userId,
      to,
      content,
    };
    socket.to(to).emit("private message", message);
    saveMessage(message);
  });

  socket.on("user messages", ({ userId, username }) => {
    const userMessages = getMessagesForUser(socket.userId);
    socket.emit("user messages", {
      userId,
      username,
      messages: userMessages ? userMessages.get(userId) : [],
    });
  });

  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userId).fetchSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      //notify other users
      socket.broadcast.emit("user disconnected", {
        userId: socket.userId,
        username: socket.username,
      });
      //update the connection status
      saveSession(socket.sessionId, {
        userId: socket.userId,
        username: socket.username,
        connected: socket.connected,
      });
    }
  });
});

// Routes
const registrationRoutes = require("./routes/registration");
const insurancedashboardRoutes = require("./routes/insurance");
const loginRoutes = require("./routes/login");
const searchRoutes = require("./routes/search");
const appointmentRoutes = require("./routes/appointment");
const patienthomeRoutes = require("./routes/patient");
const doctorhomeRoutes = require("./routes/doctor");
const patientDetailsRoutes = require("./routes/patientDetails");
const profileRoutes = require("./routes/profile")


app.use("/registration", registrationRoutes);
app.use("/insurance", insurancedashboardRoutes);
app.use("/login", loginRoutes);
app.use("/search", searchRoutes);
app.use("/appointment", appointmentRoutes);
app.use("/patient", patienthomeRoutes);
app.use("/doctor", doctorhomeRoutes);
app.use("/doctordashboard", patientDetailsRoutes);
app.use("/profile", profileRoutes);


app.get("/", (req, res) => {
  res.json({ message: "Good evening" });
});

httpServer.listen(PORT, () => {
  console.log(`IO Server is running on port ${PORT}`);
});
