const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const { join } = require('path')
const { Server } = require('socket.io')

const { listenMessage, createMessage } = require('./messages')

require('express-async-errors')

app = express()
app.use(bodyParser.json())

const server = http.createServer(app)
const socketIO = new Server(server)

socketIO.on('connection', async(socket) => {
    console.log('new connection...')
    await listenMessage(async (msg, username) => {
        socket.emit('message', msg, username)
    })

    socket.on('message', async (msg, username, offset, callback) => {
        await createMessage(msg, username, offset)
        socket.emit('message', msg, username)
        socket.broadcast.emit('message', msg, username)
        callback()
    })
})

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'html', 'index.html'));
});

server.listen(3333)