// 'use strict';

// class Game extends React.Component {
//     render() {
//       return (
//         <div className="game">

//           <div className="game-info">
//             <div>{"hi"}</div>
//             <ol>{"yo"}</ol>
//           </div>
//         </div>
//       );
//     }
//   }  

// ReactDOM.render(
//     <Game />,
//     document.getElementById('root')
//   );
const element = React.createElement(
    'h1',
    {className: 'greeting'},
    'Hello, world!'
  );

ReactDOM.render(
    element,
    document.getElementById('root')
  );