import {processLogisticsDay} from './logistics.js?v=4';
import {processMarketingDay} from './marketing.js?v=1';
import {processProcurementDay} from './procurement.js?v=1';
import {processB2BContracts} from './b2b.js?v=1';
import {processFactoriesDay} from './factories.js?v=5';
import {scaleInfrastructureWorkforce} from './logistics.js?v=4';
import {processGroupEconomyDay} from './group_economy.js?v=4';
import {processTechnologyCompaniesDay} from './technology_holding.js?v=1';
export const totalRevenue=state=>state.shops.reduce((sum,shop)=>sum+shop.revenue,0)+(Number(state.contractRevenue)||0)+(Number(state.factoryRevenue)||0)+(Number(state.techRevenue)||0);
export const totalCosts=state=>state.shops.reduce((sum,shop)=>sum+shop.cost,0)+(Number(state.contractCost)||0)+(Number(state.factoryCost)||0)+(Number(state.infrastructurePayroll)||0)+(Number(state.logisticsInfrastructureCost)||0)+(Number(state.techCost)||0);
export const shareAssets=state=>state.market.reduce((sum,company)=>sum+company.value*company.share/100,0);
export const operatingProfit=state=>totalRevenue(state)-totalCosts(state);
export const dividends=state=>state.market.reduce((sum,company)=>sum+company.value*company.share/100*company.dividend,0);
export const assetValue=state=>state.shops.length*170000+state.companies.reduce((sum,company)=>sum+company.value,0)+shareAssets(state);
export const netWorth=state=>state.cash+assetValue(state);
const MARKET_EVENTS=[
 {icon:'📈',title:'Nagły wzrost popytu',detail:'Klienci ruszyli do sklepów. Dzisiejsza sprzedaż rośnie o 7%.',revenue:1.07,cost:1},
 {icon:'📣',title:'Trend w mediach społecznościowych',detail:'Popularność sieci zwiększa dzisiejsze przychody o 10%.',revenue:1.10,cost:1.015},
 {icon:'🚚',title:'Problemy z dostawami',detail:'Zakłócenia logistyczne podnoszą dzisiejsze koszty o 8%.',revenue:1,cost:1.08},
 {icon:'⚡',title:'Droższa energia',detail:'Wzrost cen energii zwiększa koszty placówek o 5%.',revenue:1,cost:1.05},
 {icon:'🤝',title:'Korzystne umowy z dostawcami',detail:'Lepsze warunki zakupowe obniżają koszty o 6%.',revenue:1,cost:.94},
 {icon:'🏷️',title:'Sezonowa wyprzedaż',detail:'Większy ruch podnosi przychody o 12%, ale także koszty o 5%.',revenue:1.12,cost:1.05},
 {icon:'🏙️',title:'Nowe centrum handlowe',detail:'Ruch klientów przesuwa się na rynek. Przychody spadają dziś o 4%.',revenue:.96,cost:1}
];
export function closeBusinessDay(state){
 // Codzienna zmienność rynku: popyt, konkurencja i ceny dostawców wpływają na każdą placówkę.
 const logistics=processLogisticsDay(state);
 const marketing=processMarketingDay(state);
 const procurement=processProcurementDay(state);
 const b2b=processB2BContracts(state);
 const factories=processFactoriesDay(state);
 processGroupEconomyDay(state);
 const technology=processTechnologyCompaniesDay(state);
 const infrastructurePayroll=scaleInfrastructureWorkforce(state);
 const event=Math.random()<.32?MARKET_EVENTS[Math.floor(Math.random()*MARKET_EVENTS.length)]:null;
 const logisticsSubsidiaries=(state.companies||[]).filter(c=>c.companyType==='logistics'&&(Number(c.logisticsCenters)||0)>0);
 state.shops.forEach(shop=>{
  const demand=(Math.random()-.46)*.085;
  const supplier=(Math.random()-.48)*.05;
  shop.employees=Number.isFinite(Number(shop.employees))?Math.max(0,Math.floor(Number(shop.employees))):3;
  const payrollCost=shop.employees*180;
  const previousLogistics=Number(shop.logisticsCost)||0;shop.cost=Math.max(0,Math.round(Math.max(0,shop.cost-(Number(shop.payrollCost)||0)-previousLogistics-(Number(shop.marketingCost)||0))*(1+supplier)));
  const logisticsImpact=logistics.byShop.get(shop.id);if(logisticsImpact)shop.revenue=Math.round(shop.revenue*logisticsImpact.stockFactor);const marketingImpact=marketing.byShop.get(shop.id);shop.revenue=Math.max(0,Math.round(shop.revenue*(1+demand)*(1+(marketingImpact?.boost||0))));const manager=state.market.find(c=>(c.id===shop.companyId||c.subsidiaryId===shop.companyId)&&c.share>=50);if(manager?.strategy==='expansion')shop.revenue=Math.round(shop.revenue*1.008);else if(manager?.strategy==='profit')shop.cost=Math.round(shop.cost*.992);else if(manager?.strategy==='balanced')shop.revenue=Math.round(shop.revenue*1.002);
  const groupCenters=Math.min(3,logisticsSubsidiaries.filter(c=>c.parentCompanyId===shop.companyId).reduce((n,c)=>n+(Number(c.logisticsCenters)||0),0));
  if(groupCenters){shop.revenue=Math.round(shop.revenue*(1+groupCenters*.04));shop.cost=Math.round(shop.cost*(1-groupCenters*.03));}
  if(event){shop.revenue=Math.round(shop.revenue*event.revenue);shop.cost=Math.round(shop.cost*event.cost);}
  shop.payrollCost=payrollCost;shop.logisticsCost=logisticsImpact?.dailyCost||0;shop.marketingCost=marketingImpact?.dailyCost||0;shop.cost+=payrollCost+shop.logisticsCost+shop.marketingCost;
 });
 if(event){state.events??=[];state.events.unshift({icon:event.icon,title:event.title,detail:event.detail,day:state.day});state.events=state.events.slice(0,12);}
 const revenue=totalRevenue(state),costs=totalCosts(state),dividendIncome=dividends(state);
 const profit=revenue-costs+dividendIncome;
 state.cash+=profit;
 state.market.forEach(company=>{company.value=Math.max(50000,Math.round(company.value*(1+(Math.random()-.43)*.012)));});
 state.history.push(Math.max(1000,profit));state.history=state.history.slice(-7);
 return {profit,revenue,costs,dividendIncome,event,logistics,marketing,procurement,b2b,factories,infrastructurePayroll};
}
