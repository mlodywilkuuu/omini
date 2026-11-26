const EVENT_POOL = [
 {id:"cloud-demand",title:"Nagły popyt na chmurę",detail:"Duży klient szuka dostawcy infrastruktury na najbliższe tygodnie.",icon:"☁️",choices:[{id:"scale",label:"Rozbuduj moce obliczeniowe",cost:65000,dailyBonus:7800,days:12,description:"Koszt 65 000 zł · +7 800 zł dziennie przez 12 dni."},{id:"partner",label:"Podpisz umowę partnerską",cost:18000,dailyBonus:3400,days:10,description:"Koszt 18 000 zł · +3 400 zł dziennie przez 10 dni."}]},
 {id:"talent-race",title:"Walka o talenty AI",detail:"Konkurenci rekrutują najlepszych specjalistów. Możesz przyciągnąć zespół do holdingu.",icon:"🧠",choices:[{id:"premium",label:"Zaoferuj pakiet premium",cost:48000,dailyBonus:6100,days:11,description:"Koszt 48 000 zł · +6 100 zł dziennie przez 11 dni."},{id:"lean",label:"Zatrudnij mniejszy zespół",cost:15000,dailyBonus:2600,days:9,description:"Koszt 15 000 zł · +2 600 zł dziennie przez 9 dni."}]},
 {id:"chip-shortage",title:"Niedobór półprzewodników",detail:"Dostawcy zapowiadają ograniczenia. Zabezpiecz dostawy, zanim wzrosną ceny.",icon:"🔬",choices:[{id:"reserve",label:"Zarezerwuj zapasy",cost:72000,dailyBonus:6900,days:13,description:"Koszt 72 000 zł · +6 900 zł dziennie przez 13 dni."},{id:"spot",label:"Kup na rynku spot",cost:22000,dailyBonus:2900,days:8,description:"Koszt 22 000 zł · +2 900 zł dziennie przez 8 dni."}]},
 {id:"global-launch",title:"Okno na globalną ekspansję",detail:"Partner z zagranicy proponuje wspólną kampanię wejścia na nowy rynek.",icon:"🌍",choices:[{id:"launch",label:"Uruchom pełną kampanię",cost:90000,dailyBonus:9800,days:14,description:"Koszt 90 000 zł · +9 800 zł dziennie przez 14 dni."},{id:"pilot",label:"Przetestuj rynek pilotażowo",cost:26000,dailyBonus:3600,days:10,description:"Koszt 26 000 zł · +3 600 zł dziennie przez 10 dni."}]},
 {id:"security-audit",title:"Audyt bezpieczeństwa",detail:"Klient korporacyjny wymaga potwierdzenia standardów bezpieczeństwa przed podpisaniem umowy.",icon:"🛡️",choices:[{id:"full-audit",label:"Zamów pełny audyt",cost:54000,dailyBonus:6400,days:12,description:"Koszt 54 000 zł · +6 400 zł dziennie przez 12 dni."},{id:"quick-audit",label:"Wykonaj audyt ekspresowy",cost:17000,dailyBonus:2500,days:8,description:"Koszt 17 000 zł · +2 500 zł dziennie przez 8 dni."}]}
];
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
