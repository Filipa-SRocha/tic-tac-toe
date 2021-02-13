const Player = (name, mark) =>{

    const getPlayerName = name;
    const getPlayerMark = mark;
    return {getPlayerName, getPlayerMark};
}

const GameBoard = (function(){
    let _gameBoard= ["", "", "", "", "", "", "", "", ""];
    
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



    let render = _displayGame();
    const getBoard = () => _gameBoard;
    return {getBoard, render, updateGameBoard};
})();


const Game = (function(){
    // get players
    const _player1 = Player("filipa", "X");
    const _player2 = Player("julianna", "O");
    _turn = _player2;
    let getPlayerTurn=_turn;

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
            getPlayerTurn= togglePlayerTurn();
            GameBoard.updateGameBoard();
        }
        console.log(victoryCheck());
    }

    function victoryCheck(){
        let mark= _turn.getPlayerMark;
        const victoryArrays=[
            [1,2,3],[4,5,6],[7,8,9],
            [1,4,7], [2,5,8], [3,6,9],
            [1,5,9], [3,5,7]
        ];
        let gameArray= GameBoard.getBoard();
        let victory=false;

        for (i=0; i<=7; i++){
            i1=victoryArrays[i][0];
            i2=victoryArrays[i][1];
            i3=victoryArrays[i][2];
            testArray=[gameArray[i1], gameArray[i2], gameArray[i3]];

            victory = testArray.every((element)=> element===mark);
           
            if (victory){
                endGame();
            }
        }
        return victory;
    }

    function endGame(){
        console.log(`Game Over! ${getPlayerTurn.getPlayerName} won!`);
    }


    return {getPlayerTurn, setMark, victoryCheck};
})();


function play(){

    let cells= document.querySelectorAll(".cell");
    cells.forEach((cell) =>{
        cell.addEventListener("click", Game.setMark);
    });
    
}

play();
