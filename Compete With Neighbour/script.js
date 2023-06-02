const container = document.querySelector(".container")
const sizeControl = document.querySelector(".size-control")
const sizeInput = sizeControl.querySelector("input")
const startButtonPlayer = document.querySelector(".play-btn.player")
const startButtonOpponent = document.querySelector(".play-btn.opponent")
const loader = document.querySelector(".loader")
const game = document.querySelector(".game")
const playerScore = game.querySelector(".score-player")
const opponentScore = game.querySelector(".score-opponent")
const board = game.querySelector(".board")
const dialog = document.querySelector("dialog")
const dialogMsg = dialog.querySelector(".dialog-msg")
const restart = dialog.querySelector(".restart")

const config = {
    size: 5,
    start: "player",
    current: "player",
    playerScore: 0,
    opponentScore: 0,
    board: [],
    choise: [null, null]
}

// listners

sizeInput.addEventListener("input", changeSize)
startButtonPlayer.addEventListener("click", () => setPlayer("player"))
startButtonOpponent.addEventListener("click", () => setPlayer("opponent"))
restart.addEventListener("click", () => {
    container.setAttribute("state", "pause")
    dialog.close()
})

// functions

function changeSize(){
    sizeControl.setAttribute("size", this.value);
    config.size = parseInt(this.value)
}

function setPlayer(player){
    config.start = player
    config.current = player
    config.playerScore = config.opponentScore = 0;
    playerScore.textContent = opponentScore.textContent = 0

    container.setAttribute("state", "loading")

    setTimeout(() => {
        container.setAttribute("state", "playing")
        startGame()
    }, 2000)
}

function startGame(){
    let list = randomList(config.size)

    board.setAttribute("turn", config.start)
    board.innerHTML = null
    list.forEach(point => {
        let box = document.createElement("div")
        box.textContent = point
        box.setAttribute("point", point)
        box.addEventListener("click", choose.bind(box, false))
        board.appendChild(box)
    })

    board.firstElementChild.setAttribute("option", '')
    board.lastElementChild.setAttribute("option", '')

    config.board = list
    config.choise[0] = board.firstElementChild
    config.choise[1] = board.lastElementChild

    if(config.start == "opponent") AI_()
}

function choose(isAiOpponent = false){
    if(this.hasAttribute("option") == false ||
       this.hasAttribute("player") || 
       this.hasAttribute("opponent") ||
       config.current == "opponent" && isAiOpponent == false) return;


    this.setAttribute(config.current, '')

    let isPlayer = config.current == "player";
    let isLeft = config.choise[0] == this

    let currentScore = parseInt(this.getAttribute("point")) || 0

    if(isPlayer){
        config.playerScore += currentScore;
        playerScore.textContent = config.playerScore
    }
    else{
        config.opponentScore += currentScore
        opponentScore.textContent = config.opponentScore
    }

    config.current = isPlayer ? "opponent":"player"
    board.setAttribute("turn", config.current)

    if(config.choise[0] == config.choise[1]){
        if(config.playerScore > config.opponentScore){
            dialogMsg.innerHTML = "Congrats 🎉 <br>You won the match"
        }
        else if(config.opponentScore > config.playerScore){
            dialogMsg.innerHTML = "Sorry 😯 <br>Better luck next time"
        }
        else{
            dialogMsg.innerHTML = "Tie 😜"
        }
        
        setTimeout(() => dialog.showModal(), 1000)
        return;
    }
    if(isLeft){
        config.choise[0] = this.nextElementSibling
        this.nextElementSibling.setAttribute("option", '')
    }
    else{
        config.choise[1] = this.previousElementSibling
        this.previousElementSibling.setAttribute("option", '')
    }
    if(isPlayer){
        AI_()
    }
}

function AI_(){
    let list = config.board
    let dp = new Array(list.length+1).fill(list.length+1).map(l => new Array(l).fill(-1));
    
    let pick = 0

    const solve = (s, e) => {
        if(s > e) return 0;
        if(s == e) return list[s]

        if(dp[s][e] != -1) return dp[s][e];
        let op1 = list[s] + Math.min(solve(s+2, e), solve(s+1, e-1))
        let op2 = list[e] + Math.min(solve(s+1, e-1), solve(s, e-2))

        pick = op1 > op2 ? 0:1
        return dp[s][e] = Math.max(op1, op2)
    }

    let childrens = Array.from(board.children)
    let start = childrens.indexOf(config.choise[0])
    let end = childrens.lastIndexOf(config.choise[1])

    solve(start, end)
    setTimeout(choose.bind(config.choise[pick], true), randomBetween(100, 4000))
}

// utils

function randomList(size){
    return new Array(size).fill(0).map(() => randomBetween(1, 99))
}

function randomBetween(min, max){
    return Math.floor((Math.random() * max - min) + min)
}