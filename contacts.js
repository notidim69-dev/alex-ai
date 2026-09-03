window.CONTACTS={"AXA":[{"role":"Directeur Financier","name":"Bertrand Poupart-Lafarge","email":""},{"role":"Directeur Transformation & Technologie","name":"Christophe Vermont","email":""},{"role":"Directrice des Ressources Humaines","name":"Amélie Watelet","email":""}],"CIRCET":[{"role":"Directeur administratif & financier","name":"Charles-Marie Desmaizières","email":""},{"role":"Directrice des ressources humaines","name":"Pamela Fillon","email":""}],"CHARIER":[{"role":"Directeur Administratif et Financier","name":"Florent Derely","email":""},{"role":"Directeur des Systèmes d’Information","name":"Dominique Dubuc","email":""},{"role":"Directeur Ressources Humaines","name":"Constant Charier","email":""}],"SILL ENTREPRISES":[{"role":"Directrice Administrative et Financière","name":"Emilie Pouget","email":""},{"role":"Directeur Système d’Information et Transformation Digitale","name":"Yannick Le Bars","email":""},{"role":"Directeur Ressources Humaines","name":"Patrice Kerouel","email":""}],"Groupe Dubreuil":[{"role":"Directeur administratif et financier","name":"Erwan Sourdrille","email":""},{"role":"Directeur des systèmes d'information","name":"Pascal Pussat","email":""}],"EUROAPI":[{"role":"Directeur financier","name":"Olivier Falut","email":""},{"role":"Chief People Officer","name":"Raphaële Hauzy","email":""},{"role":"Directeur de la Transformation","name":"Matthias Cools","email":""}],"ROQUETTE FRERES":[{"role":"CFO","name":"Cédric Garrigues","email":""},{"role":"Chief Digital & Information Officer","name":"Michael Manouvrier","email":""},{"role":"Chief Human Resources Officer","name":"Stéphanie Mercier","email":""}],"CRISTAL UNION":[{"role":"Directeur Général","name":"Xavier Astolfi","email":""},{"role":"Directrice des Ressources Humaines","name":"Lauriane Delunel","email":""}],"1001 VIES HABITAT":[{"role":"DSI","name":"Christophe Bellard","email":""}],"IN EXTENSO":[{"role":"Président du Directoire","name":"Antoine de Riedmatten","email":""},{"role":"Directeur Général","name":"Frank Lamotte","email":""}]};

/* UX V2 preview bootstrap only — no effect on production index.html */
if(location.pathname.endsWith('/ux-v2.html')){
  ['login','u','p','err','overview','accountsView','fSolution','fTemp','globalSearch','kHot','kRisk','kProj','kAct','kAvg','accountName','accountSub','avatar','stack','intentScore','tempBadge','topSignals','signalGrid','projectList','nbaText','nbaWhy','contactList','newsFeed','accountCount','accountRows'].forEach(function(id){window[id]=document.getElementById(id)});
  function norm(s){return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim()}
  function buildSearchIndex(){
    const accounts=window.ACCOUNTS||[];
    return accounts.map(function(a){
      const contacts=(window.CONTACTS&&window.CONTACTS[a.name])||[];
      const stack=(a.stack||[]).flat().join(' ');
      const contactText=contacts.map(function(c){return [c.name,c.role,c.email].filter(Boolean).join(' ')}).join(' ');
      const web=[a.web&&a.web.title,a.web&&a.web.why,a.web&&a.web.project,a.web&&a.web.angle,a.web&&a.web.target].filter(Boolean).join(' ');
      return {a:a,name:norm(a.name),contacts:norm(contactText),stack:norm(stack),context:norm([a.comment,a.prosp_talent,web].filter(Boolean).join(' '))};
    });
  }
  function scoreResult(item,term){
    let s=0;
    if(item.name===term)s+=1000;
    else if(item.name.startsWith(term))s+=700;
    else if(item.name.includes(term))s+=500;
    if(item.contacts.includes(term))s+=260;
    if(item.stack.includes(term))s+=140;
    if(item.context.includes(term))s+=80;
    return s;
  }
  function ensureSuggestions(){
    if(!globalSearch)return null;
    let box=document.getElementById('searchSuggestions');
    if(box)return box;
    box=document.createElement('div');
    box.id='searchSuggestions';
    box.style.cssText='position:absolute;top:48px;left:0;right:0;background:#fff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 14px 30px rgba(16,24,40,.12);z-index:50;display:none;max-height:360px;overflow:auto';
    globalSearch.parentElement.style.position='relative';
    globalSearch.parentElement.appendChild(box);
    return box;
  }
  function renderSuggestions(results){
    const box=ensureSuggestions();if(!box)return;
    if(!results.length){box.innerHTML='<div style="padding:12px;color:#667085">Aucun compte trouvé</div>';box.style.display='block';return}
    box.innerHTML=results.slice(0,8).map(function(r){
      const a=r.a;
      const contacts=(window.CONTACTS&&window.CONTACTS[a.name])||[];
      const subtitle=contacts.length?contacts.slice(0,2).map(c=>c.name+' · '+c.role).join(' | '):(a.web&&a.web.project)||a.comment||'Compte du portefeuille';
      const safe=a.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const data=a.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
      return `<button type="button" data-account="${data}" style="width:100%;border:0;background:#fff;text-align:left;padding:11px 13px;cursor:pointer;border-bottom:1px solid #f0f2f5"><b>${safe}</b><div style="font-size:12px;color:#667085;margin-top:3px">${subtitle}</div></button>`;
    }).join('');
    box.style.display='block';
    box.querySelectorAll('[data-account]').forEach(function(btn){btn.addEventListener('click',function(){if(typeof window.openAccount==='function')window.openAccount(btn.dataset.account);globalSearch.value=btn.dataset.account;box.style.display='none'})});
  }
  setTimeout(function(){
    if(typeof window.showAccounts==='function'){
      window.filterCounter=function(k){counterFilter=k;if(fSolution)fSolution.value='';if(fTemp)fTemp.value='';showAccounts()};
    }
    const index=buildSearchIndex();
    if(globalSearch){
      globalSearch.removeAttribute('oninput');
      globalSearch.addEventListener('input',function(){
        const term=norm(globalSearch.value);
        const box=ensureSuggestions();
        if(term.length<1){if(box)box.style.display='none';return}
        const results=index.map(function(item){return {a:item.a,score:scoreResult(item,term)}}).filter(r=>r.score>0).sort((x,y)=>y.score-x.score);
        renderSuggestions(results);
      });
      globalSearch.addEventListener('keydown',function(e){
        if(e.key==='Enter'){
          const term=norm(globalSearch.value);
          const results=index.map(function(item){return {a:item.a,score:scoreResult(item,term)}}).filter(r=>r.score>0).sort((x,y)=>y.score-x.score);
          if(results[0]&&typeof window.openAccount==='function'){window.openAccount(results[0].a.name);const box=ensureSuggestions();if(box)box.style.display='none'}
        }
      });
      document.addEventListener('click',function(e){const box=document.getElementById('searchSuggestions');if(box&&!globalSearch.parentElement.contains(e.target))box.style.display='none'});
    }
  },0);
}

