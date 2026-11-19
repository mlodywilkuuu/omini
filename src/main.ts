import "./style.css";

type Party = { id:number; name:string; short:string; color:string; seats:number; support:number; ideology:string };
type Bill = { id:number; title:string; category:string; cost:number; support:number; status:"Oczekuje"|"Uchwalona"|"Odrzucona" };
type State = { day:number; month:number; year:number; money:number; gdp:number; inflation:number; unemployment:number; trust:number; party:Party; parties:Party[]; bills:Bill[]; log:string[]; coalition:number[]; tab:string };

const defaults: Party[] = [
  {id:2,name:"Koalicja Obywatelska",short:"KO",color:"#e9c46a",seats:157,support:29,ideology:"Centrum"},
  {id:3,name:"Prawo i Sprawiedliwość",short:"PiS",color:"#3a86ff",seats:194,support:32,ideology:"Konserwatyzm"},
  {id:4,name:"Trzecia Droga",short:"TD",color:"#2a9d8f",seats:33,support:8,ideology:"Centrum"},
  {id:5,name:"Lewica",short:"Lewica",color:"#e76f91",seats:26,support:9,ideology:"Lewica"},
  {id:6,name:"Konfederacja",short:"Konf.",color:"#9b8afb",seats:50,support:12,ideology:"Prawica"}
];
let state:State = {
  day:1,month:1,year:2026,money:842,gdp:3.1,inflation:4.2,unemployment:5.1,trust:48,
  party:{id:1,name:"Nowa Polska",short:"NP",color:"#70d6a5",seats:0,support:3,ideology:"Do ustalenia"},
  parties:defaults,bills:[
    {id:1,title:"Program modernizacji kolei regionalnych",category:"Infrastruktura",cost:18,support:62,status:"Oczekuje"},
    {id:2,title:"Uproszczenie podatku dochodowego",category:"Gospodarka",cost:7,support:48,status:"Oczekuje"},
    {id:3,title:"Fundusz wsparcia szpitali powiatowych",category:"Zdrowie",cost:12,support:71,status:"Oczekuje"}
  ],log:["Rozpoczęto nową kadencję symulatora.","Utworzono klub parlamentarny — Nowa Polska."],coalition:[],tab:"start"
};

const $ = <T extends HTMLElement>(selector:string) => document.querySelector<T>(selector)!;
const money = (n:number) => n.toLocaleString("pl-PL",{maximumFractionDigits:1})+" mld zł";
const totalSeats = () => state.parties.reduce((s,p)=>s+p.seats,0)+state.party.seats;
const majority = () => Math.floor(totalSeats()/2)+1;
const addLog = (message:string) => { state.log.unshift(`\u0000${dateLabel()}: ${message}`.replace("\u0000","")); state.log=state.log.slice(0,30); };
const dateLabel = () => `${String(state.day).padStart(2,"0")}.${String(state.month).padStart(2,"0")}.${state.year}`;
const allParties = () => [state.party,...state.parties];
const fmt = (n:number) => Math.round(n).toLocaleString("pl-PL");

