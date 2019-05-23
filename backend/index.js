const server = require('express')()
const Twitter = require('twitter');
const socketIO = require('socket.io')
 
var client = new Twitter({
    consumer_key: '80HQkdOtFIDYENL8gW8LrQ0i5',
    consumer_secret: 'YK2aEeZee4WFn3RtwTFMcCE5Ok9iEZQnsx1oIy8Irn7sx2BMPn',
    access_token_key: '2837745415-R8NaSEMwp13PtEVxurylzyb65YJF9W7WlYvEwQT',
    access_token_secret: 'toLgo319BCdrVoWao5gt05Xursjrfa2YbGIR9CAbTWFIf'
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

const stream = client.stream('statuses/filter', { track: '#tradewar' })
stream.on('data', function (event) {
    if (event) {
        io.sockets.emit('new-message', {time: event.timestamp_ms, tweets: event.text})
    }
})
