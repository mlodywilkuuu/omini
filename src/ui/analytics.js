import {money} from './helpers.js';

const arr=value=>Array.isArray(value)?value:[];
const n=value=>Number(value)||0;
const sum=(items,fn)=>arr(items).reduce((total,item)=>total+n(fn(item)),0);
const number=value=>n(value).toLocaleString('pl-PL',{maximumFractionDigits:1});
const pct=value=>number(value)+'%';
const metric=(label,value,detail='')=>({label,value,detail});
const panel=(title,subtitle,items)=>({title,subtitle,items});

export function buildFinanceAnalytics(s){
 const shops=arr(s.shops),companies=arr(s.companies),market=arr(s.market),factories=arr(s.factories);
 const b2b=arr(s.b2bContracts),deals=arr(s.activeStrategicDeals),loans=arr(s.loans);
 const techRevenue=n(s.techRevenue),retailRevenue=sum(shops,x=>x.revenue),factoryRevenue=n(s.factoryRevenue),diversifiedRevenue=n(s.diversifiedRevenue);
 const dividendIncome=sum(market,x=>n(x.value)*n(x.share)/100*n(x.dividend));
 const b2bRevenue=sum(b2b,x=>x.dailyRevenue),strategicRevenue=sum(deals,x=>x.dailyBonus);
 const technologyCosts=n(s.techCost),retailCosts=sum(shops,x=>x.cost),factoryCosts=n(s.factoryCost),diversifiedCosts=n(s.diversifiedCosts);
 const b2bCosts=sum(b2b,x=>x.dailyCost),marketingCosts=sum(arr(s.marketingCampaigns),x=>x.dailyBudget);
 const executiveCosts=sum(arr(s.executives),x=>x.salary),loanInstallments=sum(loans,x=>x.installment);
 const totalRevenue=techRevenue+retailRevenue+factoryRevenue+diversifiedRevenue+dividendIncome+b2bRevenue+strategicRevenue;
 const totalCosts=technologyCosts+retailCosts+factoryCosts+diversifiedCosts+b2bCosts+marketingCosts+executiveCosts+loanInstallments;
 const dailyResult=totalRevenue-totalCosts,portfolio=sum(market,x=>n(x.value)*n(x.share)/100);
 const companyAssets=sum(companies,x=>x.value),marketCap=sum(market,x=>x.value);
 const loanBalance=sum(loans,x=>x.balance),cash=n(s.cash),netWorth=cash+companyAssets+portfolio;
 const shares=sum(market,x=>x.share),held=market.filter(x=>n(x.share)>0),controlled=market.filter(x=>n(x.share)>=50);
 const avgCompany=companies.length?companyAssets/companies.length:0;
 const revenueStreams=[techRevenue,retailRevenue,factoryRevenue,diversifiedRevenue,b2bRevenue,strategicRevenue].filter(x=>x>0).length;
 const finance=[
  panel('Przychody i źródła wpływów','10 wskaźników · dzienne wpływy',[
   metric('Przychód technologiczny',money(techRevenue),'Sprzedaż produktów i usług spółek technologicznych'),
   metric('Przychód sklepów',money(retailRevenue),'Suma przychodów wszystkich placówek'),
   metric('Przychód fabryk',money(factoryRevenue),'Sprzedaż z własnej produkcji'),
   metric('Przychód aktywów wielobranżowych',money(diversifiedRevenue),'Wpływy z aktywów poza technologią'),
   metric('Dochód z dywidend',money(dividendIncome),'Szacowany dzienny dochód z posiadanych udziałów'),
   metric('Przychód z kontraktów B2B',money(b2bRevenue),'Dzienna wartość aktywnych umów'),
   metric('Premie z decyzji strategicznych',money(strategicRevenue),'Aktywne decyzje generujące dodatkowy przychód'),
   metric('Łączne wpływy dzienne',money(totalRevenue),'Suma wszystkich wykazanych źródeł'),
   metric('Przychód na sklep',money(shops.length?retailRevenue/shops.length:0),'Średnia dla całej sieci'),
   metric('Przychód na spółkę',money(companies.length?techRevenue/companies.length:0),'Średni przychód technologiczny na spółkę')
  ]),
  panel('Koszty i zobowiązania','10 wskaźników · dzienne obciążenia',[
   metric('Koszty technologii',money(technologyCosts),'Koszty zespołów i działalności technologicznej'),
   metric('Koszty sklepów',money(retailCosts),'Suma kosztów operacyjnych placówek'),
   metric('Koszty fabryk',money(factoryCosts),'Koszty produkcji i utrzymania zakładów'),
   metric('Koszty aktywów wielobranżowych',money(diversifiedCosts),'Utrzymanie pozostałych aktywów'),
   metric('Koszty kontraktów B2B',money(b2bCosts),'Koszty realizacji aktywnych umów'),
   metric('Budżet marketingowy',money(marketingCosts),'Suma dziennych budżetów kampanii'),
   metric('Wynagrodzenia zarządu',money(executiveCosts),'Dzienny koszt zatrudnionych dyrektorów'),
   metric('Raty kredytów',money(loanInstallments),'Suma dziennych rat aktywnych kredytów'),
   metric('Łączne obciążenia dzienne',money(totalCosts),'Suma kosztów i rat uwzględnionych w analizie'),
   metric('Automatyczne inwestycje rozwojowe',money(s.techInvestment),'Dzienne wydatki na rekrutację, nowe produkty i automatyczne ulepszenia')
  ]),
  panel('Rentowność i płynność','10 wskaźników · kondycja finansowa',[
   metric('Wynik dzienny przed dywidendami',money(dailyResult-dividendIncome),'Wpływy operacyjne minus wykazane koszty'),
   metric('Wynik dzienny z dywidendami',money(dailyResult),'Łączny szacowany wynik dzienny'),
   metric('Marża netto',pct(totalRevenue?dailyResult/totalRevenue*100:0),'Wynik dzienny w relacji do wpływów'),
   metric('Próg rentowności',money(totalCosts),'Minimalne dzienne wpływy potrzebne do pokrycia kosztów'),
   metric('Pokrycie kosztów wpływami',pct(totalCosts?totalRevenue/totalCosts*100:0),'100% oznacza pełne pokrycie kosztów'),
   metric('Gotówka na koncie',money(cash),'Bieżące środki dostępne w grze'),
   metric('Wartość netto imperium',money(netWorth),'Gotówka + wycena spółek + portfel giełdowy'),
   metric('Wartość spółek własnych',money(companyAssets),'Łączna wycena wszystkich spółek holdingu'),
   metric('Wartość portfela giełdowego',money(portfolio),'Wartość posiadanych pakietów akcji'),
   metric('Rezerwa gotówkowa w dniach',number(totalCosts?cash/totalCosts:0),'Ile dni kosztów pokryje gotówka przy obecnym poziomie')
  ]),
  panel('Kapitał, giełda i finansowanie','10 wskaźników · struktura majątku',[
   metric('Kapitalizacja obserwowanego rynku',money(marketCap),'Suma wycen spółek notowanych w grze'),
   metric('Saldo zadłużenia',money(loanBalance),'Pozostałe saldo wszystkich aktywnych kredytów'),
   metric('Liczba aktywnych kredytów',number(loans.length),'Otwarte zobowiązania finansowe'),
   metric('Średnia wycena spółki holdingu',money(avgCompany),'Średnia wartość na jedną spółkę'),
   metric('Liczba spółek w holdingu',number(companies.length),'Wszystkie spółki własne i zależne'),
   metric('Spółki kontrolowane na giełdzie',number(controlled.length),'Pozycje z udziałem co najmniej 50%'),
   metric('Pozycje giełdowe w portfelu',number(held.length),'Emitenci, w których posiadasz udziały'),
   metric('Łączny udział w rynku',pct(shares),'Suma procentowych udziałów w poszczególnych spółkach'),
   metric('Aktywne źródła przychodów',number(revenueStreams),'Liczba różnych kategorii wpływów z dodatnim wynikiem'),
   metric('Dywidendy względem portfela',pct(portfolio?dividendIncome/portfolio*100:0),'Szacowana dzienna stopa dywidendy')
  ])
 ];
 return finance;
}

