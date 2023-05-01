const { Schema, model } = require('mongoose');

const Conversations = new Schema({
    id: String,
    room_id: String,
    user_id: String,
    content: String,
    created_at: {type: Date, default: Date.now},
})


const Rooms = new Schema({
    id: String,
    name: String,
    // last_message: String,
    // participant_ids: String,
    created_at: {type: Date, default: Date.now},
    users: [String],
    updated_at: Date,
})

const Users = new Schema({
    id: String,
    username: String,
    phone: String,
    created_at: {type: Date, default: Date.now},
})

const chat_modal = model('conversation', Conversations);
const room_modal = model('room', Rooms);
const user_modal = model('user', Users);

module.exports = { chat_modal, room_modal, user_modal };