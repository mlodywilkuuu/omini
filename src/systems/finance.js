export const totalRevenue=state=>state.shops.reduce((sum,shop)=>sum+shop.revenue,0);
export const totalCosts=state=>state.shops.reduce((sum,shop)=>sum+shop.cost,0);
export const shareAssets=state=>state.market.reduce((sum,company)=>sum+company.value*company.share/100,0);
export const operatingProfit=state=>totalRevenue(state)-totalCosts(state);
export const dividends=state=>state.market.reduce((sum,company)=>sum+company.value*company.share/100*company.dividend,0);
export const assetValue=state=>state.shops.length*170000+state.companies.reduce((sum,company)=>sum+company.value,0)+shareAssets(state);
export const netWorth=state=>state.cash+assetValue(state);
export function closeBusinessDay(state){
 // Codzienna zmienność rynku: popyt, konkurencja i ceny dostawców wpływają na każdą placówkę.
 state.shops.forEach(shop=>{
  const demand=(Math.random()-.46)*.085;
  const supplier=(Math.random()-.48)*.05;
  shop.revenue=Math.max(0,Math.round(shop.revenue*(1+demand)));
  shop.cost=Math.max(0,Math.round(shop.cost*(1+supplier)));
 });
 const revenue=totalRevenue(state),costs=totalCosts(state),dividendIncome=dividends(state);
 const profit=revenue-costs+dividendIncome;
 state.cash+=profit;
 state.market.forEach(company=>{company.value=Math.max(50000,Math.round(company.value*(1+(Math.random()-.43)*.012)));});
 state.history.push(Math.max(1000,profit));state.history=state.history.slice(-7);
 return {profit,revenue,costs,dividendIncome};
}
