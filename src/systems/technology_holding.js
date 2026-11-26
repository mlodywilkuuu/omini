export const TECHNOLOGY_FOCI = [
 {id:'os',name:'Systemy operacyjne',product:'System operacyjny',basePrice:180,margin:.62,description:'Systemy desktopowe, mobilne i platformy urządzeń.'},
 {id:'ai',name:'Sztuczna inteligencja',product:'Model AI',basePrice:260,margin:.68,description:'Modele AI, asystenci i automatyzacja.'},
 {id:'cloud',name:'Chmura i centra danych',product:'Usługa chmurowa',basePrice:210,margin:.58,description:'Hosting, infrastruktura i usługi SaaS.'},
 {id:'chips',name:'Półprzewodniki',product:'Układ scalony',basePrice:320,margin:.48,description:'Procesory, akceleratory i układy specjalizowane.'},
 {id:'robotics',name:'Robotyka',product:'Robot przemysłowy',basePrice:420,margin:.42,description:'Roboty przemysłowe i automatyka.'},
 {id:'security',name:'Cyberbezpieczeństwo',product:'Pakiet bezpieczeństwa',basePrice:160,margin:.72,description:'Ochrona systemów, sieci i danych.'},
 {id:'devices',name:'Urządzenia i elektronika',product:'Urządzenie smart',basePrice:240,margin:.46,description:'Sprzęt konsumencki i urządzenia IoT.'},
 {id:'telecom',name:'Telekomunikacja i sieci',product:'Platforma sieciowa',basePrice:280,margin:.55,description:'Sieci nowej generacji i infrastruktura.'},
 {id:'biotech',name:'Biotechnologia obliczeniowa',product:'Platforma bioinformatyczna',basePrice:520,margin:.64,description:'AI dla biologii i medtech.'},
 {id:'xr',name:'Rzeczywistość rozszerzona',product:'Platforma XR',basePrice:340,margin:.52,description:'Systemy przestrzenne i interfejsy immersyjne.'},
 {id:'browser',name:'Przeglądarki internetowe',product:'Przeglądarka internetowa',basePrice:190,margin:.76,description:'Przeglądarki, silniki renderujące, synchronizacja i prywatność.'},
 {id:'database',name:'Bazy danych',product:'System bazodanowy',basePrice:420,margin:.72,description:'Relacyjne i wektorowe bazy danych, hurtownie i silniki analityczne.'},
 {id:'search',name:'Wyszukiwarki i reklama',product:'Silnik wyszukiwania',basePrice:280,margin:.78,description:'Wyszukiwanie, indeksowanie, reklama i odkrywanie treści.'},
 {id:'devtools',name:'Narzędzia dla programistów',product:'Platforma developerska',basePrice:350,margin:.74,description:'IDE, API, CI/CD, repozytoria i narzędzia zespołowe.'},
 {id:'mobile',name:'Systemy mobilne',product:'Mobilny system operacyjny',basePrice:390,margin:.64,description:'Systemy mobilne, sklepy aplikacji i usługi urządzeń.'},
 {id:'productivity',name:'Oprogramowanie biurowe',product:'Pakiet produktywności',basePrice:240,margin:.79,description:'Pakiety biurowe, komunikacja i współpraca.'},
 {id:'gaming',name:'Silniki gier i rozrywka',product:'Silnik gier',basePrice:460,margin:.67,description:'Silniki 3D, platformy gier i technologie rozrywkowe.'}
];
export const TECHNOLOGY_CATALOG=[{"id":"edge_ai","name":"Edge AI","focus":"ai","category":"Sztuczna inteligencja","tier":1,"cost":85000,"day":3,"effect":"Modele AI uruchamiane bezpośrednio na urządzeniach."},{"id":"quantum","name":"Obliczenia kwantowe","focus":"chips","category":"Półprzewodniki","tier":2,"cost":260000,"day":8,"effect":"Układy do obliczeń specjalistycznych."},{"id":"neuro","name":"Interfejsy neuronowe","focus":"ai","category":"Sztuczna inteligencja","tier":2,"cost":220000,"day":7,"effect":"Interfejsy człowiek–komputer."},{"id":"autonomous","name":"Autonomiczne systemy","focus":"robotics","category":"Robotyka","tier":1,"cost":110000,"day":4,"effect":"Maszyny podejmujące decyzje bez operatora."},{"id":"green_compute","name":"Energooszczędne obliczenia","focus":"cloud","category":"Chmura i centra danych","tier":1,"cost":95000,"day":4,"effect":"Oszczędniejsze centra danych."},{"id":"post_quantum","name":"Kryptografia postkwantowa","focus":"security","category":"Cyberbezpieczeństwo","tier":2,"cost":180000,"day":6,"effect":"Ochrona danych przed atakami kwantowymi."},{"id":"spatial_os","name":"Systemy przestrzenne","focus":"os","category":"Systemy operacyjne","tier":2,"cost":210000,"day":8,"effect":"Interfejsy przestrzenne i systemy XR."},{"id":"iot_mesh","name":"Sieci IoT Mesh","focus":"devices","category":"Urządzenia i elektronika","tier":1,"cost":90000,"day":3,"effect":"Rozproszone sieci inteligentnych urządzeń."},{"id":"photonic","name":"Fotoniczne procesory","focus":"chips","category":"Półprzewodniki","tier":3,"cost":520000,"day":15,"effect":"Przetwarzanie danych światłem."},{"id":"fusion","name":"Robotyka kooperacyjna","focus":"robotics","category":"Robotyka","tier":2,"cost":240000,"day":9,"effect":"Współpraca robotów i ludzi."},{"id":"digital_twin","name":"Cyfrowe bliźniaki","focus":"cloud","category":"Chmura i centra danych","tier":2,"cost":175000,"day":7,"effect":"Symulacje fabryk i infrastruktury."},{"id":"bio_compute","name":"Bioinformatyka AI","focus":"ai","category":"Sztuczna inteligencja","tier":3,"cost":430000,"day":14,"effect":"Modele AI dla biologii i medycyny."},{"id":"zero_trust","name":"Architektura Zero Trust","focus":"security","category":"Cyberbezpieczeństwo","tier":1,"cost":105000,"day":5,"effect":"Kontrola dostępu i tożsamości."},{"id":"wearables","name":"Interfejsy ubieralne","focus":"devices","category":"Urządzenia i elektronika","tier":2,"cost":195000,"day":8,"effect":"Nowe urządzenia osobiste i sensory."},{"id":"autonomous_agents","name":"Agenci autonomiczni","focus":"ai","category":"Sztuczna inteligencja","tier":3,"cost":480000,"day":13,"effect":"Agenci AI do złożonych zadań."},{"id":"silicon_3d","name":"Układy 3D","focus":"chips","category":"Półprzewodniki","tier":2,"cost":280000,"day":10,"effect":"Układy wielowarstwowe."},{"id":"orbital_cloud","name":"Infrastruktura orbitalna","focus":"cloud","category":"Chmura i centra danych","tier":3,"cost":750000,"day":20,"effect":"Obliczenia z użyciem infrastruktury satelitarnej."}];
export function ensureTechnologyTree(state){state.technologyTree??={};for(const t of TECHNOLOGY_CATALOG)if(!state.technologyTree[t.id])state.technologyTree[t.id]={discovered:Number(state.day||1)>=t.day,researched:false,level:0,discoveredDay:Number(state.day||1)>=t.day?1:null};return state.technologyTree;}
export function discoverTechnology(state){const tree=ensureTechnologyTree(state),candidates=TECHNOLOGY_CATALOG.filter(t=>!tree[t.id].discovered&&Number(state.day)>=t.day);let next;if(candidates.length)next=candidates.sort((a,b)=>a.tier-b.tier||a.day-b.day)[0];else{const focus=TECHNOLOGY_FOCI[Math.floor(Math.random()*TECHNOLOGY_FOCI.length)],tier=Math.min(5,Math.floor(Number(state.day||1)/12)+1),prefix=['Adaptive','Neural','Quantum','Distributed','Synthetic','Autonomous','Photonic','Cognitive','Hyper-scale','Predictive'],suffix=['Fabric','Engine','Protocol','Architecture','Matrix','Runtime','Network','Platform','Core','Stack'],name=prefix[Math.floor(Math.random()*prefix.length)]+' '+focus.name+' '+suffix[Math.floor(Math.random()*suffix.length)],id='frontier_'+state.day;next={id,name,focus:focus.id,category:focus.name,tier,cost:Math.round((90000+Number(state.day||1)*18000)*tier),day:Number(state.day||1),effect:'Nowa generacja '+focus.name.toLowerCase()+'. Otwiera kolejne możliwości produktów i wzmacnia potencjał badawczy holdingu.'};TECHNOLOGY_CATALOG.push(next);tree[id]={discovered:false,researched:false,level:0,discoveredDay:null};}tree[next.id].discovered=true;tree[next.id].discoveredDay=state.day;state.events??=[];state.events.unshift({icon:'🧬',title:'Odkryto nową technologię',detail:next.name+' jest dostępna w laboratorium R&D.',day:state.day});state.events=state.events.slice(0,20);return next;}
export function researchTechnology(state,id){const tree=ensureTechnologyTree(state),item=TECHNOLOGY_CATALOG.find(t=>t.id===id),entry=tree[id];if(!item||!entry?.discovered)throw new Error('Technologia nie została jeszcze odkryta.');if(entry.researched)throw new Error('Ta technologia jest już opracowana.');if(state.cash<item.cost)throw new Error('Badania wymagają '+item.cost.toLocaleString('pl-PL')+' zł.');state.cash-=item.cost;entry.researched=true;entry.level=1;entry.researchedDay=state.day;for(const c of state.companies||[]){c.techResearchLevel=(Number(c.techResearchLevel)||1)+.15;c.value=(Number(c.value)||50000)+Math.round(item.cost*.08);}state.events??=[];state.events.unshift({icon:'🔬',title:'Zakończono badania',detail:item.name+' — wzrost wydajności produktów.',day:state.day});state.events=state.events.slice(0,20);return {technology:item,cost:item.cost};}

