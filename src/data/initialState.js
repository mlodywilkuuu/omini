export function createInitialState(){return {
 day:1,cash:200000,nextId:100,selectedMarketCompanyId:null,selectedCountry:'Polska',
 shops:[],
 companies:[{id:1,name:'Wilk Retail sp. z o.o.',industry:'Handel spożywczy',share:100,value:50000,employees:3,stores:0}],
 market:[
  {id:1,name:'Miejski Handel S.A.',industry:'Supermarkety',value:650000,share:0,dividend:.004,freeFloat:68,shares:1000000,eps:2.8,pe:11.6,boardSeats:5,history:[610000,625000,638000,650000]},
  {id:2,name:'QuickBox sp. z o.o.',industry:'Convenience',value:280000,share:0,dividend:.005,freeFloat:72,shares:500000,eps:1.9,pe:9.4,boardSeats:3,history:[260000,266000,273000,280000]},
  {id:3,name:'Dom&Styl S.A.',industry:'Wyposażenie domu',value:920000,share:0,dividend:.003,freeFloat:55,shares:2000000,eps:3.4,pe:13.5,boardSeats:7,history:[870000,885000,900000,920000]},
  {id:4,name:'TechPoint S.A.',industry:'Elektronika',value:1250000,share:0,dividend:.003,freeFloat:62,shares:2500000,eps:4.1,pe:12.2,boardSeats:7,history:[1190000,1210000,1230000,1250000]},
  {id:5,name:'Drogeria Vita sp. z o.o.',industry:'Drogerie',value:430000,share:0,dividend:.004,freeFloat:75,shares:800000,eps:2.2,pe:10.8,boardSeats:5,history:[405000,414000,422000,430000]}
 ],
 districts:[],
 locations:[],
 events:[{icon:'💼',title:'Rozpoczęcie działalności',detail:'Masz 200 000 zł kapitału i możesz otworzyć pierwsze sklepy.',day:1}],
 history:[0],cashHistory:[200000]
};}