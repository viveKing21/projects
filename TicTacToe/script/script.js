const boxes = document.querySelectorAll('.container > *');
const container = document.querySelector('.container');
const notifcation = document.querySelector('.notifcation')
const clear = document.querySelector('.clear');
const user = document.querySelector('.user');
const SelectPlayer = document.getElementById('selectPlayer');
const whoWillStart = document.getElementById('whowillStart')

const scoreWin = document.getElementById('wins');
const scoreLose = document.getElementById('lose');

const currentScore = new WeakMap([[scoreWin, 0], [scoreLose, 0]])

let ai = null;
let human = null;
let currentPlayer = null;
let isGameOver = false;
let mode = ''
let savingStorage = false
let _AI_ = null;
let isMuted = false

const AI_MOVEMENT_SPEED = .5 //sec

let mapAt = [
    null, null, null,
    null, null, null,
    null, null, null
];
const winAt = [
    [0, 4, 8],
    [2, 4, 6],
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
];

//Audio setup
let win = new Audio('sound/win.wav')
let tie = new Audio('sound/tie.wav');
let lose = new Audio('sound/lose.wav')
let tap = {
    x: new Audio('sound/tap1.mp3'),
    o: new Audio('sound/tap2.wav')
} 
function soundChange(element){
    if(isMuted){
        element.children[0].src = 'image/volume-high.png';
        isMuted = false
    }
    else{
        element.children[0].src = 'image/volume-mute.png';
        isMuted = true
    }
}
//setup on load
init()

function reset(shouldIstart = false){
    whoWillStart.style.display = 'none';

    mapAt = Array(9).fill(null);
    boxes.forEach(elem=>{
        elem.innerHTML = ''
        elem.style = null
    })
    container.style.pointerEvents = null
    hideNotification();
    currentPlayer = human
    showTurn();
    isGameOver = false;
    if(shouldIstart)moveAt(_AI_(), ai)
}
function setScore(iWin){
    let wins = currentScore.get(scoreWin);
    let lose = currentScore.get(scoreLose);
    if(iWin){
        wins++
        if(savingStorage){
             localStorage.setItem('win-score', wins);
        }
        currentScore.set(scoreWin, wins);
        scoreWin.innerText = wins
    }
    else{
        lose++
        if(savingStorage){
            localStorage.setItem('lose-score', lose);
        }
        currentScore.set(scoreLose, lose)
        scoreLose.innerText = lose
    }
}
function showTurn(clear = null){
    let msg = currentPlayer == human ? 'Yours Turn!' : 'Ai\'s Turn!';
    msg = clear ? '' : msg;
    container.setAttribute('msg', msg)
}
function showNotification(msg, type = null){
    let notifcation = document.querySelector('.notifcation');
    notifcation.innerText = msg
    notifcation.setAttribute('box', type)
    notifcation.style.display = 'block';
}
function hideNotification(){
    let notifcation = document.querySelector('.notifcation');
    if(notifcation.style.display == 'none') return false;
    notifcation.innerText = ''
    notifcation.style.display = 'none'
}

function _clickHandler({target}){
    if(currentPlayer != human || isGameOver) return false;

    moveAt(parseInt(target.id), human)

    setTimeout(()=>{
        moveAt(_AI_(), ai)
    }, AI_MOVEMENT_SPEED * 1000);
}

function moveAt(index, turn){
   if(index == null || isGameOver) return false;
   
   //move
   boxes[index].innerText = turn;
   mapAt[index] = turn
   currentPlayer = turn == human ? ai:human
   showTurn(true);

   //re-click block
   boxes[index].style.pointerEvents = 'none';
   //if won
   let result = checkWinner();
   if(result){
    isGameOver = true;
       showTurn(true) //clear
       if(result == 'tie') {
        if(!isMuted) tie.play()
        showNotification('Tie!', 'info');
        return false;
       }
       let {winner, at} = result;
       if(winner == ai){
          if(!isMuted) lose.play()
          showNotification(`You (${human}) lose!`, 'error');
          at.map(i=>boxes[i].style.color = 'red')
          setScore(false)
       }
       else{
          if(!isMuted) win.play()
          showNotification(`You (${human}) Won!`);
          at.map(i=>boxes[i].style.color = 'blue')
          setScore(true)
       }
       container.style.pointerEvents = 'none'
   }
   else {
       if(!isMuted) tap[turn].play()
       showTurn()
    }
}
//onload functions
function onclickreset(){
    whoWillStart.style.display = 'flex'
}
function select(selected, cur){
    human = selected;
    ai = selected == 'x' ? 'o':'x';
    cur.style.background = 'rgb(216, 217, 235)';

    if(selected == 'x') cur.nextElementSibling.style.background = ''
    else cur.previousElementSibling.style.background = ''
}
function selectMode(selected, cur){
    _AI_ = selected == 'easy' ? dumbMove : bestMove;
    cur.style.background = 'rgb(216, 217, 235)';
    mode = selected

    if(selected == 'easy') cur.nextElementSibling.style.background = ''
    else cur.previousElementSibling.style.background = ''
}
function start(){
   let errors = '';
   let name = document.getElementById('name').value.trim();
   let rememberChoice = document.getElementById('checkbox').checked;
   
   if(!(ai && human)) errors = "Please select 'x' or 'y'!";
   else if(!_AI_) errors = "Please select mode!"
   else if(!name) errors = "Please enter your name!"
   if(errors) return showNotification(errors, 'error');

   if(rememberChoice) {
       localStorage.setItem('name', name)
       localStorage.setItem('player', human)
       localStorage.setItem('mode', mode)
       clear.style.display = 'block'
   }
   
   currentPlayer = human;
   showTurn();

   user.innerHTML = `${name} - <mode>${mode}</mode><span>${human}</human>`;
   SelectPlayer.style.display = 'none';
   hideNotification();
   scoreWin.parentElement.style.display = 'block'
   document.querySelector('.sound').style.display = 'flex'
}
function clearStorage(){
    localStorage.clear();
    window.location.reload()
}
function init(){
    let name = localStorage.getItem('name');
    let player = localStorage.getItem('player');
    let mode = localStorage.getItem('mode');
    let winScore = localStorage.getItem('win-score');
    let loseScore = localStorage.getItem('lose-score');
    if(name && player && mode){
        user.innerHTML = `${name} - <mode>${mode}</mode><span>${player}</span>`;
        SelectPlayer.style.display = 'none';
        clear.style.display = 'block'

        human = player;
        ai = human == 'x' ? 'o':'x';
        
        _AI_ = mode == 'easy' ? dumbMove : bestMove;
        
        if(loseScore != null){
            currentScore.set(scoreLose, loseScore);
            scoreLose.innerText = loseScore
        }
        if(winScore !== null){
            currentScore.set(scoreWin, winScore);
            scoreWin.innerText = winScore;
        }
        currentPlayer = human
        showTurn();
        savingStorage = true;
        scoreWin.parentElement.style.display = 'block'
        document.querySelector('.sound').style.display = 'flex'
    }
}
function hideReset({target}){
    if(target == this){
       whoWillStart.style.display = 'none'
    }
}
//Add Event
boxes.forEach((element, index)=>{
    element.addEventListener('click', _clickHandler);
})
whoWillStart.addEventListener('click', hideReset)