const focusById=id=>TECHNOLOGY_FOCI.find(x=>x.id===id)||TECHNOLOGY_FOCI[0];
const controlled=c=>Number(c?.share)>=50;
export function ensureTechnologyCompanies(state){
 state.companies??=[];
 ensureTechnologyTree(state);
 for(const c of state.companies){
  c.techFocus??='os';
  c.techStaff=Math.max(0,Math.floor(Number(c.techStaff)||0));
  c.techProducts=Array.isArray(c.techProducts)?c.techProducts:[];
  c.techResearchLevel=Math.max(1,Number(c.techResearchLevel)||1);
 }
 return state.companies;
}
export function setCompanyTechFocus(state,companyId,focusId){
 ensureTechnologyCompanies(state);
 const c=state.companies.find(x=>Number(x.id)===Number(companyId));
 if(!c)throw new Error('Nie znaleziono spółki.');
 if(!controlled(c))throw new Error('Panel strategii wymaga co najmniej 50% udziałów.');
 const focus=focusById(focusId);
 c.techFocus=focus.id;
 c.strategy='technology';
 const listed=(state.market||[]).find(x=>Number(x.subsidiaryId)===Number(c.id));
 if(listed)listed.techFocus=focus.id;
 return {company:c,focus};
}
export function hireTechnologyStaff(state,companyId,count){
 ensureTechnologyCompanies(state);
 const c=state.companies.find(x=>Number(x.id)===Number(companyId));
 if(!c)throw new Error('Nie znaleziono spółki.');
 if(!controlled(c))throw new Error('Możesz zatrudniać tylko w spółce, nad którą masz kontrolę.');
 const n=Math.floor(Number(count));
 if(!Number.isInteger(n)||n<1||n>5000)throw new Error('Zatrudnij od 1 do 5000 pracowników.');
 const cost=n*3500;
 if(state.cash<cost)throw new Error('Za mało gotówki na rekrutację. Koszt: '+cost.toLocaleString('pl-PL')+' zł.');
 state.cash-=cost;
 c.techStaff+=n;
 c.employees=(Number(c.employees)||0)+n;
 c.value=(Number(c.value)||50000)+n*1800;
 return {company:c,count:n,cost,payroll:n*260};
}
export function createTechnologyProduct(state,companyId,{name,price}={}){
 ensureTechnologyCompanies(state);
 const c=state.companies.find(x=>Number(x.id)===Number(companyId));
 if(!c)throw new Error('Nie znaleziono spółki.');
 if(!controlled(c))throw new Error('Możesz rozwijać produkty tylko w spółce, nad którą masz kontrolę.');
 if(c.techStaff<2)throw new Error('Do stworzenia produktu potrzebujesz co najmniej 2 pracowników technologicznych.');
 const gated=TECHNOLOGY_CATALOG.some(t=>t.focus===c.techFocus&&t.day<=Number(state.day||1));const researched=TECHNOLOGY_CATALOG.some(t=>t.focus===c.techFocus&&state.technologyTree?.[t.id]?.researched);if(gated&&!researched&&c.techResearchLevel<2)throw new Error('Najpierw opracuj technologię w zakładce Technologie.');
 const productName=String(name||'').trim(),sellPrice=Math.round(Number(price));
 if(productName.length<3||productName.length>48)throw new Error('Nazwa produktu musi mieć od 3 do 48 znaków.');
 if(!Number.isSafeInteger(sellPrice)||sellPrice<50||sellPrice>1000000)throw new Error('Cena produktu musi wynosić od 50 do 1 000 000 zł.');
 if(c.techProducts.some(p=>p.name.toLowerCase()===productName.toLowerCase()))throw new Error('Ta spółka ma już produkt o takiej nazwie.');
 const focus=focusById(c.techFocus),developmentCost=Math.max(25000,Math.round(sellPrice*220));
 if(state.cash<developmentCost)throw new Error('Opracowanie produktu kosztuje '+developmentCost.toLocaleString('pl-PL')+' zł.');
 state.cash-=developmentCost;
 const product={id:state.nextId++,name:productName,focus:focus.id,category:focus.name,price:sellPrice,unitCost:Math.max(1,Math.round(sellPrice*(1-focus.margin))),level:1,createdDay:state.day,unitsSold:0,revenue:0};
 c.techProducts.push(product);
 c.value=(Number(c.value)||50000)+developmentCost;
 return {company:c,product,cost:developmentCost};
}
function spendCompanyDevelopment(state,company,amount){
 const n=Math.max(0,Math.round(amount));
 const reserve=Math.max(0,Number(company.managementBudgetRemaining)||0);
 const fromReserve=Math.min(reserve,n);
 const fromGroup=n-fromReserve;
 if(fromGroup>0&&state.cash<fromGroup)return false;
 company.managementBudgetRemaining=reserve-fromReserve;
 if(fromGroup>0)state.cash-=fromGroup;
 return true;
}
function autoProductName(company,focus,index){
 const names={
 os:['AstraOS','AstraOS Pro','AstraOS Cloud','AstraOS Enterprise','AstraOS Mobile'],
 ai:['NeuralCore','NeuralCore Studio','Neural Agent','Neural Vision','Neural API'],
 cloud:['CloudNova','CloudNova Compute','CloudNova Storage','CloudNova Edge','CloudNova Enterprise'],
 chips:['SilicaCore','SilicaCore AI','SilicaCore Edge','SilicaCore Pro','SilicaCore Quantum'],
 robotics:['RoboPilot','RoboPilot Industrial','RoboPilot Vision','RoboPilot Fleet','RoboPilot Pro'],
 security:['ShieldOne','ShieldOne Endpoint','ShieldOne Identity','ShieldOne Cloud','ShieldOne Enterprise'],
 devices:['Wilk Device','Wilk Smart Hub','Wilk Sensor','Wilk Home','Wilk Edge'],
 telecom:['NetSphere','NetSphere 5G','NetSphere Fiber','NetSphere Edge','NetSphere Core'],
 biotech:['BioCompute','BioCompute Lab','BioCompute Insight','BioCompute AI','BioCompute Pro'],
 xr:['SpatialOne','SpatialOne Studio','SpatialOne Vision','SpatialOne Workspace','SpatialOne Pro'],
 browser:['Nova Browser','Nova Browser Pro','Nova Sync','Nova Privacy','Nova Enterprise'],
 database:['VectorDB','VectorDB Cloud','VectorDB Analytics','VectorDB Enterprise','VectorDB Edge'],
 search:['Findra Search','Findra Ads','Findra Maps','Findra AI Search','Findra Enterprise'],
 devtools:['Forge IDE','Forge API','Forge CI','Forge Studio','Forge Cloud'],
 mobile:['Astra Mobile','Astra Mobile Pro','Astra App Store','Astra Sync','Astra Enterprise'],
 productivity:['Wilk Office','Wilk Docs','Wilk Sheets','Wilk Meet','Wilk Workspace'],
 gaming:['Forge Engine','Forge Engine Pro','Forge Render','Forge Multiplayer','Forge Studio']
 };
 const base=(names[focus.id]||[focus.product,focus.product+' Pro',focus.product+' Cloud',focus.product+' Enterprise'])[Math.min(index,4)];
 return company.name.split(/\s+/)[0]+' '+base;
}
function autoDevelopCompany(state,company,dayStats){
 if(!controlled(company)||company.companyType==='holding'||company.companyType==='logistics'||company.companyType==='operating')return;
 const focus=focusById(company.techFocus),products=company.techProducts;
 company.autoDevelopment=true;
 company.autoHire??=true;company.autoProductDevelopment??=true;company.lastAutoHireDay??=0;company.lastAutoProductDay??=0;company.lastAutoUpgradeDay??=0;
 const reserve=Math.max(0,Number(company.managementBudgetRemaining)||0);
 const desiredStaff=Math.min(120,Math.max(6,Math.ceil(4+products.length*3+(Number(company.techResearchLevel)||1)*2)));
 if(company.autoHire&&company.techStaff<desiredStaff&&Number(state.day)-Number(company.lastAutoHireDay)>=5){
  const count=Math.min(3,desiredStaff-company.techStaff),cost=count*3500;
  if(spendCompanyDevelopment(state,company,cost)){
   company.techStaff+=count;company.employees=(Number(company.employees)||0)+count;company.value=(Number(company.value)||50000)+count*1800;company.lastAutoHireDay=state.day;
   dayStats.hires+=count;dayStats.investment+=cost;
   state.events??=[];state.events.unshift({icon:'👥',title:'Automatyczna rekrutacja',detail:company.name+' zatrudnia '+count+' specjalistów. Zespół: '+company.techStaff+'.',day:state.day});
  }
 }
 if(company.autoProductDevelopment&&company.techStaff>=4&&products.length<8&&Number(state.day)-Number(company.lastAutoProductDay)>=8){
  const duplicateIndex=products.length,productName=autoProductName(company,focus,duplicateIndex),price=Math.round(focus.basePrice*(1+Math.min(1,(Number(company.techResearchLevel)||1)*.08)));
  const developmentCost=Math.max(30000,Math.round(price*125));
  if(spendCompanyDevelopment(state,company,developmentCost)){
   const product={id:state.nextId++,name:productName,focus:focus.id,category:focus.name,price,unitCost:Math.max(1,Math.round(price*(1-focus.margin))),level:1,createdDay:state.day,unitsSold:0,revenue:0,autoCreated:true};
   products.push(product);company.value=(Number(company.value)||50000)+developmentCost;company.lastAutoProductDay=state.day;
   dayStats.products++;dayStats.investment+=developmentCost;
   state.events??=[];state.events.unshift({icon:'🚀',title:'Nowy produkt opracowany przez spółkę',detail:company.name+' wprowadza '+product.name+'.',day:state.day});
  }
 }
 if(Number(state.day)>1&&Number(state.day)%5===0&&Number(company.lastAutoUpgradeDay)!==Number(state.day)){
  let upgraded=0;
  for(const product of products){
   if(Number(product.level||1)>=10)continue;
   const upgradeCost=Math.max(12000,Math.round(Number(product.price||focus.basePrice)*32));
   if(!spendCompanyDevelopment(state,company,upgradeCost))break;
   product.level=(Number(product.level)||1)+1;product.price=Math.round(product.price*1.025);product.unitCost=Math.max(1,Math.round(product.unitCost*1.01));upgraded++;dayStats.investment+=upgradeCost;
  }
  if(upgraded){company.lastAutoUpgradeDay=state.day;dayStats.upgrades+=upgraded;company.value=(Number(company.value)||50000)+upgraded*18000;state.events??=[];state.events.unshift({icon:'⬆️',title:'Automatyczne ulepszenie produktów',detail:company.name+' rozwija '+upgraded+' produktów.',day:state.day});}
 }
 if(reserve>0)company.managementBudgetSpent=(Number(company.managementBudgetSpent)||0);
}
export function processTechnologyCompaniesDay(state){
 ensureTechnologyCompanies(state);
 if(Number(state.day||1)%3===0)discoverTechnology(state);
 let revenue=0,cost=0,units=0;
 const automation={hires:0,products:0,upgrades:0,investment:0};
 for(const c of state.companies){
  autoDevelopCompany(state,c,automation);
  const staff=c.techStaff||0,products=c.techProducts||[];
  if(!staff&&!products.length)continue;
  const payroll=staff*260;
  cost+=payroll;
  for(const p of products){
   const focusMatch=p.focus===c.techFocus?1.25:1;
   const capacity=Math.max(0,Math.floor(staff*3*focusMatch*(1+(c.techResearchLevel-1)*.12)*(1+((Number(p.level)||1)-1)*.035)));
   const sold=Math.max(0,Math.floor(capacity*(.72+Math.random()*.22)));
   const sales=sold*p.price,production=sold*p.unitCost;
   p.unitsSold=sold;p.revenue=sales;p.lastUpdatedDay=state.day;
   revenue+=sales;cost+=production;units+=sold;
   if((Number(p.level)||1)>1)p.lastUpgradeLabel='Poziom '+p.level;
   c.value=(Number(c.value)||50000)+Math.round(Math.max(0,sales-production)*.025);
  }
  c.lastDailyRevenue=products.reduce((n,p)=>n+(Number(p.revenue)||0),0);
  c.lastDailyCosts=payroll+products.reduce((n,p)=>n+(Number(p.unitsSold)||0)*(Number(p.unitCost)||0),0);
 }
 state.techRevenue=revenue;state.techCost=cost;
 state.techAutomationStats=automation;
 state.events=Array.isArray(state.events)?state.events.slice(0,20):[];
 return {revenue,cost,units,automation};
}
