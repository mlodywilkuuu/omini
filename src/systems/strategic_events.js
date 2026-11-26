const EVENT_POOL = [
 {id:"cloud-demand",title:"Nagły popyt na chmurę",detail:"Duży klient szuka dostawcy infrastruktury na najbliższe tygodnie.",icon:"☁️",choices:[{id:"scale",label:"Rozbuduj moce obliczeniowe",cost:65000,dailyBonus:7800,days:12,description:"Koszt 65 000 zł · +7 800 zł dziennie przez 12 dni."},{id:"partner",label:"Podpisz umowę partnerską",cost:18000,dailyBonus:3400,days:10,description:"Koszt 18 000 zł · +3 400 zł dziennie przez 10 dni."}]},
 {id:"talent-race",title:"Walka o talenty AI",detail:"Konkurenci rekrutują najlepszych specjalistów. Możesz przyciągnąć zespół do holdingu.",icon:"🧠",choices:[{id:"premium",label:"Zaoferuj pakiet premium",cost:48000,dailyBonus:6100,days:11,description:"Koszt 48 000 zł · +6 100 zł dziennie przez 11 dni."},{id:"lean",label:"Zatrudnij mniejszy zespół",cost:15000,dailyBonus:2600,days:9,description:"Koszt 15 000 zł · +2 600 zł dziennie przez 9 dni."}]},
 {id:"chip-shortage",title:"Niedobór półprzewodników",detail:"Dostawcy zapowiadają ograniczenia. Zabezpiecz dostawy, zanim wzrosną ceny.",icon:"🔬",choices:[{id:"reserve",label:"Zarezerwuj zapasy",cost:72000,dailyBonus:6900,days:13,description:"Koszt 72 000 zł · +6 900 zł dziennie przez 13 dni."},{id:"spot",label:"Kup na rynku spot",cost:22000,dailyBonus:2900,days:8,description:"Koszt 22 000 zł · +2 900 zł dziennie przez 8 dni."}]},
 {id:"global-launch",title:"Okno na globalną ekspansję",detail:"Partner z zagranicy proponuje wspólną kampanię wejścia na nowy rynek.",icon:"🌍",choices:[{id:"launch",label:"Uruchom pełną kampanię",cost:90000,dailyBonus:9800,days:14,description:"Koszt 90 000 zł · +9 800 zł dziennie przez 14 dni."},{id:"pilot",label:"Przetestuj rynek pilotażowo",cost:26000,dailyBonus:3600,days:10,description:"Koszt 26 000 zł · +3 600 zł dziennie przez 10 dni."}]},
 {id:"security-audit",title:"Audyt bezpieczeństwa",detail:"Klient korporacyjny wymaga potwierdzenia standardów bezpieczeństwa przed podpisaniem umowy.",icon:"🛡️",choices:[{id:"full-audit",label:"Zamów pełny audyt",cost:54000,dailyBonus:6400,days:12,description:"Koszt 54 000 zł · +6 400 zł dziennie przez 12 dni."},{id:"quick-audit",label:"Wykonaj audyt ekspresowy",cost:17000,dailyBonus:2500,days:8,description:"Koszt 17 000 zł · +2 500 zł dziennie przez 8 dni."}]}
];

