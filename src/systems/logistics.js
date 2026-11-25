const WAREHOUSE_TYPES={
 small:{name:'Magazyn lokalny',cost:180000,capacity:6000,dailyCost:320,employees:4,vehicles:2,emoji:'🏬'},
 regional:{name:'Centrum regionalne',cost:620000,capacity:24000,dailyCost:1050,employees:14,vehicles:8,emoji:'🏭'},
 national:{name:'Centrum krajowe',cost:1850000,capacity:90000,dailyCost:3200,employees:38,vehicles:24,emoji:'🏢'}
};
export const warehouseTypes=()=>WAREHOUSE_TYPES;
export const warehouseBuildCost=(type)=>WAREHOUSE_TYPES[type]?.cost||0;
export function createWarehouse(state,{name,country,type,parentWarehouseId=null}){
 const spec=WAREHOUSE_TYPES[type],nation=String(country||'').trim(),label=String(name||'').trim();
 if(!spec)throw new Error('Wybierz prawidłowy typ magazynu.');
 if(!nation)throw new Error('Wybierz kraj magazynu.');
 if(!label)throw new Error('Wpisz nazwę magazynu.');
 if(state.cash<spec.cost)throw new Error('Za mało gotówki. Potrzeba '+spec.cost.toLocaleString('pl-PL')+' zł.');
 const parent=parentWarehouseId?state.warehouses.find(w=>w.id===Number(parentWarehouseId)):null;
 if(parentWarehouseId&&(!parent||parent.type==='small'||parent.country!==nation||type!=='small'))throw new Error('Magazyn lokalny musi być przypisany do magazynu głównego z tego samego kraju.');
 const warehouse={id:state.nextId++,name:label,country:nation,type,parentWarehouseId:parent?.id||null,capacity:spec.capacity,stock:Math.round(spec.capacity*.35),dailyCost:spec.dailyCost,employees:spec.employees,vehicles:spec.vehicles,deliveryCapacity:spec.vehicles*450,level:1,createdDay:state.day};
 state.warehouses??=[];state.warehouses.push(warehouse);state.cash-=spec.cost;
 return {warehouse,cost:spec.cost};
}
export function assignShopWarehouse(state,shopId,warehouseId){
 const shop=state.shops.find(x=>x.id===Number(shopId));
 if(!shop)throw new Error('Nie znaleziono sklepu.');
 if(warehouseId===null||warehouseId===''||warehouseId===undefined){shop.warehouseId=null;return shop;}
 const warehouse=state.warehouses.find(x=>x.id===Number(warehouseId));
 if(!warehouse)throw new Error('Nie znaleziono magazynu.');
 if((shop.country||'Polska')!==warehouse.country)throw new Error('Magazyn i sklep muszą działać w tym samym kraju.');
 shop.warehouseId=warehouse.id;return shop;
}
export function upgradeWarehouse(state,id){
 const warehouse=state.warehouses.find(x=>x.id===Number(id));
 if(!warehouse)throw new Error('Nie znaleziono magazynu.');
 const cost=Math.round(warehouse.capacity*.095*35+warehouse.level*45000);
 if(state.cash<cost)throw new Error('Za mało gotówki na rozbudowę. Potrzeba '+cost.toLocaleString('pl-PL')+' zł.');
 state.cash-=cost;warehouse.level=(warehouse.level||1)+1;warehouse.capacity=Math.round(warehouse.capacity*1.55);warehouse.dailyCost=Math.round(warehouse.dailyCost*1.18);warehouse.employees=Math.ceil(warehouse.employees*1.2);warehouse.vehicles=(warehouse.vehicles||1)+Math.max(1,Math.ceil((warehouse.vehicles||1)*.25));warehouse.deliveryCapacity=warehouse.vehicles*450;
 return {warehouse,cost};
}
// Dzienny fundusz płac zaplecza logistycznego.
// Zatrudnienie jest zapisane przy każdym magazynie; stawka odpowiada
// bazowemu kosztowi pracownika używanemu w pozostałych modułach gry.
export function scaleInfrastructureWorkforce(state){
 const warehouses=Array.isArray(state.warehouses)?state.warehouses:[];
 const payroll=warehouses.reduce((total,warehouse)=>{
  const employees=Math.max(0,Number(warehouse.employees)||0);
  return total+employees*180;
 },0);
 state.infrastructurePayroll=Math.round(payroll);
 return state.infrastructurePayroll;
}

export function processLogisticsDay(state){
 const result={byShop:new Map(),purchased:0,delivered:0,stockouts:0,centralCost:0};
 for(const local of (state.warehouses||[]).filter(w=>w.type==='small'&&w.parentWarehouseId)){const parent=state.warehouses.find(w=>w.id===local.parentWarehouseId);if(parent){const target=Math.min(local.capacity,Math.max(0,Math.round(local.capacity*.65)-local.stock)),transfer=Math.min(target,Math.max(0,parent.stock));parent.stock-=transfer;local.stock+=transfer;local.lastTransfer=transfer;}}
 for(const warehouse of (state.warehouses||[])){
  const shops=state.shops.filter(shop=>shop.warehouseId===warehouse.id);
  if(!shops.length){const hasChildren=(state.warehouses||[]).some(w=>w.parentWarehouseId===warehouse.id);if(hasChildren){const target=Math.min(warehouse.capacity,Math.round(warehouse.capacity*.65)),order=Math.max(0,Math.min(warehouse.capacity-warehouse.stock,target-warehouse.stock,Number(warehouse.deliveryCapacity)||((warehouse.vehicles||1)*450)));warehouse.stock+=order;warehouse.lastOrder=order;warehouse.lastDeliveryDay=state.day;result.purchased+=order;result.centralCost+=order*35+(Number(warehouse.dailyCost)||0);}continue;}
  const demandByShop=shops.map(shop=>({shop,demand:Math.max(1,Math.ceil((Number(shop.revenue)||0)/120))}));
  const totalDemand=demandByShop.reduce((n,x)=>n+x.demand,0),available=Math.max(0,Number(warehouse.stock)||0);
  let remaining=available;
  const coverage=demandByShop.map(item=>{const fulfilled=Math.min(item.demand,remaining);remaining-=fulfilled;return {...item,fulfilled,ratio:fulfilled/item.demand};});
  warehouse.stock=remaining;
  const target=Math.min(warehouse.capacity,Math.max(totalDemand*3,Math.round(warehouse.capacity*.2)));
  const order=Math.max(0,Math.min(warehouse.capacity-warehouse.stock,target-warehouse.stock,Number(warehouse.deliveryCapacity)||((warehouse.vehicles||1)*450)));
  const purchaseCost=order*35;warehouse.stock+=order;warehouse.lastOrder=order;warehouse.lastDeliveryDay=state.day;
  result.purchased+=order;result.delivered+=coverage.reduce((n,x)=>n+x.fulfilled,0);
  const fixedPerShop=warehouse.dailyCost/shops.length,procurementPerShop=purchaseCost/shops.length;
  coverage.forEach(item=>{
   const stockFactor=.65+.35*item.ratio;
   if(item.ratio<.999)result.stockouts++;
   result.byShop.set(item.shop.id,{dailyCost:Math.round(fixedPerShop+procurementPerShop+80),stockFactor});
  });
 }
 state.logisticsInfrastructureCost=result.centralCost;
 return result;
}
