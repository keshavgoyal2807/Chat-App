const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');


var app = express();
const server = require('http').createServer(app);
const {addUser,removeUser,getUser,getUsersInRoom,getrooms} = require('../utils/track.js');


const port = process.env.PORT || 3000
var clientPath = path.join(__dirname,'../client')


app.use(express.static(clientPath));

const io = require('socket.io')(server);


io.on('connection',(socket)=>{
    socket.on('getroomslist',(msg)=>{
        rooms = getrooms();
        socket.emit('rooms',rooms);
    })
    socket.on('details',(msg,callback)=>{
        // console.log(msg);
        const user = addUser(socket.id,msg.username,msg.room);
        // console.log(user);
        if(user.error)
        {
            // console.log('123');
            callback(user);
        }
        else
        {
            // console.log(user.room);
            socket.join(user.room);
            socket.emit('welcome',"welcome to the chat app");
            socket.broadcast.to(user.room).emit('new',`${user.username} Joined`);
            const users = getUsersInRoom(user.room);
            io.to(user.room).emit('users',{
                room:user.room,
                users
            });
        }
    })
    socket.on('location',(msg)=>{
        socket.broadcast.emit('loc',msg);
    })

    socket.on('usermessage',(msg)=>{
        const user = getUser(socket.id);
        if(user)
        socket.to(user.room).emit('messages',{user,msg});
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id);
        if(user)
        {
        socket.broadcast.to(user.room).emit('left',`${user.username} Left`)
        const users = getUsersInRoom(user.room);
        io.to(user.room).emit('users',{
            room:user.room,
            users
        });
        rooms = getrooms();
        socket.emit('rooms',rooms);
        }
    })
})

//SOCKETIO

server.listen(port,()=>{
    console.log(`connected to port ${port}`);
})

