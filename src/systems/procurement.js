const CATALOG=[
{id:'bulk',name:'Zakupy hurtowe',kind:'Hurtownia',cost:18000,rate:.035,description:'Stałe rabaty przy dużych zamówieniach.'},
{id:'direct',name:'Dostawy bezpośrednie',kind:'Producent',cost:26000,rate:.045,description:'Omiń pośredników i obniż ceny zakupu.'},
{id:'regional',name:'Regionalna sieć dostawców',kind:'Lokalni dostawcy',cost:14000,rate:.025,description:'Krótsze łańcuchy dostaw i lepsze stawki.'},
{id:'global',name:'Globalny sourcing',kind:'Import',cost:52000,rate:.065,description:'Negocjowane ceny przy zakupach międzynarodowych.'},
{id:'fresh',name:'Kontrakt świeżej żywności',kind:'Żywność',cost:22000,rate:.035,description:'Lepsze ceny produktów świeżych i krótsze terminy.'},
{id:'private',name:'Marka własna',kind:'Produkcja',cost:68000,rate:.075,description:'Wyższa marża dzięki produktom pod własną marką.'},
{id:'energy',name:'Grupowy zakup energii',kind:'Energia',cost:30000,rate:.04,description:'Negocjowana stawka energii dla całej sieci.'},
{id:'packaging',name:'Opakowania w abonamencie',kind:'Opakowania',cost:12000,rate:.02,description:'Stałe ceny materiałów i opakowań.'},
{id:'seasonal',name:'Kontrakt sezonowy',kind:'Sezon',cost:16000,rate:.03,description:'Zabezpieczenie cen w okresach szczytowego popytu.'},
{id:'tech',name:'Platforma zakupowa B2B',kind:'Technologia',cost:44000,rate:.05,description:'Automatyczne porównywanie ofert dostawców.'},
{id:'cold',name:'Łańcuch chłodniczy',kind:'Logistyka',cost:36000,rate:.04,description:'Mniej strat w transporcie produktów chłodzonych.'},
{id:'exclusive',name:'Wyłączność dystrybucyjna',kind:'Negocjacje',cost:90000,rate:.085,description:'Największe rabaty, ale wysoki koszt wejścia.'}
];
export const getSupplierContracts=()=>CATALOG;
export function activateSupplierContract(state,id){
 const contract=CATALOG.find(x=>x.id===id);if(!contract)throw Error('Nie znaleziono kontraktu dostawcy.');
 state.supplierContracts??=[];if(state.supplierContracts.some(x=>x.id===id))throw Error('Ten kontrakt jest już aktywny.');
 if(state.supplierContracts.length>=3)throw Error('Możesz mieć maksymalnie 3 aktywne kontrakty dostawców.');
 if(state.cash<contract.cost)throw Error('Za mało gotówki na podpisanie kontraktu.');
 state.cash-=contract.cost;state.supplierContracts.push({...contract,signedDay:state.day});return contract;
}
export function processProcurementDay(state){
 const active=state.supplierContracts||[],rate=Math.min(.22,active.reduce((n,x)=>n+(Number(x.rate)||0),0));let savings=0;
 for(const shop of state.shops){const fixed=(Number(shop.payrollCost)||0)+(Number(shop.logisticsCost)||0)+(Number(shop.marketingCost)||0);const variable=Math.max(0,(Number(shop.cost)||0)-fixed);const saving=Math.round(variable*rate);shop.cost=Math.max(fixed,Math.round((Number(shop.cost)||0)-saving));savings+=saving;}
 return {rate,savings,active:active.length};
}
