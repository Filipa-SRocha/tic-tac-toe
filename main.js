const Player = (name, mark) =>{
    const getPlayerName = name;
    const getPlayerMark = mark;
    return {getPlayerName, getPlayerMark};
}

const ChangeDisplay = (function(){
    const divSubmitButton= document.querySelector("#div-submit-button");
    const submitButton = document.querySelector("#submit");
    const playersInput = document.querySelectorAll(".player-input");
    const player1InfoBox = document.querySelector("#player1-info-box");
    const player2InfoBox = document.querySelector("#player2-info-box");
    const endGameDiv = document.querySelector("#end-game-div");

    let hide = (selector) => selector.style.display = "none";

    let show = (selector) => selector.style.display = "block";

    const displayHumanVsHuman = () => {
        hide(endGameDiv);
        hide(player1InfoBox);
        hide(player2InfoBox);
        show(divSubmitButton);
        show(submitButton);
        playersInput.forEach(playerInput => show(playerInput));
    }

    const displayGameStart = () =>{
        hide(endGameDiv);
        hide(divSubmitButton);
        hide(submitButton);
        playersInput.forEach(playerInput => hide(playerInput));
        show(player1InfoBox);
        show(player2InfoBox);
    }

    const printPlayersNames = (player1, player2, randomComputer=false) => {
        let player1Text = `<p id="first-p">${player1.toUpperCase()}, YOU ARE THE X </p>`;
        let player2Text = `<p id="second-p">${player2.toUpperCase()}, YOU ARE THE O </p>`;
        let computerText = `<p id="second-p">I AM THE O </p>`;

        player1InfoBox.innerHTML=player1Text;
        randomComputer ? player2InfoBox.innerHTML = computerText : player2InfoBox.innerHTML = player2Text;
    }

    const highlightPlayer = (pL, pH) =>{
        pL.classList.remove("p-highlight");
        pH.classList.add("p-highlight");
    }

    const printEndGame = (text) => {
        hide(player1InfoBox);
        hide(player2InfoBox);
        show(endGameDiv);
        p=document.createElement("p");
        p.textContent=text;
        endGameDiv.appendChild(p);
    }

    const resetGame = () => {
        GameBoard.reset();
        if(endGameDiv.firstChild) endGameDiv.removeChild(endGameDiv.firstChild);
    }

    return {displayHumanVsHuman, displayGameStart, printPlayersNames, highlightPlayer, printEndGame, resetGame}
})();

const GameBoard = (function(){
    const cells= document.querySelectorAll(".cell");
    let _gameBoard= ["", "", "", "", "", "", "", "", ""];

    let checkIfFull= (board) => board.every((element) => element !== "");

    function getFreeCells(){
        let freeCells=[];

        for (i=0; i<9; i++){
            if(_gameBoard[i] == "") freeCells.push(i);
        }
        return freeCells;
    }

    let getBoard= () => _gameBoard;

    const updateGameBoard = () =>{
        _gameBoard=[];

        cells.forEach(cell =>{
            _gameBoard.push(cell.textContent);
            console.log(cell.textContent);
        });
    }

    const displayGameBoard = () => {
        let i=0;

        cells.forEach(cell =>{
            cell.textContent = _gameBoard[i];
            i++;
        });
    }

    const reset = () => {
        _gameBoard=[];
        displayGameBoard();
    }

    return {reset, displayGameBoard, updateGameBoard, checkIfFull, getBoard, getFreeCells}
})();

const Game = (function(){
    const cells= document.querySelectorAll(".cell");
    let _player1;
    let _player2;
    let _turn;
    let _randomComputer;
    let _smart

    const defineTurn = (player1, player2, randomComputer = false, smart= false) => {
        _player1 = Player(player1, "X");
        _player2 = Player(player2, "O");
        _turn = _player1;
        _randomComputer = randomComputer;
        _smart = smart;
    }

    const togglePlayerTurn = () => {
        p1=document.querySelector("#first-p");
        p2=document.querySelector("#second-p");

        if (_turn == _player1){
            _turn= _player2;
            ChangeDisplay.highlightPlayer(p1, p2);
        }
        else{
            _turn = _player1
            ChangeDisplay.highlightPlayer(p2, p1);
        }
        return _turn;
    }


    const start = () =>{
            cells.forEach((cell) => {
                cell.addEventListener("click", makePlay);
            });   
    }

    function makePlay() {
        if (!this.textContent){
            if(drawMark(this)){
                cells.forEach(cell => cell.removeEventListener("click", makePlay));
                if (!runChecks()){
                    togglePlayerTurn();

                    if(_randomComputer && _turn.getPlayerName == "Computer"){
                        makeComputerPlay();
                    }
                    else{
                        start();
                    }
                }    
            }
        }
    }

    function makeComputerPlay(){ 
        Computer.computerChoice(_smart); // randomly chooses a cell, draws and updates display and gameboard array
        runChecks();
        togglePlayerTurn();
        start();
    }

    function drawMark(cell){
        cell.textContent = _turn.getPlayerMark;
        GameBoard.updateGameBoard();
        GameBoard.displayGameBoard();
        return true;
    }

    function runChecks(){
        let full = GameBoard.checkIfFull(GameBoard.getBoard());
        let win = victoryCheck(_turn.getPlayerMark, GameBoard.getBoard());
        if(full || win){
            endGame(win);
            return true;
        }  
    }

    function victoryCheck(mark, gameArray){
        const victoryArrays=[
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6], [1,4,7], [2,5,8],
            [0,4,8], [2,4,6]
        ];
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

    function endGame(win){
        
        const winText=`Game Over! ${_turn.getPlayerName} won!`
        const fullText = "Game Over! It's a tie!"
        win ? ChangeDisplay.printEndGame(winText) : ChangeDisplay.printEndGame(fullText);
    }


    return{defineTurn, start, drawMark, victoryCheck}
})();

