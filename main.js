const Player = (name, mark) =>{
    const getPlayerName = name;
    const getPlayerMark = mark;
    return {getPlayerName, getPlayerMark};
}

const GameBoard = (function(){
    let _gameBoard= ["", "", "", "", "", "", "", "", ""];

    let checkIfFull= () => _gameBoard.every((element) => element !== "");
    
    let updateGameBoard = () =>{
        _gameBoard = [];
        const cells= DomAccess.cells;
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

        const p1Display= document.querySelector("#player1-display");
        const p2Display= document.querySelector("#player2-display");
        const infoBox1 = document.createElement("div");
        const infoBox2 = document.createElement("div"); 
        infoBox1.classList.add("info-box");
        infoBox2.classList.add("info-box");

        infoBox1.innerHTML=`<p id="first-p">${player1.toUpperCase()}, YOU ARE THE X </p>`;
        infoBox2.innerHTML=`<p id="second-p">${player2.toUpperCase()}, YOU ARE THE O </p>`;
        p1Display.appendChild(infoBox1);
        p2Display.appendChild(infoBox2);

    }

    function reset(){
        _gameBoard= [];
        _displayGame();
        const endGameDiv = document.querySelector("#end-game-div");
        const submit = DomAccess.submit;
        const infoBoxes= document.querySelectorAll(".info-box");
        const playerInputs=DomAccess.playerInputs;

        endGameDiv.remove()
        infoBoxes.forEach(infoBox => infoBox.remove());
        
        submit.style.display="block";
        playerInputs.forEach(playerInput => playerInput.style.display="block");
    }

    let render = _displayGame();
    const getBoard = () => _gameBoard;
    return {getBoard, render, updateGameBoard, setDisplay, reset, checkIfFull};
})();


const Game = (function(){
  
    let _player1, _player2;
    let _turn;
    let getPlayerTurn;

    function definePlayers(player1, player2){
        _player1= Player(player1, "X");
        _player2= Player(player2, "O");
        _turn=_player1;
        getPlayerTurn=_turn;
    }

    function togglePlayerTurn (){
        p1=document.querySelector("#first-p");
        p2=document.querySelector("#second-p");

        if (_turn == _player1){
            _turn=_player2;
            p1.classList.remove("p-highlight");
            p2.classList.add("p-highlight");

        }else{
            _turn=_player1
            p2.classList.remove("p-highlight");
            p1.classList.add("p-highlight");
        }
        return _turn;
    }


    function setMark (){
        if (!this.textContent){
            this.textContent = getPlayerTurn.getPlayerMark;
            GameBoard.updateGameBoard();
            runChecks();
            getPlayerTurn= togglePlayerTurn();
        }

    }
    function runChecks(){
        let full = GameBoard.checkIfFull();
        let win = victoryCheck();
        if(full || win){
            endGame(win);
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

    function endGame(win){
        const textDiv= DomAccess.submitDiv;
        const endGameP = document.createElement("p");
        const endGameDiv = document.createElement("div");
        endGameDiv.id="end-game-div";
        const winText=`Game Over! ${getPlayerTurn.getPlayerName} won!`
        const fullText = "Game Over! It's a tie!"
        win ? endGameP.textContent=winText : endGameP.textContent = fullText;
       
        endGameDiv.appendChild(endGameP);
        textDiv.appendChild(endGameDiv);
        textDiv.style.display="block";
        DomAccess.cells.forEach(cell => {
            cell.removeEventListener("click", Game.setMark);
        })
    }


    return {getPlayerTurn, setMark, victoryCheck, definePlayers, reset};
})();


const DomAccess = (function play(){
    const submit= document.querySelector("#submit");
    const submitDiv= document.querySelector("#div-submit-button");
    const playerInputs = document.querySelectorAll(".player-input");
    const cells= document.querySelectorAll(".cell");
    const newGameButton = document.querySelector("#new-game");

    
    newGameButton.addEventListener("click", ()=>{
        GameBoard.reset();
        Game.reset();
    });

    submit.addEventListener("click", setGame);

    function setGame(){
        playerInputs.forEach(playerInput => playerInput.style.display="none");
        submit.style.display="none";
        submitDiv.style.display="none";
        
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
    
    return{cells, submitDiv, submit, playerInputs}
})();
