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
const EXTRA_PRODUCTS=[
['Płatki owsiane','Produkty suche',11,4.2,390000,1000,950],['Ryż basmati','Produkty suche',14,6,430000,900,980],['Kasza gryczana','Produkty suche',9,3.5,370000,1100,900],['Oliwa z oliwek','Produkty suche',32,17,650000,420,1450],['Konfitura malinowa','Przetwory',16,7,470000,650,1100],['Miód wielokwiatowy','Przetwory',29,14,610000,400,1350],['Ogórki kiszone','Przetwory',10,4,410000,950,980],['Pomidory w puszce','Przetwory',7,2.5,350000,1200,900],['Tuńczyk w puszce','Przetwory',12,5.5,450000,850,1050],['Baton proteinowy','Słodycze',8,3,390000,1100,950],
['Herbata czarna','Napoje',15,6,450000,700,1050],['Kakao instant','Napoje',13,5,420000,800,1000],['Napój izotoniczny','Napoje',8,3,390000,1100,950],['Lemoniada cytrynowa','Napoje',9,3.5,410000,950,980],['Napój owsiany','Nabiał',12,5,460000,850,1080],['Masło ekstra','Nabiał',11,5,420000,900,1000],['Twaróg półtłusty','Nabiał',8,3,380000,1100,950],['Śmietana 18%','Nabiał',6,2.2,350000,1250,900],['Kefir naturalny','Nabiał',6,2.1,350000,1200,900],['Ser feta','Nabiał',15,7,470000,700,1080],
['Ketchup łagodny','Sosy',9,3.2,390000,1000,950],['Musztarda sarepska','Sosy',7,2.4,360000,1100,900],['Majonez tradycyjny','Sosy',12,5,430000,850,1000],['Sos pomidorowy','Sosy',8,2.8,380000,1050,920],['Orzechy nerkowca','Przekąski',19,9,520000,550,1200],['Migdały prażone','Przekąski',17,8,500000,600,1150],['Paluszki solone','Przekąski',6,2,350000,1300,900],['Popcorn maślany','Przekąski',7,2.5,360000,1200,900],['Baton czekoladowy','Słodycze',5,1.8,340000,1400,880],['Guma do żucia','Słodycze',4,1.2,320000,1500,850],
['Płyn do płukania','Chemia domowa',22,9,540000,600,1250],['Proszek do zmywarki','Chemia domowa',31,14,670000,420,1500],['Odkamieniacz','Chemia domowa',13,5,450000,850,1050],['Pasta do zębów','Higiena',10,3.5,400000,1100,950],['Dezodorant roll-on','Higiena',16,6,470000,800,1080],['Krem nawilżający','Higiena',24,10,590000,550,1300],['Ręcznik kąpielowy','Dom i ogród',39,17,690000,400,1500],['Pościel bawełniana','Dom i ogród',119,55,1050000,180,2200],['Patelnia nieprzywierająca','Dom i ogród',79,34,870000,250,1800],['Kubek ceramiczny','Dom i ogród',19,7,440000,800,1050],
['Powerbank 10000 mAh','Elektronika',89,42,950000,220,1900],['Mysz bezprzewodowa','Elektronika',59,24,780000,350,1600],['Klawiatura mechaniczna','Elektronika',229,115,1550000,100,2700],['Głośnik Bluetooth','Elektronika',139,68,1250000,150,2300],['Walizka kabinowa','Akcesoria',179,82,1350000,130,2450],['Portfel skórzany','Akcesoria',69,28,790000,320,1650],['Bluza bawełniana','Odzież',89,38,920000,280,1800],['Kurtka przejściowa','Odzież',229,110,1580000,100,2800],['Czapka zimowa','Odzież',39,14,620000,600,1350],['Legginsy sportowe','Odzież',79,31,850000,330,1750]
];
factoryProducts.push(...EXTRA_PRODUCTS.map((x,i)=>({id:'extra_'+(i+1),name:x[0],category:x[1],price:x[2],cost:x[3],factoryCost:x[4],capacity:x[5],dailyCost:x[6]})));

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
