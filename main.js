const Player = (name, mark) =>{
    const getPlayerName= () => name;
    const getPlayerMark = () => mark;
    return {getPlayerName, getPlayerMark};
}

const GameBoard = (function(){
    let _gameBoard= ["X", "O", "X", "X", "O", "O", "X", "X", "O"];
    
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
    return {getBoard, render};
})();


const Game = (function(){
    
})();



function play(){
    renderGame();
    let cells= document.querySelectorAll(".cell");
    cells.forEach(cell =>{
        cell.addEventListener("click", changeCellStatus);
    });
}
