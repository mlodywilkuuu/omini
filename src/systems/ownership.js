const investorNames=['Fundusz Północny','Baltic Capital','Orzeł Asset Management','Nova Investments','Horyzont TFI','Atlas Partners','Vistula Pension Fund','Amber Equity','Global Value Fund','Cedar Capital','Northstar Holdings','Silverline Investments','Polaris Capital','Union Trust'];
const companyNames=['Nova','Baltic','Orion','Vertex','Aurum','Pioneer','Urban','Verto','Horizon','Quantum','Nexum','Atlas','Lumen','Polar','Cobalt','Meridian','Prime','Everest','Solido','Viva'];
const companyIndustries=['Handel detaliczny','Technologie','Energetyka','Logistyka','Nieruchomości','Finanse','Moda i odzież','Żywność i napoje','Telekomunikacja','Farmacja','Motoryzacja','Media i rozrywka','Budownictwo','Turystyka','Przemysł'];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const roundShare=n=>Math.round((Number(n)||0)*100)/100;
function syncShareLedger(company){
 const player=roundShare(Math.max(0,Math.min(100,company.share)));
 company.share=player;
 let holders=Array.isArray(company.shareholders)?company.shareholders:[];
 holders=holders.filter(h=>h&&typeof h==='object').map((h,i)=>({name:String(h.name||('Inwestor '+(i+1))),type:String(h.type||'Inwestor'),share:Math.max(0,Number(h.share)||0)})).filter(h=>h.share>0);
 const target=roundShare(100-player);
 if(!holders.length&&target>0){
  const count=3+Math.floor(Math.random()*3),weights=Array.from({length:count},()=>Math.random()+.3),sum=weights.reduce((a,b)=>a+b,0);
  holders=weights.map((w,i)=>({name:pick(investorNames)+' '+(i+1),type:i===0?'Fundusz':'Inwestor',share:target*w/sum}));
 }
 if(target===0)holders=[];
 else if(holders.length){
  const sum=holders.reduce((a,h)=>a+h.share,0);
  if(sum<=0)holders[0].share=target;
  else holders.forEach(h=>h.share=h.share*target/sum);
  holders=holders.map(h=>({...h,share:roundShare(h.share)}));
  const drift=roundShare(target-holders.reduce((a,h)=>a+h.share,0));
  if(holders.length)holders[0].share=roundShare(holders[0].share+drift);
 }
 company.shareholders=holders.filter(h=>h.share>.001);
 company.freeFloat=target;
 return company.shareholders;
}
export function ensureShareholders(company){return syncShareLedger(company);}
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
  const from=holders[Math.floor(Math.random()*holders.length)],to=pick(holders.filter(x=>x!==from));
  const transfer=roundShare(Math.min(from.share,0.2+Math.random()*0.8));
  if(transfer<=0)continue;
  from.share=roundShare(from.share-transfer);to.share=roundShare(to.share+transfer);
  if(Math.random()<.08&&holders.length<8&&from.share>4){
   const piece=roundShare(Math.min(from.share-1,0.5+Math.random()*1.5));
   if(piece>0){from.share=roundShare(from.share-piece);let name=pick(investorNames),tries=0;while(holders.some(h=>h.name===name)&&tries++<30)name=pick(investorNames);holders.push({name,type:Math.random()<.4?'Fundusz':'Inwestor',share:piece});}
  }
  company.shareholders=holders.filter(h=>h.share>.001);
  const target=roundShare(100-company.share),sum=company.shareholders.reduce((a,h)=>a+h.share,0);
  if(sum>0){company.shareholders.forEach(h=>h.share=roundShare(h.share*target/sum));const drift=roundShare(target-company.shareholders.reduce((a,h)=>a+h.share,0));company.shareholders[0].share=roundShare(company.shareholders[0].share+drift);}
  company.freeFloat=target;
 }
}
export function buyShares(state,companyId,percentage){
 const company=state.market.find(x=>x.id===companyId);if(!company)throw new Error('Nie znaleziono spółki.');
 const holders=ensureShareholders(company),requested=Number(percentage);
 if(!Number.isFinite(requested)||requested<=0)throw new Error('Podaj prawidłowy procent pakietu.');
 const available=roundShare(holders.reduce((a,h)=>a+h.share,0)),amount=roundShare(Math.min(requested,available,100-company.share));
 if(amount<=0)throw new Error('Brak akcji dostępnych do kupienia.');
 const volatility=company.history?.length>1?Math.min(.035,Math.abs(company.history.at(-1)-company.history.at(-2))/Math.max(1,company.history.at(-2))*.5):.01;
 const multiplier=1.012+amount*.0012+volatility,price=Math.round(company.value*amount/100*multiplier);
 if(state.cash<price)throw new Error('Za mało gotówki na ten pakiet.');
 let left=amount;const total=available;
 holders.forEach((h,i)=>{const take=i===holders.length-1?left:Math.min(h.share,roundShare(amount*h.share/total));h.share=roundShare(h.share-take);left=roundShare(left-take);});
 company.share=roundShare(company.share+amount);company.shareholders=holders.filter(h=>h.share>.001);company.freeFloat=roundShare(100-company.share);
 state.cash-=price;company.invested=(company.invested||0)+price;
 company.history??=[company.value];company.history.push(company.value);company.history=company.history.slice(-8);
 syncShareLedger(company);
 return {company,amount,price,premium:Math.round((multiplier-1)*100),unitPrice:Math.round(price/amount)};
}
export function sellShares(state,companyId,percentage){
 const company=state.market.find(x=>x.id===companyId);if(!company)throw new Error('Nie znaleziono spółki.');
 const requested=Number(percentage),amount=roundShare(Math.min(requested,company.share||0));
 if(!Number.isFinite(requested)||requested<=0||amount<=0)throw new Error('Nie masz tylu udziałów do sprzedaży.');
 const volatility=company.history?.length>1?Math.min(.035,Math.abs(company.history.at(-1)-company.history.at(-2))/Math.max(1,company.history.at(-2))*.5):.01;
 const gross=Math.round(company.value*amount/100*(1-.008-amount*.0007-volatility)),fee=Math.round(gross*.01),proceeds=gross-fee;
 company.share=roundShare(company.share-amount);
 const holders=ensureShareholders(company);
 if(holders.length){const total=holders.reduce((a,h)=>a+h.share,0);holders.forEach((h,i)=>{h.share=roundShare(h.share+amount*(total?h.share/total:1/holders.length));});const drift=roundShare(100-company.share-holders.reduce((a,h)=>a+h.share,0));holders[0].share=roundShare(holders[0].share+drift);}
 company.freeFloat=roundShare(100-company.share);state.cash+=proceeds;
 company.history??=[company.value];company.history.push(company.value);company.history=company.history.slice(-8);
 return {company,amount,proceeds,fee};
}
export function takeControl(state,companyId){
 const company=state.market.find(item=>Number(item.id)===Number(companyId));
 if(!company)throw new Error('Nie znaleziono spółki na giełdzie. Odśwież zakładkę i spróbuj ponownie.');
 if(Number(company.share)<50)throw new Error('Do przejęcia kontroli potrzebujesz minimum 50% udziałów.');
 let subsidiary=state.companies.find(item=>item.sourceMarketId===company.id||item.name===company.name);
 if(!subsidiary){
  subsidiary={id:state.nextId++,name:company.name,industry:company.industry,share:company.share,value:company.value,employees:Math.max(5,Math.round(company.value/35000)),stores:0,acquired:true,parentCompanyId:null,operatingCountries:['Polska'],companyType:'operating',ownBrands:[],autoDevelopment:true,sourceMarketId:company.id};
  state.companies.push(subsidiary);
 }
 const companyName=company.name;
 state.market=state.market.filter(item=>Number(item.id)!==Number(companyId));
 if(Number(state.selectedMarketCompanyId)===Number(companyId))state.selectedMarketCompanyId=null;
 state.events??=[];
 state.events.unshift({icon:'👑',title:'Spółka przeniesiona do holdingu',detail:companyName+' została zdjęta z giełdy i dodana do struktury Wilk Investments.',day:state.day});
 state.events=state.events.slice(0,12);
 return {...company,name:companyName,controlled:true,subsidiaryId:subsidiary.id};
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
export const votingPower=company=>Math.max(0,Math.min(100,Number(company.share)||0));
export const boardSeats=company=>Math.floor((company.boardSeats||5)*company.share/100);

export function proposeBuyout(state,companyId,holderName,percentage,offerPrice){
 const company=state.market.find(x=>x.id===companyId);if(!company)throw new Error('Nie znaleziono spółki.');
 const holders=ensureShareholders(company),holder=holders.find(x=>x.name===holderName);if(!holder)throw new Error('Ten akcjonariusz nie jest już w spółce.');
 const amount=roundShare(Number(percentage)),price=Math.round(Number(offerPrice));
 if(!Number.isFinite(amount)||amount<=0||amount>holder.share)throw new Error('Pakiet przekracza liczbę akcji tego akcjonariusza.');
 if(!Number.isSafeInteger(price)||price<=0)throw new Error('Podaj prawidłową cenę oferty.');
 state.buyoutOffers??=[];
 if(state.buyoutOffers.some(x=>x.companyId===companyId&&x.holderName===holderName))throw new Error('Masz już aktywną ofertę dla tego akcjonariusza.');
 const reserved=state.buyoutOffers.reduce((sum,x)=>sum+x.price,0);
 if(price+reserved>state.cash)throw new Error('Aktywne oferty rezerwują już część gotówki. Zmniejsz kwotę lub poczekaj na ich rozliczenie.');
 const reservedShares=state.buyoutOffers.filter(x=>x.companyId===companyId&&x.holderName===holderName).reduce((sum,x)=>sum+x.amount,0);
 if(amount+reservedShares>holder.share)throw new Error('Ten pakiet jest już objęty inną ofertą.');
 state.buyoutOffers.push({id:state.nextId++,companyId,holderName,amount,price,day:state.day,expires:state.day+5});
 return {company,holderName,amount,price};
}
export function processBuyoutOffers(state){
 const offers=state.buyoutOffers||[],remaining=[];state.events??=[];
 for(const offer of offers){
  const company=state.market.find(x=>x.id===offer.companyId),holder=company&&ensureShareholders(company).find(x=>x.name===offer.holderName);
  if(!company||!holder||state.day>offer.expires){state.events.unshift({icon:'📭',title:'Oferta odkupu wygasła',detail:offer.holderName,day:state.day});continue;}
  const fair=company.value*offer.amount/100,ratio=offer.price/Math.max(1,fair),chance=Math.max(.05,Math.min(.9,.08+(ratio-1)*.65));
  if(Math.random()<chance&&state.cash>=offer.price&&holder.share+0.001>=offer.amount){
   state.cash-=offer.price;holder.share=roundShare(holder.share-offer.amount);company.share=roundShare(company.share+offer.amount);
   company.shareholders=company.shareholders.filter(x=>x.share>.001);company.freeFloat=roundShare(100-company.share);
   syncShareLedger(company);
   state.events.unshift({icon:'🤝',title:'Oferta odkupu przyjęta',detail:company.name+' · '+offer.holderName+' sprzedał '+offer.amount+'% za '+offer.price.toLocaleString('pl-PL')+' zł.',day:state.day});
  }else if(state.day>=offer.expires){state.events.unshift({icon:'❌',title:'Oferta odrzucona',detail:offer.holderName+' nie przyjął oferty za '+offer.price.toLocaleString('pl-PL')+' zł.',day:state.day});}
  else remaining.push(offer);
 }
 state.buyoutOffers=remaining;state.events=state.events.slice(0,12);
}
