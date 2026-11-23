export function buyShares(state,companyId,percentage){
 const company=state.market.find(item=>item.id===companyId);
 if(!company)throw new Error('Nie znaleziono spółki.');
 const amount=Math.min(percentage,100-company.share),price=Math.round(company.value/100*amount);
 if(amount<=0)throw new Error('Masz już 100% udziałów.');
 if(state.cash<price)throw new Error('Za mało gotówki na ten pakiet.');
 state.cash-=price;company.share+=amount;
 return {company,amount,price};
}
export function takeControl(state,companyId){
 const company=state.market.find(item=>item.id===companyId);
 if(!company||company.share<50)throw new Error('Do przejęcia kontroli potrzebujesz minimum 50% udziałów.');
 if(state.companies.some(item=>item.name===company.name))throw new Error('Ta spółka jest już w twojej grupie.');
 state.companies.push({id:state.nextId++,name:company.name,industry:company.industry,share:company.share,value:company.value});
 return company;
}
export function ownershipStatus(company){
 if(company.share>=50)return 'Większość — możesz kontrolować zarząd';
 if(company.share>=25)return 'Duży wpływ — możesz negocjować miejsce w radzie';
 if(company.share>0)return 'Udziałowiec mniejszościowy';
 return 'Nie posiadasz udziałów';
}
