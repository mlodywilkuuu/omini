export const EXCHANGES=[
 {id:"GPW",name:"Giełda Papierów Wartościowych w Warszawie",short:"GPW",city:"Warszawa",currency:"PLN",region:"Polska"},
 {id:"NASDAQ",name:"NASDAQ",short:"NASDAQ",city:"Nowy Jork",currency:"USD",region:"USA"},
 {id:"NYSE",name:"New York Stock Exchange",short:"NYSE",city:"Nowy Jork",currency:"USD",region:"USA"},
 {id:"LSE",name:"London Stock Exchange",short:"LSE",city:"Londyn",currency:"GBP",region:"Wielka Brytania"},
 {id:"XETRA",name:"Deutsche Börse · Xetra",short:"XETRA",city:"Frankfurt",currency:"EUR",region:"Niemcy"},
 {id:"TSE",name:"Tokyo Stock Exchange",short:"TSE",city:"Tokio",currency:"JPY",region:"Japonia"}
];
const pickExchange=company=>{
 const text=((company.industry||"")+" "+(company.name||"")).toLowerCase();
 if(/robot|półprzew|chip|elektron|hardware|produkc/.test(text))return "TSE";
 if(/finans|bank|płat|ubezpiec|leasing/.test(text))return "LSE";
 if(/cloud|chmur|data|centrum danych|infrastrukt/.test(text))return "XETRA";
 if(/ai|sztuczna inteligencja|software|system|cyber|telekom|biotech|technolog/.test(text))return "NASDAQ";
 return "GPW";
};
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function ensureStockMarket(state){
 state.market??=[];
 state.companies??=[];
 state.holdingHistory??=[{day:Math.max(1,Number(state.day)||1),value:Math.max(0,Number(state.cash)||0)}];
 state.selectedExchange??="ALL";
 for(const company of state.market){
  company.exchange??=pickExchange(company);
  company.history=Array.isArray(company.history)?company.history:[Number(company.value)||0];
  if(!company.history.length)company.history.push(Number(company.value)||0);
  company.ticker??=(String(company.name||"OMNI").replace(/[^A-Z0-9]/gi,"").slice(0,4).toUpperCase()||"OMNI");
 }
 for(const company of state.companies){
  company.valueHistory=Array.isArray(company.valueHistory)?company.valueHistory:[Number(company.value)||0];
  if(!company.valueHistory.length)company.valueHistory.push(Number(company.value)||0);
 }
 return state;
}
export function holdingMarketValue(state){
 const cash=Math.max(0,Number(state.cash)||0);
 const companies=(state.companies||[]).reduce((sum,c)=>sum+Math.max(0,Number(c.value)||0),0);
 const shares=(state.market||[]).reduce((sum,c)=>sum+Math.max(0,Number(c.value)||0)*clamp(Number(c.share)||0,0,100)/100,0);
 const shops=(state.shops||[]).reduce((sum,s)=>sum+Math.max(0,Number(s.value)||Number(s.purchaseCost)||0),0);
 const factories=(state.factories||[]).reduce((sum,f)=>sum+Math.max(0,Number(f.value)||Number(f.buildCost)||0),0);
 return Math.round(cash+companies+shares+shops+factories);
}
export function advanceStockMarketDay(state){
 ensureStockMarket(state);
 const listedCompanyIds=new Set((state.market||[]).map(x=>Number(x.sourceCompanyId)).filter(Boolean));
 for(const stock of state.market){
  const value=Math.max(10000,Number(stock.value)||10000);
  const fundamentals=clamp((Number(stock.eps)||2)/(Number(stock.pe)||15),.025,.22);
  const drift=(fundamentals-.12)*.012;
  const shock=(Math.random()-.5)*.018;
  const dailyReturn=clamp(drift+shock,-.025,.025);
  stock.value=Math.max(10000,Math.round(value*(1+dailyReturn)/100)*100);
  stock.changePercent=dailyReturn*100;
  stock.history.push(stock.value);
  stock.history=stock.history.slice(-90);
  if(stock.sourceCompanyId){
   const subsidiary=state.companies.find(c=>Number(c.id)===Number(stock.sourceCompanyId));
   if(subsidiary){subsidiary.value=stock.value;subsidiary.valueHistory??=[];subsidiary.valueHistory.push(stock.value);subsidiary.valueHistory=subsidiary.valueHistory.slice(-90);}
  }
 }
 for(const company of state.companies){
  if(listedCompanyIds.has(Number(company.id)))continue;
  const value=Math.max(10000,Number(company.value)||10000);
  const products=(company.techProducts||[]).length;
  const staff=Math.max(0,Number(company.techStaff??company.employees)||0);
  const ownedShops=(state.shops||[]).filter(s=>Number(s.companyId)===Number(company.id)).length;
  const factories=(state.factories||[]).filter(f=>Number(f.companyId)===Number(company.id)).length;
  const growth=Math.min(.003,products*.00012+Math.min(staff,100)*.000008+ownedShops*.00008+factories*.00012);
  const dailyReturn=clamp(growth+(Math.random()-.5)*.012,-.012,.014);
  company.value=Math.max(10000,Math.round(value*(1+dailyReturn)/100)*100);
  company.valueHistory??=[];
  company.valueHistory.push(company.value);
  company.valueHistory=company.valueHistory.slice(-90);
 }
 state.holdingHistory??=[];
 state.holdingHistory.push({day:Number(state.day)||0,value:holdingMarketValue(state)});
 state.holdingHistory=state.holdingHistory.slice(-90);
 return {holdingValue:holdingMarketValue(state),listed:state.market.length,subsidiaries:state.companies.length};
}
