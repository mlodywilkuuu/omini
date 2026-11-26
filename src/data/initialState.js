export function createInitialState(){return {
 day:1,cash:400000,nextId:100,selectedMarketCompanyId:null,selectedCountry:'Polska',initiatives:[],
 shops:[],warehouses:[],marketingCampaigns:[],supplierContracts:[],b2bContracts:[],contractRevenue:0,contractCost:0,
 companies:[],
 market:[
  {id:1,name:'Quantum Silicon S.A.',industry:'Półprzewodniki',value:4250000,share:0,dividend:.002,freeFloat:100,shares:2500000,eps:4.8,pe:16.2,boardSeats:7,history:[3900000,4100000,4250000]},
  {id:2,name:'OmniCloud Group',industry:'Chmura i centra danych',value:2850000,share:0,dividend:.003,freeFloat:100,shares:1800000,eps:3.4,pe:14.1,boardSeats:5,history:[2600000,2720000,2850000]},
  {id:3,name:'Cortex Intelligence',industry:'Sztuczna inteligencja',value:6100000,share:0,dividend:.001,freeFloat:100,shares:3200000,eps:5.6,pe:18.4,boardSeats:7,history:[5700000,5900000,6100000]},
  {id:4,name:'Nexa Operating Systems',industry:'Systemy operacyjne',value:3750000,share:0,dividend:.002,freeFloat:100,shares:2100000,eps:4.1,pe:15.7,boardSeats:5,history:[3400000,3600000,3750000]},
  {id:5,name:'Atlas Robotics',industry:'Robotyka i automatyka',value:1950000,share:0,dividend:.002,freeFloat:100,shares:1300000,eps:2.7,pe:13.2,boardSeats:5,history:[1780000,1860000,1950000]}
 ],
 districts:[],locations:[],
 events:[{icon:'🌱',title:'Początek od zera',detail:'Masz 400 000 zł kapitału. Nie posiadasz jeszcze żadnych spółek ani pracowników — zbuduj swoje imperium od podstaw.',day:1}],
 history:[0],cashHistory:[400000],techRevenue:0,techCost:0,buyoutOffers:[]
};}