function dumbMove(){
    const canMoveAt = turn => {
        return winAt.filter((arrayList, index)=>{
          let withData = arrayList.map(ar=>mapAt[ar]);
          if(withData.includes(turn)) return false;
          let extract = withData.filter(a=>a)
          if(extract.length) return true;
          });
    }
    const priority = _MayWin => {
         return _MayWin.map((index, i)=>index.reduce((acc, cur)=>mapAt[cur] ? acc+1:acc,0))
    }
    const riskAt = (priority, _MayWin) => {
         let riskAt = _MayWin[priority.indexOf(2)].map(i=>({index: i, filled: mapAt[i]}));
         let riskPosition;
         if(!riskAt[0].filled) riskPosition = 0
         else if(!riskAt[1].filled) riskPosition = 1
         else if(!riskAt[2].filled) riskPosition = 2
         return riskAt[riskPosition].index
    }
    
    function single(indexList, sec_indexList = null){
        let getIndex = null, searchIn = sec_indexList || indexList
        searching: for(let i = 0; i < indexList.length; i++)
                   {
                     indexList[i].map(winIndex => {
                     if(mapAt[winIndex]) return false;
                     searchIn.map((winMap_, index_b)=>{
                         if(i == index_b && !sec_indexList) return false;
                         if(winMap_.includes(winIndex)) getIndex = winIndex;
                     })
                     })  
                     if(getIndex) break searching;
                   }
         return getIndex
     }
    
    let opponentMayWin = canMoveAt(ai); //remove row if o is in winning position
    let aiMayWin = canMoveAt(human); //remove row if x is in winning position
    
    let givePriorityOpponent = priority(opponentMayWin);
    let givePriority_AI = priority(aiMayWin);

    //In the case if we AI going to win [PRIORITY:MAKE AI WIN]
    if(givePriority_AI.includes(2)) return riskAt(givePriority_AI, aiMayWin)

    //In the case if opponent is going to win
    if(givePriorityOpponent.includes(2)) return riskAt(givePriorityOpponent, opponentMayWin)

    //Strategy A [CHECK IF A AI MAY DEFEAT X AS WELL AS MOVE TOWARDS WIN]
    let xoMultipleWin = single(aiMayWin, opponentMayWin);
    if(xoMultipleWin) return xoMultipleWin

    //Strategy B [CHECK IF A BOX CAN MAKE YOU WINS BY TWO ANGLES]
    let oMultipleWin = single(aiMayWin);
    if(oMultipleWin) return oMultipleWin

    //Strategy C [CHECK IF OPPONENT BOX CAN MAKE YOU WINS BY TWO ANGLES]
    let xMultipleWin = single(opponentMayWin);
    if(xMultipleWin) return xMultipleWin
    
    //Strategy D [IF AI IS NOT WINNING BY TWO ANGLES]
    if(aiMayWin.length){
        let canMoveAt;
        if(!mapAt[aiMayWin[0][0]]) canMoveAt = aiMayWin[0][0]
        else if(!mapAt[aiMayWin[0][1]]) canMoveAt = aiMayWin[0][1]
        else if(!mapAt[aiMayWin[0][2]]) canMoveAt = aiMayWin[0][2]
        return canMoveAt
    }
    //Strategy E [AT FIRST - IF OPPENENT HAVE WINNING PATHS]
    if(opponentMayWin.length){
        let canMoveAt;
        if(!mapAt[opponentMayWin[0][0]]) canMoveAt = opponentMayWin[0][0]
        else if(!mapAt[opponentMayWin[0][1]]) canMoveAt = opponentMayWin[0][1]
        else if(!mapAt[opponentMayWin[0][2]]) canMoveAt = opponentMayWin[0][2]
        return canMoveAt
    }
    
    //in the case if we are playing first 
    let length = mapAt.filter(ar=>ar).length
    if(length == 0) return 4;

    //in the case if one last box left and its our turn
    if(length == 8){
      let lastBox;
      return mapAt.indexOf(null)
    }
}

