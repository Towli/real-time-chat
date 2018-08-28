'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const state = {
  messages: [],
  users: []
};

const FIRST_NAMES = [
  'Big',
  'Old',
  'Afraid',
  'Hyper',
  'Child',
  'Happy',
  'Pretentious',
  'Grubby',
  'Disturbed',
  'Swift',
  'Vast',
  'Low',
  'Deep',
  'Creepy',
  'Courageous',
  'Cool'
];

const LAST_NAMES = [
  'Mother',
  'Genie',
  'Dog',
  'Officer',
  'Mastermind',
  'Rapper',
  'Ninja',
  'Samurai',
  'Crusader',
  'Artist',
  'Foreigner',
  'Gamer',
  'Elephant',
  'Professor',
  'Mug',
  'Douchebag',
  'Teacher',
  'Doctor'
];

const COLOUR_PALETTE = [
  '#966B9D',
  '#67AAF9',
  '#9BC1BC',
  '#6C7D47',
  '#7F5A83',
  '#B95F89',
  '#F5FFC6',
  '#C1FF9B'
];

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/main.html`);
});

io.on('connection', socket => {
  const name = generateRandomName();
  const colour = getRandomColour();
  state.users.push({ name: name, socket: socket, colour: colour });
  socket.emit('connection', {
    messages: state.messages,
    username: name,
    colour: colour
  });
  console.log(`${name} connected`);
  socket.on('messages_updated', messages => {
    state.messages = messages;
    console.log(state);
    io.emit('messages_updated', messages);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

function generateRandomName() {
  return (
    FIRST_NAMES[_getRandomInt(FIRST_NAMES.length)] +
    ' ' +
    LAST_NAMES[_getRandomInt(LAST_NAMES.length)]
  );
}

function getRandomColour() {
  return COLOUR_PALETTE[_getRandomInt(COLOUR_PALETTE.length)];
}

function _getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
