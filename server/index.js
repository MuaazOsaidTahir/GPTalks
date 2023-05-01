require("dotenv").config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { user_modal, chat_modal, room_modal } = require("./db.Schema");
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: { origin: "http://localhost:5173/" }
});


app.use(express.json());
app.use(cors())

require("./db");

app.post('/signup', async (req, res) => {
    // console.log(req.body);
    try {
        const user = new user_modal(req.body);
        await user.save();

        res.json({ status: 'success', data: user });
    } catch (error) {
        console.log("LOGIN ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

app.post("/login", async (req, res) => {
    try {
        const user = await user_modal.findOne({ username: req.body.username });
        // await user.save();
        // console.log(user);

        res.json({ status: 'success', data: user ? user : null });
    } catch (error) {
        console.log("LOGIN ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

app.get("/searching_user", async (req, res) => {
    try {
        const { type, user } = req.query;

        let query = {}

        type === "phone" ? query['phone'] = user : query['_id'] = user;

        const searched_user = await user_modal.findOne(query)

        res.json({ status: "success", data: searched_user });
    } catch (error) {
        console.log("SEARCHING USER ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

app.post('/room', async (req, res) => {
    try {
        const room = new room_modal(req.body);
        room.users.push(req.headers["user_id"]);
        await room.save();
        // console.log(room);
        res.json({ status: 'success', data: room });
    } catch (error) {
        console.log("ROOM ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

app.get('/getRooms', async (req, res) => {
    try {
        const rooms = await room_modal.find({
            users: req.headers["user_id"]
        }).sort({ "updated_at": -1 })
        res.json({ status: 'success', data: rooms });
    } catch (error) {
        console.log("GET ROOM ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

app.post("/updating_user_in_chat", async (req, res) => {
    try {
        const { userid, roomid, type } = req.query;

        if (type === "add") {
            const user_exists = await room_modal.aggregate([
                {
                    '$match': {
                        '_id': roomid
                    }
                }, {
                    '$match': {
                        'users': {
                            '$in': [
                                userid
                            ]
                        }
                    }
                }
            ])

            if (user_exists?.length) {
                res.json({ status: 'success', message: "User Already Exists in this chatRoom" });
                return;
            }
        }

        let aggregration = {}

        if (type === "add") {
            aggregration = {
                $push: {
                    users: userid
                }
            }
        } else {
            aggregration = {
                $pull: {
                    users: userid
                }
            }
        }

        await room_modal.updateOne({
            _id: roomid,
        }, aggregration)

        res.json({ status: 'success' });
    } catch (error) {
        console.log("UPDATE USER ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

app.get("/users_in_chat", async (req, res) => {
    try {
        const room = await room_modal.findOne({
            _id: req.query.roomid
        })

        const users = await Promise.all(room.users.map(async (user) => {
            const user_found = await user_modal.findOne({
                _id: user,
            })

            return user_found;
        }))

        res.json({ status: "success", data: users });
    } catch (error) {
        console.log("USERS IN CHAT ERROR", error.message);
        res.json({ status: "error" });
    }
})

app.get("/getConversations/:id", async (req, res) => {
    try {
        const pageNumber = req.query.page;
        const totalChats = await chat_modal.find({ room_id: { $eq: req.params.id } }).count();
        const skipping = (totalChats - pageNumber * 20) > 0 ? (totalChats - pageNumber * 20) : 0
        const chats = await chat_modal.find({ room_id: { $eq: req.params.id } }).sort({ created_at: 1 }).skip(skipping).limit(pageNumber * 20);
        // console.log(totalChats)
        res.json({ status: 'success', data: { chats: chats, totalCount: totalChats } });
    } catch (error) {
        console.log("GET CHATS ERROR:" + error.message);
        res.json({ status: 'error' });
    }
})

server.listen(8080, () => {
    console.log("Server Running");
})

io.on("connect", (socket) => {
    // console.log(socket.id);
    socket.emit('hello', socket.id);
    // socket.emit('connection', socket.id);
    socket.on('join', (roomId) => {
        // console.log(roomId)
        socket.join(roomId);
    })

    socket.on('check_typing', (chat_details) => {
        // console.log(chat_details)
        socket.to(chat_details.room_id).emit(chat_details.room_id, { content: chat_details.value, user_id: chat_details.user_id, chat_type: chat_details.chat_type, mode: chat_details.mode, room_id: chat_details.room_id });
    })

    socket.on('send_message', async (message) => {
        try {
            const chat = chat_modal(message)
            await chat.save();
            await room_modal.findByIdAndUpdate(message?.room_id, { updated_at: Date.now() })
            io.to(message.room_id).emit(`recieve_message:${message.room_id}`, chat);
        } catch (error) {
            console.log('SOCKET ERROR', error.message);
        }
    })

    socket.on('calluser', ({ signal, to, from }) => {
        // console.log(to)
        socket.to(to?.id).emit(`recieve_call:${to?.id}`, { signal: signal, from, to });
    })

    socket.on('answerCall', ({ signal, to, from }) => {
        // console.log(to, from)
        socket.to(to.id).emit('callAccepted', { signal: signal });
    })
});