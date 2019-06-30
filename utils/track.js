var users=[]; 
var rooms =[];
const addUser = (id,username,room) =>{
    // console.log(username);
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    
//checking if details are entered

    if(!username || !room)
    {
        return{error:"add details correctly"}
    }

//checking if same username exists in that room
const index = users.findIndex((user)=>{
    return (user.room===room)&&(user.username===username)
});
if(index!==-1)
{
    // console.log('1');
    return {error:"username already exists in that room"}
}

//storing user

const user={id,username,room};
const index1 = rooms.findIndex((room)=>{
    return room.room===user.room
})
if(index1==-1)
{
    r={room:user.room,users:0};
    rooms.push(r);
}

users.push(user);

const index2 = rooms.findIndex((room)=>{
    return room.room===user.room;
})
if(index2!=-1)
{
    // console.log('hi');
    rooms[index2].users=rooms[index2].users+1;
}
// console.log(users);
// console.log(rooms);
return user;

}

// remvoing user

const removeUser = (id)=>{
    const index = users.findIndex((user) => {
        return user.id===id
    })
    if(index!==-1)
    {
        const room1 = users[index].room;
        // console.log(room1);
        const index1 = rooms.findIndex((room)=>{
            return room.room===room1
        })
        // console.log(index1);
        if(index1!==-1)
        {
            rooms[index1].users=rooms[index1].users-1;
            if(rooms[index1].users===0)
            {
                rooms.splice(index1,1);
            }
            // console.log(rooms);
        }
        return users.splice(index,1)[0];
    }
}

//get user

const getUser = (id) => {
    const user = users.find((user) =>{
        return user.id===id;
    })
    return user;
}

//getUsersinroom

const getUsersInRoom = (room) =>{
    const usersinroom = users.filter((user) =>{
        return user.room===room
    })
    return usersinroom
}


const getrooms = ()=>{
    return rooms;
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getrooms
}

// addUser(1,'keshav','123');
// addUser(1,'keshav','123');