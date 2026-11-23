import {createInitialState} from './data/initialState.js';
import {totalRevenue,totalCosts,netWorth,closeBusinessDay} from './systems/finance.js';
import {openShop,shopFormats,availableDistricts} from './systems/shops.js';
import {buyShares,takeControl} from './systems/ownership.js';
import {unlockDistrict} from './systems/districts.js';
import {renderAll,renderHeader} from './ui/render.js';
import {money} from './ui/helpers.js';

const state=createInitialState();
const $=id=>document.getElementById(id);
let modalAction=null,toastTimer;
function notify(message){const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2500);}
function log(icon,title,detail){state.events.unshift({icon,title,detail,day:state.day});state.events=state.events.slice(0,8);}
function showPage(page){document.querySelectorAll('.page').forEach(section=>section.classList.toggle('hidden',section.id!=='page-'+page));document.querySelectorAll('.nav-link').forEach(button=>button.classList.toggle('active',button.dataset.page===page));const labels={overview:'Pulpit główny',shops:'Moje sklepy',companies:'Spółki córki',market:'Giełda udziałów',districts:'Rejony działania',finance:'Finanse'};$('breadcrumb').textContent=labels[page];}
function openModal({title,description,fields,onConfirm}){$('modalTitle').textContent=title;$('modalDescription').textContent=description;$('modalBody').innerHTML=fields;$('modal').showModal();modalAction=onConfirm;}
function closeModal(){$('modal').close();modalAction=null;}
function shopModal(){const districts=availableDistricts(state);openModal({title:'Otwórz nowy sklep',description:'Wybierz format i rejon. Sklep zacznie zarabiać od następnego dnia.',fields:'<div class="field"><label>NAZWA PLACÓWKI</label><input id="fName" value="Market Wilk"></div><div class="field"><label>FORMAT SKLEPU</label><select id="fType">'+shopFormats().map(type=>'<option>'+type+'</option>').join('')+'</select></div><div class="field"><label>REJON</label><select id="fDistrict">'+districts.map(d=>'<option>'+d.name+'</option>').join('')+'</select></div><div class="notice">Koszt zależy od formatu: od 65 000 zł. Przychód zależy od potencjału rejonu.</div>',onConfirm:()=>{const shop=openShop(state,{name:$('fName').value,type:$('fType').value,district:$('fDistrict').value});log('🏬','Otwarto nową placówkę',shop.name+' — '+shop.district);notify('Sklep został otwarty!');closeModal();renderAll(state);}});}
function companyModal(){openModal({title:'Załóż spółkę córkę',description:'Utwórz nową firmę w strukturze holdingu.',fields:'<div class="field"><label>NAZWA SPÓŁKI</label><input id="fName" value="Wilk Retail 2 sp. z o.o."></div><div class="field"><label>BRANŻA</label><select id="fIndustry">'+['Handel spożywczy','Odzież i obuwie','Elektronika','Drogerie i kosmetyki','Wyposażenie domu'].map(x=>'<option>'+x+'</option>').join('')+'</select></div><div class="notice">Kapitał zakładowy: 50 000 zł. Holding obejmuje 100% udziałów.</div>',onConfirm:()=>{const name=$('fName').value.trim(),industry=$('fIndustry').value;if(!name)throw new Error('Podaj nazwę spółki.');if(state.cash<50000)throw new Error('Za mało środków.');state.cash-=50000;state.companies.push({id:state.nextId++,name,industry,share:100,value:50000});log('◈','Założono nową spółkę',name);notify('Spółka córka została utworzona!');closeModal();renderAll(state);}});}
function handleAction(button){const action=button.dataset.action,id=Number(button.dataset.id);try{switch(action){
 case 'new-shop':shopModal();break;
 case 'new-company':companyModal();break;
 case 'select-company':state.selectedMarketCompanyId=id;renderAll(state);break;
 case 'buy-shares':{const result=buyShares(state,id,Number(button.dataset.percent));log('📈','Zakupiono udziały',result.company.name+' · '+result.amount+'%');notify('Zakupiono '+result.amount+'% udziałów.');renderAll(state);break;}
 case 'take-control':{const company=takeControl(state,id);log('👑','Przejęto kontrolę nad spółką',company.name+' — pakiet '+company.share+'%');notify('Przejęto zarządzanie spółką!');renderAll(state);break;}
 case 'unlock-district':{const district=unlockDistrict(state,Number(button.dataset.index));log('⌖','Odblokowano nowy rejon',district.name+' — rynek otwarty');notify('Nowy rejon jest dostępny!');renderAll(state);break;}
 }}catch(error){notify(error.message);}
}
document.addEventListener('click',event=>{const actionButton=event.target.closest('[data-action]');if(actionButton){handleAction(actionButton);return;}const pageButton=event.target.closest('[data-page]');if(pageButton)showPage(pageButton.dataset.page);});
$('modalCancel').addEventListener('click',closeModal);
$('modalConfirm').addEventListener('click',()=>{if(!modalAction)return;try{modalAction();}catch(error){notify(error.message);}});
$('nextDay').addEventListener('click',()=>{state.day++;const result=closeBusinessDay(state);log('📊','Zamknięto dzień '+state.day,(result.profit>=0?'Zysk: ':'Strata: ')+money(Math.abs(result.profit)));renderAll(state);notify('Dzień '+state.day+' zakończony · '+(result.profit>=0?'+':'')+money(result.profit));});
renderAll(state);renderHeader(state);
