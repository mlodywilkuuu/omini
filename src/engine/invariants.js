export function assertGameInvariants(state){
 if(!Number.isFinite(Number(state.day))||state.day<1)throw new Error('Nieprawidłowy dzień symulacji.');
 if(!Number.isFinite(Number(state.cash)))throw new Error('Saldo gotówki nie jest liczbą.');
 for(const company of state.market||[]){
  const player=Number(company.share)||0;
  const investors=(company.shareholders||[]).reduce((sum,h)=>sum+(Number(h.share)||0),0);
  const total=player+investors;
  if(player<-.001||player>100.001||investors<-.001||total>100.02||Math.abs(total-100)>.02){
   throw new Error('Naruszenie limitu 100% udziałów w spółce: '+(company.name||company.id)+' ('+total.toFixed(2)+'%).');
  }
  if((company.shareholders||[]).some(h=>!Number.isFinite(Number(h.share))||Number(h.share)<0)){
   throw new Error('Nieprawidłowy pakiet akcjonariusza w spółce '+(company.name||company.id)+'.');
  }
 }
 return true;
}
