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
let newround = true;

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
        games[data["currentgamenumber"]].start=true;
        io.sockets.in(games[data["currentgamenumber"]].creator).emit("clientstart", {games:games, currentgamenumber:data["currentgamenumber"]});
    });

    socket.on("updatebets", function(data) {
        if(data["bet"]>0){
            console.log("up bets called to add 1");       
        games[data["currentgamenumber"]].bets.push(data["bet"]);
    
        io.sockets.in(games[data["currentgamenumber"]].creator).emit("updategamesgame", {games:games,currentgamenumber:data["currentgamenumber"],numberofbets:games[data["currentgamenumber"]].bets.length});
        }
    });

    socket.on('joinroom', function(data) {
        let currentgamenumber = 0;
        if(data["createdgame"]){
            games[games.length] = new Object();
            games[games.length-1].creator = data["player"];
            //can change to allow naming of games/only allowing one game per person:::
            games[games.length-1].name = data["player"] + "'s game";
            games[games.length-1].players = [];
            games[games.length-1].start = false;
            games[games.length-1].bets = [];
            games[games.length-1].deck = new Array(52);

            let s = 1;
        for(let i=0; i<52; i=i+4){
            games[games.length-1].deck[i] = new Object();
            games[games.length-1].deck[i].rank = s;
            games[games.length-1].deck[i].suit = "diamonds";
            games[games.length-1].deck[i+1] = new Object();
            games[games.length-1].deck[i+1].rank = s;
            games[games.length-1].deck[i+1].suit = "clubs";
            games[games.length-1].deck[i+2] = new Object();
            games[games.length-1].deck[i+2].rank = s;
            games[games.length-1].deck[i+2].suit = "hearts";
            games[games.length-1].deck[i+3] = new Object();
            games[games.length-1].deck[i+3].rank = s;
            games[games.length-1].deck[i+3].suit = "spades";
    s++
        }
        console.log("blahdbhbhc: " + games[games.length-1].deck[0].suit);
        

        }
        for(i=0;i<games.length;i++){
            if(games[i].creator==data["currentgame"]){
                currentgamenumber = i;
            }
        }

        games[currentgamenumber].players.push(data["player"]); 
        socket.leave('lobby');
        socket.room = games[currentgamenumber].creator;
        socket.join(games[currentgamenumber].creator);
        let x = -1;
        io.sockets.in(games[currentgamenumber].creator).emit("updategamesgame", {games:games,currentgamenumber:currentgamenumber, numberofbets:x});
        io.sockets.in("account").emit("updategamesaccount", {games:games});
        io.sockets.in("lobby").emit("updategames", {games:games,currentgamenumber:currentgamenumber});
    });

    socket.on("shuffledeck", function(data) {
        let x = -1;
        if(newround){
        let deck = createdeck();
        shuffle(deck);
        for(i=0; i<52; i++){
            console.log(getCard(deck[i]));
        }
        games[games.length-1].deck = deck;         
        newround = false;
        console.log(games[data["currentgamenumber"]].deck);
        
        io.sockets.in(games[data["currentgamenumber"]].creator).emit("updategamesgame", {games:games,currentgamenumber:data["currentgamenumber"], numberofbets:x});
        }
        // io.sockets.in(games[currentgamenumber].creator).emit("updategamesgame", {games:games,currentgamenumber:currentgamenumber, numberofbets:x});
    });

    function createdeck(){
        let deck = [];
        let s = 1;
        for(let i=0; i<52; i=i+4){
            deck[i] = new Object();
            deck[i].rank = s;
            deck[i].suit = "diamonds";
            deck[i+1] = new Object();
            deck[i+1].rank = s;
            deck[i+1].suit = "clubs";
            deck[i+2] = new Object();
            deck[i+2].rank = s;
            deck[i+2].suit = "hearts";
            deck[i+3] = new Object();
            deck[i+3].rank = s;
            deck[i+3].suit = "spades";
    s++
        }
        return deck;
    }

    function getCard(card){
        if(card.rank == 11){
            return "Jack of " + card.suit;
        }
        if(card.rank == 12){
            return "Queen of " + card.suit;
        }
        if(card.rank == 13){
            return "King of " + card.suit;
        }
        if(card.rank == 1){
            return "Ace of " + card.suit;
        }
        return card.rank + " of " + card.suit;
    }

    function shuffle (oldDeck) {
        let newDeck = new Array(52);
            for (let i=newDeck.length-1; i>=0; --i) {
                let c = parseInt((Math.random() * (i+1)));
                newDeck[i] = oldDeck[c];
                for (let j=c; j<newDeck.length-1; ++j) {
                    oldDeck[j] = oldDeck[j+1];}}
            for(let i=0; i<52; i++) {
                oldDeck[i] = newDeck[i];
            }
        }

});