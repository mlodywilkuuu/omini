const FORMATS={'Market osiedlowy':{base:8400,cost:85000,emoji:'🏪',expense:.68},'Supermarket':{base:14500,cost:145000,emoji:'🛒',expense:.72},'Sklep convenience':{base:6200,cost:65000,emoji:'🏬',expense:.67},'Drogeria':{base:9200,cost:95000,emoji:'🧴',expense:.69},'Sklep elektroniczny':{base:11000,cost:120000,emoji:'💻',expense:.74}};
export const shopFormats=()=>Object.keys(FORMATS);
export const staffingForFormat=type=>({'Market osiedlowy':3,'Supermarket':5,'Sklep convenience':2,'Drogeria':3,'Sklep elektroniczny':3}[type]||3);
const DAILY_WAGE=180;
export function updateShop(shop,{name,type,country}){const format=FORMATS[type],nation=(country||'').trim();if(!name?.trim())throw new Error('Wpisz nazwę sklepu.');if(!nation)throw new Error('Wybierz państwo.');if(!format)throw new Error('Wybierz prawidłowy format sklepu.');const potential=({Polska:90,Niemcy:94,Francja:92,Hiszpania:89,'Wielka Brytania':95,USA:100,Japonia:98,Czechy:86,Włochy:91,Holandia:93}[nation]||85);shop.name=name.trim();shop.type=type;shop.city='Cały kraj';shop.country=nation;shop.district='Cały kraj, '+nation;shop.emoji=format.emoji;shop.revenue=Math.round(format.base*potential/90);shop.cost=Math.round(shop.revenue*format.expense);return shop;}
export function closeShop(state,id){const i=state.shops.findIndex(x=>x.id===id);if(i<0)throw new Error('Nie znaleziono sklepu.');const shop=state.shops[i],refund=Math.round(shop.revenue*5);state.shops.splice(i,1);state.cash+=refund;return {shop,refund};}
export const availableDistricts=state=>state.locations||[];
export function openShop(state,{name,type,country}){const result=openCountryShops(state,{name,type,country,count:1});return {...result.shops[0],investment:result.investment};}
export function estimateCountryShopCost(type,count){
 const format=FORMATS[type],quantity=Math.floor(Number(count));
 if(!format||!Number.isInteger(quantity)||quantity<1)return 0;
 return Math.round(format.cost*1.28)*quantity;
}
export function openCountryShops(state,{name,type,country,count}){
 const format=FORMATS[type],nation=(country||'').trim(),quantity=Number(count);
 if(!name?.trim())throw new Error('Wpisz nazwę sieci sklepów.');
 if(!nation)throw new Error('Wybierz kraj z podpowiedzi.');
 if(!format)throw new Error('Wybierz prawidłowy format sklepu.');
 if(!Number.isInteger(quantity)||quantity<1||quantity>500000)throw new Error('Liczba placówek musi wynosić od 1 do 500 000.');
 const unitCost=estimateCountryShopCost(type,1),investment=unitCost*quantity;
 if(state.cash<investment)throw new Error('Za mało środków. Potrzebujesz '+investment.toLocaleString('pl-PL')+' zł.');
 const potential=({Polska:90,Niemcy:94,Francja:92,Hiszpania:89,'Wielka Brytania':95,USA:100,Japonia:98,Czechy:86,Włochy:91,Holandia:93}[nation]||85);
 const opened=[];
 for(let i=1;i<=quantity;i++){
  const revenue=Math.round(format.base*potential/90);
  const employees=staffingForFormat(type),payrollCost=employees*DAILY_WAGE;
  const shop={id:state.nextId++,name:name.trim()+' '+i,type,city:'Cały kraj',country:nation,district:'Cały kraj, '+nation,revenue,cost:Math.round(revenue*format.expense)+payrollCost,baseCost:Math.round(revenue*format.expense),employees,payrollCost,emoji:format.emoji};
  state.shops.push(shop);opened.push(shop);
 }
 state.cash-=investment;
 return {shops:opened,investment,unitCost};
}