// 50 dodatkowych okazji biznesowych, każda z dwoma wariantami inwestycji.
const EXTRA_EVENT_DATA = [["edge-ai","Boom na urządzenia edge AI","Modele AI uruchamiane bezpośrednio na sprzęcie.","📡"],["green-data","Zielone centra danych","Klienci wybierają dostawców o niskim śladzie energetycznym.","🌱"],["quantum-lab","Wyścig komputerów kwantowych","Uczelnia proponuje wspólne laboratorium badawcze.","⚛️"],["cyber-insurance","Ubezpieczenie cybernetyczne","Broker oferuje polisę dla całej grupy po audycie.","🔐"],["robot-fleet","Automatyzacja magazynów","Sieć logistyczna szuka operatora floty robotów.","🤖"],["fintech-wave","Fala płatności bezgotówkowych","Bank szuka partnera do wdrożenia platformy płatniczej.","💳"],["satellite-net","Internet satelitarny","Operator proponuje hurtowy dostęp do nowej sieci.","🛰️"],["medical-ai","AI w diagnostyce","Sieć klinik szuka narzędzi do analizy obrazów medycznych.","🩺"],["smart-city","Kontrakt smart city","Miasto ogłasza przetarg na czujniki i analizę ruchu.","🏙️"],["game-cloud","Chmura dla graczy","Studio gier chce uruchomić streaming na nowych rynkach.","🎮"],["dev-platform","Platforma dla programistów","Ekosystem aplikacji potrzebuje narzędzi API i CI/CD.","🧑‍💻"],["data-market","Rynek danych biznesowych","Firmy chcą kupować zanonimizowane dane i raporty.","📊"],["battery-tech","Nowa technologia baterii","Startup oferuje licencję na magazynowanie energii.","🔋"],["drone-logistics","Dostawy dronami","Operator szuka partnera do testów dostaw miejskich.","🚁"],["voice-assistant","Asystent głosowy","Producent elektroniki chce zintegrować asystenta z urządzeniami.","🎙️"],["identity-cloud","Tożsamość cyfrowa","Konsorcjum szuka dostawcy bezpiecznego logowania.","🪪"],["ar-retail","Zakupy w rozszerzonej rzeczywistości","Sieć handlowa chce uruchomić wirtualne przymierzalnie.","🥽"],["supply-ai","Prognozowanie łańcucha dostaw","Producent szuka AI do planowania zapasów i dostaw.","🚚"],["microchips","Lokalna fabryka chipów","Region oferuje grant na montaż półprzewodników.","🧩"],["open-source","Ekosystem open source","Projekt open source szuka sponsora i zaplecza komercyjnego.","🧑‍🔬"],["adtech","Nowa sieć reklamowa","Wydawcy szukają alternatywy dla tradycyjnych platform.","📣"],["streaming","Licencje streamingowe","Właściciel katalogu treści proponuje pakiet licencji.","📺"],["smart-home","Ekosystem smart home","Producent chce połączyć urządzenia z usługami chmurowymi.","🏠"],["industrial-iot","Przemysłowy internet rzeczy","Fabryki potrzebują platformy monitorowania maszyn.","🏭"],["language-model","Modele językowe dla firm","Klienci B2B chcą prywatnych modeli hostowanych lokalnie.","💬"],["privacy-suite","Pakiet prywatności danych","Nowe wymogi zwiększają popyt na zarządzanie zgodami.","🕵️"],["cloud-region","Nowy region chmurowy","Klient wymaga lokalnej infrastruktury w kolejnym kraju.","🌐"],["tech-campus","Kampus technologiczny","Samorząd oferuje warunki dla centrum rozwoju technologii.","🏢"],["startup-fund","Fundusz startupowy","Do portfela holdingu może dołączyć kilka młodych spółek.","🚀"],["patent-pool","Wspólny portfel patentów","Konsorcjum oferuje dostęp do patentów sieciowych i AI.","📜"],["autonomous-fleet","Autonomiczna flota","Operator transportowy testuje autonomiczne pojazdy.","🚗"],["warehouse-vision","Wizja komputerowa w logistyce","Centra dystrybucyjne potrzebują rozpoznawania towarów.","📦"],["energy-trading","Handel energią","Partner proponuje platformę optymalizacji zakupów energii.","⚡"],["water-tech","Technologie oszczędzania wody","Zakłady szukają systemu monitorowania zużycia wody.","💧"],["recycling-ai","Robotyka recyklingu","Operator odpadów chce automatycznie sortować surowce.","♻️"],["digital-twin","Cyfrowe bliźniaki fabryk","Producent chce odwzorować zakłady w symulacji cyfrowej.","🪞"],["low-code","Platforma low-code","Firmy szukają automatyzacji bez programowania.","🧱"],["api-economy","Ekonomia API","Partnerzy chcą kupować dostęp do danych i funkcji spółek.","🔌"],["edge-security","Ochrona urządzeń edge","Klienci wymagają zabezpieczenia rozproszonych urządzeń.","🛡️"],["bio-compute","Obliczenia dla biotechnologii","Laboratorium potrzebuje mocy do symulacji molekularnych.","🧬"],["edu-cloud","Chmura edukacyjna","Uczelnie szukają platformy laboratoriów wirtualnych.","🎓"],["retail-analytics","Analityka zachowań klientów","Sieć handlowa chce prognozować popyt i asortyment.","🛒"],["cross-border","Handel transgraniczny","Operator płatności proponuje uproszczone rozliczenia.","🌍"],["translation-ai","Tłumaczenia AI","Platforma e-commerce potrzebuje tłumaczeń ofert.","🗣️"],["observability","Monitoring infrastruktury","Klienci oczekują panelu monitorowania aplikacji i serwerów.","📈"],["backup-cloud","Usługi kopii zapasowych","Firmy szukają dostawcy backupu i odzyskiwania danych.","💾"],["smart-grid","Inteligentna sieć energetyczna","Operator chce analizować obciążenie i przewidywać awarie.","🔌"],["wearables","Urządzenia ubieralne","Producent zegarków szuka platformy analitycznej.","⌚"],["robot-process","Automatyzacja procesów biurowych","Korporacja chce automatyzować dokumenty i powtarzalne procesy.","⚙️"],["digital-bank","Bankowość jako usługa","Fintech proponuje usługi bankowe dla firm.","🏦"]];
EVENT_POOL.push(...EXTRA_EVENT_DATA.map(([id,title,detail,icon],i)=>{
 const tier=i%5, cost=18000+tier*12500+Math.floor(i/5)*1800, bonus=Math.round(cost*(0.105+(i%4)*0.012)), days=8+(i%7);
 return {id,title,detail,icon,choices:[
  {id:'major',label:'Zrealizuj pełną inwestycję',cost:cost*3,dailyBonus:bonus*3,days:days+4,description:'Koszt '+(cost*3).toLocaleString('pl-PL')+' zł · +'+(bonus*3).toLocaleString('pl-PL')+' zł dziennie przez '+(days+4)+' dni.'},
  {id:'pilot',label:'Rozpocznij pilotaż',cost,dailyBonus:bonus,days,description:'Koszt '+cost.toLocaleString('pl-PL')+' zł · +'+bonus.toLocaleString('pl-PL')+' zł dziennie przez '+days+' dni.'}
 ]};
}));
const pick = items => items[Math.floor(Math.random()*items.length)];
export function ensureStrategicEvents(s){
 s.strategicOffers ??= [];
 s.activeStrategicDeals ??= [];
 s.strategicEventHistory ??= [];
 s.nextStrategicOfferDay ??= Math.max(2,Number(s.day)||1)+2;
}
export function processStrategicEventsDay(s){
 ensureStrategicEvents(s);
 s.activeStrategicDeals = s.activeStrategicDeals.filter(deal=>{
  s.cash += Number(deal.dailyBonus)||0;
  deal.daysLeft = Math.max(0,(Number(deal.daysLeft)||0)-1);
  return deal.daysLeft>0;
 });
 if(!s.strategicOffers.length && Number(s.day)>=Number(s.nextStrategicOfferDay)){
  const template=pick(EVENT_POOL);
  const id=(s.nextStrategicEventId=(Number(s.nextStrategicEventId)||0)+1);
  s.strategicOffers.push({...template,eventId:id,createdDay:s.day});
  s.nextStrategicOfferDay=s.day+5+Math.floor(Math.random()*4);
 }
 return {active:s.activeStrategicDeals.length,offers:s.strategicOffers.length};
}
export function resolveStrategicEvent(s,eventId,choiceId){
 ensureStrategicEvents(s);
 const event=s.strategicOffers.find(x=>Number(x.eventId)===Number(eventId));
 if(!event)throw new Error("Ta oferta strategiczna nie jest już dostępna.");
 const choice=event.choices.find(x=>x.id===choiceId);
 if(!choice)throw new Error("Nie znaleziono wybranej decyzji.");
 if(s.cash<choice.cost)throw new Error("Za mało gotówki. Potrzebujesz "+choice.cost.toLocaleString("pl-PL")+" zł.");
 s.cash-=choice.cost;
 s.activeStrategicDeals.push({id:event.eventId,title:event.title,choice:choice.label,dailyBonus:choice.dailyBonus,daysLeft:choice.days,totalDays:choice.days});
 s.strategicOffers=s.strategicOffers.filter(x=>x.eventId!==event.eventId);
 s.strategicEventHistory.unshift({title:event.title,choice:choice.label,day:s.day});
 s.strategicEventHistory=s.strategicEventHistory.slice(0,8);
 return {event,choice};
}
