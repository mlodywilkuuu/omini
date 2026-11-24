const CAMPAIGNS=[
{id:'social',name:'Kampania w mediach społecznościowych',icon:'📱',channel:'Social media',base:450,boost:.035,description:'Zasięg, krótkie filmy i lokalne profile marki.'},
{id:'influencer',name:'Lokalni influencerzy',icon:'🤳',channel:'Influencer marketing',base:900,boost:.052,description:'Współpraca z twórcami i recenzje produktów.'},
{id:'search',name:'Reklama w wyszukiwarce',icon:'🔎',channel:'SEM',base:650,boost:.043,description:'Przechwytywanie klientów szukających produktów.'},
{id:'radio',name:'Radio lokalne',icon:'📻',channel:'Radio',base:500,boost:.032,description:'Spoty w lokalnych stacjach radiowych.'},
{id:'outdoor',name:'Billboardy i outdoor',icon:'🪧',channel:'Outdoor',base:850,boost:.045,description:'Widoczność przy głównych ulicach i węzłach ruchu.'},
{id:'loyalty',name:'Program lojalnościowy',icon:'🎁',channel:'Retencja',base:700,boost:.05,description:'Punkty i nagrody zachęcające do powrotów.'},
{id:'coupons',name:'Kupony rabatowe',icon:'🏷️',channel:'Promocje',base:420,boost:.038,description:'Kody rabatowe zwiększające ruch w sklepach.'},
{id:'opening',name:'Wielkie otwarcie',icon:'🎉',channel:'Aktywacja sprzedaży',base:1100,boost:.065,description:'Lokalne wydarzenie i promocja otwarciowa.'},
{id:'sampling',name:'Degustacje i próbki',icon:'🥨',channel:'Marketing terenowy',base:780,boost:.048,description:'Prezentacje i testowanie produktów w sklepach.'},
{id:'sponsorship',name:'Sponsoring wydarzeń',icon:'🏆',channel:'Sponsoring',base:1200,boost:.055,description:'Wsparcie lokalnych wydarzeń i społeczności.'},
{id:'email',name:'Newsletter i e-mail',icon:'✉️',channel:'CRM',base:300,boost:.028,description:'Oferty dla klientów i reaktywacja nieaktywnych.'},
{id:'sms',name:'Powiadomienia SMS',icon:'💬',channel:'CRM',base:380,boost:.031,description:'Krótkie oferty i przypomnienia o promocjach.'},
{id:'app',name:'Promocja aplikacji mobilnej',icon:'📲',channel:'Mobile',base:1000,boost:.057,description:'Instalacje aplikacji i zamówienia mobilne.'},
{id:'localpress',name:'Prasa i portale lokalne',icon:'📰',channel:'PR',base:550,boost:.034,description:'Artykuły, reklamy i patronaty medialne.'},
{id:'seasonal',name:'Kampania sezonowa',icon:'🎄',channel:'Sezonowa',base:950,boost:.06,description:'Oferta dopasowana do sezonu i kalendarza.'},
{id:'student',name:'Oferta dla studentów',icon:'🎓',channel:'Segmentacja',base:520,boost:.04,description:'Zniżki i promocje dla młodych klientów.'},
{id:'family',name:'Rodzinne weekendy',icon:'👨‍👩‍👧',channel:'Event marketing',base:750,boost:.047,description:'Akcje weekendowe dla rodzin i grup.'},
{id:'premium',name:'Budowanie marki premium',icon:'💎',channel:'Branding',base:1300,boost:.058,description:'Komunikacja jakości i produktów premium.'},
{id:'green',name:'Kampania ekologiczna',icon:'🌱',channel:'Wizerunek',base:680,boost:.036,description:'Promocja odpowiedzialnych zakupów i opakowań.'},
{id:'cross',name:'Sprzedaż krzyżowa',icon:'🛍️',channel:'Merchandising',base:620,boost:.05,description:'Zestawy produktów i rekomendacje przy kasie.'}
];
export function getMarketingCatalog(){return CAMPAIGNS;}
export function getMarketingOffers(day=1){
 const start=(Math.max(1,Number(day)||1)-1)*3%CAMPAIGNS.length;
 return Array.from({length:6},(_,i)=>CAMPAIGNS[(start+i)%CAMPAIGNS.length]);
}
export function getActiveMarketingCampaigns(state){return state.marketingCampaigns||[];}
export function startMarketingCampaign(state,{campaignId,dailyBudget,duration,country='all'}){
 const campaign=CAMPAIGNS.find(x=>x.id===campaignId);
 if(!campaign)throw new Error('Ta oferta marketingowa nie jest już dostępna. Odśwież panel i wybierz aktualną.');
 if(!state.shops.length)throw new Error('Najpierw otwórz przynajmniej jeden sklep.');
 const budget=Number(dailyBudget),days=Number(duration);
 if(!Number.isSafeInteger(budget)||budget<campaign.base||budget>1000000)throw new Error('Budżet dzienny musi wynosić od '+campaign.base+' do 1 000 000 zł.');
 if(![3,5,7,10,14].includes(days))throw new Error('Wybierz prawidłowy czas kampanii.');
 if(country!=='all'&&!state.shops.some(s=>s.country===country))throw new Error('W wybranym kraju nie masz żadnego sklepu.');
 state.marketingCampaigns??=[];
 if(state.marketingCampaigns.length>=8)throw new Error('Możesz prowadzić maksymalnie 8 kampanii jednocześnie.');
 if(state.cash<budget)throw new Error('Masz za mało gotówki na pierwszy dzień kampanii.');
 const active={id:state.nextId++,campaignId,name:campaign.name,icon:campaign.icon,channel:campaign.channel,country,dailyBudget:budget,remainingDays:days,totalDays:days,base:campaign.base,boost:campaign.boost,startedDay:state.day};
 state.marketingCampaigns.push(active);
 return active;
}
export function processMarketingDay(state){
 const result={byShop:new Map(),dailySpend:0,active:0,expired:[]};
 const campaigns=state.marketingCampaigns||[];
 for(const campaign of campaigns){
  const shops=state.shops.filter(s=>campaign.country==='all'||s.country===campaign.country);
  if(!shops.length){campaign.remainingDays=0;result.expired.push(campaign.name);continue;}
  const scale=Math.min(2.5,Math.sqrt(campaign.dailyBudget/campaign.base));
  const boost=Math.min(.14,campaign.boost*scale),perShop=campaign.dailyBudget/shops.length;
  shops.forEach(shop=>{
   const previous=result.byShop.get(shop.id)||{boost:0,dailyCost:0,campaigns:0};
   previous.boost=Math.min(.35,previous.boost+boost);previous.dailyCost+=perShop;previous.campaigns++;
   result.byShop.set(shop.id,previous);
  });
  result.dailySpend+=campaign.dailyBudget;result.active++;
  campaign.remainingDays--;
  if(campaign.remainingDays<=0)result.expired.push(campaign.name);
 }
 state.marketingCampaigns=campaigns.filter(c=>c.remainingDays>0);
 return result;
}
