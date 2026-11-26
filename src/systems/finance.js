import {processTechnologyCompaniesDay} from './technology_holding.js?v=4';
export const totalRevenue=state=>Number(state.techRevenue)||0;
export const totalCosts=state=>Number(state.techCost)||0;
export const shareAssets=state=>(state.market||[]).reduce((sum,company)=>sum+company.value*company.share/100,0);
export const operatingProfit=state=>totalRevenue(state)-totalCosts(state);
export const dividends=state=>(state.market||[]).reduce((sum,company)=>sum+company.value*company.share/100*company.dividend,0);
export const assetValue=state=>(state.companies||[]).reduce((sum,company)=>sum+(Number(company.value)||0),0)+shareAssets(state);
export const netWorth=state=>state.cash+assetValue(state);
export function closeBusinessDay(state){
 const technology=processTechnologyCompaniesDay(state);
 const revenue=totalRevenue(state),costs=totalCosts(state),dividendIncome=dividends(state);
 const profit=revenue-costs+dividendIncome;
 state.cash+=profit;
 (state.market||[]).forEach(company=>{company.value=Math.max(50000,Math.round(company.value*(1+(Math.random()-.43)*.012)));});
 state.history??=[];state.history.push(Math.max(1000,profit));state.history=state.history.slice(-30);
 state.events??=[];
 if(technology?.event)state.events.unshift({...technology.event,day:state.day});
 state.events=state.events.slice(0,20);
 return {profit,revenue,costs,dividendIncome,technology};
}
