(()=>{
const A=window.ACCOUNTS||[];
const oldOpen=window.openA;
function searchUrl(name){const q=encodeURIComponent(`site:linkedin.com ${name} (DAF OR CFO OR DSI OR CIO OR DRH OR CHRO OR "chef de projet ERP" OR "chef de projet SIRH" OR trésorier OR paie OR transformation)`);return `https://www.google.com/search?q=${q}`;}
function webText(a){return [a.web?.title,a.web?.why,a.web?.project,a.web?.angle].filter(Boolean).join(' ').toLowerCase();}
function sourceFor(label,a){
  if(!a.web)return null;
  const x=webText(a);
  const rules={
    'Signal web qualifié':/.*/,
    'Projet explicite':/.*/,
    'Recrutement / gouvernance':/recrut|chef de projet|responsable paie|lead dev|daf|dsi|drh|tr[eé]sorier|cfo|cio|chro|gouvernance|nomination/,
    'Transformation ERP / SI':/erp|s\/4|sap|dynamics|oracle|sage|ifs|si|syst[eè]me d.information/,
    'Programme de transformation':/transformation|simplification|rationalisation|modernisation|programme/,
    'Signal cash / trésorerie':/cash|tr[eé]so|bfr|refinanc|working capital|tms/,
    'M&A / intégration':/acquisition|m&a|croissance externe|fusion|int[eé]gration/,
    'Transformation RH / Paie':/paie|sirh|talent|workday|adp|silae|rh|ressources humaines/,
    'Réglementaire Finance / Tax':/facturation|rfe|fiscal|tax|ctu|ctf|invoke|conformit[eé]/
  };
  const r=rules[label];
  return r&&r.test(x)?{name:a.web.source||'Source web',url:a.web.url,date:a.web.date}:null;
}
function decorateRadar(a){
  const d=document.getElementById('detail');
  if(!d)return;
  d.querySelectorAll('.radar .sig').forEach(card=>{
    const strong=card.querySelector('strong');
    if(!strong)return;
    const raw=strong.textContent||'';
    const label=raw.replace(/\s[+-]\d+\s*$/,'').trim();
    const src=sourceFor(label,a);
    const line=document.createElement('div');
    line.className='muted';
    line.style.marginTop='7px';
    if(src){
      const date=src.date?` · ${src.date}`:'';
      line.innerHTML=`Source web : <a href="${src.url}" target="_blank" rel="noopener">${src.name} ↗</a>${date}`;
    }else if(label==='Compte stratégique' || label==='Risque relationnel'){
      line.textContent='Source : donnée interne Alex AI';
    }else{
      line.textContent='Source web : non associée à ce signal';
    }
    card.appendChild(line);
  });
}
window.openA=function(nm){
  oldOpen(nm);
  const a=A.find(x=>x.name===nm);
  if(!a)return;
  decorateRadar(a);
  const d=document.getElementById('detail');
  const block=`<div class="card"><h2>🔎 LinkedIn public</h2><p class="muted">Recherche rapide des signaux faibles publics : nominations, changements de poste, recrutements, posts de décideurs et annonces de transformation.</p><a class="pri" style="display:inline-block;padding:10px 13px;border-radius:10px;color:#fff" href="${searchUrl(a.name)}" target="_blank" rel="noopener">Rechercher ${a.name} sur LinkedIn public ↗</a></div>`;
  d.insertAdjacentHTML('beforeend',block);
};
})();