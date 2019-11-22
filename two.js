// function createdeck(){
//     deck = [];
//     s = 1;
//     for(i=0; i<52; i=i+4){
//         deck[i] = new Object();
//         deck[i].rank = s;
//         deck[i].suit = "diamonds";

//         deck[i+1] = new Object();
//         deck[i+1].rank = s;
//         deck[i+1].suit = "clubs";

//         deck[i+2] = new Object();
//         deck[i+2].rank = s;
//         deck[i+2].suit = "hearts";

//         deck[i+3] = new Object();
//         deck[i+3].rank = s;
//         deck[i+3].suit = "spades";
// s++
//     }
//     return deck;
// }

// function getCard(card){
//     if(card.rank == 11){
//         return "Jack of " + card.suit;
//     }
//     if(card.rank == 12){
//         return "Queen of " + card.suit;
//     }
//     if(card.rank == 13){
//         return "King of " + card.suit;
//     }
//     if(card.rank == 1){
//         return "Ace of " + card.suit;
//     }
//     return card.rank + " of " + card.suit;
// }

// // //adapted from Professor Cytron in CSE 131
// function shuffle (oldDeck) {
//     newDeck = new Array(52);
// 		for (i=newDeck.length-1; i>=0; --i) {
// 			c = parseInt((Math.random() * (i+1)));
// 			newDeck[i] = oldDeck[c];
// 			for (j=c; j<newDeck.length-1; ++j) {
// 				oldDeck[j] = oldDeck[j+1];}}
// 		for(i=0; i<52; i++) {
// 			oldDeck[i] = newDeck[i];
// 		}
//     }


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {deck: shuffledeck(createdeck()),
                    players: 2, //make an array of player objects, containing cards for each
                    newround: true //so you know when to shuffle deck
        };
      }




    render() {
        //const t = this.createdeck();
        //const t = createdeck();
        //const d = createdeck();

        //return (this.props.username);
        return (
            <div>
                {this.state.deck[0].rank}
            </div>

        );
    }

}

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {clicked_creategame: false};
      }

render(){
    if (this.state.clicked_creategame) {
        return (
            <Game
                username={this.props.username}
            />
        );
        
        }

    return(
        <div>
        <button className="creategame" onClick={() => this.setState({clicked_creategame: true })}>
            Create New Game
        </button>

        </div>
    );
}
}

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicked_login: false,
                 clicked_create: false};
  }

  render() {
    if (this.state.clicked_login) {
        return (
            <Login
                username={document.getElementById("username_input").value}
                // onClick={() => this.handleClick(i)}
            />
        );
        
        
        //document.getElementById("username_input").value;
    }

    if (this.state.clicked_create) {
        return 'You clicked create.';
    }

    return (
        <div>
        <input type="text" id="username_input" placeholder="Username"/>

        <button className="login" onClick={() => this.setState({clicked_login: true })}>
            Login
        </button>

        <button className="create" onClick={() => this.setState({clicked_create: true })}>
            Create
        </button>

        </div>
    )
  }
}

ReactDOM.render(
    <Account />,
    document.getElementById('s')
  );

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