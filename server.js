// Require the packages we will use:
var http = require("http"),
	socketio = require("socket.io"),
	fs = require("fs");

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

let socketmap = new Map();
let games = [];

var io = socketio.listen(app);
io.sockets.on("connection", function(socket){
    socket.room = "account";
    socket.join("account");
    
    socket.on("newConnection", function(data) {
        socket.leave(socket.room);
        socket.join("lobby");
        socket.room = "lobby";
        socketmap.set(data["user"], socket.id);
    });

    socket.on('newroom', function(data) {
        console.log("newroom created by: " + data["creator"]);
        socket.leave(socket.room);
        socket.join(data["creator"]);
        socket.room = data["creator"];
        console.log("creator is " + data["creator"]);
        games[games.length] = new Object;
        games[games.length-1].creator = data["creator"];
        //can change to allow naming of games/only allowing one game per person:::
        games[games.length-1].name = data["creator"] + "'s game";
        games[games.length-1].players = [data["creator"]];

        console.log("good");
        //*** */ONCE YOURE IN LOBBY THEN EMIT IN LOBBY ONLY - FIX BELOW
        io.sockets.in("lobby").emit("joinroombtn", {creator:data["creator"], games:games});
    });

	
	socket.on('message_to_server', function(data) {
		
		console.log("message: "+data["message"]); 
		io.sockets.emit("message_to_client",{message:data["message"] }) 
	});
});