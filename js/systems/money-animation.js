(function(){
'use strict';
const format=n=>new Intl.NumberFormat('pl-PL',{maximumFractionDigits:0}).format(Math.round(n))+' zł';
const previous=new Map();
const running=new WeakMap();
function animate(el,target,from){
  const old=running.get(el);if(old)cancelAnimationFrame(old);
  const duration=850,start=performance.now(),delta=target-from;
  el.classList.remove('money-up','money-down');void el.offsetWidth;
  el.classList.add(target>from?'money-up':'money-down');
  const step=now=>{
    const p=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-p,3);
    el.textContent=format(from+delta*ease);
    if(p<1)running.set(el,requestAnimationFrame(step));
    else{el.textContent=format(target);running.delete(el);el.classList.remove('money-up','money-down');}
  };
  running.set(el,requestAnimationFrame(step));
  const holder=el.closest('.stat');
  if(holder){
    holder.querySelectorAll('.money-delta').forEach(x=>x.remove());
    const pop=document.createElement('span');pop.className='money-delta '+(delta>0?'positive':'negative');
    pop.textContent=(delta>0?'+':'−')+format(Math.abs(delta));holder.appendChild(pop);
    pop.addEventListener('animationend',()=>pop.remove(),{once:true});
  }
}
function scan(){
  document.querySelectorAll('[data-money-counter][data-value]').forEach(el=>{
    const key=el.dataset.moneyCounter,value=Number(el.dataset.value);
    if(!Number.isFinite(value))return;
    if(previous.has(key)){const before=previous.get(key);if(value!==before)animate(el,value,before);}
    else el.textContent=format(value);
    previous.set(key,value);
  });
}
const root=document.getElementById('content');
if(root){new MutationObserver(()=>requestAnimationFrame(scan)).observe(root,{childList:true,subtree:true});scan();}
})();