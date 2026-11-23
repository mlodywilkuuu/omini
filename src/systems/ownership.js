const investorNames=['Fundusz Północny','Baltic Capital','Orzeł Asset Management','Nova Investments','Horyzont TFI','Atlas Partners','Vistula Pension Fund','Amber Equity','Global Value Fund','Cedar Capital','Northstar Holdings','Silverline Investments','Polaris Capital','Union Trust'];
const companyNames=['Nova','Baltic','Orion','Vertex','Aurum','Pioneer','Urban','Verto','Horizon','Quantum','Nexum','Atlas','Lumen','Polar','Cobalt','Meridian','Prime','Everest','Solido','Viva'];
const companyIndustries=['Handel detaliczny','Technologie','Energetyka','Logistyka','Nieruchomości','Finanse','Moda i odzież','Żywność i napoje','Telekomunikacja','Farmacja','Motoryzacja','Media i rozrywka','Budownictwo','Turystyka','Przemysł'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
export function ensureShareholders(company){
 if(Array.isArray(company.shareholders)&&company.shareholders.length)return company.shareholders;
 const remaining=Math.max(0,100-(company.share||0)),count=3+Math.floor(Math.random()*3),weights=Array.from({length:count},()=>Math.random()+.3),total=weights.reduce((a,b)=>a+b,0);
 company.shareholders=weights.map((w,i)=>({name:pick(investorNames)+' '+(i+1),share:+(remaining*w/total).toFixed(2),type:i===0?'Fundusz':'Inwestor'}));
 const delta=+(remaining-company.shareholders.reduce((a,x)=>a+x.share,0)).toFixed(2);company.shareholders[0].share=+(company.shareholders[0].share+delta).toFixed(2);
 return company.shareholders;
}
export function generateMarketCompany(state){
 if(state.market.length>=80){
  const candidates=state.market.filter(x=>!(x.share>0)&&!x.controlled).sort((a,b)=>a.value-b.value);
  if(!candidates.length)return null;
  const retired=candidates[0];state.market=state.market.filter(x=>x.id!==retired.id);
  state.events??=[];state.events.unshift({icon:'📤',title:'Wycofanie z giełdy',detail:retired.name+' zakończyła notowania.',day:state.day});state.events=state.events.slice(0,12);
 }
 let name='',attempts=0;do{name=pick(companyNames)+' '+pick(['Group','Industries','Holdings','Systems','Retail','S.A.']);attempts++;}while(state.market.some(c=>c.name===name)&&attempts<20);if(state.market.some(c=>c.name===name))return null;const id=state.nextId++;
 const value=Math.round((180000+Math.random()*2820000)/10000)*10000,company={id,name,industry:pick(companyIndustries),value,share:0,dividend:+(.001+Math.random()*.006).toFixed(4),freeFloat:100,shares:Math.round(value/(2+Math.random()*8)),eps:+(1+Math.random()*6).toFixed(2),pe:+(7+Math.random()*15).toFixed(1),boardSeats:3+2*Math.floor(Math.random()*3),history:[Math.round(value*.94),Math.round(value*.97),value],listedDay:state.day,shareholders:[]};
 state.market.push(company);ensureShareholders(company);
 state.events??=[];state.events.unshift({icon:'🆕',title:'Nowa spółka na giełdzie',detail:name+' debiutuje z wyceną '+value.toLocaleString('pl-PL')+' zł.',day:state.day});state.events=state.events.slice(0,12);
 return company;
}
export function rotateShareholders(state){
 for(const company of state.market){
  const holders=ensureShareholders(company);if(holders.length<2)continue;
  const from=holders[Math.floor(Math.random()*holders.length)],others=holders.filter(x=>x!==from),to=pick(others);
  const transfer=Math.min(from.share,+(0.35+Math.random()*1.65).toFixed(2));
  if(transfer<=0)continue;
  from.share=+(from.share-transfer).toFixed(2);to.share=+(to.share+transfer).toFixed(2);
  if(Math.random()<.16&&holders.length<8&&from.share>5){const piece=+(Math.min(from.share-1,1+Math.random()*2)).toFixed(2);from.share=+(from.share-piece).toFixed(2);let name=pick(investorNames),tries=0;while(holders.some(h=>h.name===name)&&tries++<20)name=pick(investorNames);holders.push({name,share:piece,type:Math.random()<.4?'Fundusz':'Inwestor'});}
  company.shareholders=holders.filter(x=>x.share>=.05);
  const target=Math.max(0,100-(company.share||0)),totalNow=company.shareholders.reduce((a,x)=>a+x.share,0);if(totalNow>0){company.shareholders.forEach(h=>h.share=+(h.share*target/totalNow).toFixed(2));const drift=+(target-company.shareholders.reduce((a,x)=>a+x.share,0)).toFixed(2);if(company.shareholders[0])company.shareholders[0].share=+(company.shareholders[0].share+drift).toFixed(2);}
  if(state.day%3===0&&company.shareholders.length>=3&&Math.random()<.5){
   const replaceAt=Math.floor(Math.random()*company.shareholders.length),old=company.shareholders[replaceAt],used=new Set(company.shareholders.map(x=>x.name));
   let name=pick(investorNames),tries=0;while(used.has(name)&&tries++<20)name=pick(investorNames);
   company.shareholders[replaceAt]={name,share:old.share,type:Math.random()<.45?'Fundusz':'Inwestor'};
  }
 }
}
export function buyShares(state,companyId,percentage){
 const company=state.market.find(item=>item.id===companyId);if(!company)throw new Error('Nie znaleziono spółki.');
 const requested=Math.max(0,Number(percentage)||0),amount=Math.min(requested,100-company.share,company.freeFloat??(100-company.share));
 if(amount<=0)throw new Error('Brak wolnych akcji w tej ofercie.');
 const volatility=company.history?.length>1?Math.min(.035,Math.abs(company.history.at(-1)-company.history.at(-2))/Math.max(1,company.history.at(-2))*.5):.01;const blockPremium=1.012+amount*.0012+volatility,price=Math.round(company.value/100*amount*blockPremium);
 if(state.cash<price)throw new Error('Za mało gotówki na ten pakiet.');
 state.cash-=price;company.share=+(company.share+amount).toFixed(2);company.freeFloat=+((company.freeFloat??100)-amount).toFixed(2);
 const holders=ensureShareholders(company),total=holders.reduce((a,x)=>a+x.share,0),remaining=Math.max(0,total-amount);
 holders.forEach(h=>h.share=total?+(h.share*remaining/total).toFixed(2):0);
 const correction=+(remaining-holders.reduce((a,x)=>a+x.share,0)).toFixed(2);if(holders[0])holders[0].share=+(holders[0].share+correction).toFixed(2);
 company.history??=[company.value];company.history.push(company.value);company.history=company.history.slice(-8);
 company.invested=(company.invested||0)+price;
 return {company,amount,price,premium:Math.round((blockPremium-1)*100),unitPrice:Math.round(price/amount)};
}
export function sellShares(state,companyId,percentage){
 const company=state.market.find(item=>item.id===companyId);if(!company)throw new Error('Nie znaleziono spółki.');
 const requested=Math.max(0,Number(percentage)||0),amount=Math.min(requested,company.share||0);if(amount<=0)throw new Error('Nie masz tylu udziałów do sprzedaży.');
 const volatility=company.history?.length>1?Math.min(.035,Math.abs(company.history.at(-1)-company.history.at(-2))/Math.max(1,company.history.at(-2))*.5):.01;const gross=Math.round(company.value/100*amount*(1-.008-amount*.0007-volatility)),fee=Math.round(gross*.01),proceeds=gross-fee;
 company.share=+(company.share-amount).toFixed(2);company.freeFloat=Math.min(100-company.share,+((company.freeFloat??0)+amount).toFixed(2));
 const holders=ensureShareholders(company);if(holders.length){const total=holders.reduce((a,x)=>a+x.share,0);if(total>0){holders.forEach(h=>h.share=+(h.share+amount*h.share/total).toFixed(2));const delta=+(100-company.share-holders.reduce((a,x)=>a+x.share,0)).toFixed(2);holders[0].share=+(holders[0].share+delta).toFixed(2);}}
 state.cash+=proceeds;company.history??=[company.value];company.history.push(company.value);company.history=company.history.slice(-8);
 return {company,amount,proceeds,fee};
}
export function takeControl(state,companyId){
 const company=state.market.find(item=>item.id===companyId);
 if(!company||company.share<50)throw new Error('Do przejęcia kontroli potrzebujesz minimum 50% udziałów.');
 if(state.companies.some(item=>item.name===company.name))throw new Error('Ta spółka jest już w twojej grupie.');
 const subsidiary={id:state.nextId++,name:company.name,industry:company.industry,share:company.share,value:company.value,employees:Math.max(5,Math.round(company.value/35000)),stores:0,acquired:true,parentCompanyId:null,operatingCountries:['Polska']};
 state.companies.push(subsidiary);company.controlled=true;return company;
}
export function ownershipStatus(company){
 const s=company.share;
 if(s>=75)return 'Pakiet dominujący — możesz przegłosować kluczowe uchwały';
 if(s>=50)return 'Pakiet kontrolny — kontrolujesz zarząd i strategię';
 if(s>=33.34)return 'Blokująca mniejszość — możesz blokować ważne uchwały';
 if(s>=25)return 'Znaczący wpływ — realny głos w radzie nadzorczej';
 if(s>=10)return 'Duży inwestor — mocna pozycja negocjacyjna';
 if(s>=5)return 'Znaczący akcjonariusz — prawo do informacji';
 if(s>0)return 'Akcjonariusz mniejszościowy';
 return 'Nie posiadasz udziałów';
}
export const votingPower=company=>Math.min(100,company.share*1.08);
export const boardSeats=company=>Math.floor((company.boardSeats||5)*company.share/100);
