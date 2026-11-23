const FORMATS={'Market osiedlowy':{base:8400,cost:85000,emoji:'🏪',expense:.68},'Supermarket':{base:14500,cost:145000,emoji:'🛒',expense:.72},'Sklep convenience':{base:6200,cost:65000,emoji:'🏬',expense:.67},'Drogeria':{base:9200,cost:95000,emoji:'🧴',expense:.69},'Sklep elektroniczny':{base:11000,cost:120000,emoji:'💻',expense:.74}};
export const shopFormats=()=>Object.keys(FORMATS);
export function updateShop(shop,{name,type,city,country}){const format=FORMATS[type],town=(city||'').trim(),nation=(country||'').trim();if(!name?.trim())throw new Error('Wpisz nazwę sklepu.');if(!town||!nation)throw new Error('Podaj miasto i państwo.');if(!format)throw new Error('Wybierz prawidłowy format sklepu.');const potential=({Polska:90,Niemcy:94,Francja:92,Hiszpania:89,'Wielka Brytania':95,USA:100,Japonia:98,Czechy:86,Włochy:91,Holandia:93}[nation]||85);shop.name=name.trim();shop.type=type;shop.city=town;shop.country=nation;shop.district=town+', '+nation;shop.emoji=format.emoji;shop.revenue=Math.round(format.base*potential/90);shop.cost=Math.round(shop.revenue*format.expense);return shop;}
export function closeShop(state,id){const i=state.shops.findIndex(x=>x.id===id);if(i<0)throw new Error('Nie znaleziono sklepu.');const shop=state.shops[i],refund=Math.round(shop.revenue*5);state.shops.splice(i,1);state.cash+=refund;return {shop,refund};}
export const availableDistricts=state=>state.locations||[];
export function openShop(state,{name,type,district,city,country}){
 const format=FORMATS[type],town=(city||district||'').trim(),nation=(country||'Polska').trim();
 if(!name?.trim())throw new Error('Wpisz nazwę sklepu.');
 if(!town)throw new Error('Wpisz miasto, w którym budujesz sklep.');
 if(!format)throw new Error('Wybierz prawidłowy format sklepu.');
 const location=(state.locations||[]).find(x=>x.city.toLowerCase()===town.toLowerCase()&&x.country.toLowerCase()===nation.toLowerCase());
 const potential=location?.potential||({Polska:90,Niemcy:94,Francja:92,Hiszpania:89,'Wielka Brytania':95,USA:100,Japonia:98,Czechy:86,Włochy:91,Holandia:93}[nation]||85);
 const cost=format.cost+(location?0:Math.round(format.cost*.28));
 if(state.cash<cost)throw new Error('Za mało środków. Potrzebujesz '+cost.toLocaleString('pl-PL')+' zł.');
 if(!location)state.locations.push({city:town,country:nation,owned:true,potential});
 const revenue=Math.round(format.base*potential/90),shop={id:state.nextId++,name:name.trim(),type,city:town,country:nation,district:town+', '+nation,revenue,cost:Math.round(revenue*format.expense),emoji:format.emoji};
 state.cash-=cost;state.shops.push(shop);return {...shop,investment:cost};
}
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
 if(!Number.isInteger(quantity)||quantity<1||quantity>1000)throw new Error('Liczba placówek musi wynosić od 1 do 1000.');
 const unitCost=estimateCountryShopCost(type,1),investment=unitCost*quantity;
 if(state.cash<investment)throw new Error('Za mało środków. Potrzebujesz '+investment.toLocaleString('pl-PL')+' zł.');
 const potential=({Polska:90,Niemcy:94,Francja:92,Hiszpania:89,'Wielka Brytania':95,USA:100,Japonia:98,Czechy:86,Włochy:91,Holandia:93}[nation]||85);
 const opened=[];
 for(let i=1;i<=quantity;i++){
  const revenue=Math.round(format.base*potential/90);
  const shop={id:state.nextId++,name:name.trim()+' '+i,type,city:'Cały kraj',country:nation,district:'Cały kraj, '+nation,revenue,cost:Math.round(revenue*format.expense),emoji:format.emoji};
  state.shops.push(shop);opened.push(shop);
 }
 state.cash-=investment;
 return {shops:opened,investment,unitCost};
}