const Computer = (function(){
    const cells= document.querySelectorAll(".cell");

    let computerChoice = (smart)=>{
        let cellNumber;

        if (smart){
            cellNumber = SmartPlay.minimax(["X", "X", "O", "O","O", "", "X", "", ""],"X");
            console.log(`cellNumber ai ${cellNumber.index}`);
        }else{
            let possibleChoices=GameBoard.getFreeCells();
            let choice= randomChoice(possibleChoices.length-1);
            cellNumber = possibleChoices[choice]; 
        }
        
        cells.forEach((cell) => {
            if(cell.dataset.index == (cellNumber+1)) {
                Game.drawMark(cell);
            }
        });
    }

    const randomChoice = (n) => {
        Math.floor(Math.random()*n);
        return n;
    }

    return {computerChoice}

})();
/*
const SmartPlay = (function(){

    ai="X";
    human="O";

    function getFreeCells(board){
        let freeCells=[];

        for (i=0; i<9; i++){
            if(board[i] == "") freeCells.push(i);
        }
        return freeCells;
    }

    function minimax(board, player){
        console.log(`board ${board}`);
        //check for terminal state X-human, O-ai
        if (Game.victoryCheck("X", board)){
             return {score: 10};
        }
        else if (Game.victoryCheck("O", board)) {
            return {score: -10};
        }
        else if (GameBoard.checkIfFull(board)) {
            return {score: 0};
        }

        let freeCells = getFreeCells(board); // 

        let moves = []; //{index:score}

        for (i=0; i<freeCells.length; i++){
            let move={};

            move.index=freeCells[i];
            board[freeCells[i]] = player;

            if (player == ai){
                let result = minimax(board, human);
                move.score = result.score;                
            }
            else if (player == human){
                let result = minimax(board, ai);
                move.score = result.score;
            }
            board[freeCells[i]]= "";
            moves.push(move);
        }

        let bestMove;

        player == ai ? bestScore = -10000 : bestScore= 10000;

        
        for (i=0; i<moves.length; i++){
            if (player == ai){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                } 
            }
            else{
                if (moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = moves[i];
                }
            }
        }



    return bestMove;
    }

    return{minimax}
})();
*/


const DomAcess = (function(){
    const submitButton = document.querySelector("#submit");
    const humanButton = document.querySelector("#humans-game");
    const computerButton = document.querySelector("#computer-game");
    const smartButton = document.querySelector("#smartComputer-game");

    humanButton.addEventListener("click", () => {
        ChangeDisplay.resetGame();
        ChangeDisplay.displayHumanVsHuman();
    });

    submitButton.addEventListener("click", ()=>{
        let player1 = document.querySelector("#player1").value;
        let player2 = document.querySelector("#player2").value;
        ChangeDisplay.displayGameStart();
        ChangeDisplay.printPlayersNames(player1, player2);
        Game.defineTurn(player1, player2);
        Game.start();
    });

    computerButton.addEventListener("click", ()=>{
        ChangeDisplay.resetGame();
        ChangeDisplay.displayGameStart();
        ChangeDisplay.printPlayersNames("Human", "Computer", true);
        Game.defineTurn("Human", "Computer", true);
        Game.start();
    });

    /*
    smartButton.addEventListener("click", () => {
        ChangeDisplay.resetGame();
        ChangeDisplay.displayGameStart();
        ChangeDisplay.printPlayersNames("Human", "Computer", true);
        Game.defineTurn("Human", "Computer", true, true);
        Game.start();
    });
    */

})();
