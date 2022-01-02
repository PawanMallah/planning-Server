const http = require('http');
var List = require("collections/list");

const port = 80;
const server = http.createServer((request, response) => {
    response.end("Pawan Mallah Port "+port);
});

var io  = require('socket.io')(server);
var list ={};

io.on('connection',function(socket)
{
    //console.log(socket.id);
    socket.on('join',function(data){
        var list1 =[];
        socket.join(data.RoomId);
        otherData=list[data.RoomId];
        for (var otherRoomCode in otherData) {
            list1.push(otherData[otherRoomCode]);
        }
        list1.push(data);
        list[data.RoomId] = (list1);
        console.log(list);
        socket.broadcast.to(data.RoomId).emit("newUserJoin",data);
    });

    socket.on('UpdatePoint',function(data){
        AllUser=list[data.RoomId];
        var i=0;
        
        // for (let index = 0; index < AllUser.length; index++) {
        //     if(AllUser[index] == data.Name)
        //     {
        //         AllUser[index].Point = data.Point;
        //     }
        // }
        for (const key in AllUser) {
            if(AllUser[key].Name == data.Name)
             {
                 AllUser[key].Point = data.Point;
             }
        }
        //console.log(AllUser);
        list[data.RoomId] = AllUser;
        console.log(list);
        socket.broadcast.to(data.RoomId).emit("GetAllUser",list[data.RoomId]);
    });

    socket.on('Remove',function(data){
        debugger;
        var list1 =[];
        var isAdmin = false;
        otherData=list[data.RoomId];
        for (var otherRoomCode in otherData) {
            if(otherData[otherRoomCode].Id == data.Id)
            {
                if(otherData[otherRoomCode].Admin == 1)
                {
                    isAdmin = true;
                }
                continue;
            }
            if(isAdmin)
            {
                    otherData[otherRoomCode].Admin = 1;
                    isAdmin =false;
            }
            list1.push(otherData[otherRoomCode]);
        }
        console.log(otherData[otherRoomCode]);
        console.log(list1);
        list[data.RoomId] = (list1);
        socket.broadcast.to(data.RoomId).emit("GetAllUser",list[data.RoomId]);
    });
    socket.on('GetAll',function(RoomId){
        socket.broadcast.to(RoomId).emit("GetAllUser",list[RoomId]);
    });
    socket.on('SendMessage',function(data){
        console.log("Msg");
        socket.broadcast.to(data.RoomId).emit("GetAllMessage",data);
    });
    socket.on('ShowPoint',function(data)
    {
        socket.broadcast.to(data.RoomId).emit("ShowAllPoint",{Show:"yes"});
    });
    socket.on('SendArtifactNumber',function(data)
    {
        socket.broadcast.to(data.RoomId).emit("BroadcastArtifactNumber",{Number:data.Number});
    });
});

server.listen(port);

console.log("Server running at http://localhost:%d", port);
