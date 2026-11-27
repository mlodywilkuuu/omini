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
