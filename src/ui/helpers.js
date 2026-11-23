export const money=value=>Math.round(value).toLocaleString('pl-PL')+' zł';
export const percent=value=>value.toFixed(1).replace('.',',')+'%';
export function pageHeading(kicker,title,description,action=''){return '<div class="page-heading"><div><div class="eyebrow">'+kicker+'</div><h1>'+title+'</h1><p>'+description+'</p></div>'+action+'</div>';}
export function stats(items){return '<div class="stats">'+items.map(([label,value,detail=''])=>'<div class="stat"><label>'+label+'</label><strong>'+value+'</strong>'+(detail?'<small>'+detail+'</small>':'')+'</div>').join('')+'</div>';}
export function card(title,meta,body){return '<div class="card"><div class="card-head"><h3>'+title+'</h3><span>'+meta+'</span></div>'+body+'</div>';}
export function table(headers,rows){return '<div class="table-wrap"><table class="data-table"><thead><tr>'+headers.map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>';}
