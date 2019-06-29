var socket = io();


//AUTOSCROLL


const autoscroll = ()=>{
    const messages_box = document.getElementById('messages');
    const newMessage = messages_box.lastElementChild;

    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

    const visibleHeight = messages_box.offsetHeight;
    const totalHeight = messages_box.scrollHeight;

    const heightFromTop = messages_box.scrollTop;
    const heightFromBottom = heightFromTop+visibleHeight;

    if((totalHeight-newMessageHeight)<=(heightFromBottom))
    {
        messages_box.scrollTop = messages_box.scrollHeight;
    }

    // console.log(heightFromBottom);
    // console.log(heightFromTop+visibleHeight)
}

//parsing the string

const details= Qs.parse(location.search,{ignoreQueryPrefix:true});
// console.log(details);
//sending Details
if(details.username||details.room)
{
socket.emit('details',details,function(user){
    // console.log('123');
    if(user.error)
    {
        alert(user.error);
        location.href="/";
    }
});
}

else
{
    socket.emit('getroomslist',{});
    socket.on('rooms',(rooms)=>{
        var template = document.getElementById('rooms_template').innerHTML
        var render = Mustache.render(template,{rooms});
        document.getElementById('left1').innerHTML = render;
    })
}

// WELCOME MESSAGE

socket.on('welcome',(msg)=>{
    var template = document.getElementById('welcome_template').innerHTML
    var render = Mustache.render(template,{message:msg});
    document.getElementById('messages').insertAdjacentHTML('afterbegin',render);
    console.log(msg);
    autoscroll();
})

//ALERT AS NEW USER JOINED

socket.on('new',(msg)=>{
    var template = document.getElementById('welcome_template').innerHTML
    var render = Mustache.render(template,{message:msg});
    document.getElementById('messages').insertAdjacentHTML('beforeend',render);
    console.log(msg)
    autoscroll();
})

//SENDING THE MESSAGE BY USER

document.getElementById('message-box').addEventListener('submit',(e)=>{
    e.preventDefault();
    var msg = e.target.elements.message.value;
    var template = document.getElementById('snd-message-template').innerHTML
    var render = Mustache.render(template,{message:msg});
    document.getElementById('messages').insertAdjacentHTML('beforeend',render);
    socket.emit('usermessage',msg);
    autoscroll();
})

// SENDING THE LOCATION

document.getElementById('location').addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('geolocation not supported')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const url = `https://google.com/maps?q=${lat},${long}`;
        socket.emit('location',url);
    })
})

//Receving location

socket.on('loc',(msg)=>{
    var template = document.getElementById('location-template').innerHTML
    var render = Mustache.render(template,{message:msg});
    document.getElementById('message-box').insertAdjacentHTML('beforebegin',render);
    console.log(msg);
})
//RECEVING THE MESSAGES

socket.on('messages',(obj)=>{
    var template = document.getElementById('message-template').innerHTML
    var render = Mustache.render(template,{message:obj.msg,user:obj.user.username});
    document.getElementById('messages').insertAdjacentHTML('beforeend',render);
    console.log(obj);
    autoscroll();
})

//ALERT USER LEFT

socket.on('left',(msg)=>{
    var template = document.getElementById('welcome_template').innerHTML
    var render = Mustache.render(template,{message:msg});
    document.getElementById('messages').insertAdjacentHTML('beforeend',render);
    console.log(msg)
    autoscroll();
})

//RECEIVING USERS LIST

socket.on('users',(users)=>{
    var template = document.getElementById('users-template').innerHTML
    var render = Mustache.render(template,{room:users.room,users:users.users});
    document.getElementById('left').innerHTML = render;
})
