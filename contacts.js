window.CONTACTS={"AXA":[{"role":"Directeur Financier","name":"Bertrand Poupart-Lafarge","email":""},{"role":"Directeur Transformation & Technologie","name":"Christophe Vermont","email":""},{"role":"Directrice des Ressources Humaines","name":"Amélie Watelet","email":""}],"CIRCET":[{"role":"Directeur administratif & financier","name":"Charles-Marie Desmaizières","email":""},{"role":"Directrice des ressources humaines","name":"Pamela Fillon","email":""}],"CHARIER":[{"role":"Directeur Administratif et Financier","name":"Florent Derely","email":""},{"role":"Directeur des Systèmes d’Information","name":"Dominique Dubuc","email":""},{"role":"Directeur Ressources Humaines","name":"Constant Charier","email":""}],"SILL ENTREPRISES":[{"role":"Directrice Administrative et Financière","name":"Emilie Pouget","email":""},{"role":"Directeur Système d’Information et Transformation Digitale","name":"Yannick Le Bars","email":""},{"role":"Directeur Ressources Humaines","name":"Patrice Kerouel","email":""}],"Groupe Dubreuil":[{"role":"Directeur administratif et financier","name":"Erwan Sourdrille","email":""},{"role":"Directeur des systèmes d'information","name":"Pascal Pussat","email":""}],"EUROAPI":[{"role":"Directeur financier","name":"Olivier Falut","email":""},{"role":"Chief People Officer","name":"Raphaële Hauzy","email":""},{"role":"Directeur de la Transformation","name":"Matthias Cools","email":""}],"ROQUETTE FRERES":[{"role":"CFO","name":"Cédric Garrigues","email":""},{"role":"Chief Digital & Information Officer","name":"Michael Manouvrier","email":""},{"role":"Chief Human Resources Officer","name":"Stéphanie Mercier","email":""}],"CRISTAL UNION":[{"role":"Directeur Général","name":"Xavier Astolfi","email":""},{"role":"Directrice des Ressources Humaines","name":"Lauriane Delunel","email":""}],"1001 VIES HABITAT":[{"role":"DSI","name":"Christophe Bellard","email":""}],"IN EXTENSO":[{"role":"Président du Directoire","name":"Antoine de Riedmatten","email":""},{"role":"Directeur Général","name":"Frank Lamotte","email":""}],"DEMATHIEU BARD":[{"role":"Directeur Général Finances Groupe / membre du Directoire","name":"Vincent Monnot","email":""},{"role":"Directeur des Ressources Humaines Groupe","name":"Michael Heinz","email":""}]};

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