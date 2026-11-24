import {openCountryShops,estimateCountryShopCost,shopFormats} from './shops.js?v=5';
import {createFactory,factoryProducts} from './factories.js?v=5';
import {createWarehouse} from './logistics.js?v=3';

const formatFor = industry => {
 const s=String(industry||'').toLowerCase();
 if(/elektr|tech/.test(s))return 'Sklep elektroniczny';
 if(/odzie|mod|fashion/.test(s))return 'Sklep odzieżowy';
 if(/droger|farm/.test(s))return 'Drogeria';
 if(/logist/.test(s))return 'Hurtownia cash & carry';
 if(/dom|mebl/.test(s))return 'Sklep meblowy';
 if(/żyw|spoż|food|napoj/.test(s))return 'Supermarket';
 return 'Market osiedlowy';
};
const productFor = industry => {
 const s=String(industry||'').toLowerCase();
 const terms=/elektr|tech/.test(s)?['Elektronika']: /odzie|mod/.test(s)?['Odzież']: /droger|farm/.test(s)?['Higiena']: /dom|mebl/.test(s)?['Dom i ogród']:['Żywność','Nabiał','Napoje','Produkty suche'];
 return factoryProducts.find(p=>terms.includes(p.category))||factoryProducts[0];
};
const addEvent=(state,icon,title,detail)=>{state.events??=[];state.events.unshift({icon,title,detail,day:state.day});state.events=state.events.slice(0,12);};
function attachCompany(state,listed){
 if(listed.subsidiaryId&&state.companies.some(c=>c.id===listed.subsidiaryId))return state.companies.find(c=>c.id===listed.subsidiaryId);
 const company={id:state.nextId++,name:listed.name,industry:listed.industry,share:listed.share,value:listed.value,employees:Math.max(5,Math.round((listed.value||200000)/35000)),stores:0,acquired:true,parentCompanyId:null,operatingCountries:['Polska'],companyType:'operating',ownBrands:Array.isArray(listed.marketBrands)?listed.marketBrands.map(b=>({...b})):[],autoDevelopment:true,sourceMarketId:listed.id};
 state.companies.push(company);listed.controlled=true;listed.subsidiaryId=company.id;
 const count=Math.max(1,Math.min(15,Number(listed.marketStores)||1)),type=formatFor(company.industry),cost=estimateCountryShopCost(type,count);
 const acquired=openCountryShops(state,{name:company.name,type,country:'Polska',count});
 state.cash+=acquired.investment;
 acquired.shops.forEach(shop=>{shop.companyId=company.id;shop.brandId=company.ownBrands[0]?.id||null;});
 company.stores=acquired.shops.length;
 addEvent(state,'🏢','Spółka dołączyła do holdingu',company.name+' · przejęto '+count+' istniejących sklepów i aktywa · automatyczny rozwój uruchomiony');
 return company;
}
function openAutoStore(state,company){
 const country=(company.operatingCountries||[]).find(c=>c==='Polska')||company.operatingCountries?.[0]||'Polska';
 const type=formatFor(company.industry),cost=estimateCountryShopCost(type,1);
 if(state.cash<cost)return false;
 const result=openCountryShops(state,{name:company.name,type,country,count:1});
 const shop=result.shops[0];shop.companyId=company.id;shop.brandId=company.ownBrands?.[0]?.id||null;
 const warehouses=(state.warehouses||[]).filter(w=>w.country===country).sort((a,b)=>(a.assignedShopCount||0)-(b.assignedShopCount||0));
 if(warehouses[0]){shop.warehouseId=warehouses[0].id;warehouses[0].assignedShopCount=(warehouses[0].assignedShopCount||0)+1;}
 company.stores=(Number(company.stores)||0)+1;company.value=(Number(company.value)||0)+Math.round(cost*.75);
 addEvent(state,'🏬','Automatyczna ekspansja sklepu',company.name+' · '+country+' · '+type);
 return true;
}
function createOwnBrand(state,company){
 if((company.ownBrands||[]).length)return false;
 company.ownBrands=[{id:state.nextId++,name:company.name.split(' ')[0]+' Select',category:company.industry||'Produkty codzienne',quality:65,createdDay:state.day,products:[]}];
 addEvent(state,'🏷️','Nowa marka własna',company.name+' wprowadza markę '+company.ownBrands[0].name);
 return true;
}
function autoBuildFactory(state,company){
 const companyFactories=(state.factories||[]).filter(f=>f.companyId===company.id),limit=1+Math.floor((Number(company.stores)||0)/5);
 if(companyFactories.length>=limit)return false;
 const used=new Set(companyFactories.map(f=>f.productId)),preferred=productFor(company.industry);
 const product=factoryProducts.find(p=>!used.has(p.id)&&p.category===preferred.category)||factoryProducts.find(p=>!used.has(p.id));
 if(!product||state.cash<product.factoryCost)return false;
 const r=createFactory(state,{name:company.name+' — fabryka '+product.category,productId:product.id,companyId:company.id});
 const factory=r.factory;factory.playerShare=0;factory.shareholders=[{name:company.name,share:100,type:'Spółka'}];factory.autoBuilt=true;
 addEvent(state,'🏭','Spółka uruchomiła fabrykę',company.name+' · '+product.name);
 return true;
}
function autoBuildWarehouse(state,company){
 const country=(company.operatingCountries||[])[0]||'Polska';
 const owned=(state.warehouses||[]).filter(w=>w.ownerCompanyId===company.id),limit=(Number(company.stores)||0)>=25?3:(Number(company.stores)||0)>=10?2:1;
 if(owned.length>=limit)return false;
 const type=owned.length===0?'small':(company.stores||0)>=8?'regional':'small',specCost=type==='small'?180000:620000;
 if(state.cash<specCost)return false;
 const r=createWarehouse(state,{name:company.name+' — '+(type==='small'?'magazyn lokalny':'centrum regionalne'),country,type});
 r.warehouse.ownerCompanyId=company.id;
 (state.shops||[]).filter(s=>s.companyId===company.id&&!s.warehouseId).forEach(s=>{s.warehouseId=r.warehouse.id;r.warehouse.assignedShopCount=(r.warehouse.assignedShopCount||0)+1;});
 addEvent(state,'📦','Rozbudowa zaplecza logistycznego',company.name+' · '+r.warehouse.name);
 return true;
}
function autoBuildLogisticsChild(state,company){
 let child=(state.companies||[]).find(c=>c.parentCompanyId===company.id&&c.companyType==='logistics');
 const target=Math.min(3,Math.max(1,Math.floor((Number(company.stores)||0)/5)));
 if(child&&Number(child.logisticsCenters||0)>=target)return false;
 const cost=1200000;if(state.cash<cost)return false;
 state.cash-=cost;
 if(!child){child={id:state.nextId++,name:company.name+' Logistics',industry:'Logistyka',companyType:'logistics',share:100,value:cost,employees:8,stores:0,logisticsCenters:0,parentCompanyId:company.id,operatingCountries:[...(company.operatingCountries||['Polska'])],acquired:true,autoDevelopment:true};state.companies.push(child);}
 child.logisticsCenters=(Number(child.logisticsCenters)||0)+1;child.value=(Number(child.value)||0)+cost;company.value=(Number(company.value)||0)+cost;
 addEvent(state,'🚚','Rozbudowano własne centrum logistyczne',child.name+' · centra: '+child.logisticsCenters);
 return true;
}
export function developControlledCompanies(state,{immediate=false}={}){
 state.companies??=[];state.market??=[];state.factories??=[];state.warehouses??=[];state.shops??=[];
 for(const listed of state.market.filter(c=>Number(c.share)>=50)){
  const company=attachCompany(state,listed);
  if(immediate&&!company.stores&&!state.shops.some(s=>s.companyId===company.id))openAutoStore(state,company);
 }
 for(const company of state.companies.filter(c=>c.acquired||c.autoDevelopment)){
  company.ownBrands??=[];company.stores=state.shops.filter(s=>s.companyId===company.id).length;
  if(!company.ownBrands.length)createOwnBrand(state,company);
  if(!company.stores)openAutoStore(state,company);
  if(company.stores>=2)autoBuildFactory(state,company);
  if(company.stores>=2)autoBuildWarehouse(state,company);
  if(company.stores>=5)autoBuildLogisticsChild(state,company);
  const interval=company.stores>=20?1:company.stores>=8?2:3;
  if(!immediate&&state.day>1&&state.day%(interval*5)===0&&state.cash>=estimateCountryShopCost(formatFor(company.industry),1))openAutoStore(state,company);
  if(!immediate&&state.day>1&&state.day%15===0)company.employees=Math.max(Number(company.employees)||0,Math.ceil(company.stores*4+((state.factories||[]).filter(f=>f.companyId===company.id).length*12)));
 }
 return state.companies;
}
export function developPublicCompanies(state){
 state.market??=[];
 for(const company of state.market.filter(c=>!c.controlled)){
  company.marketStores??=Math.max(1,Math.min(30,Math.round((Number(company.value)||200000)/220000)));
  company.marketBrands??=[{id:state.nextId++,name:String(company.name).split(' ')[0]+' Select',category:company.industry||'Retail',quality:55+Math.round(Math.random()*25)}];
  company.corporateCash??=Math.max(80000,Math.round((Number(company.value)||200000)*.08));
  company.corporateCash+=Math.max(1000,company.marketStores*2200);
  if(state.day>1&&state.day%5===0&&company.marketStores<40&&company.corporateCash>=125000){
   company.marketStores++;company.corporateCash-=125000;company.value=(Number(company.value)||0)+155000;
   addEvent(state,'🏬','Ekspansja spółki giełdowej',company.name+' otworzyła nową placówkę. Łącznie: '+company.marketStores);
  }
  company.marketFactories??=0;company.marketWarehouses??=0;company.marketLogisticsCenters??=0;
  if(state.day>1&&state.day%20===0&&company.marketFactories<Math.max(1,Math.floor((Number(company.value)||0)/1800000))&&company.corporateCash>=420000){
   company.marketFactories++;company.corporateCash-=420000;company.value+=520000;
   addEvent(state,'🏭','Inwestycja przemysłowa spółki giełdowej',company.name+' rozbudowała własne moce produkcyjne');
  }
  if(state.day>1&&state.day%25===0&&company.marketWarehouses<Math.max(1,Math.floor(company.marketStores/8))&&company.corporateCash>=260000){
   company.marketWarehouses++;company.corporateCash-=260000;company.value+=300000;
  }
  if(state.day>1&&state.day%30===0&&company.marketStores>=8&&company.marketLogisticsCenters<3&&company.corporateCash>=750000){
   company.marketLogisticsCenters++;company.corporateCash-=750000;company.value+=850000;
   addEvent(state,'🚚','Rozwój logistyki spółki giełdowej',company.name+' uruchomiła własne centrum logistyczne');
  }
 }
}
export function processGroupEconomyDay(state){developPublicCompanies(state);developControlledCompanies(state);return {companies:(state.companies||[]).filter(c=>c.acquired||c.autoDevelopment).length,stores:(state.shops||[]).length};}
