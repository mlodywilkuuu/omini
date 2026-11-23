const FORMATS={
 'Market osiedlowy':{base:8400,cost:85000,emoji:'🏪',expense:.68},
 'Supermarket':{base:14500,cost:145000,emoji:'🛒',expense:.72},
 'Sklep convenience':{base:6200,cost:65000,emoji:'🏬',expense:.67},
 'Drogeria':{base:9200,cost:95000,emoji:'🧴',expense:.69},
 'Sklep elektroniczny':{base:11000,cost:120000,emoji:'💻',expense:.74}
};
export const shopFormats=()=>Object.keys(FORMATS);
export const availableDistricts=state=>state.districts.filter(district=>district.owned);
export function openShop(state,{name,type,district}){
 const format=FORMATS[type],area=state.districts.find(item=>item.name===district);
 if(!name?.trim())throw new Error('Wpisz nazwę sklepu.');
 if(!format||!area?.owned)throw new Error('Nieprawidłowy format lub rejon.');
 if(state.cash<format.cost)throw new Error('Za mało środków na otwarcie sklepu.');
 const revenue=Math.round(format.base*area.potential/90);
 const shop={id:state.nextId++,name:name.trim(),type,district,revenue,cost:Math.round(revenue*format.expense),emoji:format.emoji};
 state.cash-=format.cost;state.shops.push(shop);
 return shop;
}