function render(){
  const tabs=[["start","Przegląd"],["party","Moja partia"],["sejm","Sejm"],["bills","Ustawy"],["election","Wybory"],["economy","Gospodarka"],["diplomacy","Koalicje"]];
  $("#app").innerHTML=`
  <div class="shell">
    <aside class="sidebar">
      <div class="brand"><div class="brand-mark">§</div><div><b>PARLAMENT</b><small>POLSKA · SANDBOX</small></div></div>
      <div class="season"><span class="live-dot"></span> KADENCJA 2023–2027</div>
      <nav>${tabs.map(([id,label])=>`<button class="nav-item ${state.tab===id?"active":""}" data-tab="${id}"><span class="nav-icon">${({start:"▦",party:"♟",sejm:"▤",bills:"§",election:"◉",economy:"↗",diplomacy:"⇄"} as Record<string,string>)[id]}</span>${label}</button>`).join("")}</nav>
      <div class="sidebar-bottom"><div class="player-chip"><div class="avatar">${state.party.short.slice(0,2)}</div><div><b>${esc(state.party.name)}</b><small>PREZES PARTII</small></div></div><button class="subtle-btn" id="reset">↻ Nowa rozgrywka</button></div>
    </aside>
    <main class="main">
      <header class="topbar"><div><span class="eyebrow">RZECZPOSPOLITA POLSKA</span><h1>${tabs.find(t=>t[0]===state.tab)?.[1]}</h1></div><div class="top-meta"><div class="datebox"><small>DATA W GRZE</small><b>${dateLabel()}</b></div><button class="advance" id="next-day">Następny dzień <span>→</span></button></div></header>
      <section class="content">${pageContent()}</section>
    </main>
  </div>`;
  document.querySelectorAll<HTMLElement>("[data-tab]").forEach(el=>el.onclick=()=>{state.tab=el.dataset.tab!;render()});
  $("#next-day").onclick=nextDay;
  $("#reset").onclick=()=>{if(confirm("Rozpocząć nową rozgrywkę?")){state=structuredClone(defaultsState);render()}};
  bindActions();
}
const defaultsState=structuredClone(state);
function pageContent():string {
 switch(state.tab){
 case "party":return partyPage();
 case "sejm":return sejmPage();
 case "bills":return billsPage();
 case "election":return electionPage();
 case "economy":return economyPage();
 case "diplomacy":return diplomacyPage();
 default:return dashboard();
 }
}
function dashboard(){return `
 <div class="welcome"><div><span class="eyebrow">CENTRUM DOWODZENIA</span><h2>Witaj w polityce.</h2><p>Każda decyzja ma konsekwencje. Zbuduj poparcie, zdobądź mandaty i zmieniaj Polskę.</p></div><div class="welcome-stamp">RP<br><b>2026</b></div></div>
 <div class="stats-grid">
 ${stat("Poparcie społeczne",state.party.support.toFixed(1)+"%","Twoja partia","↗")}
 ${stat("Mandaty",String(state.party.seats),"na 460 w Sejmie","♟")}
 ${stat("Budżet państwa",money(state.money),"dostępne środki"," zł")}
 ${stat("Zaufanie do rządu",state.trust+"%","nastroje społeczne","◎")}
 </div>
 <div class="two-col"><div class="panel"><div class="panel-head"><div><span class="eyebrow">UKŁAD SIŁ</span><h3>Rozkład mandatów</h3></div><span class="tag">Sejm · ${totalSeats()}/460</span></div><div class="seatbar">${allParties().map(p=>`<i style="width:${p.seats/460*100}%;background:${p.color}" title="${esc(p.name)}"></i>`).join("")}</div><div class="party-list">${allParties().sort((a,b)=>b.seats-a.seats).map(p=>`<div class="party-row"><span class="party-dot" style="background:${p.color}"></span><span class="party-name">${esc(p.short)}</span><b>${p.seats}</b><small>${p.support}%</small></div>`).join("")}</div></div>
 <div class="panel"><div class="panel-head"><div><span class="eyebrow">PAŃSTWO</span><h3>Wskaźniki gospodarcze</h3></div><span class="tag positive">LIVE</span></div><div class="metric"><span>Wzrost PKB</span><b class="positive">+${state.gdp.toFixed(1)}%</b></div><div class="metric"><span>Inflacja</span><b>${state.inflation.toFixed(1)}%</b></div><div class="metric"><span>Bezrobocie</span><b>${state.unemployment.toFixed(1)}%</b></div><div class="metric"><span>Budżet</span><b>${money(state.money)}</b></div></div></div>
 <div class="two-col lower"><div class="panel"><div class="panel-head"><div><span class="eyebrow">AKTUALNOŚCI</span><h3>Dziennik wydarzeń</h3></div></div><div class="timeline">${state.log.slice(0,5).map(x=>`<div class="timeline-item"><i></i><span>${esc(x)}</span></div>`).join("")}</div></div><div class="panel callout"><span class="eyebrow">NAJBLIŻSZY KROK</span><h3>Zbuduj rozpoznawalną partię</h3><p>Ustal program, wybierz priorytety i rozpocznij kampanię, aby zwiększyć poparcie.</p><button class="primary" data-tab="party">Zarządzaj partią →</button></div></div>`; }
