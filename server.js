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
    console.log("NEW");
    socket.room = "account";
    socket.join('account');
    io.sockets.in(socket.id).emit("games",{games:games,test:"test"})
    //**** */
    // games[0] = new Object();
    // games[0].creator = "yeay";
    // for(i=0;i<games.length;i++){
    //     console.log("games #" + i + ": " + games[i].creator);
    // }
    
    socket.on("newConnection", function(data) {
        socketmap.set(data["user"], socket.id);
    });

    socket.on("joinlobby", function(data) {
    socket.leave(socket.room);
    socket.join("lobby");
    socket.room = "lobby";});

    socket.on("startgame", function(data) {
        console.log("startgmae");
        games[data["currentgamenumber"]].start=true;
        io.sockets.in(games[data["currentgamenumber"]].creator).emit("clientstart", {games:games, currentgamenumber:data["currentgamenumber"]});
    });

    socket.on('joinroom', function(data) {
        let currentgamenumber = 0;
        if(data["createdgame"]){
            console.log("Newroom created by: " + data["player"]);
            games[games.length] = new Object();
            games[games.length-1].creator = data["player"];
            //can change to allow naming of games/only allowing one game per person:::
            games[games.length-1].name = data["player"] + "'s game";
            games[games.length-1].players = [];
            games[games.length-1].start = false;
        }
        for(i=0;i<games.length;i++){
            if(games[i].creator==data["currentgame"]){
                currentgamenumber = i;
                console.log("currentgamenum = " + i);
            }
        }

        games[currentgamenumber].players.push(data["player"]); 
        socket.leave('lobby');
        socket.room = games[currentgamenumber].creator;
        socket.join(games[currentgamenumber].creator);
        console.log(io.sockets.adapter.sids[socket.id]);
        console.log("creator is " + games[games.length-1].creator);

        for(i=0;i<games[currentgamenumber].players.length;i++){
        console.log("Player " + i + ": " + games[currentgamenumber].players[i]);
        }
        io.sockets.in(games[currentgamenumber].creator).emit("updategamesgame", {games:games,currentgamenumber:currentgamenumber});
        io.sockets.in("account").emit("updategamesaccount", {games:games});
        io.sockets.in("lobby").emit("updategames", {games:games,currentgamenumber:currentgamenumber});
    });

});