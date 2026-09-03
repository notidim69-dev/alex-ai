window.CONTACTS={"AXA":[{"role":"Directeur Financier","name":"Bertrand Poupart-Lafarge","email":""},{"role":"Directeur Transformation & Technologie","name":"Christophe Vermont","email":""},{"role":"Directrice des Ressources Humaines","name":"Amélie Watelet","email":""}],"CIRCET":[{"role":"Directeur administratif & financier","name":"Charles-Marie Desmaizières","email":""},{"role":"Directrice des ressources humaines","name":"Pamela Fillon","email":""}],"CHARIER":[{"role":"Directeur Administratif et Financier","name":"Florent Derely","email":""},{"role":"Directeur des Systèmes d’Information","name":"Dominique Dubuc","email":""},{"role":"Directeur Ressources Humaines","name":"Constant Charier","email":""}],"SILL ENTREPRISES":[{"role":"Directrice Administrative et Financière","name":"Emilie Pouget","email":""},{"role":"Directeur Système d’Information et Transformation Digitale","name":"Yannick Le Bars","email":""},{"role":"Directeur Ressources Humaines","name":"Patrice Kerouel","email":""}],"Groupe Dubreuil":[{"role":"Directeur administratif et financier","name":"Erwan Sourdrille","email":""},{"role":"Directeur des systèmes d'information","name":"Pascal Pussat","email":""}],"EUROAPI":[{"role":"Directeur financier","name":"Olivier Falut","email":""},{"role":"Chief People Officer","name":"Raphaële Hauzy","email":""},{"role":"Directeur de la Transformation","name":"Matthias Cools","email":""}],"ROQUETTE FRERES":[{"role":"CFO","name":"Cédric Garrigues","email":""},{"role":"Chief Digital & Information Officer","name":"Michael Manouvrier","email":""},{"role":"Chief Human Resources Officer","name":"Stéphanie Mercier","email":""}],"CRISTAL UNION":[{"role":"Directeur Général","name":"Xavier Astolfi","email":""},{"role":"Directrice des Ressources Humaines","name":"Lauriane Delunel","email":""}],"1001 VIES HABITAT":[{"role":"DSI","name":"Christophe Bellard","email":""}],"IN EXTENSO":[{"role":"Président du Directoire","name":"Antoine de Riedmatten","email":""},{"role":"Directeur Général","name":"Frank Lamotte","email":""}],"DEMATHIEU BARD":[{"role":"Directeur des Ressources Humaines Groupe","name":"Michael Heinz","email":""},{"role":"Directeur comptable multi-filiales","name":"Poste en recrutement","email":""}]};

if(location.pathname.endsWith('/ux-v3.html')){
  const slots=[
    {role:"DSI / Directeur des systèmes d'information",match:/\b(dsi|cio)\b|syst[eè]mes? d.?information|information officer/i},
    {role:"Responsable RH / DRH",match:/\bdrh\b|ressources humaines|human resources|chief people|people officer/i},
    {role:"Trésorier / Directeur trésorerie",match:/tr[eé]sor|treasury/i},
    {role:"Directeur fiscal",match:/fiscal|tax/i},
    {role:"Directeur comptable",match:/comptab|accounting/i}
  ];
  Object.keys(window.CONTACTS||{}).forEach(function(account){
    const list=window.CONTACTS[account];
    slots.forEach(function(slot){if(!list.some(c=>slot.match.test(c.role||'')))list.push({role:slot.role,name:'À identifier',email:''})});
  });

  (function(){
    const NEW_HASH='8b7bfc449d3e571b4c46789462c79b821362a213b3593b9228be62059ce738e5';
    const btn=document.getElementById('loginBtn'),user=document.getElementById('u'),pass=document.getElementById('p'),login=document.getElementById('login'),err=document.getElementById('err');
    if(!btn||!user||!pass||!login)return;
    async function digest(s){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return[...new Uint8Array(d)].map(x=>x.toString(16).padStart(2,'0')).join('')}
    async function authenticate(e){if(e){e.preventDefault();e.stopImmediatePropagation()}if(user.value.trim()==='alexandre'&&(await digest(pass.value))===NEW_HASH){sessionStorage.ok='1';login.classList.add('hide');if(err)err.textContent=''}else if(err)err.textContent='Identifiant ou mot de passe incorrect.'}
    btn.addEventListener('click',authenticate,true);
    pass.addEventListener('keydown',function(e){if(e.key==='Enter')authenticate(e)},true);
  })();
}