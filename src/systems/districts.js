export function unlockDistrict(state,index){
 const district=state.districts[index];
 if(!district)throw new Error('Nie znaleziono rejonu.');
 if(district.owned)throw new Error('Ten rejon jest już odblokowany.');
 if(state.cash<district.cost)throw new Error('Za mało środków.');
 state.cash-=district.cost;district.owned=true;return district;
}
