export function buyShares(state,companyId,percentage){
 const company=state.market.find(item=>item.id===companyId);if(!company)throw new Error('Nie znaleziono spółki.');
 const amount=Math.min(percentage,100-company.share,company.freeFloat??(100-company.share));
 if(amount<=0)throw new Error('Brak wolnych akcji w tej ofercie.');
 const blockPremium=amount>=25?1.08:amount>=10?1.04:1.015,price=Math.round(company.value/100*amount*blockPremium);
 if(state.cash<price)throw new Error('Za mało gotówki na ten pakiet.');
 state.cash-=price;company.share=+(company.share+amount).toFixed(2);company.freeFloat=+((company.freeFloat??100)-amount).toFixed(2);
 company.history??=[company.value];company.history.push(company.value);company.history=company.history.slice(-8);
 company.invested=(company.invested||0)+price;
 return {company,amount,price,premium:Math.round((blockPremium-1)*100)};
}
export function takeControl(state,companyId){
 const company=state.market.find(item=>item.id===companyId);
 if(!company||company.share<50)throw new Error('Do przejęcia kontroli potrzebujesz minimum 50% udziałów.');
 if(state.companies.some(item=>item.name===company.name))throw new Error('Ta spółka jest już w twojej grupie.');
 const subsidiary={id:state.nextId++,name:company.name,industry:company.industry,share:company.share,value:company.value,employees:Math.max(5,Math.round(company.value/35000)),stores:0,acquired:true};
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
