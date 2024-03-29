const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { METHODS } = require("http");

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling", "flashsocket"],
});

app.use(cors());

// app.use(function (req, res, next) {
//     // res.header(
//     //     "Access-Control-Allow-Origin",
//     //     "https://www.differentServerDomain.fr https://www.differentServerDomain.fr"
//     // );
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
// });

const PORT = 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Response From Root updated 19:17",
    });
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        // console.log({ userToCall, from, name });
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

    socket.on("answerCall", (data) => {
        console.log(data);
        io.to(data.to).emit("callAccepted", data.signal);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port:${PORT}`);
});
