(()=>{
const A=window.ACCOUNTS||[];
const oldOpen=window.openA;
function q(s){return encodeURIComponent(s)}
function google(query){return `https://www.google.com/search?q=${q(query)}`}
function webText(a){return [a.web?.title,a.web?.why,a.web?.project,a.web?.angle].filter(Boolean).join(' ').toLowerCase();}
function actualWebSource(label,a){
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
function fallbackSource(label,a){
  const n=a.name;
  if(label==='Recrutement / gouvernance') return {name:'LinkedIn public / Careers',url:google(`"${n}" (DAF OR CFO OR DSI OR CIO OR DRH OR CHRO OR trésorier OR "chef de projet" OR recrutement) (site:linkedin.com OR careers OR emploi OR jobs)`)};
  if(label==='Transformation ERP / SI') return {name:'Web SI / intégrateurs',url:google(`"${n}" (ERP OR SAP OR S4HANA OR Oracle OR IFS OR Dynamics OR Sage OR transformation SI OR intégrateur)`)};
  if(label==='Programme de transformation') return {name:'Web entreprise / presse',url:google(`"${n}" (transformation OR simplification OR rationalisation OR modernisation OR programme stratégique)`)};
  if(label==='Signal cash / trésorerie') return {name:'Web Finance / Trésorerie',url:google(`"${n}" (trésorerie OR cash OR TMS OR BFR OR refinancement OR working capital)`)};
  if(label==='M&A / intégration') return {name:'Web M&A',url:google(`"${n}" (acquisition OR fusion OR M&A OR croissance externe OR intégration)`)};
  if(label==='Transformation RH / Paie') return {name:'LinkedIn Jobs / Careers',url:google(`"${n}" (SIRH OR paie OR payroll OR talent OR RH OR Workday OR ADP OR Silae) (site:linkedin.com/jobs OR careers OR emploi)`)};
  if(label==='Réglementaire Finance / Tax') return {name:'Web Finance / Tax',url:google(`"${n}" (RFE OR facturation électronique OR fiscalité OR tax OR conformité)`)};
  return null;
}
function decorateRadar(a){
  const d=document.getElementById('detail');
  if(!d)return;
  const research=d.querySelector('.radar .research');
  if(research)research.remove();
  d.querySelectorAll('.radar .sig').forEach(card=>{
    const strong=card.querySelector('strong');
    if(!strong)return;
    const raw=strong.textContent||'';
    const label=raw.replace(/\s[+-]\d+\s*$/,'').trim();
    const existing=card.querySelector('.radar-source');
    if(existing)existing.remove();
    const line=document.createElement('div');
    line.className='muted radar-source';
    line.style.marginTop='7px';
    if(label==='Compte stratégique' || label==='Risque relationnel'){
      line.textContent='Source : donnée interne Alex AI';
      card.appendChild(line);
      return;
    }
    const src=actualWebSource(label,a)||fallbackSource(label,a);
    if(src){
      const date=src.date?` · ${src.date}`:'';
      line.innerHTML=`Source : <a href="${src.url}" target="_blank" rel="noopener">${src.name} ↗</a>${date}`;
    }else{
      line.textContent='Source : non disponible';
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
  const oldLinkedIn=d.querySelector('[data-linkedin-public]');
  if(oldLinkedIn)oldLinkedIn.remove();
};
})();