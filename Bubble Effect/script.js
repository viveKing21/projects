var body=document.querySelector('body');

body.onmousemove=body.onmousedown=function(){
var Box=document.createElement('div');
Box.setAttribute("class","animation");
document.body.appendChild(Box);
console.log(event)
Box.style.left=event.clientX-22+"px";
Box.style.top=event.clientY-22+"px";
setTimeout(function(){
Box.remove();
},1000);
}
