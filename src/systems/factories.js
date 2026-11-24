export const factoryProducts=[
{id:'bread',name:'Chleb pszenny',category:'Żywność',price:12,cost:6,factoryCost:320000,capacity:900,dailyCost:900},
{id:'milk',name:'Mleko UHT 1 l',category:'Nabiał',price:7,cost:3.5,factoryCost:380000,capacity:1100,dailyCost:1050},
{id:'cheese',name:'Ser żółty 500 g',category:'Nabiał',price:24,cost:13,factoryCost:520000,capacity:500,dailyCost:1250},
{id:'yogurt',name:'Jogurt naturalny',category:'Nabiał',price:5,cost:2.2,factoryCost:350000,capacity:1200,dailyCost:950},
{id:'juice',name:'Sok jabłkowy 1 l',category:'Napoje',price:9,cost:4,factoryCost:420000,capacity:1000,dailyCost:1000},
{id:'water',name:'Woda mineralna 1,5 l',category:'Napoje',price:4,cost:1.4,factoryCost:300000,capacity:1600,dailyCost:850},
{id:'pasta',name:'Makaron durum 500 g',category:'Produkty suche',price:8,cost:3,factoryCost:360000,capacity:1300,dailyCost:900},
{id:'flour',name:'Mąka pszenna 1 kg',category:'Produkty suche',price:5,cost:1.8,factoryCost:340000,capacity:1500,dailyCost:850},
{id:'coffee',name:'Kawa mielona 250 g',category:'Produkty suche',price:22,cost:12,factoryCost:560000,capacity:500,dailyCost:1300},
{id:'chocolate',name:'Czekolada mleczna 100 g',category:'Słodycze',price:7,cost:2.8,factoryCost:390000,capacity:1200,dailyCost:950},
{id:'cookies',name:'Ciastka maślane 200 g',category:'Słodycze',price:11,cost:4.5,factoryCost:410000,capacity:900,dailyCost:980},
{id:'chips',name:'Chipsy solone 150 g',category:'Przekąski',price:8,cost:3.1,factoryCost:400000,capacity:1000,dailyCost:980},
{id:'frozen',name:'Pizza mrożona',category:'Mrożonki',price:19,cost:10,factoryCost:580000,capacity:500,dailyCost:1350},
{id:'icecream',name:'Lody familijne',category:'Mrożonki',price:17,cost:8,factoryCost:540000,capacity:550,dailyCost:1300},
{id:'soap',name:'Mydło w kostce',category:'Higiena',price:6,cost:2,factoryCost:330000,capacity:1400,dailyCost:850},
{id:'shampoo',name:'Szampon 400 ml',category:'Higiena',price:18,cost:8,factoryCost:470000,capacity:700,dailyCost:1100},
{id:'detergent',name:'Płyn do prania 1,5 l',category:'Chemia domowa',price:26,cost:12,factoryCost:620000,capacity:500,dailyCost:1400},
{id:'dish',name:'Płyn do naczyń',category:'Chemia domowa',price:9,cost:3.5,factoryCost:390000,capacity:1000,dailyCost:950},
{id:'paper',name:'Papier toaletowy 8 rolek',category:'Papier',price:16,cost:7,factoryCost:450000,capacity:800,dailyCost:1050},
{id:'tshirt',name:'Koszulka basic',category:'Odzież',price:35,cost:15,factoryCost:680000,capacity:450,dailyCost:1500},
{id:'jeans',name:'Jeansy klasyczne',category:'Odzież',price:119,cost:58,factoryCost:950000,capacity:220,dailyCost:1900},
{id:'socks',name:'Skarpety 3-pak',category:'Odzież',price:19,cost:7,factoryCost:430000,capacity:850,dailyCost:1050},
{id:'shoes',name:'Buty sportowe',category:'Obuwie',price:189,cost:92,factoryCost:1250000,capacity:140,dailyCost:2300},
{id:'backpack',name:'Plecak miejski',category:'Akcesoria',price:99,cost:42,factoryCost:820000,capacity:260,dailyCost:1750},
{id:'lamp',name:'Lampa LED',category:'Elektronika',price:49,cost:21,factoryCost:760000,capacity:300,dailyCost:1600},
{id:'cable',name:'Kabel USB-C',category:'Elektronika',price:29,cost:9,factoryCost:590000,capacity:700,dailyCost:1350},
{id:'headphones',name:'Słuchawki bezprzewodowe',category:'Elektronika',price:149,cost:76,factoryCost:1450000,capacity:130,dailyCost:2500},
{id:'furniture',name:'Krzesło drewniane',category:'Dom i ogród',price:159,cost:75,factoryCost:1100000,capacity:160,dailyCost:2100},
{id:'detergentpro',name:'Zestaw do sprzątania',category:'Dom i ogród',price:39,cost:15,factoryCost:620000,capacity:550,dailyCost:1400},
{id:'bottle',name:'Butelka termiczna',category:'Akcesoria',price:59,cost:23,factoryCost:730000,capacity:350,dailyCost:1550}
];
export function createFactory(state,{name,productId,companyId}){
 const product=factoryProducts.find(p=>p.id===productId),company=state.companies.find(c=>c.id===companyId&&c.share>=50);
 if(!product)throw Error('Wybierz produkt z katalogu.');
 if(!company)throw Error('Wybierz spółkę, nad którą masz kontrolę.');
 if(state.cash<product.factoryCost)throw Error('Budowa wymaga '+product.factoryCost.toLocaleString('pl-PL')+' zł. Brakuje '+(product.factoryCost-state.cash).toLocaleString('pl-PL')+' zł.');
 const factory={id:state.nextId++,name,productId,companyId,capacity:product.capacity,level:1,builtDay:state.day};
 state.cash-=product.factoryCost;company.value=(Number(company.value)||0)+product.factoryCost;state.factories.push(factory);
 return {factory,cost:product.factoryCost};
}
export function processFactoriesDay(state){
 let revenue=0,cost=0,units=0;
 (state.factories||[]).forEach(factory=>{
  const product=factoryProducts.find(p=>p.id===factory.productId),company=state.companies.find(c=>c.id===factory.companyId);
  if(!product||!company)return;
  const stores=state.shops.filter(shop=>shop.companyId===company.id).length;
  const produced=Math.min(product.capacity*factory.level,Math.max(0,stores)*90);
  const sold=produced;
  factory.lastProduction=produced;factory.lastRevenue=sold*product.price;
  revenue+=sold*product.price;cost+=sold*product.cost+product.dailyCost;units+=sold;
 });
 state.factoryRevenue=revenue;state.factoryCost=cost;
 return {revenue,cost,units};
}
export function getFactoryProduct(productId){return factoryProducts.find(p=>p.id===productId);}
