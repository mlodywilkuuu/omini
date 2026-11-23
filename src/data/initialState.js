export function createInitialState(){return {
 day:1,cash:250000,nextId:10,selectedMarketCompanyId:null,
 shops:[{id:1,name:'Market Wilk — Centrum',type:'Market osiedlowy',district:'Centrum',revenue:8400,cost:5700,emoji:'🏪'}],
 companies:[{id:1,name:'Wilk Retail sp. z o.o.',industry:'Handel spożywczy',share:100,value:170000}],
 market:[
  {id:1,name:'Miejski Handel S.A.',industry:'Supermarkety',value:650000,share:0,dividend:.004},
  {id:2,name:'QuickBox sp. z o.o.',industry:'Sklepy convenience',value:280000,share:0,dividend:.005},
  {id:3,name:'Dom&Styl S.A.',industry:'Wyposażenie domu',value:920000,share:0,dividend:.003},
  {id:4,name:'TechPoint S.A.',industry:'Elektronika',value:1250000,share:0,dividend:.003},
  {id:5,name:'Drogeria Vita sp. z o.o.',industry:'Drogerie',value:430000,share:0,dividend:.004}
 ],
 districts:[
  {name:'Centrum',desc:'Duży ruch pieszy, wysokie czynsze.',potential:92,cost:0,owned:true,competition:'Wysoka'},
  {name:'Stare Miasto',desc:'Klienci premium i ruch turystyczny.',potential:82,cost:45000,owned:false,competition:'Średnia'},
  {name:'Nowe Osiedle',desc:'Rodziny i szybko rosnąca populacja.',potential:88,cost:38000,owned:false,competition:'Niska'},
  {name:'Przemysłowa',desc:'Klienci hurtowi i pracownicy firm.',potential:69,cost:26000,owned:false,competition:'Niska'},
  {name:'Galeria Północ',desc:'Wysoki ruch, bardzo drogie lokale.',potential:96,cost:80000,owned:false,competition:'Bardzo wysoka'},
  {name:'Przedmieścia',desc:'Niższe koszty i lojalni klienci.',potential:73,cost:18000,owned:false,competition:'Średnia'}
 ],
 events:[{icon:'🏪',title:'Otwarto Market Wilk — Centrum',detail:'Twoja pierwsza placówka rozpoczęła działalność.',day:1}],
 history:[6200,7100,6800,7500,7900,8100,8400]
};}