export function buildReportAnalytics(s){
 const shops=arr(s.shops),companies=arr(s.companies),market=arr(s.market),factories=arr(s.factories);
 const products=companies.reduce((total,c)=>total+arr(c.techProducts).length,0);
 const techStaff=sum(companies,c=>c.techStaff),employees=sum(companies,c=>c.employees);
 const countries=new Set(shops.map(x=>x.country).filter(Boolean));
 const formats=new Set(shops.map(x=>x.type).filter(Boolean));
 const controlledCompanies=companies.filter(c=>n(c.share)>=50);
 const activeFactories=factories.filter(f=>f.productionEnabled!==false);
 const factoryCapacity=sum(factories,f=>f.capacity),produced=sum(factories,f=>f.lastProduction);
 const utilization=factoryCapacity?produced/factoryCapacity*100:0;
 const brands=companies.reduce((total,c)=>total+arr(c.ownBrands).length,0);
 const marketCap=sum(market,x=>x.value),portfolio=sum(market,x=>n(x.value)*n(x.share)/100);
 const held=market.filter(x=>n(x.share)>0),controlledMarket=market.filter(x=>n(x.share)>=50);
 const avgShare=held.length?sum(held,x=>x.share)/held.length:0;
 const initiatives=arr(s.initiatives),upgrades=arr(s.upgrades),projects=arr(s.empireProjects);
 const b2b=arr(s.b2bContracts),deals=arr(s.activeStrategicDeals),campaigns=arr(s.marketingCampaigns);
 const warehouses=arr(s.warehouses),fleet=arr(s.fleet);
 const activeOffers=arr(s.strategicOffers),suppliers=arr(s.supplierContracts);
 const diversified=arr(s.diversifiedAssets),executives=arr(s.executives);
 const totalRetailRevenue=sum(shops,x=>x.revenue),totalRetailCost=sum(shops,x=>x.cost);
 const totalStaff=techStaff+employees;
 const history=arr(s.history),lastHistory=history.length?history[history.length-1]:0;
 return [
  panel('Skala i struktura imperium','10 wskaźników · rozmiar organizacji',[
   metric('Placówki handlowe',number(shops.length),'Liczba aktywnych sklepów w sieci'),
   metric('Kraje działalności',number(countries.size),'Unikalne kraje z co najmniej jedną placówką'),
   metric('Formaty sklepów',number(formats.size),'Różne typy i formaty placówek'),
   metric('Spółki w grupie',number(companies.length),'Łączna liczba spółek holdingu'),
   metric('Spółki kontrolowane',number(controlledCompanies.length),'Spółki z udziałem gracza na poziomie minimum 50%'),
   metric('Specjaliści technologiczni',number(techStaff),'Zespoły R&D, inżynierowie i pracownicy technologiczni'),
   metric('Pozostali pracownicy spółek',number(employees),'Zatrudnienie zapisane w strukturze spółek'),
   metric('Produkty technologiczne',number(products),'Wszystkie produkty przypisane do spółek'),
   metric('Fabryki',number(factories.length),'Liczba posiadanych zakładów produkcyjnych'),
   metric('Łączne zatrudnienie',number(totalStaff),'Suma pracowników i specjalistów technologicznych')
  ]),
  panel('Produkcja i wydajność','10 wskaźników · moce operacyjne',[
   metric('Aktywne fabryki',number(activeFactories.length),'Zakłady z włączoną produkcją'),
   metric('Wstrzymane fabryki',number(factories.length-activeFactories.length),'Zakłady z wyłączoną produkcją'),
   metric('Moc produkcyjna / dzień',number(factoryCapacity)+' szt.','Suma nominalnych mocy fabryk'),
   metric('Produkcja ostatniego dnia',number(produced)+' szt.','Suma ostatniego raportowanego wolumenu'),
   metric('Wykorzystanie mocy',pct(utilization),'Produkcja ostatniego dnia względem nominalnej mocy'),
   metric('Kategorie produktów fabrycznych',number(new Set(factories.map(f=>f.productId).filter(Boolean)).size),'Różne typy produktów w zakładach'),
   metric('Marki własne',number(brands),'Liczba marek przypisanych do spółek'),
   metric('Produkty na spółkę',number(companies.length?products/companies.length:0),'Średnia liczba produktów w grupie'),
   metric('Specjaliści na spółkę',number(companies.length?techStaff/companies.length:0),'Średnia wielkość zespołu technologicznego'),
   metric('Pracownicy na produkt',number(products?totalStaff/products:0),'Orientacyjna relacja zatrudnienia do portfolio')
  ]),
  panel('Giełda i pozycja inwestora','10 wskaźników · portfel udziałów',[
   metric('Notowani emitenci',number(market.length),'Liczba spółek dostępnych na giełdzie'),
   metric('Kapitalizacja rynku',money(marketCap),'Łączna wartość wszystkich emitentów'),
   metric('Wartość Twojego portfela',money(portfolio),'Wycena posiadanych pakietów'),
   metric('Spółki z udziałem gracza',number(held.length),'Emitenci, w których posiadasz akcje'),
   metric('Kontrolowane spółki giełdowe',number(controlledMarket.length),'Pozycje z udziałem co najmniej 50%'),
   metric('Średni udział w posiadanych pozycjach',pct(avgShare),'Średnia wielkość pakietu na emitenta'),
   metric('Największy pojedynczy pakiet',pct(held.reduce((max,x)=>Math.max(max,n(x.share)),0)),'Największy udział w jednej spółce'),
   metric('Spółki wypłacające dywidendę',number(market.filter(x=>n(x.dividend)>0).length),'Emitenci z dodatnią stopą dywidendy'),
   metric('Wartość spółek własnych',money(sum(companies,x=>x.value)),'Łączna wycena holdingu poza portfelem giełdowym'),
   metric('Udział portfela w majątku',pct((n(s.cash)+sum(companies,x=>x.value)+portfolio)?portfolio/(n(s.cash)+sum(companies,x=>x.value)+portfolio)*100:0),'Część wartości netto ulokowana w akcjach')
  ]),
  panel('Rozwój, projekty i ekosystem','10 wskaźników · aktywność zarządcza',[
   metric('Aktywne inicjatywy',number(initiatives.length),'Uruchomione programy rozwojowe'),
   metric('Aktywne ulepszenia',number(upgrades.length),'Wykupione usprawnienia imperium'),
   metric('Projekty strategiczne w toku',number(projects.length),'Długoterminowe projekty grupy'),
   metric('Nowe okazje strategiczne',number(activeOffers.length),'Decyzje oczekujące na rozpatrzenie'),
   metric('Aktywne decyzje strategiczne',number(deals.length),'Wybory generujące czasowe efekty'),
   metric('Kontrakty B2B',number(b2b.length),'Aktywne umowy z klientami instytucjonalnymi'),
   metric('Umowy z dostawcami',number(suppliers.length),'Aktywne kontrakty zakupowe'),
   metric('Kampanie marketingowe',number(campaigns.length),'Aktywne kampanie promocyjne'),
   metric('Magazyny i centra logistyczne',number(warehouses.length),'Liczba obiektów logistycznych'),
   metric('Aktywa wielobranżowe',number(diversified.length),'Aktywa poza podstawową działalnością technologiczną')
  ])
 ];
}

export function renderAnalyticsGroups(groups){
 return '<div class="analytics-grid">'+groups.map(group=>'<section class="card analytics-card"><div class="card-head"><div><h3>'+group.title+'</h3><span>'+group.subtitle+'</span></div><b class="analytics-count">'+group.items.length+'</b></div><div class="analytics-list">'+group.items.map((item,index)=>'<div class="analytics-row"><div class="analytics-label"><span class="analytics-index">'+String(index+1).padStart(2,'0')+'</span><div><b>'+item.label+'</b><small>'+item.detail+'</small></div></div><strong>'+item.value+'</strong></div>').join('')+'</div></section>').join('')+'</div>';
}
