import {rotateShareholders,generateMarketCompany,processBuyoutOffers,validateShareLedgers} from '../systems/ownership.js?v=9';

export function advanceMarketDay(state){
 state.market??=[];
 rotateShareholders(state);
 processBuyoutOffers(state);
 const listed=generateMarketCompany(state);
 validateShareLedgers(state);
 return {listed,companies:state.market.length,activeOffers:(state.buyoutOffers||[]).length};
}
export function getOwnershipTotals(company){
 const holders=company.shareholders||[];
 return {
  player:Math.max(0,Math.min(100,Number(company.share)||0)),
  investors:holders.reduce((sum,h)=>sum+(Number(h.share)||0),0),
  total:Math.min(100,(Number(company.share)||0)+holders.reduce((sum,h)=>sum+(Number(h.share)||0),0))
 };
}
