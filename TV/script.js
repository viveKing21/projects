let screen = document.querySelector(".screen")
let powerBtn = document.querySelector(".power-button")

const PIXEL = 3;

const createBlanckChannel = () => {
    let channel = document.createElement("div")
    channel.className = "channel"

    const cols = Math.floor(screen.offsetWidth / PIXEL);
    const rows = Math.floor(screen.offsetHeight / PIXEL);

    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let pixel_item = document.createElement('div')
            pixel_item.style.height = PIXEL + "px"
            pixel_item.style.width = PIXEL + "px"
            pixel_item.style.background = "black"
            pixel_item.className = "pixel"
            if((i+j) % 2){
                pixel_item.style.background = "white"
                pixel_item.className += " white"
            }
            channel.append(pixel_item)
        }
    }
    screen.append(channel)
}

powerBtn.onclick = () => {
    const isTvOn = screen.querySelector(".channel") != null;

    if(isTvOn){
        screen.innerHTML = ""
    }
    else{
        createBlanckChannel()
    }
}

