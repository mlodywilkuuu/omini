const FORMATS={'Market osiedlowy':{base:8400,cost:85000,emoji:'🏪',expense:.68},'Supermarket':{base:14500,cost:145000,emoji:'🛒',expense:.72},'Sklep convenience':{base:6200,cost:65000,emoji:'🏬',expense:.67},'Drogeria':{base:9200,cost:95000,emoji:'🧴',expense:.69},'Sklep elektroniczny':{base:11000,cost:120000,emoji:'💻',expense:.74}};
export const shopFormats=()=>Object.keys(FORMATS);
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