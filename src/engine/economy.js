import {closeBusinessDay} from '../systems/finance.js?v=17';
import {applyInitiativesDaily} from '../systems/initiatives.js?v=5';
import {advanceMarketDay} from './market.js?v=1';
import {assertGameInvariants} from './invariants.js?v=1';
import {processEmpireSystemsDay} from '../systems/empire_systems.js?v=4';
import {processDiversifiedEmpireDay} from '../systems/diversified_empire.js?v=3';
import {processStrategicEventsDay} from '../systems/strategic_events.js?v=2';
import {advanceStockMarketDay} from '../systems/stock_market.js?v=2';

export function simulateGameDay(state){
 state.day=Math.max(1,Math.floor(Number(state.day)||1))+1;
 const finances=closeBusinessDay(state);
 const empireSystems=processEmpireSystemsDay(state);
 const diversifiedEmpire=processDiversifiedEmpireDay(state);
 const strategicEvents=processStrategicEventsDay(state);
 const initiatives=applyInitiativesDaily(state);
 const market=advanceMarketDay(state);
 const stockMarket=advanceStockMarketDay(state);
 assertGameInvariants(state);
 state.cashHistory??=[];
 state.cashHistory.push(Number(state.cash)||0);
 state.cashHistory=state.cashHistory.slice(-60);
 state.engineStats??={daysProcessed:0,lastProcessedDay:state.day,totalMarketCompanies:0};
 state.engineStats.daysProcessed++;
 state.engineStats.lastProcessedDay=state.day;
 state.engineStats.totalMarketCompanies=market.companies;
 return {finances,empireSystems,diversifiedEmpire,strategicEvents,initiatives,market,stockMarket};
}