function stat(label:string,value:string,sub:string,icon:string){return `<div class="stat-card"><div class="stat-top"><span>${label}</span><i>${icon}</i></div><strong>${value}</strong><small>${sub}</small></div>`;}
function partyPage(){return `<div class="page-intro"><div><span class="eyebrow">TWÓJ RUCH POLITYCZNY</span><h2>${esc(state.party.name)}</h2><p>To Twoje ugrupowanie. Kształtuj jego tożsamość i zdobywaj wyborców.</p></div><span class="big-initial">${esc(state.party.short.slice(0,2))}</span></div><div class="two-col"><div class="panel"><h3>Profil partii</h3><label>Nazwa ugrupowania<input id="party-name" value="${esc(state.party.name)}" maxlength="36"></label><label>Skrót<input id="party-short" value="${esc(state.party.short)}" maxlength="8"></label><label>Kolor identyfikacji<select id="party-color"><option value="#70d6a5">Miętowy</option><option value="#e76f91">Różowy</option><option value="#e9c46a">Złoty</option><option value="#3a86ff">Niebieski</option><option value="#9b8afb">Fioletowy</option><option value="#f28c52">Pomarańczowy</option></select></label><label>Profil ideowy<select id="ideology"><option>Do ustalenia</option><option>Centrum</option><option>Centroprawica</option><option>Konserwatyzm</option><option>Liberalizm</option><option>Lewica</option><option>Zielona polityka</option><option>Libertarianizm</option></select></label><button class="primary" id="save-party">Zapisz zmiany</button></div><div class="panel"><h3>Rozwijaj poparcie</h3><p class="muted">Wybierz działanie polityczne. Każde kosztuje środki kampanijne i przesuwa poparcie.</p><div class="action-card"><div><b>Spotkanie z wyborcami</b><small>+0,4–1,0 pp · koszt 1 mln zł</small></div><button data-action="meet">Zorganizuj</button></div><div class="action-card"><div><b>Kampania w mediach</b><small>+0,7–1,5 pp · koszt 3 mln zł</small></div><button data-action="media">Uruchom</button></div><div class="action-card"><div><b>Konwencja programowa</b><small>+1,0–2,0 pp · koszt 5 mln zł</small></div><button data-action="convention">Zorganizuj</button></div><div class="metric"><span>Aktualne poparcie</span><b>${state.party.support.toFixed(1)}%</b></div></div></div>`;}
function sejmPage(){return `<div class="page-intro"><div><span class="eyebrow">IZBA NIŻSZA PARLAMENTU</span><h2>Sejm Rzeczypospolitej</h2><p>460 posłów · większość bezwzględna: ${majority()} głosów</p></div><div class="seat-total"><b>460</b><small>MANDATÓW</small></div></div><div class="panel"><div class="panel-head"><h3>Kluby i koła parlamentarne</h3><span class="tag">Kadencja X</span></div>${allParties().sort((a,b)=>b.seats-a.seats).map(p=>`<div class="seat-party"><div class="seat-party-name"><span class="party-dot" style="background:${p.color}"></span><b>${esc(p.name)}</b><small>${esc(p.ideology)}</small></div><div class="seat-track"><i style="width:${p.seats/460*100}%;background:${p.color}"></i></div><strong>${p.seats}</strong></div>`).join("")}<div class="majority-line"><span>Próg większości</span><b>${majority()} mandatów</b></div></div><div class="panel"><h3>Skład prezydium i praca izby</h3><p class="muted">Wybieraj kierunki działań i proceduj projekty ustaw w zakładce Ustawy.</p><button class="primary" data-tab="bills">Przejdź do projektów ustaw →</button></div>`;}
function billsPage(){return `<div class="page-intro"><div><span class="eyebrow">PROCES LEGISLACYJNY</span><h2>Projekty ustaw</h2><p>Składaj projekty, przekonuj posłów i obserwuj skutki głosowań.</p></div><button class="primary" id="new-bill">＋ Nowy projekt</button></div><div class="bill-list">${state.bills.map(b=>`<div class="panel bill"><div class="bill-top"><span class="tag">${esc(b.category)}</span><span class="status ${b.status==="Uchwalona"?"positive":b.status==="Odrzucona"?"negative":""}">${b.status}</span></div><h3>${esc(b.title)}</h3><div class="bill-meta"><span>Szacowany koszt: <b>${b.cost} mld zł</b></span><span>Poparcie posłów: <b>${b.support}%</b></span></div><div class="progress"><i style="width:${b.support}%"></i></div>${b.status==="Oczekuje"?`<div class="bill-actions"><button class="primary" data-vote="${b.id}">Rozpocznij głosowanie</button><button data-lobby="${b.id}">Przekonuj posłów</button></div>`:""} </div>`).join("")}</div>`;}
function electionPage(){return `<div class="page-intro"><div><span class="eyebrow">DEMOKRACJA</span><h2>Wybory parlamentarne</h2><p>Wybory rozstrzygają o podziale 460 mandatów. Uruchom kampanię lub przeprowadź przedterminowe głosowanie.</p></div><div class="seat-total"><b>${state.party.support.toFixed(1)}%</b><small>SONDAŻ NP</small></div></div><div class="panel"><div class="panel-head"><h3>Aktualny sondaż poparcia</h3><span class="tag">Symulacja</span></div>${allParties().sort((a,b)=>b.support-a.support).map(p=>`<div class="poll-row"><span class="party-dot" style="background:${p.color}"></span><b>${esc(p.short)}</b><div class="poll-track"><i style="width:${Math.min(p.support,100)}%;background:${p.color}"></i></div><strong>${p.support.toFixed(1)}%</strong></div>`).join("")}<p class="muted tiny">Wyniki sondażu są generowane przez symulator i nie stanowią rzeczywistych danych politycznych.</p></div><div class="panel"><h3>Decyzje wyborcze</h3><p class="muted">Wybory można przeprowadzić w dowolnym momencie trybu sandbox. Rozstrzygnięcie przeliczy poparcie na mandaty metodą proporcjonalną, z progiem 5%.</p><button class="primary" id="election-now">Zarządź wybory parlamentarne</button></div>`;}
function economyPage(){return `<div class="page-intro"><div><span class="eyebrow">FINANSE PUBLICZNE</span><h2>Gospodarka i budżet</h2><p>Stan gospodarki wpływa na nastroje społeczne i szanse wyborcze.</p></div></div><div class="stats-grid">${stat("Budżet",money(state.money),"saldo dostępne"," zł")}${stat("PKB","+"+state.gdp.toFixed(1)+"%","wzrost roczny","↗")}${stat("Inflacja",state.inflation.toFixed(1)+"%","wskaźnik cen","%")}${stat("Bezrobocie",state.unemployment.toFixed(1)+"%","stopa bezrobocia","◎")}</div><div class="panel"><h3>Instrumenty polityki gospodarczej</h3><p class="muted">Decyzje wpływają na budżet i wskaźniki. Skutki są rozliczane w kolejnych dniach.</p><div class="action-card"><div><b>Inwestycje infrastrukturalne</b><small>Koszt 10 mld zł · impuls dla PKB</small></div><button data-economy="infra">Zainwestuj</button></div><div class="action-card"><div><b>Pakiet antyinflacyjny</b><small>Koszt 8 mld zł · presja na inflację</small></div><button data-economy="anti">Wprowadź</button></div><div class="action-card"><div><b>Program aktywizacji zawodowej</b><small>Koszt 6 mld zł · walka z bezrobociem</small></div><button data-economy="jobs">Uruchom</button></div></div>`;}
function diplomacyPage(){return `<div class="page-intro"><div><span class="eyebrow">NEGOCJACJE POLITYCZNE</span><h2>Koalicje i porozumienia</h2><p>Większość sejmowa wymaga co najmniej ${majority()} głosów.</p></div><div class="seat-total"><b>${state.coalition.reduce((s,id)=>s+(allParties().find(p=>p.id===id)?.seats||0),0)+state.party.seats}</b><small>MANDATÓW BLOKU</small></div></div><div class="panel"><h3>Potencjalni partnerzy</h3>${state.parties.map(p=>`<div class="action-card"><div><b>${esc(p.name)}</b><small>${p.seats} mandatów · ${p.support}% poparcia · ${esc(p.ideology)}</small></div><button data-coalition="${p.id}">${state.coalition.includes(p.id)?"Wypowiedz umowę":"Zaproponuj koalicję"}</button></div>`).join("")}<div class="coalition-total"><span>Łączna siła koalicji</span><b>${state.coalition.reduce((s,id)=>s+(allParties().find(p=>p.id===id)?.seats||0),0)+state.party.seats} / 460</b></div></div>`;}
function bindActions(){
  document.querySelectorAll<HTMLElement>("[data-action]").forEach(b=>b.onclick=()=>campaign(b.dataset.action!));
  $("#save-party")?.addEventListener("click",()=>{state.party.name=($("#party-name") as HTMLInputElement).value.trim()||state.party.name;state.party.short=($("#party-short") as HTMLInputElement).value.trim()||state.party.short;state.party.color=($("#party-color") as HTMLSelectElement).value;state.party.ideology=($("#ideology") as HTMLSelectElement).value;addLog("Zmieniono profil partii.");render()});
  $("#new-bill")?.addEventListener("click",()=>{const title=prompt("Tytuł projektu ustawy:");if(!title?.trim())return;const cost=Number(prompt("Szacowany koszt w mld zł:", "2"));if(!Number.isFinite(cost)||cost<0)return;state.bills.unshift({id:Date.now(),title:title.trim(),category:"Nowy projekt",cost,support:Math.round(35+Math.random()*35),status:"Oczekuje"});addLog(`Złożono projekt ustawy: ${title.trim()}.`);render()});
  document.querySelectorAll<HTMLElement>("[data-vote]").forEach(b=>b.onclick=()=>vote(Number(b.dataset.vote)));
  document.querySelectorAll<HTMLElement>("[data-lobby]").forEach(b=>b.onclick=()=>lobby(Number(b.dataset.lobby)));
  $("#election-now")?.addEventListener("click",()=>{if(confirm("Zarządzić wybory parlamentarne? Aktualny skład Sejmu zostanie zastąpiony."))holdElection()});
  document.querySelectorAll<HTMLElement>("[data-coalition]").forEach(b=>b.onclick=()=>{const id=Number(b.dataset.coalition);state.coalition=state.coalition.includes(id)?state.coalition.filter(x=>x!==id):[...state.coalition,id];addLog("Zaktualizowano rozmowy koalicyjne.");render()});
  document.querySelectorAll<HTMLElement>("[data-economy]").forEach(b=>b.onclick=()=>economyAction(b.dataset.economy!));
  document.querySelectorAll<HTMLElement>("[data-tab]").forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab!;render()});
}
function campaign(kind:string){const data:Record<string,[number,number,number,string]>={meet:[1,.4,.6,"Spotkanie z wyborcami"],media:[3,.7,1.5,"Kampania medialna"],convention:[5,1,2,"Konwencja programowa"]};const [cost,min,max,label]=data[kind];if(state.money<cost){alert("Za mało środków w budżecie.");return}state.money-=cost;state.party.support=Math.min(49.5,state.party.support+min+Math.random()*(max-min));addLog(`${label}: wzrost poparcia partii.`);render()}
function vote(id:number){const bill=state.bills.find(b=>b.id===id);if(!bill)return;const support=Math.max(0,Math.min(100,bill.support+(state.coalition.length?8:0)+(state.party.seats>0?3:0)));const yes=Math.round(460*support/100);const passed=yes>=231&&state.money>=bill.cost;bill.status=passed?"Uchwalona":"Odrzucona";if(passed){state.money-=bill.cost;state.trust=Math.min(100,state.trust+1.5);state.gdp+=.1}else{state.trust=Math.max(0,state.trust-.5)}addLog(`Głosowanie nad projektem „${bill.title}”: ${yes} za, ${460-yes} przeciw. ${passed?"Ustawa uchwalona.":"Projekt odrzucony."}`);render()}
function lobby(id:number){const b=state.bills.find(x=>x.id===id);if(!b)return;if(state.money<2){alert("Brak środków na negocjacje.");return}state.money-=2;b.support=Math.min(95,b.support+8+Math.random()*5);addLog(`Przeprowadzono konsultacje w sprawie: ${b.title}.`);render()}
function economyAction(kind:string){const opts:Record<string,[number,string]>={infra:[10,"Inwestycje infrastrukturalne"],anti:[8,"Pakiet antyinflacyjny"],jobs:[6,"Program aktywizacji zawodowej"]};const [cost,label]=opts[kind];if(state.money<cost){alert("Brak środków w budżecie.");return}state.money-=cost;if(kind==="infra")state.gdp+=.25;if(kind==="anti")state.inflation=Math.max(0,state.inflation-.35);if(kind==="jobs")state.unemployment=Math.max(0,state.unemployment-.25);state.trust=Math.min(100,state.trust+1);addLog(`Uruchomiono: ${label}.`);render()}
function holdElection(){const parties=allParties();const sum=parties.reduce((s,p)=>s+p.support,0);const eligible=parties.filter(p=>p.support>=5);const eligibleSum=eligible.reduce((s,p)=>s+p.support,0);let allocated=0;eligible.forEach(p=>{p.seats=Math.floor(p.support/eligibleSum*460);allocated+=p.seats});eligible.sort((a,b)=>(b.support/eligibleSum*460-Math.floor(b.support/eligibleSum*460))-(a.support/eligibleSum*460-Math.floor(a.support/eligibleSum*460)));for(let i=0;i<460-allocated;i++)eligible[i%eligible.length].seats++;parties.filter(p=>!eligible.includes(p)).forEach(p=>p.seats=0);state.coalition=[];addLog(`Zakończono wybory parlamentarne. Rozdzielono 460 mandatów (poparcie łączne ${sum.toFixed(1)}%).`);state.tab="sejm";render()}
function nextDay(){state.day++;if(state.day>30){state.day=1;state.month++;if(state.month>12){state.month=1;state.year++}}state.money+=.08;state.gdp+=(Math.random()-.48)*.04;state.inflation=Math.max(0,state.inflation+(Math.random()-.52)*.035);state.unemployment=Math.max(0,state.unemployment+(Math.random()-.55)*.02);state.trust=Math.max(5,Math.min(95,state.trust+(Math.random()-.5)*.5));state.parties.forEach(p=>p.support=Math.max(1,Math.min(45,p.support+(Math.random()-.5)*.12)));addLog("Minął kolejny dzień. Zaktualizowano wskaźniki państwa.");render()}
function esc(s:string){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!))}
render();
