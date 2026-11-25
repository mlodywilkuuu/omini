const DEALS=[
['food','Kantyny i stołówki','Żywność',5200,3450,18,'🍽️','Stałe dostawy do zakładów pracy i stołówek.'],
['office','Zaopatrzenie biur','Artykuły biurowe',3100,1780,24,'🏢','Cykliczne dostawy produktów do biur.'],
['hotel','Sieć hoteli','Hotele',6800,4380,21,'🏨','Dostawy kosmetyków, napojów i produktów codziennych.'],
['school','Placówki edukacyjne','Edukacja',4200,2870,30,'🎓','Umowa na zaopatrzenie szkół i przedszkoli.'],
['fitness','Kluby fitness','Sport',3600,2140,20,'🏋️','Napoje, przekąski i akcesoria dla klubów.'],
['clinic','Przychodnie i kliniki','Zdrowie',4900,3300,26,'🏥','Produkty higieniczne i artykuły codzienne.'],
['construction','Firmy budowlane','Budownictwo',7400,5050,16,'🏗️','Materiały i artykuły dla ekip wykonawczych.'],
['restaurants','Restauracje','Gastronomia',5600,3720,22,'🍴','Regularne dostawy produktów spożywczych.'],
['ecommerce','Operator e-commerce','Handel online',8200,5480,28,'📦','Kompletacja i dostawy produktów do sklepu internetowego.'],
['events','Organizator wydarzeń','Eventy',3900,2380,14,'🎪','Zaopatrzenie imprez i wydarzeń cyklicznych.'],
['public','Instytucje publiczne','Sektor publiczny',9100,6740,35,'🏛️','Długoterminowe zamówienia instytucjonalne.'],
['factory','Zakłady produkcyjne','Przemysł',10500,7620,32,'🏭','Zaopatrzenie pracowników i zaplecza produkcyjnego.']
].map(([id,name,sector,revenue,cost,duration,icon,description])=>({id,name,sector,revenue,cost,duration,icon,description}));
export function getB2BOffers(day=1){const start=(Math.max(1,day)-1)*3%DEALS.length;return Array.from({length:6},(_,i)=>DEALS[(start+i)%DEALS.length]);}
export function acceptB2BContract(state,id){
 const offer=getB2BOffers(state.day).find(x=>x.id===id);if(!offer)throw Error('Ta oferta wygasła. Odśwież panel kontraktów.');
 if(!state.shops.length)throw Error('Najpierw otwórz przynajmniej jeden sklep.');
 state.b2bContracts??=[];if(state.b2bContracts.length>=5)throw Error('Możesz prowadzić maksymalnie 5 kontraktów B2B jednocześnie.');
 if(state.b2bContracts.some(x=>x.id===id))throw Error('Ten kontrakt jest już aktywny.');
 const scale=Math.min(1.8,1+(state.shops.length-1)*.12);
 const contract={...offer,dailyRevenue:Math.round(offer.revenue*scale),dailyCost:Math.round(offer.cost*scale),remainingDays:offer.duration,startedDay:state.day};
 state.b2bContracts.push(contract);return contract;
}
export function processB2BContracts(state){
 state.contractRevenue=0;state.contractCost=0;state.b2bContracts??=[];
 const active=[];
 for(const contract of state.b2bContracts){if(contract.remainingDays<=0)continue;state.contractRevenue+=Number(contract.dailyRevenue)||0;state.contractCost+=Number(contract.dailyCost)||0;contract.remainingDays--;if(contract.remainingDays>0)active.push(contract);else{state.events??=[];state.events.unshift({icon:'📄',title:'Zakończono kontrakt B2B',detail:'Umowa: '+contract.name,day:state.day});}}
 state.b2bContracts=active;return {revenue:state.contractRevenue,cost:state.contractCost,active:active.length};
}
