function bestMove(){
    let bestScore = -Infinity;
    let move = null;
    for(let i in mapAt){
        if(mapAt[i] != null) continue;

        mapAt[i] = ai;
        let score = minimax(mapAt, 0, false);
        mapAt[i] = null;
        if(score > bestScore){
            bestScore = score
            move = parseInt(i);
        }
    }
    return move
}
let score = (key, depth) => {
    key = typeof key == 'object' ? key?.winner:key;
    let scores = {
        [ai]: 10 - depth,
        [human]: depth - 10,
        tie: 0
    }
    return scores[key]
}
function minimax(mapAt, depth, isMaximizing){
    let isWon = checkWinner();
    if(isWon !== null){
        return score(isWon, depth);
    }

    if(isMaximizing){
        let bestScore = -Infinity;
        for(let i in mapAt){
            if(mapAt[i] != null) continue;
            mapAt[i] = ai; 
            let score = minimax(mapAt, depth + 1, false);
            mapAt[i] = null
            bestScore = Math.max(score, bestScore)
        }
        return bestScore
    }
    else{
        let bestScore = Infinity;
        for(let i in mapAt){
            if(mapAt[i] != null) continue;
            mapAt[i] = human;
            let score = minimax(mapAt, depth + 1, true);
            mapAt[i] = null
            bestScore = Math.min(score, bestScore)
        }
        return bestScore
    }

}
function checkWinner(){
    let result = null
    if(!mapAt.includes(null)) result = 'tie'
    for(let win of winAt){
        if(!(mapAt[win[0]] || mapAt[win[2]] || mapAt[win[3]])) continue;
        if(mapAt[win[0]] == mapAt[win[1]] && mapAt[win[0]] == mapAt[win[2]]){
            result = {
                winner: mapAt[win[0]],
                at: win
            }
        }
    }
    return result
}