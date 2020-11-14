const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

users = [];
io.on('connection', function (socket) {
    console.log('A user connected');

    socket.on('setUsername', function (data) {
        console.log(data);
        if (data === '') {
            socket.emit('userBlank', data + ' username can not be blank!');
        } else if (users.indexOf(data[['username']]) > -1) {
            socket.emit(
                'userExists',
                data + ' username is taken! Try some other username.'
            );
        } else {
            users.push(data['username']);
            socket.emit('userSet', { username: data });
        }
    });

    socket.on('msg', function (data) {
        //Send message to everyone
        io.sockets.emit('newmsg', data);
    });
});

http.listen(process.env.PORT || 5000, function () {
    console.log('listening on localhost:3000');
});
