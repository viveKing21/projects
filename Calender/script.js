
	var dateHere=document.querySelector('.dateHere');
	var date=new Date();
	var list=document.querySelector('.yearSel'),remove,removeM;
    var curYear,curMonth,clear=false;
    window.onload=function(){
    	curYear=date.getFullYear();
    	curMonth=date.getMonth();
    	showCal(curYear,curMonth,clear);
    	document.querySelector('[data-date]').innerText=date.getDate();
        monthlist.scrollTo(0,document.querySelector('[data-month="'+months[curMonth]+'"').offsetTop-document.querySelector("#monthList").offsetHeight/2);
    }
	//year showing
	var Ylist=document.querySelector('#yearList');
	for(var i=1980; i<=date.getFullYear(); i++)
	{
		Ylist.innerHTML+="<div onclick='changeYear(this)' data-year='"+i+"'>"+i+"</div>";
		Ylist.scrollTo(0,Ylist.scrollHeight);
	}

	//showing date
	function showCal(year,month,clear){
		if(clear)
		{
			dateHere.innerHTML="";
		}
	var modDate=new Date(year,month,1);
	var ttDays=new Date(year,month+1,0);
	var j=1;
	for(var i=0; i<ttDays.getDate()+modDate.getDay(); i++)
	{
		var myDiv=document.createElement('div');
		dateHere.append(myDiv);
		if(i >= modDate.getDay())
		{
			if(j==date.getDate() && year==date.getFullYear() && month==date.getMonth())
				myDiv.classList.add('tdate');
			myDiv.innerText=j;
			j++
		}
	}
	document.querySelector('[data-selYear]').innerText=year;
	document.querySelector('#monthname').innerText=months[month];
	for(var i=0; i<months.length; i++)
	{
		if(i==month)
		{
			document.querySelector('[data-month="'+months[i]+'"]').classList.add('selMonth');
		}
		else
			document.querySelector('[data-month="'+months[i]+'"]').classList.remove('selMonth');
	} 
	
	for(var i=1980; i<=date.getFullYear(); i++)
	{
		if(i==year)
			document.querySelector('[data-year="'+i+'"]').classList.add('selYear');
		else
			document.querySelector('[data-year="'+i+'"]').classList.remove('selYear');
	}
	clear=false;
	
}
//on year change
function changeYear(year){
	curYear=year.innerText;
	clear=true;
    showCal(curYear,curMonth,clear);
}
//show list on click

function showList()
{
	
   list.style.cssText="pointer-events:auto; opacity:1";
   remove=setTimeout(function(){
   	list.removeAttribute('style')
   },5000)
}
list.onmouseenter=function(){
	clearTimeout(remove);
}
list.onmouseleave=function(){
	list.removeAttribute('style')
}
//showing months
var months=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
var monthlist=document.querySelector('#monthList');
for(var i=0; i<months.length; i++)
{
	monthlist.innerHTML+="<div onclick='changeMonth(this)' data-month='"+months[i]+"'>"+months[i].slice(0,3)+"</div>";
}


//onchange month
function changeMonth(month)
{
	clear=true;
	for(var i=0; i<months.length; i++)
	{
		if(months[i]==month.getAttribute('data-month'))
		{
			curMonth=i;
			showCal(curYear,curMonth,clear);
			break;
		}
	}
}
//show month list
var mList=document.querySelector('.monthSel');
function showMonthList(){
   mList.style.cssText="opacity:1;pointer-events:auto";
    removeM=setTimeout(function(){
   	mList.removeAttribute('style')
   },5000)
}
mList.onmouseenter=function(){
	clearTimeout(removeM);
}
mList.onmouseleave=function(){
	mList.removeAttribute('style');
}