export function createInitialState(){return {
 day:1,cash:2500000,nextId:100,selectedMarketCompanyId:null,selectedCountry:'Polska',initiatives:[],
 shops:[],warehouses:[],marketingCampaigns:[],supplierContracts:[],b2bContracts:[],contractRevenue:0,contractCost:0,
 companies:[
  {id:1,name:'Wilk Technologies Holding',industry:'Technologie i oprogramowanie',companyType:'holding',share:100,value:1250000,employees:18,techStaff:18,techFocus:'os',techResearchLevel:2,techProducts:[{id:10,name:'AstraOS',focus:'os',category:'Systemy operacyjne',price:590,unitCost:145,level:1,createdDay:1,unitsSold:0,revenue:0}],parentCompanyId:null,operatingCountries:['Polska','Niemcy']},
  {id:2,name:'Neural Forge AI',industry:'Sztuczna inteligencja',companyType:'ai',share:100,value:720000,employees:14,techStaff:14,techFocus:'ai',techResearchLevel:2,techProducts:[{id:11,name:'NeuralCore AI',focus:'ai',category:'Sztuczna inteligencja',price:890,unitCost:210,level:1,createdDay:1,unitsSold:0,revenue:0}],parentCompanyId:1,operatingCountries:['Polska','USA']},
  {id:3,name:'CloudNova Systems',industry:'Chmura i centra danych',companyType:'technology',share:100,value:530000,employees:10,techStaff:10,techFocus:'cloud',techResearchLevel:1,techProducts:[{id:12,name:'CloudNova One',focus:'cloud',category:'Chmura i centra danych',price:420,unitCost:150,level:1,createdDay:1,unitsSold:0,revenue:0}],parentCompanyId:1,operatingCountries:['Polska']}
 ],
 market:[
  {id:1,name:'Quantum Silicon S.A.',industry:'Półprzewodniki',value:4250000,share:0,dividend:.002,freeFloat:100,shares:2500000,eps:4.8,pe:16.2,boardSeats:7,history:[3900000,4100000,4250000]},
  {id:2,name:'OmniCloud Group',industry:'Chmura i centra danych',value:2850000,share:0,dividend:.003,freeFloat:100,shares:1800000,eps:3.4,pe:14.1,boardSeats:5,history:[2600000,2720000,2850000]},
  {id:3,name:'Cortex Intelligence',industry:'Sztuczna inteligencja',value:6100000,share:0,dividend:.001,freeFloat:100,shares:3200000,eps:5.6,pe:18.4,boardSeats:7,history:[5700000,5900000,6100000]},
  {id:4,name:'Nexa Operating Systems',industry:'Systemy operacyjne',value:3750000,share:0,dividend:.002,freeFloat:100,shares:2100000,eps:4.1,pe:15.7,boardSeats:5,history:[3400000,3600000,3750000]},
  {id:5,name:'Atlas Robotics',industry:'Robotyka i automatyka',value:1950000,share:0,dividend:.002,freeFloat:100,shares:1300000,eps:2.7,pe:13.2,boardSeats:5,history:[1780000,1860000,1950000]}
 ],
 districts:[],locations:[],
 events:[{icon:'🚀',title:'Powstaje Wilk Technologies Holding',detail:'Masz 2 500 000 zł kapitału, trzy spółki technologiczne i pierwsze produkty w portfolio.',day:1}],
 history:[0],cashHistory:[2500000],techRevenue:0,techCost:0,buyoutOffers:[]
};}