/* UX V3 radar source correction — no effect on production index.html */
if(location.pathname.endsWith('/ux-v3.html')){
  (function(){
    const q=s=>'https://www.google.com/search?q='+encodeURIComponent(s);
    function currentAccount(){
      const name=(document.getElementById('companyName')?.textContent||'').trim();
      return (window.ACCOUNTS||[]).find(a=>a.name===name);
    }
    function themeSource(label,a){
      if(!a)return null;
      const n='"'+a.name+'" ';
      if(label==='Signal web qualifié')return a.web?{name:a.web.source||'Source web qualifiée',url:a.web.url}:null;
      if(label==='Projet explicite')return a.web?{name:a.web.source||'Source du projet',url:a.web.url}:null;
      if(label==='Recrutement / gouvernance')return{name:'LinkedIn public / Careers',url:q(n+'(recrutement OR nomination OR DAF OR CFO OR DSI OR CIO OR DRH OR CHRO OR trésorier OR "chef de projet ERP" OR "chef de projet SIRH")')};
      if(label==='Transformation ERP / SI')return{name:'Web SI / intégrateurs',url:q(n+'(ERP OR SAP OR S4HANA OR Oracle OR IFS OR Dynamics OR Sage OR "transformation SI" OR intégrateur)')};
      if(label==='Programme de transformation')return{name:'Web entreprise / presse',url:q(n+'(transformation OR simplification OR rationalisation OR modernisation OR "programme stratégique")')};
      if(label==='Signal cash / trésorerie')return{name:'Web Finance / Trésorerie',url:q(n+'(trésorerie OR cash OR TMS OR BFR OR refinancement OR "working capital")')};
      if(label==='M&A / intégration')return{name:'Web M&A / corporate',url:q(n+'(acquisition OR fusion OR "croissance externe" OR M&A OR intégration)')};
      if(label==='Transformation RH / Paie')return{name:'LinkedIn Jobs / Careers',url:q(n+'(SIRH OR paie OR payroll OR talent OR Workday OR ADP OR Silae OR recrutement RH)')};
      if(label==='Réglementaire Finance / Tax')return{name:'Web Finance / Tax',url:q(n+'(RFE OR "facturation électronique" OR fiscalité OR tax OR conformité)')};
      if(label==='Compte stratégique'||label==='Risque relationnel')return{name:'Donnée interne Alex AI',url:''};
      return null;
    }
    function rewriteRadar(){
      const a=currentAccount(); if(!a)return;
      document.querySelectorAll('#radarGrid .radarItem').forEach(card=>{
        const b=card.querySelector('b'); if(!b)return;
        const label=(b.textContent||'').replace(/\s[+-]\d+\s*$/,'').trim();
        const src=themeSource(label,a); if(!src)return;
        let source=card.querySelector('.source'); if(!source){source=document.createElement('div');source.className='source';card.appendChild(source)}
        source.innerHTML=src.url?`<a href="${src.url}" target="_blank" rel="noopener">${src.name} ↗</a>`:`<span class="muted">${src.name}</span>`;
      });
    }
    const obs=new MutationObserver(()=>rewriteRadar());
    document.addEventListener('DOMContentLoaded',()=>{
      const grid=document.getElementById('radarGrid');
      if(grid)obs.observe(grid,{childList:true,subtree:true});
      setTimeout(rewriteRadar,50);
    });
  })();
}