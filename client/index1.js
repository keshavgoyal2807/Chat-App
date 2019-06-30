var socket = io();
socket.emit('getroomslist',{});
    socket.on('rooms',(rooms)=>{
        var template = document.getElementById('rooms_template').innerHTML
        var render = Mustache.render(template,{rooms});
        document.getElementById('left1').innerHTML = render;
    });
const emitfunction = () =>{
    socket.emit('getroomslist',{});
    socket.on('rooms',(rooms)=>{
        var template = document.getElementById('rooms_template').innerHTML
        var render = Mustache.render(template,{rooms});
        document.getElementById('left1').innerHTML = render;
    });
};
setInterval(emitfunction,1000)