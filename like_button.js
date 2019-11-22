// Require the packages we will use:
var http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs");

let rooms = [];
let currentnewroom = 0;

// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html:
var app = http.createServer(function(req, resp){
	// This callback runs when a new connection is made to our HTTP server.
	
	fs.readFile("client.html", function(err, data){
		// This callback runs when the client.html file has been read from the filesystem.
		
		if(err) return resp.writeHead(500);
		resp.writeHead(200);
		resp.end(data);
	});
});
app.listen(3456);

let users = [];
let socketarray = [];
let count = 0;
let socketmap = new Map();

// function getId(value, key, map){
// return value;
// }


// Do the Socket.IO magic:
var io = socketio.listen(app);
io.sockets.on("connection", function(socket){
    // This callback runs when a new Socket.IO connection is established.
    socket.room = "lobby";
    socket.join("lobby");
    //socket.privateroom = "lobby";


for(i=0; i<currentnewroom; i++){

    io.sockets.in("lobby").emit("joinroombtn",{name:rooms[i].roomName, pass:rooms[i].password, bool:rooms[i].bool});
    //io.sockets.in("lobby").emit("joinroombtn",{name:rooms[i]});

}

    socket.on("newConnection", function(data) {
        // socket.leave(socket.privateroom);
        // socket.join();

        socketmap.set(data["user"], socket.id);
        // let f = socketmap.get(data["user"]);
        // console.log(f);

        //socketarray[count] = new Map([[data["user"], socket.id]]);
        // save new user to some collection to keep track
    });
    
	socket.on('message_to_server', function(data) {
		// This callback runs when the server receives a new message from the client.
		

        if(data["name"]!="lobby"){
            io.sockets.in(data["name"]).emit("message_to_client",{message:data['message'], user:data['user']}); 
        }
        else{ 
            
		io.sockets.in("lobby").emit("message_to_client",{message:data["message"], user:data["user"] }) }// broadcast the message to other users
    });

    socket.on('privatemessage_to_server', function(data) {
        //if(data["receiver"] = socketmap.forEach(getId);
        
        //socketmap.forEach(getId);
        console.log(data["receiver"]);
        let v = socketmap.size;
        console.log("size" + v)
        let receiverid = socketmap.get(data["receiver"]);
        console.log("id" + receiverid);
        for(i=0;i<currentnewroom;i++){
            for(j=0;j<rooms[i].users.length;j++){
                if(rooms[i].users[j]==data["receiver"]){
                    if(rooms[i].roomName==data["name"]){
                        io.sockets.to(receiverid).emit("message_to_client",{message:data["message"], user:data['sender']}); 
                    }
                }
            }
        }
        
          }// broadcast the message to other users
    );

    socket.on('kickmessage_to_server', function(data) {
        for(i=0;i<currentnewroom;i++){
            if(rooms[i].roomName==data["name"]){
                if(data["sender"]==rooms[i].creator){
                    let kickedid = socketmap.get(data["receiver"]);
                    io.sockets.to(kickedid).emit("forcequitmessage_to_client",{name:data["name"], user:data['receiver']}); 
                }
            }
        }
    

    });

    socket.on('newroom', function(data) {
        socket.leave(socket.room);
        socket.join(data["name"]);
        socket.room = data["name"];
        
        // broadcast the message to other users in the new room
        io.sockets.in(data["name"]).emit("message_to_client2",{name:data["name"], message:"A new room called "});
       
        rooms[currentnewroom] = new Object();
        rooms[currentnewroom].roomName = data["name"];
        rooms[currentnewroom].users = [data["creator"]];
        //rooms[currentnewroom].users.push(data["creator"]);
        rooms[currentnewroom].creator = data["creator"];
        rooms[currentnewroom].password = data["pass"];
        rooms[currentnewroom].banned = [];

        
        rooms[currentnewroom].index = currentnewroom;

var bool = false;


console.log("PASS" + rooms[currentnewroom].password);
if(rooms[currentnewroom].password!=''){
bool=true;
}
rooms[currentnewroom].bool = bool;


io.sockets.emit("joinroombtn",{name:data["name"], bool:bool});
        currentnewroom++;
       
        
        //console.log("#: " + rooms[currentnewroom].users.length);
       //******** */
        //io.sockets.in(data["name"]).emit("message_to_client3",{name:data["name"], users:data["creator"]});
        io.sockets.in(data["name"]).emit("message_to_client3",{name:data["name"],user:data['creator'], users:[data["creator"]]});

        // rooms[currentnewroom] = data["name"];
        // currentnewroom++;

        
	});

    socket.on('banmessage_to_server', function(data) {
        
        for(i=0;i<currentnewroom;i++){
            if(rooms[i].roomName==data["name"]){
                if(data["sender"]==rooms[i].creator){
                    let kickedid = socketmap.get(data["receiver"]);
                    rooms[i].banned.push(data["receiver"]);
                    io.sockets.to(kickedid).emit("forcequitmessage_to_client",{name:data["name"], user:data["receiver"]});
                }
            }
        }
        if(isNaN(data['time'])==false){
            let millisecond = data['time']*60000;
            console.log("time taken"+millisecond);
            //https://www.w3schools.com/js/js_timing.asp
            setTimeout(unban, millisecond);

        }
    function unban(){
        console.log("ssssssssssssssssssaRONRONRONRONRONR");
        for(i=0; i<currentnewroom; i++){
            if(rooms[i].roomName==data["name"]){
                for(k=0;k<rooms[i].banned.length;k++){
                    if(rooms[i].banned[k]==data['receiver']){
                        rooms[i].banned.splice(k,1);
                    }
                }
            }
    }
}

    });



socket.on('joinroom', function(data) {
    let isbanned = false;
for(i=0; i<currentnewroom; i++){
    if(rooms[i].roomName==data["name"]){
        console.log("PASSWORD IS THIS MOSES"+rooms[i].password);
        if(rooms[i].password!=''){
            
            guess = data["guess"];

            if(guess == rooms[i].password){

                for(k=0;k<rooms[i].banned.length;k++){
                    if(rooms[i].banned[k]==data["user"]){
                    console.log("banned");
                    isbanned = true;
                    //io.sockets.in(data["user"]).emit("yourebannedmessage_to_client",{user:data["user"]}); 
                }
                }


                
                // if(rooms[i].banned[k]==data["user"]){
                //     console.log("banned");
                //     io.sockets.in(data["user"]).emit("yourebannedmessage_to_client",{user:data["user"]}); 
                // }
              //  else{

                if(!isbanned){
                socket.leave(socket.room);
                socket.join(data["name"]);
                socket.room = data["name"];
                for(i=0; i<currentnewroom; i++){
                    if(rooms[i].roomName==data["name"] && data["user"]!=null){
                        console.log(data["user"] + " joined " + data["name"])
                        rooms[i].users.push(data["user"]);
                        io.sockets.in(data["name"]).emit("message_to_client3",{name:data["name"], user:data['creator'], users:rooms[i].users});
                    }
                }
           // }
            
            }
        }
            else{
                io.sockets.in(data["user"]).emit("wrong",{users:rooms[i].users});
            }
        }
        else{
            for(k=0;k<rooms[i].banned.length;k++){
                if(rooms[i].banned[k]==data["user"]){
                console.log("banned");
                isbanned = true;
                //io.sockets.in(data["user"]).emit("yourebannedmessage_to_client",{user:data["user"]}); 
            }
            }
            if(!isbanned){
            socket.leave(socket.room);
                socket.join(data["name"]);
                socket.room = data["name"];
                for(i=0; i<currentnewroom; i++){
                    if(rooms[i].roomName==data["name"] && data["user"]!=null){
                        console.log(data["user"] + " joined " + data["name"])
                        rooms[i].users.push(data["user"]);
                        io.sockets.in(data["name"]).emit("message_to_client3",{name:data["name"], user:data['creator'], users:rooms[i].users});
                    }
                }
            }
        }
        
    }
}




        
        //io.sockets.in(data["name"]).emit("message_to_client3",{name:data["name"]})
        

    });

    socket.on('leaveroom', function(data) {
        socket.leave(data["name"]);
        socket.join("lobby");
        for(i=0; i<currentnewroom; i++){
            if(rooms[i].roomName==data["name"] && data["user"]!=null){
                //leaver = rooms[i].users[i];
                leaver = data["user"];
                l = rooms[i].users.indexOf(leaver);
                console.log(l);
                console.log(leaver + " has left " + rooms[i].roomName);
                for(j=0;j<rooms[i].users.length; j++){
                    console.log("users are BEFORE leave: " + rooms[i].users[j]);
                }
                rooms[i].users.splice(l,1);
                io.sockets.in("lobby").emit("message_to_client_leavechat",{name:data["name"], users:rooms[i].users, leaver:leaver});
                for(j=0;j<rooms[i].users.length; j++){
                    console.log("users are AFTER leave: " + rooms[i].users[j]);
                }
                io.sockets.in(data["name"]).emit("message_to_client_notleavechat",{name:data["name"], users:rooms[i].users});

            }
        }

    });

    socket.on('kickleaveroom', function(data) {

        let kickid = socketmap.get(data["user"]);
        console.log("id..." + data["user"]);
        console.log(kickid);
        console.log(socket.id);
        socket.leave(data["name"]);
        
        socket.join("lobby");
        for(i=0; i<currentnewroom; i++){
            if(rooms[i].roomName==data["name"] && data["user"]!=null){
                //leaver = rooms[i].users[i];
                leaver = data["user"];
                l = rooms[i].users.indexOf(leaver);
                console.log(l);
                console.log(leaver + " has left " + rooms[i].roomName);
                for(j=0;j<rooms[i].users.length; j++){
                    console.log("users are BEFORE leave: " + rooms[i].users[j]);
                }
                rooms[i].users.splice(l,1);
                io.sockets.in("lobby").emit("message_to_client_leavechat",{name:data["name"], users:rooms[i].users, leaver:leaver});
                for(j=0;j<rooms[i].users.length; j++){
                    console.log("users are AFTER leave: " + rooms[i].users[j]);
                }
                io.sockets.in(data["name"]).emit("message_to_client_notleavechat",{name:data["name"], users:rooms[i].users});

            }
        }

    });

});