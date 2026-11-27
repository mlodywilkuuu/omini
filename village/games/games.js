(()=> {
 const area=document.querySelector("#play-area"),start=document.querySelector("#start"),scoreEl=document.querySelector("#score"),timeEl=document.querySelector("#time"),bestEl=document.querySelector("#best"),result=document.querySelector("#result");
 let score=0,time=20,active=false,timer=null,spawn=null;
 let best=0;try{best=Number(localStorage.getItem("villageGiftBest")||0)}catch(e){}bestEl.textContent=best;
 const gifts=["🎁","🧸","🚂","🪀","🎄","⭐"];
 function spawnGift(){
  if(!active)return;
  const btn=document.createElement("button");btn.className="gift-target";btn.type="button";btn.textContent=gifts[Math.floor(Math.random()*gifts.length)];btn.setAttribute("aria-label","Zapakuj prezent");
  const maxX=Math.max(0,area.clientWidth-48),maxY=Math.max(0,area.clientHeight-48);
  btn.style.left=Math.floor(Math.random()*maxX)+"px";btn.style.top=Math.floor(Math.random()*maxY)+"px";
  btn.addEventListener("click",()=>{if(!active)return;score++;scoreEl.textContent=score;btn.remove();spawnGift()},{once:true});
  area.appendChild(btn);setTimeout(()=>{if(btn.isConnected){btn.remove();if(active)spawnGift()}},1150);
 }
 function endGame(){
  active=false;clearInterval(timer);clearTimeout(spawn);area.querySelectorAll(".gift-target").forEach(x=>x.remove());
  if(score>best){best=score;bestEl.textContent=best;try{localStorage.setItem("villageGiftBest",String(best))}catch(e){}}
  result.textContent="Koniec czasu! Zapakowane prezenty: "+score+". "+(score>=15?"Elfy są z Ciebie dumne!":"Spróbuj jeszcze raz i pobij swój wynik!");
  start.textContent="ZAGRAJ PONOWNIE ↻";
  const msg=document.createElement("div");msg.className="start-message";msg.innerHTML="<span>🎅</span><b>Świetna robota!</b><small>Naciśnij zagraj ponownie, aby spróbować jeszcze raz.</small>";area.appendChild(msg);
 }
 start.addEventListener("click",()=>{
  if(active)return;score=0;time=20;active=true;scoreEl.textContent=score;timeEl.textContent=time;result.textContent="";start.textContent="GRA W TOKU…";area.innerHTML="";
  spawnGift();timer=setInterval(()=>{time--;timeEl.textContent=time;if(time<=0)endGame()},1000);
 });
})();