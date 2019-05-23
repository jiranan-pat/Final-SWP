const server = require('express')()
const Twitter = require('twitter');
const socketIO = require('socket.io')
 
var client = new Twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
});

const port = '4000';

const app = server.listen(port, () => {
    console.log('Server is listening at ' + port)
})

const io = socketIO.listen(app)
io.on('connection', client => {
    console.log('user connected')
    client.on('disconnect', () => {
        console.log('user disconnected')
    })
})

const stream = client.stream('statuses/filter', { track: 'tradewar' })
stream.on('data', function (event) {
    if (event) {
        io.sockets.emit('new-message', event.text)
    }
})
