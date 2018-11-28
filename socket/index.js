const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
    socket.on('appendMessage', message  => {
        console.log(message)
        io.emit(message.receiver_id, message)
        io.emit(message.sender_id, message)
    })
})

http.listen(8000, () => console.log('listening on *:8000'))