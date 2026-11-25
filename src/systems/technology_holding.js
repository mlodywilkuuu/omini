export const TECHNOLOGY_FOCI = [
 {id:'os',name:'Systemy operacyjne',product:'System operacyjny',basePrice:180,margin:.62,description:'Systemy desktopowe, mobilne i platformy urządzeń.'},
 {id:'ai',name:'Sztuczna inteligencja',product:'Model AI',basePrice:260,margin:.68,description:'Modele AI, asystenci i automatyzacja.'},
 {id:'cloud',name:'Chmura i centra danych',product:'Usługa chmurowa',basePrice:210,margin:.58,description:'Hosting, infrastruktura i usługi SaaS.'},
 {id:'chips',name:'Półprzewodniki',product:'Układ scalony',basePrice:320,margin:.48,description:'Procesory, akceleratory i układy specjalizowane.'},
 {id:'robotics',name:'Robotyka',product:'Robot przemysłowy',basePrice:420,margin:.42,description:'Roboty przemysłowe i automatyka.'},
 {id:'security',name:'Cyberbezpieczeństwo',product:'Pakiet bezpieczeństwa',basePrice:160,margin:.72,description:'Ochrona systemów, sieci i danych.'},
 {id:'devices',name:'Urządzenia i elektronika',product:'Urządzenie smart',basePrice:240,margin:.46,description:'Sprzęt konsumencki i urządzenia IoT.'}
];
const focusById=id=>TECHNOLOGY_FOCI.find(x=>x.id===id)||TECHNOLOGY_FOCI[0];
const controlled=c=>Number(c?.share)>=50;
export function ensureTechnologyCompanies(state){
 state.companies??=[];
 for(const c of state.companies){
  c.techFocus??='os';
  c.techStaff=Math.max(0,Math.floor(Number(c.techStaff)||0));
  c.techProducts=Array.isArray(c.techProducts)?c.techProducts:[];
  c.techResearchLevel=Math.max(1,Number(c.techResearchLevel)||1);
 }
 return state.companies;
}
export function setCompanyTechFocus(state,companyId,focusId){
 ensureTechnologyCompanies(state);
 const c=state.companies.find(x=>Number(x.id)===Number(companyId));
 if(!c)throw new Error('Nie znaleziono spółki.');
 if(!controlled(c))throw new Error('Panel strategii wymaga co najmniej 50% udziałów.');
 const focus=focusById(focusId);
 c.techFocus=focus.id;
 c.strategy='technology';
 const listed=(state.market||[]).find(x=>Number(x.subsidiaryId)===Number(c.id));
 if(listed)listed.techFocus=focus.id;
 return {company:c,focus};
}
export function hireTechnologyStaff(state,companyId,count){
 ensureTechnologyCompanies(state);
 const c=state.companies.find(x=>Number(x.id)===Number(companyId));
 if(!c)throw new Error('Nie znaleziono spółki.');
 if(!controlled(c))throw new Error('Możesz zatrudniać tylko w spółce, nad którą masz kontrolę.');
 const n=Math.floor(Number(count));
 if(!Number.isInteger(n)||n<1||n>5000)throw new Error('Zatrudnij od 1 do 5000 pracowników.');
 const cost=n*3500;
 if(state.cash<cost)throw new Error('Za mało gotówki na rekrutację. Koszt: '+cost.toLocaleString('pl-PL')+' zł.');
 state.cash-=cost;
 c.techStaff+=n;
 c.employees=(Number(c.employees)||0)+n;
 c.value=(Number(c.value)||50000)+n*1800;
 return {company:c,count:n,cost,payroll:n*260};
}
export function createTechnologyProduct(state,companyId,{name,price}={}){
 ensureTechnologyCompanies(state);
 const c=state.companies.find(x=>Number(x.id)===Number(companyId));
 if(!c)throw new Error('Nie znaleziono spółki.');
 if(!controlled(c))throw new Error('Możesz rozwijać produkty tylko w spółce, nad którą masz kontrolę.');
 if(c.techStaff<2)throw new Error('Do stworzenia produktu potrzebujesz co najmniej 2 pracowników technologicznych.');
 const productName=String(name||'').trim(),sellPrice=Math.round(Number(price));
 if(productName.length<3||productName.length>48)throw new Error('Nazwa produktu musi mieć od 3 do 48 znaków.');
 if(!Number.isSafeInteger(sellPrice)||sellPrice<50||sellPrice>1000000)throw new Error('Cena produktu musi wynosić od 50 do 1 000 000 zł.');
 if(c.techProducts.some(p=>p.name.toLowerCase()===productName.toLowerCase()))throw new Error('Ta spółka ma już produkt o takiej nazwie.');
 const focus=focusById(c.techFocus),developmentCost=Math.max(25000,Math.round(sellPrice*220));
 if(state.cash<developmentCost)throw new Error('Opracowanie produktu kosztuje '+developmentCost.toLocaleString('pl-PL')+' zł.');
 state.cash-=developmentCost;
 const product={id:state.nextId++,name:productName,focus:focus.id,category:focus.name,price:sellPrice,unitCost:Math.max(1,Math.round(sellPrice*(1-focus.margin))),level:1,createdDay:state.day,unitsSold:0,revenue:0};
 c.techProducts.push(product);
 c.value=(Number(c.value)||50000)+developmentCost;
 return {company:c,product,cost:developmentCost};
}
export function processTechnologyCompaniesDay(state){
 ensureTechnologyCompanies(state);
 let revenue=0,cost=0,units=0;
 for(const c of state.companies){
  const staff=c.techStaff||0,products=c.techProducts||[];
  if(!staff&&!products.length)continue;
  const payroll=staff*260;
  cost+=payroll;
  for(const p of products){
   const focusMatch=p.focus===c.techFocus?1.25:1;
   const capacity=Math.max(0,Math.floor(staff*3*focusMatch*(1+(c.techResearchLevel-1)*.12)));
   const sold=Math.max(0,Math.floor(capacity*(.72+Math.random()*.22)));
   const sales=sold*p.price,production=sold*p.unitCost;
   p.unitsSold=sold;p.revenue=sales;
   revenue+=sales;cost+=production;units+=sold;
   p.level=Math.min(10,Number(p.level)||1);
   c.value=(Number(c.value)||50000)+Math.round(Math.max(0,sales-production)*.025);
  }
 }
 state.techRevenue=revenue;state.techCost=cost;
 return {revenue,cost,units};
}
