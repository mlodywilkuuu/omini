const upgrades=[
{id:'marketing',name:'Kampania marketingowa',category:'Sprzedaż',cost:18000,description:'Ogólnokrajowa kampania zwiększa przychody sklepów o 12%.',effect:'revenue',rate:.12},
{id:'training',name:'Akademia pracowników',category:'Zespół',cost:22000,description:'Szkolenia poprawiają obsługę i zwiększają przychody o 8%.',effect:'revenue',rate:.08},
{id:'managers',name:'Regionalni menedżerowie',category:'Zarządzanie',cost:35000,description:'Lepszy nadzór nad placówkami: +6% przychodów.',effect:'revenue',rate:.06},
{id:'loyalty',name:'Program lojalnościowy',category:'Klienci',cost:26000,description:'Punkty i kupony zwiększają przychody o 10%.',effect:'revenue',rate:.10},
{id:'ecommerce',name:'Sklep internetowy',category:'Cyfryzacja',cost:48000,description:'Uruchom sprzedaż online: +15% przychodów.',effect:'revenue',rate:.15},
{id:'delivery',name:'Dostawy do domu',category:'Logistyka',cost:30000,description:'Nowy kanał sprzedaży podnosi przychody o 5%.',effect:'revenue',rate:.05},
{id:'logistics',name:'Optymalizacja tras',category:'Logistyka',cost:24000,description:'Inteligentne trasy obniżają koszty o 8%.',effect:'cost',rate:-.08},
{id:'warehouse',name:'Centralny magazyn',category:'Logistyka',cost:52000,description:'Konsolidacja zapasów obniża koszty o 6%.',effect:'cost',rate:-.06},
{id:'suppliers',name:'Negocjacje z dostawcami',category:'Zakupy',cost:20000,description:'Lepsze warunki zakupowe obniżają koszty o 7%.',effect:'cost',rate:-.07},
{id:'energy',name:'Energooszczędne sklepy',category:'Ekologia',cost:27000,description:'Modernizacja instalacji obniża koszty o 5%.',effect:'cost',rate:-.05},
{id:'analytics',name:'Analityka sprzedaży',category:'Technologia',cost:32000,description:'Decyzje oparte na danych zwiększają przychody o 4%.',effect:'revenue',rate:.04},
{id:'brand',name:'Silna marka grupy',category:'Marketing',cost:65000,description:'Rozpoznawalność marki zwiększa przychody o 9%.',effect:'revenue',rate:.09},
{id:'automation',name:'Automatyzacja procesów',category:'Technologia',cost:70000,description:'Automatyzacja zmniejsza koszty operacyjne o 10%.',effect:'cost',rate:-.10},
{id:'security',name:'System bezpieczeństwa',category:'Bezpieczeństwo',cost:19000,description:'Mniej strat i szkód: koszty niższe o 3%.',effect:'cost',rate:-.03},
{id:'premium',name:'Linia produktów premium',category:'Oferta',cost:42000,description:'Wyższa marża i lepsza oferta: +7% przychodów.',effect:'revenue',rate:.07},
{id:'pricing',name:'Dynamiczne ceny',category:'Analityka',cost:38000,description:'Dopasowanie cen do popytu zwiększa przychody o 8%.',effect:'revenue',rate:.08},
{id:'export',name:'Centrum eksportowe',category:'Ekspansja',cost:85000,description:'Rozwój sprzedaży zagranicznej zwiększa przychody o 10%.',effect:'revenue',rate:.10},
{id:'franchise',name:'Program franczyzowy',category:'Ekspansja',cost:90000,description:'Partnerzy franczyzowi zwiększają przychody grupy o 11%.',effect:'revenue',rate:.11},
{id:'research',name:'Dział badań i rozwoju',category:'Innowacje',cost:110000,description:'Nowe rozwiązania produktowe zwiększają przychody o 5%.',effect:'revenue',rate:.05},
{id:'green',name:'Zielona transformacja',category:'Ekologia',cost:60000,description:'Mniej odpadów i niższe zużycie zasobów: koszty niższe o 5%.',effect:'cost',rate:-.05}
];
export const getUpgrades=()=>upgrades;
export function buyUpgrade(state,id){
 const item=upgrades.find(x=>x.id===id);
 if(!item)throw new Error('Nie znaleziono inwestycji.');
 state.upgrades??=[];
 if(state.upgrades.includes(id))throw new Error('Ta inwestycja jest już aktywna.');
 if(state.cash<item.cost)throw new Error('Za mało gotówki. Potrzeba '+item.cost.toLocaleString('pl-PL')+' zł.');
 state.cash-=item.cost;
 for(const shop of state.shops){
  if(item.effect==='revenue')shop.revenue=Math.round(shop.revenue*(1+item.rate));
  else shop.cost=Math.max(0,Math.round(shop.cost*(1+item.rate)));
 }
 state.upgrades.push(id);
 state.events??=[];
 state.events.unshift({icon:'🚀',title:'Nowa inwestycja: '+item.name,detail:item.description,day:state.day});
 state.events=state.events.slice(0,12);
 return item;
}
