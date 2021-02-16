const Player = (name, mark) =>{
    const getPlayerName = name;
    const getPlayerMark = mark;
    return {getPlayerName, getPlayerMark};
}

const GameBoard = (function(){
    let _gameBoard= ["", "", "", "", "", "", "", "", ""];

    function checkIfFull(){
        if(_gameBoard.every((element) => element !== "")){
            return true;
        }
        else{
            return false;
        }
    }
    
    let updateGameBoard = () =>{
        _gameBoard = [];
        let cells= document.querySelectorAll(".cell");
        cells.forEach(cell =>{
            _gameBoard.push(cell.textContent);
        });
    }

    let _displayGame = ()=>{
        let cells= document.querySelectorAll(".cell");
        let i=0;

        cells.forEach(cell => {
            cell.textContent=_gameBoard[i]   
            i++;
        });
    } 
    function setDisplay(player1, player2){
        const display= document.querySelector("#display");
        const infoBox= document.createElement("div");
        infoBox.id="info-box";
        infoBox.innerHTML=`<p id="first-p">${player1}, you are the X </p> 
                            <p id="second-p">${player2}, you are the O </p>`;
        display.appendChild(infoBox);
    }

    function reset(){
        _gameBoard= ["", "", "", "", "", "", "", "", ""];
        console.log(_gameBoard);
        _displayGame();
        const infoBox= document.querySelector("#info-box");
        infoBox.remove();
        inputForm=document.querySelector("#player-input");
        inputForm.style.display="block";
    }

    let render = _displayGame();
    const getBoard = () => _gameBoard;
    return {getBoard, render, updateGameBoard, setDisplay, reset, checkIfFull};
})();


const Game = (function(){
    // get players
    let _player1, _player2;
    let _turn;
    let getPlayerTurn;

    function definePlayers(player1, player2){
        _player1= Player(player1, "X");
        _player2= Player(player2, "O");
        _turn=_player2;
        getPlayerTurn=_turn;
    }

    function togglePlayerTurn (){
        if (_turn == _player1){
            _turn=_player2;
        }else{
            _turn=_player1
        }
        return _turn;
    }


    function setMark (){
        if (!this.textContent){
            this.textContent = getPlayerTurn.getPlayerMark;
            console.log(`_turn: ${_turn.getPlayerName} getplayerturn: ${getPlayerTurn.getPlayerName}`);
            GameBoard.updateGameBoard();
            runChecks();
            getPlayerTurn= togglePlayerTurn();
            
        }

    }
    function runChecks(){
        let full = GameBoard.checkIfFull();
        let win = victoryCheck();
        if(full || win){
            endGame([win, full]);
        }    
    }

    function victoryCheck(){
        let mark= _turn.getPlayerMark;
        const victoryArrays=[
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
        let gameArray= GameBoard.getBoard();
        let victory=false;

        for (i=0; i<=7; i++){
            i1=victoryArrays[i][0];
            i2=victoryArrays[i][1];
            i3=victoryArrays[i][2];
            testArray=[gameArray[i1], gameArray[i2], gameArray[i3]];

            victory = testArray.every((element)=> element===mark);
            if(victory){
                return victory;
            }
        }
        return victory;
    }

    function reset(){
        delete _player1;
        delete _player2;
        delete _turn;
    }

    function endGame(results){
        win=results[0];

        const infoBox = document.querySelector("#info-box");
        const endGameP = document.createElement("p");
        const winText=`Game Over! ${getPlayerTurn.getPlayerName} won!`
        const fullText = "Game Over! It's a tie!"
        win ? endGameP.textContent=winText : endGameP.textContent = fullText; 
        
        infoBox.appendChild(endGameP);
        DomAccess.cells.forEach(cell => {
            cell.removeEventListener("click", Game.setMark);
        })
    }


    return {getPlayerTurn, setMark, victoryCheck, definePlayers};
})();


const DomAccess = (function play(){
    const submit= document.querySelector("#submit");
    const inputForm = document.querySelector("#player-input");
    const cells= document.querySelectorAll(".cell");
    const newGameButton = document.querySelector("#new-game");

    
    newGameButton.addEventListener("click", ()=>{
        GameBoard.reset();
        Game.reset();
    });

    submit.addEventListener("click", setGame);

    function setGame(){
        inputForm.style.display="none";
        let player1=document.querySelector("#player1").value;
        let player2=document.querySelector("#player2").value;
        GameBoard.setDisplay(player1, player2);
        Game.definePlayers(player1, player2);
        startGame();
    }

    function startGame(){
        cells.forEach((cell) =>{
            cell.addEventListener("click", Game.setMark);
        });
    }    
    
    return{cells}
})();
