const placeInfo={
 workshop:{emoji:"🎁",title:"Warsztat Elfów",copy:"W warsztacie trwa wielka praca! Elfy sortują zabawki, pakują prezenty i sprawdzają listę grzecznych dzieci. Wkrótce dodamy tu interaktywną scenę."},
 house:{emoji:"🏠",title:"Dom Mikołaja",copy:"W kominku wesoło trzaska ogień, a na stole czeka kubek gorącego kakao. To tutaj Mikołaj odpoczywa przed wielką podróżą."},
 stable:{emoji:"🦌",title:"Stajnia Reniferów",copy:"Rudolf i cała drużyna szykują się do lotu. Sprawdź uprzęże, przygotuj marchewki i poznaj świąteczną ekipę."}
};
const modal=document.querySelector("#modal");
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true")}
document.querySelectorAll("[data-place]").forEach(card=>card.addEventListener("click",()=>{
 const place=placeInfo[card.dataset.place];if(!place)return;
 document.querySelector("#modal-emoji").textContent=place.emoji;
 document.querySelector("#modal-title").textContent=place.title;
 document.querySelector("#modal-copy").textContent=place.copy;
 modal.classList.add("open");modal.setAttribute("aria-hidden","false");
}));
document.querySelector("#close").addEventListener("click",closeModal);
document.querySelector("#modal-ok").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});


// Interakcje świata — wszystkie miejsca są dostępne także z klawiatury.
const world=document.querySelector('#village-world');
const snowToggle=document.querySelector('#snow-toggle');
const themeToggle=document.querySelector('#theme-toggle');
const clockNode=document.querySelector('#village-clock');
const visitorNode=document.querySelector('#visitor-count');
if(world){
  const visits=Number(localStorage.getItem('omini-village-visits')||0)+1;
  localStorage.setItem('omini-village-visits',String(visits));
  if(visitorNode)visitorNode.textContent='👣 '+visits+' wizyt';
  const updateClock=()=>{if(clockNode)clockNode.textContent=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit'}).format(new Date())+' · CZAS WIOSKI'};
  updateClock();setInterval(updateClock,30000);
  snowToggle?.addEventListener('click',()=>{const enabled=world.classList.toggle('no-snow')===false;snowToggle.setAttribute('aria-pressed',String(enabled));snowToggle.textContent=enabled?'❄ Śnieg: ON':'❄ Śnieg: OFF'});
  themeToggle?.addEventListener('click',()=>{const day=world.classList.toggle('day-mode');themeToggle.setAttribute('aria-pressed',String(day));themeToggle.textContent=day?'☀ Dzień':'🌙 Noc'});
}
document.querySelector('#santa-hello')?.addEventListener('click',()=>{
  document.querySelector('#modal-emoji').textContent='🎅';
  document.querySelector('#modal-title').textContent='Ho, ho, ho! Witaj w mojej wiosce!';
  document.querySelector('#modal-copy').textContent='Miło Cię widzieć! Elfy pracują w warsztacie, renifery odpoczywają w stajni, a ja sprawdzam listę prezentów. Kliknij miejsca na mapie i pomóż nam przygotować święta!';
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');
});
