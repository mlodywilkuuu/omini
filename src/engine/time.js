export function createGameClock(onDay,{dayLengthMs=30000,initialSpeed=1}={}){
 let speed=initialSpeed,timer=null,disposed=false;
 const allowed=[0,1,2,4,8];
 const stop=()=>{if(timer!==null){clearInterval(timer);timer=null;}};
 const start=()=>{stop();if(disposed||speed===0)return;timer=setInterval(()=>{if(!document.hidden)onDay();},dayLengthMs/speed);};
 const setSpeed=value=>{
  const next=Number(value);
  speed=allowed.includes(next)?next:1;
  start();
  return speed;
 };
 const dispose=()=>{disposed=true;stop();};
 const getSpeed=()=>speed;
 document.addEventListener('visibilitychange',start);
 return {setSpeed,getSpeed,dispose};
}
