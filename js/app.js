/* Atelier — application */
(()=>{
'use strict';
/* Même projet Firebase que Mission Bip et Bip Agence : un seul compte pour les trois sites */
const FB_CONFIG={apiKey:"AIzaSyDF6idRWnpsezjXYQ_f_7_58O2prxvA9Gc",authDomain:"bip-jeux.firebaseapp.com",projectId:"bip-jeux",storageBucket:"bip-jeux.firebasestorage.app",messagingSenderId:"518939054835",appId:"1:518939054835:web:737987fffa793c14a25d86"};
let fb=null,auth=null,db=null;
try{if(window.firebase&&firebase.initializeApp){fb=firebase.apps.length?firebase.app():firebase.initializeApp(FB_CONFIG);auth=firebase.auth();db=firebase.firestore()}}catch(e){fb=null}
const sb=auth; /* présence du service de comptes */

/* ---------- utils ---------- */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const hash=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)%2147483646+1};
const rng=seed=>{let s=seed;return()=>(s=s*16807%2147483647)/2147483647};
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
let toastT;
function toast(msg,html){const t=$('#toast');if(html)t.innerHTML=msg;else t.textContent=msg;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),html?5000:2200)}
async function copy(text,label){try{await navigator.clipboard.writeText(text);toast((label||'Copié')+' ✓')}catch(e){toast('Copie impossible : sélectionnez le texte à la main')}}
const gimg=q=>'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(q);
const wiki=q=>'https://fr.wikipedia.org/w/index.php?search='+encodeURIComponent(q);

/* ---------- fonts ---------- */
const loaded=new Set(['Archivo']);
const fontURL=n=>'https://fonts.googleapis.com/css2?family='+n.replace(/ /g,'+')+(FONTS[n]?':wght@'+FONTS[n]:'')+'&display=swap';
function loadFont(n){if(!n||loaded.has(n))return;loaded.add(n);const l=document.createElement('link');l.rel='stylesheet';l.href=fontURL(n);document.head.appendChild(l)}

/* ---------- favourites ---------- */
let user=null,favs=new Map(),nudged=false,current='aujourdhui';
const REG=new Map();
const LOCAL='atelier-favs-v2';
const fid=(k,key)=>k+'::'+key;
function favBtn(kind,key,label,data,ico){const id=fid(kind,key);REG.set(id,{kind,key,label,data:data||{}});const on=favs.has(id);return `<button class="fav${ico?' ico':''}" data-fid="${esc(id)}" aria-pressed="${on}" title="${on?'Retirer des favoris':'Ajouter aux favoris'}" aria-label="Favori : ${esc(label)}">${ico?(on?'★':'☆'):(on?'★ Favori':'☆ Favori')}</button>`}
function refreshFav(){$$('.fav[data-fid]').forEach(b=>{const on=favs.has(b.dataset.fid);b.setAttribute('aria-pressed',on);b.title=on?'Retirer des favoris':'Ajouter aux favoris';b.textContent=b.classList.contains('ico')?(on?'★':'☆'):(on?'★ Favori':'☆ Favori')});$('#favCount').textContent=favs.size;if(current==='espace')renderEspace();if(current==='artistes'&&af==='fav')renderArtists();if(current==='lexique'&&lf==='fav')renderLex()}
const saveLocal=()=>store.set(LOCAL,[...favs.values()]);
const favRef=()=>db.collection('eleves').doc(user.uid).collection('atelier').doc('favoris');
let saveT=null,denied=false;
function saveRemote(){clearTimeout(saveT);saveT=setTimeout(async()=>{if(!user)return;try{await favRef().set({data:JSON.stringify([...favs.values()]),email:user.email||'',updatedAt:firebase.firestore.FieldValue.serverTimestamp()});denied=false}catch(e){if(/permission/.test(String(e.code||e.message))){denied=true;saveLocal();toast('Favoris gardés sur cet appareil : la sauvegarde en ligne d\u2019Atelier n\u2019est pas encore activée (prévenez votre formateur).')}else toast('Sauvegarde impossible, réessayez')}},400)}
function persist(){if(user)saveRemote();else saveLocal()}
async function toggleFav(id){
  const r=REG.get(id)||favs.get(id);if(!r)return;
  if(favs.has(id)){favs.delete(id);refreshFav();persist();return}
  favs.set(id,{kind:r.kind,key:r.key,label:r.label,data:r.data||{}});refreshFav();persist();
  if(!user&&!nudged){nudged=true;toast('Gardé sur cet appareil. <a href="#" data-open-auth>Créez un compte</a> pour le retrouver partout.',true)}else toast('Ajouté à votre espace ★')
}
function addFav(kind,key,label,data){const id=fid(kind,key);REG.set(id,{kind,key,label,data});if(favs.has(id)){toast('Déjà dans votre espace');return}toggleFav(id)}
async function remoteFavs(){try{const d=await favRef().get();return d.exists?JSON.parse(d.data().data||'[]'):[]}catch(e){if(/permission/.test(String(e.code||e.message)))denied=true;return null}}
async function loadFavs(){
  let rows=store.get(LOCAL,[]);
  if(user){const remote=await remoteFavs();if(remote){const m=new Map(remote.map(r=>[fid(r.kind,r.key),r]));let added=0;rows.forEach(r=>{const k=fid(r.kind,r.key);if(!m.has(k)){m.set(k,r);added++}});favs=m;if(added){saveRemote();toast(added+' favori'+(added>1?'s':'')+' de cet appareil ajouté'+(added>1?'s':'')+' à votre compte')}if(!denied)store.del(LOCAL);refreshFav();return}}
  favs=new Map(rows.map(r=>[fid(r.kind,r.key),r]));refreshFav();
}

/* ---------- auth (Firebase, partagé avec les jeux) ---------- */
let mode='in',synced=null;
const AM=$('#authModal');
const pseudo=()=>user?(user.displayName||(user.email||'').split('@')[0]):'';
function renderAcct(){$('#acctBtn').textContent=user?'★ '+pseudo():'Se connecter'}
function setMode(m){mode=m;
  $('#fPseudo').hidden=m!=='up';$('#fPass').hidden=m==='reset';
  $('#authTabs').hidden=m==='reset';$('#aForgot').hidden=m!=='in';
  $('#aPass').autocomplete=m==='in'?'current-password':'new-password';
  $('#authTitle').textContent={in:'Connexion',up:'Créer un compte',reset:'Mot de passe oublié'}[m];
  $('#aSubmit').textContent={in:'Se connecter',up:'Créer mon compte',reset:'Recevoir un lien'}[m];
  $$('#authTabs [data-am]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.am===m));$('#aErr').textContent='';$('#aErr').className='err'}
function openAuth(m){if(!auth){toast('Connexion indisponible pour le moment');return}setMode(m||'in');AM.showModal();setTimeout(()=>(m==='up'?$('#aPseudo'):$('#aEmail')).focus(),50)}
const frErr=e=>{const c=String(e&&e.code||''),m=String(e&&e.message||'');
  if(/invalid-credential|wrong-password|user-not-found|invalid-login/.test(c))return'Email ou mot de passe incorrect.';
  if(/email-already-in-use/.test(c))return'Un compte existe déjà avec cet email (peut-être créé dans un jeu Bip) : connectez-vous.';
  if(/weak-password/.test(c))return'Le mot de passe doit faire au moins 6 caractères.';
  if(/invalid-email|missing-email/.test(c))return'Adresse email invalide.';
  if(/too-many-requests/.test(c))return'Trop de tentatives : réessayez dans quelques minutes.';
  if(/network-request-failed/.test(c))return'Impossible de joindre le serveur : vérifiez votre connexion.';
  if(/unauthorized-domain/.test(c))return'Ce site n\u2019est pas autorisé à se connecter : prévenez votre formateur.';
  return'Erreur : '+(c||m)};
$('#authTabs').addEventListener('click',e=>{const b=e.target.closest('[data-am]');if(b)setMode(b.dataset.am)});
$('#aForgot').onclick=()=>setMode('reset');
$('#authForm').addEventListener('submit',async e=>{
  e.preventDefault();const em=$('#aEmail').value.trim(),pw=$('#aPass').value,err=$('#aErr');err.className='err';err.textContent='';
  if(!/^\S+@\S+\.\S+$/.test(em)){err.textContent='Entrez une adresse email valide.';return}
  if(mode!=='reset'&&pw.length<6){err.textContent='Le mot de passe doit faire au moins 6 caractères.';return}
  const btn=$('#aSubmit');btn.disabled=true;const old=btn.textContent;btn.textContent='Un instant…';
  try{
    if(mode==='in'){await auth.signInWithEmailAndPassword(em,pw);AM.close();toast('Bienvenue '+pseudo()+' !')}
    else if(mode==='up'){const ps=$('#aPseudo').value.trim();const cred=await auth.createUserWithEmailAndPassword(em,pw);if(ps){await cred.user.updateProfile({displayName:ps});renderAcct()}AM.close();toast('Compte créé, bienvenue '+(ps||'')+' ! Il marche aussi dans les jeux Bip.')}
    else{await auth.sendPasswordResetEmail(em);err.className='ok';err.textContent='Si un compte existe, un lien de réinitialisation vient de partir.'}
  }catch(x){err.textContent=frErr(x)}finally{btn.disabled=false;btn.textContent=old}
});
async function afterAuth(){const id=user?user.uid:'anon';if(synced===id)return;synced=id;await loadFavs();renderAcct();if(current==='espace')renderEspace()}
if(auth){auth.onAuthStateChanged(u=>{user=u||null;renderAcct();afterAuth()})}else loadFavs();
$('#acctBtn').onclick=()=>{if(user)location.hash='#espace';else openAuth('in')};

/* ---------- global clicks ---------- */
document.addEventListener('click',e=>{
  const f=e.target.closest('.fav[data-fid]');if(f){e.preventDefault();toggleFav(f.dataset.fid);return}
  const oa=e.target.closest('[data-open-artist]');if(oa){e.preventDefault();openArtist(oa.dataset.openArtist);return}
  const au=e.target.closest('[data-open-auth]');if(au){e.preventDefault();openAuth(au.dataset.openAuth||'up');return}
  const cp=e.target.closest('[data-copy]');if(cp){e.preventDefault();copy(cp.dataset.copy,cp.dataset.copyLabel);return}
  const cl=e.target.closest('[data-close]');if(cl){cl.closest('dialog').close();return}
  const z=e.target.closest('[data-zoom]');if(z){const d=document.createElement('div');d.className='zoom';d.innerHTML=`<div><img src="${esc(z.dataset.zoom)}" alt=""><p>${esc(z.dataset.cap)}</p></div>`;d.onclick=()=>d.remove();z.closest('dialog').appendChild(d);return}
});
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));

/* ---------- router ---------- */
const TABS=['aujourdhui','artistes','couleurs','symbolique','composition','logos','typo','methode','lexique','outils','code','references','espace'];
const onShow={};
function route(){let t=location.hash.slice(1);if(!TABS.includes(t))t='aujourdhui';current=t;
  $$('.tab').forEach(s=>s.hidden=s.id!=='t-'+t);
  $$('nav.tabs a').forEach(a=>{const on=a.getAttribute('href')==='#'+t;if(on){a.setAttribute('aria-current','page');a.scrollIntoView({block:'nearest',inline:'nearest'})}else a.removeAttribute('aria-current')});
  window.scrollTo(0,0);if(onShow[t])onShow[t]();}
window.addEventListener('hashchange',route);

/* ---------- artists ---------- */
const ALL=[];CATS.forEach(c=>c.list.forEach(a=>ALL.push({id:c.k+':'+a[0],c,a})));
const BYID=new Map(ALL.map(x=>[x.id,x]));
const works=a=>a[5].split(';').map(s=>{const [t,y]=s.split('|');return {t,y:y||''}});
function art(name,cat){const r=rng(hash(name)),on=cat.on;let s='';
  for(let y=0;y<5;y++)for(let x=0;x<10;x++){const v=r(),X=x*24,Y=y*24,cx=X+12,cy=Y+12,k=Math.floor(r()*4)*90,o=(.25+r()*.75).toFixed(2);
    if(v<.2)s+=`<circle cx="${cx}" cy="${cy}" r="${(5+r()*6).toFixed(1)}" fill="${on}" fill-opacity="${o}"/>`;
    else if(v<.42)s+=`<path d="M${X} ${Y}h24a24 24 0 0 1-24 24z" fill="${on}" fill-opacity="${o}" transform="rotate(${k} ${cx} ${cy})"/>`;
    else if(v<.54)s+=`<rect x="${X+4}" y="${Y+4}" width="16" height="16" fill="${on}" fill-opacity="${o}"/>`;
    else if(v<.64)s+=`<rect x="${X}" y="${Y}" width="24" height="12" fill="${on}" fill-opacity="${o}" transform="rotate(${k} ${cx} ${cy})"/>`}
  return `<svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`}
const artFav=(x,ico)=>favBtn('artist',x.id,x.a[0],{id:x.id},ico);
function plate(x){const {c,a}=x;const w=works(a);return `<article class="plate" style="--c:${c.c};--on:${c.on}"><div class="art" data-open-artist="${esc(x.id)}" role="button" tabindex="0" aria-label="Ouvrir la fiche de ${esc(a[0])}">${art(a[0],c)}<span class="cat">${c.n}</span></div><div class="body"><h3>${a[0]}</h3><p class="meta">${a[1]} · ${a[2]} · ${a[3]}</p><p>${a[4]}</p><p><span class="k">À voir : </span>${w.map(v=>`« ${v.t} » (${v.y})`).join(', ')}</p><p class="lesson"><span class="k">À retenir : </span>${a[6]}</p><div class="acts"><button class="btn sm solid" data-open-artist="${esc(x.id)}">Voir les œuvres</button>${artFav(x)}</div></div></article>`}
let off=0;
function dayN(){const d=new Date();d.setDate(d.getDate()+off);return [d,Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)]}
function renderDay(){const [d,n]=dayN();
  $('#date').textContent=d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});$('#today').hidden=off===0;
  $('#plates').innerHTML=CATS.slice(0,4).map((c,i)=>plate(BYID.get(c.k+':'+c.list[(n+i*7)%c.list.length][0]))).join('');
  $('#also').innerHTML=CATS.slice(4).map((c,i)=>acard(BYID.get(c.k+':'+c.list[(n*3+i*5)%c.list.length][0]))).join('');
  $('#exo').textContent=EXO[n%EXO.length];
  const t=LEX[(n*7)%LEX.length];
  $('#word').innerHTML=`<span class="eyebrow">Mot du jour · ${t[1]}</span><b class="t">${t[0]}</b><p style="margin:0;font-size:17px">${t[2]}</p><div class="acts">${favBtn('term',t[0],t[0],{},false)}<a class="btn sm" href="#lexique">Tout le lexique</a></div>`;
}
$('#prev').onclick=()=>{off--;renderDay()};$('#next').onclick=()=>{off++;renderDay()};$('#today').onclick=()=>{off=0;renderDay()};
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('.art[data-open-artist]')){e.preventDefault();openArtist(e.target.dataset.openArtist)}});

/* artist modal + Wikimedia Commons */
const CQ={web:'digital art',gra:'poster',art:'artwork',des:'design',pei:'painting',pho:'photograph',arc:'building',ill:'illustration',mod:'fashion',ux:'user interface'};
const BAD=/portrait|porträt|retrato|ritratto|interview|conference|conférence|lecture|award|ceremony|cérémonie|press |selfie|headshot|signature|grave|tomb|tombe|speaking|book signing|meeting|visite officielle|in \d{4}\b|en \d{4}\b|\(\d{4}\)$/i;
const stripTags=h=>{const d=document.createElement('div');d.innerHTML=h||'';return (d.textContent||'').replace(/\s+/g,' ').trim()};
let galTok=0;
async function commons(q,limit){const u='https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit='+limit+'&gsrsearch='+encodeURIComponent(q+' filetype:bitmap')+'&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=600';
  const r=await fetch(u);if(!r.ok)return [];const j=await r.json();return Object.values(j.query?.pages||{}).sort((a,b)=>a.index-b.index)}
async function loadGallery(x){
  const tok=++galTok,{a,c}=x,gal=$('#gal');
  const clean=a[0].replace(/\s*\(.*?\)/g,'');const sur=/&|teamLab|JODI|Grapus|Nendo|Experimental|M\/M|SANAA|Formafantasma|Studio|Architects|Chermayeff/i.test(a[0])?clean:clean.split(' ').pop();
  const qs=works(a).slice(0,3).map(w=>w.t.replace(/\s*\(.*?\)/g,'')+' '+sur);qs.push(clean+' '+(CQ[c.k]||'artwork'));
  let res=[];try{res=(await Promise.all(qs.map(q=>commons(q,6).catch(()=>[])))).flat()}catch(e){}
  if(tok!==galTok)return;
  const seen=new Set(),nm=norm(clean).replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim(),out=[];
  for(const p of res){if(seen.has(p.pageid))continue;seen.add(p.pageid);const i=p.imageinfo&&p.imageinfo[0];if(!i||!i.thumburl)continue;
    const title=p.title.replace(/^File:/,'').replace(/\.[^.]+$/,'');const md=i.extmetadata||{};
    const txt=title+' '+(md.Categories?.value||'')+' '+stripTags(md.ImageDescription?.value);
    if(BAD.test(txt))continue;
    const tn=norm(title).replace(/[^a-z ]/g,' ').replace(/\s+/g,' ').trim();if(tn===nm||tn.replace(/ \w$/,'')===nm)continue;
    out.push({title,thumb:i.thumburl,big:(i.width&&i.width<=1600)?i.url:i.thumburl.replace(/\/\d+px-/,'/1280px-'),page:i.descriptionurl,author:stripTags(md.Artist?.value)||'Auteur non précisé',lic:md.LicenseShortName?.value||'Licence libre'});
    if(out.length>=12)break}
  gal.innerHTML=out.length?out.map(o=>`<figure><button data-zoom="${esc(o.big)}" data-cap="${esc(o.title+' — '+o.author+' · '+o.lic)}"><img loading="lazy" src="${esc(o.thumb)}" alt="${esc(o.title)}"></button><figcaption>${esc(o.title)}<br>${esc(o.author)} · ${esc(o.lic)} · <a href="${esc(o.page)}" target="_blank" rel="noopener">source</a></figcaption></figure>`).join('')
  :`<p class="empty" style="grid-column:1/-1">Aucune image libre de droits trouvée. Les œuvres récentes sont protégées par le droit d'auteur et ne figurent pas sur Wikimedia Commons : utilisez les boutons « Voir l'image » ci-dessus.</p>`;
}
function openArtist(id){const x=BYID.get(id);if(!x)return;const {a,c}=x,w=works(a),M=$('#artModal');
  $('#artBody').innerHTML=`<div class="art" style="--c:${c.c};--on:${c.on}">${art(a[0],c)}<span class="cat">${c.n}</span></div>
  <div class="mgrid"><div><p class="eyebrow" style="margin-bottom:6px">${a[3]}</p><h2>${a[0]}</h2><p class="meta" style="margin-top:8px">${a[1]} · ${a[2]}</p><p style="font-size:17px">${a[4]}</p><p class="lesson" style="--c:${c.c}"><span class="k">À retenir : </span>${a[6]}</p><div class="acts">${artFav(x)}<a class="btn sm" href="${wiki(a[0].replace(/\s*\(.*?\)/g,''))}" target="_blank" rel="noopener">Wikipédia ↗</a><a class="btn sm" href="${gimg(a[0]+' '+c.q)}" target="_blank" rel="noopener">Toutes les images ↗</a></div></div>
  <div><h3 style="margin-bottom:8px">Œuvres clés</h3><ul class="works">${w.map(v=>`<li><span><b>${v.t}</b> · ${v.y}</span><a class="btn sm" href="${gimg(a[0].replace(/\s*\(.*?\)/g,'')+' '+v.t.replace(/\s*\(.*?\)/g,''))}" target="_blank" rel="noopener">Voir l'image ↗</a></li>`).join('')}</ul></div></div>
  <div class="sec"><h3 style="margin-bottom:4px">Images libres de droits</h3><p class="small">Issues de Wikimedia Commons, avec leurs auteurs et licences. Cliquez pour agrandir.</p><div class="gal" id="gal"><p><span class="spin"></span>Recherche des images…</p></div></div>`;
  if(!M.open)M.showModal();M.querySelector('.dlg-body').scrollTop=0;M.scrollTop=0;loadGallery(x)}

/* repertoire */
let af='all',aPage=1;const PER=48;
$('#artN').textContent=ALL.length;
$('#af').innerHTML=[['all','Tous'],...CATS.map(c=>[c.k,c.n]),['fav','★ Mes favoris']].map(([k,n])=>`<button class="btn sm" data-af="${k}" aria-pressed="${k==='all'}">${n}</button>`).join('');
$('#af').addEventListener('click',e=>{const b=e.target.closest('[data-af]');if(!b)return;af=b.dataset.af;aPage=1;$$('#af .btn').forEach(x=>x.setAttribute('aria-pressed',x===b));renderArtists()});
$('#aq').addEventListener('input',()=>{aPage=1;renderArtists()});
$('#asort').addEventListener('input',()=>{aPage=1;renderArtists()});
$('#aMore').onclick=()=>{aPage++;renderArtists(true)};
$('#inspire').onclick=()=>{const x=ALL[Math.floor(Math.random()*ALL.length)];openArtist(x.id)};
const year=x=>{const m=String(x.a[1]).match(/\d{3,4}/);return m?+m[0]:9999};
const acard=x=>`<article class="acard" style="--c:${x.c.c};--on:${x.c.on}"><div class="art" data-open-artist="${esc(x.id)}" role="button" tabindex="0" aria-label="Ouvrir ${esc(x.a[0])}">${art(x.a[0],x.c)}<span class="cat">${x.c.n}</span></div><div class="in"><button class="open" data-open-artist="${esc(x.id)}"><h4>${x.a[0]}</h4></button><p class="meta" style="margin:0">${x.a[3]} · ${x.a[1]} · ${x.a[2]}</p><div class="acts"><button class="btn sm" data-open-artist="${esc(x.id)}">Ouvrir la fiche</button>${artFav(x,true)}</div></div></article>`;
function renderArtists(more){const q=norm($('#aq').value.trim()),so=$('#asort').value;
  let l=ALL.filter(x=>(af==='all'||af===x.c.k||(af==='fav'&&favs.has(fid('artist',x.id))))&&(!q||norm(x.a.join(' ')+' '+x.c.n).includes(q)));
  if(so==='az')l.sort((p,r)=>p.a[0].localeCompare(r.a[0],'fr'));
  else if(so==='chrono')l.sort((p,r)=>year(p)-year(r));
  else{const r=rng(dayN()[1]+7);l=l.map(x=>[r(),x]).sort((p,s)=>p[0]-s[0]).map(p=>p[1])}
  const shown=l.slice(0,aPage*PER);$('#aCount').textContent=l.length+' fiche'+(l.length>1?'s':'');
  $('#agrid').innerHTML=shown.length?shown.map(acard).join(''):`<p class="empty" style="grid-column:1/-1">${af==='fav'?'Aucun artiste en favori : cliquez ☆ sur une fiche.':'Aucun résultat.'}</p>`;
  $('#aMore').hidden=shown.length>=l.length;$('#aMore').textContent='Afficher plus ('+(l.length-shown.length)+' restantes)'}
onShow.artistes=renderArtists;

/* ---------- colour ---------- */
const hsl2hex=(h,s,l)=>{s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('').toUpperCase()};
const hex2rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
const rgb2hex=(r,g,b)=>'#'+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('').toUpperCase();
const rgb2hsl=(r,g,b)=>{r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;let h=0,s=0;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return [Math.round(h),Math.round(s*100),Math.round(l*100)]};
const lum=hex=>{const v=hex2rgb(hex).map(c=>c/255).map(c=>c<=.03928?c/12.92:((c+.055)/1.055)**2.4);return .2126*v[0]+.7152*v[1]+.0722*v[2]};
const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const best=bg=>ratio(bg,'#111111')>=ratio(bg,'#FFFFFF')?'#111111':'#FFFFFF';
const RYB=[[0,0],[60,30],[120,55],[180,120],[240,220],[300,275],[360,360]];
const ryb2h=a=>{a=((a%360)+360)%360;for(let i=0;i<6;i++)if(a<=RYB[i+1][0]){const t=(a-RYB[i][0])/60;return RYB[i][1]+t*(RYB[i+1][1]-RYB[i][1])}return 0};
const NR=['Rouge','Rouge-orangé','Orange','Jaune-orangé','Jaune','Jaune-vert','Vert','Bleu-vert','Bleu','Bleu-violet','Violet','Rouge-violet'];
const NG=['Rouge','Orange','Jaune','Chartreuse','Vert','Vert printemps','Cyan','Azur','Bleu','Violet','Magenta','Rose'];
const HARM={comp:["Complémentaire",[0,180],"Deux couleurs opposées sur le cercle. Contraste maximal : idéal pour faire ressortir un élément. Laissez l'une dominer, l'autre ponctuer."],
 ana:["Analogue",[-30,0,30],"Trois voisines. Harmonie douce et naturelle. Ajoutez un neutre (blanc, noir, gris) pour le texte."],
 tri:["Triade",[0,120,240],"Trois couleurs à égale distance. Vivant et équilibré, typique du Bauhaus. Gardez-en une dominante."],
 split:["Complémentaires adjacentes",[0,150,210],"La base + les deux voisines de sa complémentaire. Contrasté, mais moins brutal que le complémentaire."],
 tetra:["Tétrade",[0,60,180,240],"Deux paires de complémentaires. Très riche : une couleur doit clairement dominer."],
 square:["Carré",[0,90,180,270],"Quatre couleurs à 90°. Énergique et festif, à équilibrer avec beaucoup de neutre."],
 mono:["Monochrome",[0],"Une seule teinte, du clair au foncé. Élégant et très sûr, parfait pour une interface."]};
const C={mode:'ryb',a:240,s:80,l:50,h:'comp'};
const hueOf=a=>C.mode==='ryb'?ryb2h(a):((a%360)+360)%360;
const nameOf=a=>(C.mode==='ryb'?NR:NG)[Math.round((((a%360)+360)%360)/30)%12];
$('#harm').innerHTML=Object.entries(HARM).map(([k,v])=>`<button class="btn sm" data-h="${k}" aria-pressed="${k===C.h}">${v[0]}</button>`).join('');
function palette(){if(C.h==='mono')return [-30,-15,0,15,30].map(d=>{const l=Math.max(8,Math.min(94,C.l+d));return {a:C.a,hex:hsl2hex(hueOf(C.a),C.s,l),n:nameOf(C.a)+(d<0?' foncé':d>0?' clair':'')}});
  return HARM[C.h][1].map(o=>({a:C.a+o,hex:hsl2hex(hueOf(C.a+o),C.s,C.l),n:nameOf(C.a+o)}))}
const P=(r,deg)=>{const t=deg*Math.PI/180;return [200+r*Math.sin(t),200-r*Math.cos(t)]};
const sector=(r1,r2,a1,a2)=>{const [x1,y1]=P(r2,a1),[x2,y2]=P(r2,a2),[x3,y3]=P(r1,a2),[x4,y4]=P(r1,a1),lg=a2-a1>180?1:0;return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${r2} ${r2} 0 ${lg} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}L${x3.toFixed(2)} ${y3.toFixed(2)}A${r1} ${r1} 0 ${lg} 0 ${x4.toFixed(2)} ${y4.toFixed(2)}Z`};
let curPal=[];
function drawWheel(){const rot=C.mode==='ryb'?120:60;let s='';
  for(let i=0;i<36;i++){const a=i*10,sa=a-rot;s+=`<path class="sg" data-a="${a}" d="${sector(120,190,sa-5,sa+5.2)}" fill="${hsl2hex(hueOf(a),85,52)}"><title>${nameOf(a)}</title></path><path class="sg" data-a="${a}" d="${sector(82,118,sa-5,sa+5.2)}" fill="${hsl2hex(hueOf(a),C.s,C.l)}"/>`}
  const p=palette(),pts=p.map(c=>P(100,c.a-rot));curPal=p;
  s+=`<circle cx="200" cy="200" r="80" fill="var(--bg)"/>`;
  if(pts.length>2)s+=`<polygon points="${pts.map(q=>q.map(v=>v.toFixed(1)).join(',')).join(' ')}" fill="${p[0].hex}" fill-opacity=".12" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>`;
  else if(pts.length===2)s+=`<line x1="${pts[0][0]}" y1="${pts[0][1]}" x2="${pts[1][0]}" y2="${pts[1][1]}" stroke="currentColor" stroke-width="2.5" stroke-dasharray="6 5"/>`;
  pts.forEach((q,i)=>{if(C.h!=='mono'||i===2)s+=`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="5" fill="currentColor"/>`});
  const seen=new Set();p.forEach((c,i)=>{const [x,y]=P(155,c.a-rot),key=Math.round(x)+'/'+Math.round(y);if(seen.has(key))return;seen.add(key);const big=i===0||C.h==='mono';s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big?17:13}" fill="${C.h==='mono'?p[2].hex:c.hex}" stroke="#fff" stroke-width="4"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${big?19.5:15.5}" fill="none" stroke="#111" stroke-width="1.5"/>`});

  $('#wheel').innerHTML=`<svg viewBox="0 0 400 400" role="img" aria-label="Cercle chromatique interactif" style="color:var(--ink)">${s}</svg>`;
  $('#sw').innerHTML=p.map(c=>`<button class="sw" data-copy="${c.hex}" data-copy-label="${c.hex} copié"><i style="background:${c.hex}"></i><span><b>${c.hex}</b>${c.n}</span></button>`).join('');
  $('#hnote').textContent=HARM[C.h][2];$('#oA').textContent=Math.round(C.a)+'°';$('#oS').textContent=C.s+'%';$('#oL').textContent=C.l+'%';
  const bg=p[0].hex,sh=(p[1]||p[0]).hex,ac=(p[2]||p[1]||p[0]).hex,tx=best(bg);
  $('#pm').innerHTML=`<rect width="100" height="141" fill="${bg}"/><circle cx="62" cy="52" r="30" fill="${sh}"/><text x="8" y="100" font-family="Archivo" font-weight="900" font-size="15" fill="${tx}">FESTIVAL</text><text x="8" y="114" font-family="Archivo" font-weight="700" font-size="8" fill="${tx}">12 → 14 juin · Nice</text><rect x="8" y="122" width="34" height="11" rx="5.5" fill="${ac}"/><text x="25" y="129.6" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="5.5" fill="${best(ac)}">BILLETS</text>`}
$('#harm').addEventListener('click',e=>{const b=e.target.closest('[data-h]');if(!b)return;C.h=b.dataset.h;$$('#harm .btn').forEach(x=>x.setAttribute('aria-pressed',x===b));drawWheel()});
$$('[data-mode]').forEach(b=>b.onclick=()=>{C.mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.setAttribute('aria-pressed',x===b));drawWheel()});
$('#wheel').addEventListener('click',e=>{const t=e.target.closest('.sg');if(!t)return;C.a=+t.dataset.a;$('#hA').value=C.a;drawWheel()});
[['#hA','a'],['#hS','s'],['#hL','l']].forEach(([id,k])=>$(id).addEventListener('input',e=>{C[k]=+e.target.value;drawWheel()}));
const cssVars=cols=>':root {\n'+cols.map((h,i)=>`  --couleur-${i+1}: ${h};`).join('\n')+'\n}';
$('#palSave').onclick=()=>{const cols=[...new Set(curPal.map(c=>c.hex))];const name=$('#palName').value.trim()||HARM[C.h][0]+' · '+nameOf(C.a);addFav('palette',cols.join('-'),name,{colors:cols,name});$('#palName').value=''};
$('#palCss').onclick=()=>copy(cssVars([...new Set(curPal.map(c=>c.hex))]),'Variables CSS copiées');
drawWheel();
const IT=[["Jaune","#FFD400"],["Jaune-orangé","#FFA800"],["Orange","#FF7A00"],["Rouge-orangé","#F24A1D"],["Rouge","#E3001B"],["Rouge-violet","#A8186E"],["Violet","#6A2C91"],["Bleu-violet","#3B3FA0"],["Bleu","#0057B8"],["Bleu-vert","#00897B"],["Vert","#2BA84A"],["Jaune-vert","#A6C80A"]];
{let s='';IT.forEach((c,i)=>{const a=i*30;s+=`<path d="${sector(136,192,a-15,a+15)}" fill="${c[1]}" stroke="var(--bg)" stroke-width="2"><title>${c[0]}</title></path>`;const [x,y]=P(164,a);s+=`<text x="${x.toFixed(1)}" y="${(y+5).toFixed(1)}" text-anchor="middle" font-size="15" font-weight="800" fill="${[0,1,11].includes(i)?'#111':'#fff'}">${i%4===0?'P':i%2===0?'S':'T'}</text>`});
 [0,2,4,6,8,10].forEach(i=>{s+=`<path d="${sector(76,130,i*30-30,i*30+30)}" fill="${IT[i][1]}" stroke="var(--bg)" stroke-width="2"/>`});
 [0,4,8].forEach(i=>{s+=`<path d="${sector(0.01,70,i*30-60,i*30+60)}" fill="${IT[i][1]}" stroke="var(--bg)" stroke-width="2"/>`});
 $('#itten').innerHTML=`<svg viewBox="0 0 400 400" role="img" aria-label="Cercle chromatique d'Itten">${s}</svg>`;
 const chip=i=>`<span><i style="background:${IT[i][1]}"></i>${IT[i][0]}</span>`;$('#cP').innerHTML=[4,0,8].map(chip).join('');$('#cS').innerHTML=[2,6,10].map(chip).join('');$('#cT').innerHTML=[3,1,11,9,7,5].map(chip).join('')}
const validHex=v=>/^#?[0-9a-f]{6}$/i.test(String(v).trim());
const fixH=v=>('#'+String(v).trim().replace('#','')).toUpperCase();
function cc(){const f=fixH($('#fgT').value),b=fixH($('#bgT').value);if(!validHex(f)||!validHex(b))return;const r=ratio(f,b);$('#ratio').textContent=r.toFixed(2).replace('.',',')+':1';const pv=$('#ccPrev');pv.style.background=b;pv.style.color=f;
  $('#badges').innerHTML=[["AA texte courant",4.5],["AA gros titre",3],["AAA texte courant",7],["AAA gros titre",4.5]].map(([n,v])=>`<span class="${r>=v?'ok':'ko'}">${r>=v?'✓':'✗'} ${n}</span>`).join('')}
const link=(c,t,fn)=>{$(c).addEventListener('input',()=>{$(t).value=$(c).value.toUpperCase();fn()});$(t).addEventListener('input',()=>{if(validHex($(t).value))$(c).value=fixH($(t).value).toLowerCase();fn()})};
link('#fgC','#fgT',cc);link('#bgC','#bgT',cc);
$('#swap').onclick=()=>{const a=$('#fgT').value;$('#fgT').value=$('#bgT').value;$('#bgT').value=a;$('#fgC').value=fixH($('#fgT').value).toLowerCase();$('#bgC').value=fixH($('#bgT').value).toLowerCase();cc()};cc();

/* ---------- symbolism ---------- */
function renderSym(){$('#sym').innerHTML=SYM.map(c=>`<article><div class="shades">${c[1].map((h,i)=>`<i style="background:${h};color:${best(h)}">${c[2][i]}</i>`).join('')}</div><div class="txt"><h3>${c[0]} ${favBtn('color',c[1][1],c[0]+' (symbolique)',{hex:c[1][1]},true)}</h3><p><b>+ </b>${c[3]}</p><p><b>− </b>${c[4]}</p><p><b>Ailleurs : </b>${c[5]}</p><p><b>Usage : </b>${c[6]}</p></div></article>`).join('')}
let symTab='couleurs';
$('#symTabs').addEventListener('click',e=>{const b=e.target.closest('[data-st]');if(!b)return;symTab=b.dataset.st;$$('#symTabs .btn').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.stp').forEach(p=>p.hidden=p.id!=='st-'+symTab)});
function renderSym2(){
  $('#formes').innerHTML=FORMES.map(f=>`<div class="forme"><svg viewBox="0 0 100 100" aria-hidden="true">${f[1]}</svg><h4>${f[0]} ${favBtn('term','Forme : '+f[0],'Forme : '+f[0],{},true)}</h4><p>${f[2]}</p><p class="small">${f[3]}</p></div>`).join('');
  $('#semio').innerHTML=SEMIO.map(s=>`<div class="rule" style="border-top-width:2px"><h4>${s[0]}</h4><p style="font-size:15px">${s[1]}</p><p class="small" style="margin:0"><b>Exemple : </b>${s[2]}</p></div>`).join('');
  $('#figs').innerHTML=FIGURES.map(f=>`<div class="fig2"><h4 style="display:flex;justify-content:space-between;gap:8px;align-items:center">${f[0]} ${favBtn('term','Figure : '+f[0],'Figure de style : '+f[0],{},true)}</h4><p>${f[1]}</p><p><b>En mots : </b>${f[2]}</p><p class="small"><b>En image : </b>${f[3]}</p></div>`).join('');
  $('#univ').innerHTML=UNIVERS.map(u=>`<tr><td data-l="Univers"><b>${u[0]}</b></td><td data-l="Mots">${u[1]}</td><td data-l="Typo">${u[2]}</td><td data-l="Couleurs">${u[3]}</td></tr>`).join('');
  $('#nums').innerHTML=NOMBRES.map(n=>`<div class="num"><div class="top2"><b class="n">${n[0]}</b>${favBtn('term','Nombre : '+n[0],'Nombre : '+n[0]+' ('+n[1]+')',{},true)}</div><h4>${n[1]}</h4><p>${n[2]}</p>${n[3]!=='—'?`<p class="small"><b>Ailleurs : </b>${n[3]}</p>`:''}${n[4]!=='—'?`<p class="small"><b>En design : </b>${n[4]}</p>`:''}</div>`).join('')}
onShow.symbolique=()=>{renderSym();renderSym2()};

/* ---------- composition ---------- */
const G=[
["Règle des tiers",`<rect width="100" height="141" fill="#ffc400"/><circle cx="66.7" cy="47" r="19" fill="#111"/><rect x="8" y="92" width="52" height="10" fill="#111"/><rect x="8" y="105" width="38" height="4" fill="#111"/><rect x="8" y="122" width="30" height="2.4" fill="#111" opacity=".55"/><rect x="8" y="127" width="24" height="2.4" fill="#111" opacity=".55"/><rect x="80" y="124" width="12" height="8" fill="#111"/>`,"M33.3 0V141M66.7 0V141M0 47H100M0 94H100",[[33.3,47],[66.7,47],[33.3,94],[66.7,94]],"M66.7 47L34 97L20 124L84 128","On découpe le format en 3 × 3. Les intersections attirent l'œil : on y place le sujet, pas au centre. Plus dynamique qu'une composition centrée.","Affiches de film, photographie, visuels pour les réseaux."],
["Grille modulaire suisse",`<rect width="100" height="141" fill="#f2f0eb"/><rect x="8" y="8" width="62.25" height="9" fill="#111"/><rect x="8" y="20" width="40" height="9" fill="#111"/><rect x="29.75" y="50.67" width="62.25" height="39.67" fill="#e4002b"/><circle cx="60.9" cy="70.5" r="14" fill="#f2f0eb"/><rect x="8" y="93.33" width="18.75" height="2" fill="#111"/><rect x="8" y="97.5" width="18.75" height="2" fill="#111"/><rect x="8" y="101.7" width="14" height="2" fill="#111"/><rect x="8" y="105.9" width="18.75" height="2" fill="#111"/><rect x="73.25" y="114.67" width="18.75" height="5" fill="#111"/><rect x="73.25" y="122" width="12" height="2" fill="#111"/>`,"M8 0V141M26.75 0V141M29.75 0V141M48.5 0V141M51.5 0V141M70.25 0V141M73.25 0V141M92 0V141M0 8H100M0 26.33H100M0 29.33H100M0 47.67H100M0 50.67H100M0 69H100M0 72H100M0 90.33H100M0 93.33H100M0 111.67H100M0 114.67H100M0 133H100",[],"M10 13H66L58 70L17 100L82 118","Colonnes et rangées identiques séparées par des gouttières. Chaque bloc s'aligne : l'ensemble paraît ordonné même avec beaucoup d'éléments.","Expositions, magazines, sites. À chercher : Josef Müller-Brockmann, « Musica Viva »."],
["Diagonale dynamique",`<rect width="100" height="141" fill="#f2f0eb"/><circle cx="72" cy="34" r="17" fill="#e4002b"/><g transform="rotate(-32 50 80)"><rect x="-12" y="72" width="124" height="13" fill="#111"/><rect x="10" y="89" width="70" height="4" fill="#111"/></g><polygon points="0,141 0,112 40,141" fill="#e4002b"/><rect x="58" y="124" width="34" height="2.4" fill="#111" opacity=".6"/><rect x="58" y="129" width="26" height="2.4" fill="#111" opacity=".6"/>`,"M0 109.7L100 47.3M0 141L100 0",[],"M10 103L86 56L74 38","Une oblique crée le mouvement et la tension : l'œil glisse le long de la diagonale. Montante = élan, descendante = chute.","Sport, musique, militantisme. À chercher : El Lissitzky, Rodtchenko."],
["Symétrie axiale",`<rect width="100" height="141" fill="#1f3fd1"/><rect x="22" y="12" width="56" height="9" fill="#fff"/><rect x="34" y="24" width="32" height="3" fill="#fff"/><circle cx="50" cy="64" r="24" fill="#ffc400"/><rect x="38" y="64" width="24" height="42" fill="#fff"/><rect x="30" y="106" width="40" height="4" fill="#fff"/><rect x="32" y="122" width="36" height="2.4" fill="#fff" opacity=".8"/><rect x="38" y="127" width="24" height="2.4" fill="#fff" opacity=".8"/>`,"M50 0V141M8 0V141M92 0V141M0 8H100M0 133H100",[],"M50 14V128","Tout s'organise autour d'un axe central. Stable, solennel, monumental, mais statique si rien ne vient le casser.","Luxe, institutions, cinéma épique. À chercher : Cassandre, « Normandie » (1935)."],
["La typo est l'image",`<rect width="100" height="141" fill="#fff"/><text x="6" y="38" font-family="Archivo" font-weight="900" font-size="30" textLength="88" lengthAdjust="spacingAndGlyphs" fill="#111">LA TYPO</text><text x="6" y="84" font-family="Archivo" font-weight="900" font-size="50" textLength="88" lengthAdjust="spacingAndGlyphs" fill="#111">EST</text><text x="6" y="114" font-family="Archivo" font-weight="900" font-size="27" textLength="88" lengthAdjust="spacingAndGlyphs" fill="#e4002b">L'IMAGE</text><rect x="6" y="125" width="30" height="2.4" fill="#111" opacity=".6"/><rect x="6" y="130" width="22" height="2.4" fill="#111" opacity=".6"/><rect x="80" y="124" width="14" height="8" fill="#111"/>`,"M0 38H100M0 84H100M0 114H100M6 0V141M94 0V141",[],"M8 28H90L8 70H90L8 106H90","Pas d'illustration : les lettres remplissent le format. Les tailles différentes créent le rythme et la hiérarchie.","Théâtre, festivals, édition. À chercher : Paula Scher (Public Theater), Wim Crouwel."],
["Figure et fond",`<rect width="100" height="141" fill="#fff"/><path d="M34 22L60 18L66 52L56 55L70 98L44 104L47 64L30 60Z" fill="#111"/><rect x="8" y="118" width="40" height="7" fill="#e4002b"/><rect x="8" y="128" width="26" height="2.4" fill="#111" opacity=".6"/><rect x="80" y="126" width="12" height="6" fill="#111"/>`,"M8 8H92V133H8ZM50 8V133",[],"M50 58L28 120","Une seule forme forte sur un grand vide. L'espace négatif fait partie du dessin : il isole la forme et la rend inoubliable.","Cinéma, campagnes de sensibilisation. À chercher : Saul Bass, Savignac."],
["Lecture en Z",`<rect width="100" height="141" fill="#fff"/><rect x="8" y="8" width="54" height="10" fill="#111"/><rect x="8" y="21" width="36" height="4" fill="#111"/><rect x="80" y="8" width="12" height="12" fill="#ff6a13"/><rect x="8" y="34" width="84" height="64" fill="#1f3fd1"/><circle cx="36" cy="66" r="18" fill="#ffc400"/><rect x="8" y="108" width="40" height="2.4" fill="#111" opacity=".6"/><rect x="8" y="113" width="34" height="2.4" fill="#111" opacity=".6"/><rect x="8" y="118" width="38" height="2.4" fill="#111" opacity=".6"/><rect x="60" y="112" width="32" height="18" fill="#e4002b"/>`,"M50 0V141M0 70.5H100",[],"M10 13H88L12 115H88","On lit de gauche à droite et de haut en bas : l'œil fait un Z. Titre en haut à gauche, action (billets, date) en bas à droite, là où la lecture se termine.","Événements, publicités, pages d'accueil."],
["Proportions dorées",`<rect width="100" height="141" fill="#111"/><circle cx="61.8" cy="53.9" r="20" fill="#ffc400"/><rect x="8" y="90" width="54" height="10" fill="#fff"/><rect x="8" y="103" width="36" height="4" fill="#fff"/><rect x="8" y="124" width="30" height="2.4" fill="#fff" opacity=".7"/><rect x="8" y="129" width="22" height="2.4" fill="#fff" opacity=".7"/>`,"M38.2 0V141M61.8 0V141M0 53.9H100M0 87.1H100",[[61.8,53.9],[38.2,53.9],[61.8,87.1],[38.2,87.1]],"M61.8 53.9L20 95L20 128","Des lignes placées à 0,382 et 0,618 du format (le nombre d'or). Proche de la règle des tiers, un peu plus resserré. Un guide, pas une loi magique.","Édition, mise en page classique. À chercher : le Modulor de Le Corbusier."],
["Bandes horizontales",`<rect width="100" height="141" fill="#fff"/><rect width="100" height="38" fill="#ff6a13"/><rect y="103" width="100" height="38" fill="#ff6a13"/><rect x="18" y="58" width="64" height="8" fill="#111"/><rect x="30" y="70" width="40" height="4" fill="#111"/><rect x="38" y="82" width="24" height="2.4" fill="#111" opacity=".6"/><ellipse cx="50" cy="122" rx="9" ry="6" fill="#fff"/>`,"M0 38H100M0 103H100M50 0V141",[],"M50 18V122","Trois bandes : couleur, information, couleur. Une structure fixe qui devient l'identité d'une collection, reconnaissable de loin.","Collections de livres, séries d'affiches. À chercher : couvertures Penguin (Edward Young, puis Jan Tschichold)."]];
const gabSvg=g=>`<svg viewBox="0 0 100 141" role="img" aria-label="Gabarit : ${g[0]}">${g[1]}<g class="ov-grid"><path class="h" d="${g[2]}"/><path class="m" d="${g[2]}"/>${g[3].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.8"/>`).join('')}</g><g class="ov-read"><path class="h" d="${g[4]}"/><path class="m" d="${g[4]}"/></g></svg>`;
function renderGab(){$('#gab').innerHTML=G.map((g,i)=>`<article>${gabSvg(g)}<div><h4 style="display:flex;justify-content:space-between;gap:8px;align-items:center">${g[0]} ${favBtn('gabarit',g[0],g[0],{i},true)}</h4><p>${g[5]}</p><p class="small">${g[6]}</p></div></article>`).join('')}
onShow.composition=renderGab;
const tg=(btn,cls)=>$(btn).onclick=()=>{const on=$(btn).getAttribute('aria-pressed')!=='true';$(btn).setAttribute('aria-pressed',on);$('#gab').classList.toggle(cls,on)};tg('#tgG','show-grid');tg('#tgR','show-read');

/* ---------- logos ---------- */
const LT=[
["Logotype","Le nom écrit dans une typo choisie ou dessinée. Simple et mémorisable si le nom est court.","Coca-Cola, Google, FedEx (une flèche cachée entre E et x)",`<text x="100" y="74" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="44" fill="currentColor">lumen</text>`],
["Monogramme","Les initiales entrelacées. Élégant, idéal quand le nom est long.","Chanel, Louis Vuitton, Yves Saint Laurent (dessiné par Cassandre)",`<text x="86" y="86" text-anchor="middle" font-family="Bodoni Moda,serif" font-size="72" fill="currentColor">A</text><text x="114" y="86" text-anchor="middle" font-family="Bodoni Moda,serif" font-size="72" fill="none" stroke="#e4002b" stroke-width="2">R</text>`],
["Pictogramme","Un objet reconnaissable, simplifié. Fonctionne sans le nom une fois la marque connue.","Apple, WWF (le panda), Lacoste",`<path d="M70 62L100 34L130 62V94H70Z" fill="currentColor"/><rect x="92" y="72" width="16" height="22" style="fill:var(--panel)"/>`],
["Abstrait","Une forme géométrique sans sens littéral. On y met l'émotion voulue, mais il faut du temps pour la faire connaître.","Nike (le Swoosh), Mastercard, Pepsi",`<rect x="98" y="32" width="36" height="56" fill="#ffc400"/><circle cx="90" cy="60" r="28" fill="#1f3fd1" fill-opacity=".92"/>`],
["Emblème","Le nom à l'intérieur d'un badge, d'un sceau, d'un écusson. Évoque la tradition et l'appartenance.","Starbucks, Harley-Davidson, Porsche",`<circle cx="100" cy="60" r="46" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="100" cy="60" r="37" fill="none" stroke="currentColor" stroke-width="1"/><path id="arcE" d="M70 62a30 30 0 0 1 60 0" fill="none"/><text font-family="Archivo" font-weight="800" font-size="8.5" letter-spacing="1" fill="currentColor"><textPath href="#arcE" startOffset="50%" text-anchor="middle">CAFÉ DU PORT</textPath></text><text x="100" y="72" text-anchor="middle" font-family="Bodoni Moda,serif" font-size="24" fill="#e4002b">CP</text><text x="100" y="86" text-anchor="middle" font-family="Archivo" font-weight="700" font-size="7" fill="currentColor">DEPUIS 1998</text>`],
["Combiné","Un symbole + le nom. Le plus courant : on peut ensuite utiliser le symbole seul.","Adidas, Carrefour (un C dans l'espace négatif), Spotify",`<circle cx="46" cy="60" r="20" fill="#1f3fd1"/><circle cx="64" cy="60" r="20" fill="#e4002b" fill-opacity=".85"/><text x="92" y="71" font-family="Archivo" font-weight="800" font-size="30" fill="currentColor">nuance</text>`],
["Mascotte","Un personnage qui incarne la marque. Chaleureux, idéal pour la famille et l'enfance.","Michelin (Bibendum, 1898), KFC, la Vache qui rit",`<path d="M76 38L82 22L92 36ZM124 38L118 22L108 36Z" fill="#ff6a13"/><ellipse cx="100" cy="66" rx="30" ry="36" fill="#ff6a13"/><circle cx="88" cy="56" r="11" fill="#fff"/><circle cx="112" cy="56" r="11" fill="#fff"/><circle cx="90" cy="57" r="5" fill="#111"/><circle cx="114" cy="57" r="5" fill="#111"/><path d="M95 67L100 76L105 67Z" fill="#ffc400"/>`],
["Dynamique","Un système plutôt qu'une forme fixe : le logo change selon le support, la saison, la taille d'écran.","Whitney Museum (Experimental Jetset), MIT Media Lab, Google Doodles",`<rect x="22" y="40" width="40" height="40" fill="#1f3fd1"/><rect x="80" y="40" width="40" height="40" rx="20" fill="#e4002b"/><rect x="138" y="40" width="40" height="40" fill="#ffc400" transform="rotate(14 158 60)"/><text x="42" y="69" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="26" fill="#fff">n</text><text x="100" y="69" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="26" fill="#fff">n</text><text x="158" y="69" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="26" fill="#111">n</text>`]];
const mark=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="#1f3fd1"/><circle cx="${x+r*.9}" cy="${y}" r="${r}" fill="#e4002b" fill-opacity=".85"/>`;
function renderLogos(){loadFont('Bodoni Moda');
  $('#lt').innerHTML=LT.map(l=>`<article><svg viewBox="0 0 200 120" role="img" aria-label="Exemple de ${l[0]}">${l[3]}</svg><div class="txt"><h4>${l[0]} ${favBtn('logo',l[0],'Logo : '+l[0],{},true)}</h4><p style="margin-bottom:6px">${l[1]}</p><p class="small" style="margin:0"><b>À chercher : </b>${l[2]}</p></div></article>`).join('');
  $('#consBox').innerHTML=`<svg viewBox="0 0 600 300" role="img" aria-label="Construction d'un logo"><g class="lg-c" stroke="#ff1fa9" fill="none" stroke-width="1"><path d="M0 150H600M190 40V260M235 40V260" stroke-dasharray="5 4"/><circle cx="190" cy="150" r="50"/><circle cx="235" cy="150" r="50"/><circle cx="212.5" cy="150" r="22.5"/><path d="M290 100H560M290 172H560" stroke-dasharray="5 4"/></g>${mark(190,150,50)}<text x="300" y="172" font-family="Archivo" font-weight="800" font-size="72" textLength="240" lengthAdjust="spacingAndGlyphs" fill="currentColor">nuance</text><g class="lg-z"><rect x="90" y="50" width="500" height="200" fill="none" stroke="#0094ff" stroke-width="2" stroke-dasharray="8 6"/><rect x="140" y="100" width="400" height="100" fill="none" stroke="#0094ff" stroke-width="1" opacity=".5"/><path d="M90 225H140" stroke="#0094ff" stroke-width="2"/><text x="115" y="243" text-anchor="middle" font-size="16" font-weight="800" fill="#0094ff">x</text><path d="M565 50V100" stroke="#0094ff" stroke-width="2"/><text x="574" y="80" font-size="16" font-weight="800" fill="#0094ff">x</text></g><g class="lg-m"><path d="M140 276H540" stroke="currentColor" stroke-width="1.5"/><path d="M140 270V282M540 270V282" stroke="currentColor" stroke-width="1.5"/><text x="340" y="268" text-anchor="middle" font-size="14" font-weight="700" fill="currentColor">mini : 24 px écran · 15 mm impression</text></g></svg>`;
  const D=[["Couleur","#ffffff",null],["Noir","#ffffff","#111"],["Négatif","#111111","#fff"],["Sur couleur","#1f3fd1","#fff"],["Symbole seul","#ffffff","sym"],["Vertical","#f2f0eb","vert"]];
  $('#decl').innerHTML=D.map(([n,bg,m])=>{let g;if(m==='sym')g=mark(84,60,26);else if(m==='vert')g=`${mark(88,44,20)}<text x="100" y="98" text-anchor="middle" font-family="Archivo" font-weight="800" font-size="24" fill="#111">nuance</text>`;else if(m)g=`<circle cx="40" cy="60" r="18" fill="${m}"/><circle cx="56" cy="60" r="18" fill="${m}" fill-opacity=".6"/><text x="82" y="70" font-family="Archivo" font-weight="800" font-size="28" fill="${m}">nuance</text>`;else g=`${mark(40,60,18)}<text x="82" y="70" font-family="Archivo" font-weight="800" font-size="28" fill="#111">nuance</text>`;return `<figure><svg viewBox="0 0 200 120" role="img" aria-label="Déclinaison ${n}"><rect width="200" height="120" fill="${bg}"/>${g}</svg><figcaption>${n}</figcaption></figure>`}).join('')}
onShow.logos=renderLogos;
$$('[data-lg]').forEach(b=>b.onclick=()=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);$('#consBox').classList.toggle('show-'+b.dataset.lg,on)});

/* ---------- typo ---------- */
const anatSvg=$('#anat svg');
async function drawAnat(){const f=$('#anatF').value;loadFont(f);try{await document.fonts.load(`400 120px "${f}"`)}catch(e){}
  const W=anatSvg.clientWidth,H=anatSvg.clientHeight;if(!W||!H)return;const ctx=document.createElement('canvas').getContext('2d'),txt='Hxdp';
  let fs=Math.min(H*.55,W*.3);ctx.font=`400 ${fs}px "${f}"`;let tw=ctx.measureText(txt).width;if(tw>W*.92){fs*=W*.92/tw;ctx.font=`400 ${fs}px "${f}"`;tw=ctx.measureText(txt).width}
  const m=t=>ctx.measureText(t),cap=m('H').actualBoundingBoxAscent,xh=m('x').actualBoundingBoxAscent,asc=m('d').actualBoundingBoxAscent,desc=m('p').actualBoundingBoxDescent;
  const top=Math.max(asc,cap),base=(H-(top+desc))/2+top,x0=(W-tw)/2;
  const L=(y,c,d)=>`<line x1="0" x2="${W}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c}" stroke-width="2"${d?' stroke-dasharray="6 5"':''}/>`;
  anatSvg.innerHTML=L(base-asc,'#1f3fd1')+L(base-cap,'#e4002b')+L(base-xh,'#ff6a13')+L(base,'currentColor')+L(base+desc,'#8a8a8a',1)+`<text x="${x0.toFixed(1)}" y="${base.toFixed(1)}" font-family="'${f}',serif" font-size="${fs.toFixed(1)}" fill="currentColor">${txt}</text><text x="${W-8}" y="${(H-10).toFixed(0)}" text-anchor="end" font-size="13" fill="currentColor" opacity=".7">hauteur d'x = ${Math.round(xh/cap*100)} % de la capitale</text>`}
const roA=new ResizeObserver(()=>drawAnat());roA.observe(anatSvg);$('#anatF').onchange=drawAnat;
$('#tf').innerHTML=FGROUPS.map(([g,l])=>`<optgroup label="${g}">${l.map(n=>`<option${n==='Fraunces'?' selected':''}>${n}</option>`).join('')}</optgroup>`).join('');
function weights(){const n=$('#tf').value,w=(FONTS[n]||'400').split(';'),cur=$('#tw').value;$('#tw').innerHTML=w.map(x=>`<option${x===cur||(!w.includes(cur)&&x==='700')?' selected':''}>${x}</option>`).join('')}
function tester(){const n=$('#tf').value,w=$('#tw').value;loadFont(n);
  Object.assign($('#tp').style,{fontFamily:`'${n}', serif`,fontSize:$('#tz').value+'px',fontWeight:w,lineHeight:$('#tl').value,letterSpacing:$('#tt').value+'em',textTransform:$('#tc').value});
  $('#tp').textContent=$('#tx').value||'Tapez votre texte…';$('#oz').textContent=$('#tz').value;$('#ol').textContent=(+$('#tl').value).toFixed(2);$('#ot').textContent=(+$('#tt').value).toFixed(2);
  $('#tGF').href='https://fonts.google.com/specimen/'+n.replace(/ /g,'+');
  $('#tcss').textContent=`@import url('${fontURL(n)}');\n\n.titre {\n  font-family: '${n}', serif;\n  font-size: ${$('#tz').value}px;\n  font-weight: ${w};\n  line-height: ${(+$('#tl').value).toFixed(2)};\n  letter-spacing: ${(+$('#tt').value).toFixed(2)}em;${$('#tc').value!=='none'?`\n  text-transform: ${$('#tc').value};`:''}\n}`;
  $('#tFav').innerHTML=favBtn('font',n+'|'+w,n+' '+w,{font:n,weight:w},false)}
$('#tf').onchange=()=>{weights();tester()};['#tz','#tw','#tl','#tt','#tc','#tx'].forEach(id=>$(id).addEventListener('input',tester));
$('#tCopy').onclick=()=>copy($('#tcss').textContent,'CSS copié');
function scale(){const b=Math.max(10,Math.min(24,+$('#sb').value||16)),r=+$('#sr').value;const st=[["Affiche",6],["H1",5],["H2",4],["H3",3],["H4",2],["Chapô",1],["Texte",0],["Légende",-1]];
  $('#so').innerHTML=st.map(([n,k])=>{const px=b*r**k;return `<div><em>${n}</em><em>${px.toFixed(1).replace('.',',')} px</em><span style="font-size:${Math.min(px,96).toFixed(1)}px">${k>0?'Titre fort':'Texte courant lisible'}</span></div>`}).join('');
  $('#so').dataset.css=':root {\n'+st.map(([n,k])=>`  --fs-${norm(n).replace(/[^a-z0-9]/g,'')}: ${(r**k).toFixed(3)}rem; /* ${(b*r**k).toFixed(1)}px */`).join('\n')+'\n}'}
['#sb','#sr'].forEach(id=>$(id).addEventListener('input',scale));$('#sCopy').onclick=()=>copy($('#so').dataset.css,'Variables CSS copiées');
let typoInit=false;
onShow.typo=()=>{if(!typoInit){typoInit=true;CLS.forEach(c=>loadFont(c[1]));PAIRS.forEach(p=>{loadFont(p[0]);loadFont(p[2])});weights();scale()}
  $('#cls').innerHTML=CLS.map(c=>`<article><h4 style="display:flex;justify-content:space-between;gap:6px;align-items:center">${c[0]} ${favBtn('font',c[1]+'|'+c[2],c[1]+' '+c[2],{font:c[1],weight:String(c[2])},true)}</h4><div class="spec" style="font-family:'${c[1]}',serif;font-weight:${c[2]}">Aa Rg</div><p>${c[3]}</p><p class="small"><b>Usage : </b>${c[4]}</p><p class="small" style="margin:0">Exemple : <a href="https://fonts.google.com/specimen/${c[1].replace(/ /g,'+')}" target="_blank" rel="noopener">${c[1]}</a></p></article>`).join('');
  $('#pairs').innerHTML=PAIRS.map(pairCard).join('');tester();drawAnat()};
const pairCard=p=>`<article><div class="t1" style="font-family:'${p[0]}',serif;font-weight:${p[1]}">${p[4]}</div><div class="t2" style="font-family:'${p[2]}',sans-serif;font-weight:${p[3]}">Le texte courant reste calme et lisible : c'est le titre qui porte le caractère. ${p[5]}</div><small><span>${p[0]} + ${p[2]}</span>${favBtn('pair',p[0]+'+'+p[2],p[0]+' + '+p[2],{p},true)}</small></article>`;

/* ---------- lexique ---------- */
let lf='all';const LCATS=[...new Set(LEX.map(t=>t[1]))];
$('#lexN').textContent=LEX.length;
$('#lf').innerHTML=[['all','Tout'],...LCATS.map(c=>[c,c]),['fav','★ À réviser']].map(([k,n])=>`<button class="btn sm" data-lf="${esc(k)}" aria-pressed="${k==='all'}">${n}</button>`).join('');
$('#lf').addEventListener('click',e=>{const b=e.target.closest('[data-lf]');if(!b)return;lf=b.dataset.lf;$$('#lf .btn').forEach(x=>x.setAttribute('aria-pressed',x===b));renderLex()});
$('#lq').addEventListener('input',()=>renderLex());
const lexList=()=>{const q=norm($('#lq').value.trim());return LEX.filter(t=>(lf==='all'||t[1]===lf||(lf==='fav'&&favs.has(fid('term',t[0]))))&&(!q||norm(t[0]+' '+t[2]).includes(q)))};
function renderLex(){const l=lexList().sort((a,b)=>a[0].localeCompare(b[0],'fr'));let last='',h='';
  for(const t of l){const L=norm(t[0])[0].toUpperCase();if(L!==last){last=L;h+=`<div class="letter">${L}</div>`}h+=`<div class="term"><dt>${t[0]}<span>${t[1]}</span></dt><dd>${t[2]}</dd>${favBtn('term',t[0],t[0],{},true)}</div>`}
  $('#lex').innerHTML=h||`<p class="empty" style="grid-column:1/-1">${lf==='fav'?'Aucun mot à réviser : cliquez ☆ à côté d’un mot.':'Aucun résultat.'}</p>`}
onShow.lexique=renderLex;
let qz={score:0,total:0};
function quiz(){let pool=lexList();if(pool.length<4)pool=LEX;const t=pool[Math.floor(Math.random()*pool.length)];
  let same=LEX.filter(x=>x[1]===t[1]&&x[0]!==t[0]);if(same.length<3)same=LEX.filter(x=>x[0]!==t[0]);
  const opts=[t];while(opts.length<4){const o=same[Math.floor(Math.random()*same.length)];if(!opts.includes(o))opts.push(o)}opts.sort(()=>Math.random()-.5);
  const Q=$('#quiz');Q.hidden=false;Q.innerHTML=`<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><span class="eyebrow">Quel mot correspond à cette définition ? · ${t[1]}</span><span class="eyebrow">Score : ${qz.score} / ${qz.total}</span></div><p class="q">${t[2]}</p><div class="opts">${opts.map(o=>`<button data-ans="${esc(o[0])}">${o[0]}</button>`).join('')}</div><div class="acts" style="margin-top:12px"><button class="btn sm" id="qNext" hidden>Question suivante →</button><button class="btn sm" id="qStop">Arrêter</button></div>`;
  Q.querySelector('.opts').onclick=e=>{const b=e.target.closest('[data-ans]');if(!b||Q.dataset.done==='1')return;Q.dataset.done='1';qz.total++;const ok=b.dataset.ans===t[0];if(ok)qz.score++;b.classList.add(ok?'good':'bad');if(!ok)Q.querySelector(`[data-ans="${CSS.escape(t[0])}"]`).classList.add('good');$('#qNext').hidden=false;Q.querySelector('.eyebrow:last-child').textContent='Score : '+qz.score+' / '+qz.total};
  Q.dataset.done='0';$('#qNext').onclick=quiz;$('#qStop').onclick=()=>{Q.hidden=true}}
$('#quizBtn').onclick=()=>{quiz();$('#quiz').scrollIntoView({block:'nearest'})};

/* ---------- outils ---------- */
function parseColor(v){v=String(v).trim();let m;
  if(m=v.match(/^#?([0-9a-f]{3})$/i))return hex2rgb('#'+m[1].split('').map(c=>c+c).join(''));
  if(m=v.match(/^#?([0-9a-f]{6})$/i))return hex2rgb('#'+m[1]);
  if(m=v.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i))return [+m[1],+m[2],+m[3]].map(x=>Math.min(255,x));
  if(m=v.match(/hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?/i))return hex2rgb(hsl2hex(+m[1]%360,Math.min(100,+m[2]),Math.min(100,+m[3])));
  return null}
function conv(){const rgb=parseColor($('#cvT').value);if(!rgb)return;const hex=rgb2hex(...rgb),[h,s,l]=rgb2hsl(...rgb);$('#cvC').value=hex.toLowerCase();
  const [r,g,b]=rgb.map(x=>x/255),k=1-Math.max(r,g,b),cm=k>=1?[0,0,0]:[(1-r-k)/(1-k),(1-g-k)/(1-k),(1-b-k)/(1-k)];
  const rows=[['HEX',hex],['RGB',`rgb(${rgb.join(', ')})`],['HSL',`hsl(${h} ${s}% ${l}%)`],['CMJN',`C${Math.round(cm[0]*100)} M${Math.round(cm[1]*100)} J${Math.round(cm[2]*100)} N${Math.round(k*100)}`],['Contraste',`${ratio(hex,'#FFFFFF').toFixed(2).replace('.',',')}:1 sur blanc · ${ratio(hex,'#000000').toFixed(2).replace('.',',')}:1 sur noir`]];
  $('#cvOut').innerHTML=rows.map(([k,v])=>`<div class="kv"><b>${k}</b><span>${v}</span>${k==='Contraste'?'':`<button class="btn sm" data-copy="${esc(v)}" data-copy-label="${esc(k)} copié">Copier</button>`}</div>`).join('')+`<p class="small" style="margin:6px 0 0">Le CMJN est une conversion approximative : l'imprimeur utilise un profil ICC.</p>`;
  $('#cvSteps').innerHTML=[95,85,75,65,l,40,30,20,10].map(L=>{const x=hsl2hex(h,s,L);return `<button style="background:${x}" data-copy="${x}" data-copy-label="${x} copié" title="${x}" aria-label="${x}"></button>`}).join('');
  $('#cvFav').innerHTML=favBtn('color',hex,hex,{hex},false)}
$('#cvT').addEventListener('input',conv);$('#cvC').addEventListener('input',()=>{$('#cvT').value=$('#cvC').value.toUpperCase();conv()});
/* image palette (k-means) */
let imgPal=[];
function extract(img){const cv=$('#imgCv'),sc=Math.min(1,120/Math.max(img.width,img.height));cv.width=Math.max(1,Math.round(img.width*sc));cv.height=Math.max(1,Math.round(img.height*sc));const x=cv.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,cv.width,cv.height);
  const d=x.getImageData(0,0,cv.width,cv.height).data,px=[];for(let i=0;i<d.length;i+=4)if(d[i+3]>128)px.push([d[i],d[i+1],d[i+2]]);if(!px.length)return;
  const K=6;let cen=[];for(let i=0;i<K;i++)cen.push(px[Math.floor((i+.5)*px.length/K)].slice());let asg=new Array(px.length).fill(0);
  for(let it=0;it<10;it++){const sum=cen.map(()=>[0,0,0,0]);px.forEach((p,i)=>{let bi=0,bd=1e9;cen.forEach((c,j)=>{const dd=(p[0]-c[0])**2+(p[1]-c[1])**2+(p[2]-c[2])**2;if(dd<bd){bd=dd;bi=j}});asg[i]=bi;const s=sum[bi];s[0]+=p[0];s[1]+=p[1];s[2]+=p[2];s[3]++});cen=cen.map((c,j)=>sum[j][3]?[sum[j][0]/sum[j][3],sum[j][1]/sum[j][3],sum[j][2]/sum[j][3]]:c)}
  const cnt=cen.map((_,j)=>asg.filter(a=>a===j).length);imgPal=cen.map((c,j)=>({hex:rgb2hex(...c),p:cnt[j]/px.length})).filter(c=>c.p>.01).sort((a,b)=>b.p-a.p);
  const uniq=[];imgPal.forEach(c=>{if(!uniq.some(u=>u.hex===c.hex))uniq.push(c)});imgPal=uniq;
  $('#imgSw').innerHTML=imgPal.map(c=>`<button class="sw" data-copy="${c.hex}" data-copy-label="${c.hex} copié"><i style="background:${c.hex}"></i><span><b>${c.hex}</b>${Math.round(c.p*100)} % de l'image</span></button>`).join('');$('#imgSave').hidden=false}
function loadImg(file){if(!file||!/^image\//.test(file.type)){toast('Choisissez un fichier image');return}const url=URL.createObjectURL(file),img=new Image();img.onload=()=>{$('#dropTxt').innerHTML=`<img src="${url}" alt="Image analysée"><span class="small">Cliquez pour changer d'image</span>`;extract(img)};img.src=url}
$('#imgIn').addEventListener('change',e=>loadImg(e.target.files[0]));
const dp=$('#drop');['dragenter','dragover'].forEach(t=>dp.addEventListener(t,e=>{e.preventDefault();dp.classList.add('over')}));['dragleave','drop'].forEach(t=>dp.addEventListener(t,e=>{e.preventDefault();dp.classList.remove('over')}));dp.addEventListener('drop',e=>loadImg(e.dataTransfer.files[0]));
$('#imgPalSave').onclick=()=>{if(!imgPal.length)return;const cols=imgPal.map(c=>c.hex);addFav('palette',cols.join('-'),$('#imgName').value.trim()||'Palette extraite d’une image',{colors:cols,name:$('#imgName').value.trim()});$('#imgName').value=''};
/* print */
const PF=[["A6",105,148],["A5",148,210],["A4",210,297],["A3",297,420],["A2",420,594],["A1",594,841],["A0",841,1189],["Carte de visite",85,55],["Affiche 40 × 60",400,600],["Abribus 120 × 176",1200,1760],["Carré 30 × 30",300,300],["Personnalisé",0,0]];
$('#pf').innerHTML=PF.map((f,i)=>`<option value="${i}"${i===3?' selected':''}>${f[0]}</option>`).join('');
function printCalc(){const f=PF[+$('#pf').value],cus=f[0]==='Personnalisé';$('#pCustom').hidden=!cus;let w=cus?+$('#pw').value:f[1],h=cus?+$('#ph').value:f[2];const bl=+$('#pb').value,dpi=+$('#pd').value;
  const W=w+2*bl,H=h+2*bl,px=mm=>Math.round(mm/25.4*dpi);$('#pOut').textContent=`${px(W).toLocaleString('fr-FR')} × ${px(H).toLocaleString('fr-FR')} px`;
  $('#pOut2').textContent=`${w} × ${h} mm${bl?` + ${bl} mm de fond perdu = ${W} × ${H} mm`:''} à ${dpi} dpi · ${(px(W)*px(H)/1e6).toFixed(1).replace('.',',')} mégapixels`;
  const rw=+$('#rw').value,rh=+$('#rh').value,rd=+$('#rd').value||300;$('#rOut').textContent=rw&&rh?`Taille d'impression maximale : ${(rw/rd*2.54).toFixed(1).replace('.',',')} × ${(rh/rd*2.54).toFixed(1).replace('.',',')} cm à ${rd} dpi`:''}
['#pf','#pd','#pb','#pw','#ph','#rw','#rh','#rd'].forEach(id=>$(id).addEventListener('input',printCalc));
/* units */
function units(){const v=+$('#uv').value,u=$('#uu').value,base=+$('#ub').value||16;const inch={px:v/96,rem:v*base/96,pt:v/72,mm:v/25.4,cm:v/2.54,in:v}[u];
  const out=[['px',inch*96],['rem',inch*96/base],['pt',inch*72],['mm',inch*25.4],['cm',inch*2.54],['in',inch]].filter(r=>r[0]!==u);
  $('#uOut').innerHTML=out.map(([k,x])=>{const s=(Math.round(x*1000)/1000).toString();return `<div class="kv"><b>${k}</b><span>${s.replace('.',',')} ${k}</span><button class="btn sm" data-copy="${s}${k}" data-copy-label="${s}${k} copié">Copier</button></div>`}).join('')}
['#uv','#uu','#ub'].forEach(id=>$(id).addEventListener('input',units));
/* ratio */
const gcd=(a,b)=>b?gcd(b,a%b):a;
const AP=[["16:9",1920,1080],["4:5 (post)",1080,1350],["1:1",1080,1080],["9:16 (story)",1080,1920],["A4 / A3",210,297],["3:2 (photo)",3000,2000]];
$('#aPre').innerHTML=AP.map((p,i)=>`<button class="btn sm" data-ap="${i}">${p[0]}</button>`).join('');
$('#aPre').addEventListener('click',e=>{const b=e.target.closest('[data-ap]');if(!b)return;const p=AP[+b.dataset.ap];$('#aw').value=p[1];$('#ah').value=p[2];ratioCalc()});
function ratioCalc(){const w=Math.round(+$('#aw').value),h=Math.round(+$('#ah').value);if(!w||!h)return;const g=gcd(w,h);$('#aOut').textContent=`${w/g}:${h/g} · ${(w/h).toFixed(3).replace('.',',')}`;const nw=+$('#anw').value;$('#anh').textContent=nw?Math.round(nw*h/w)+' px':''}
['#aw','#ah','#anw'].forEach(id=>$(id).addEventListener('input',ratioCalc));
/* gradient */
let gt='linear';
function grad(){const cols=[$('#g1').value,$('#g2').value];if($('#g3on').checked)cols.splice(1,0,$('#g3').value);const a=$('#ga').value;$('#oga').textContent=a+'°';
  const c=cols.join(', ');const css=gt==='linear'?`linear-gradient(${a}deg, ${c})`:gt==='radial'?`radial-gradient(circle at center, ${c})`:`conic-gradient(from ${a}deg, ${c}${gt==='conic'?', '+cols[0]:''})`;
  $('#gPrev').style.background=css;$('#gCss').textContent='background: '+css+';'}
['#g1','#g2','#g3','#g3on','#ga'].forEach(id=>$(id).addEventListener('input',grad));
$$('[data-gt]').forEach(b=>b.onclick=()=>{gt=b.dataset.gt;$$('[data-gt]').forEach(x=>x.setAttribute('aria-pressed',x===b));grad()});
$('#gCopy').onclick=()=>copy($('#gCss').textContent,'CSS copié');
$('#gSave').onclick=()=>{const cols=[$('#g1').value,$('#g2').value];if($('#g3on').checked)cols.splice(1,0,$('#g3').value);const up=cols.map(x=>x.toUpperCase());addFav('palette',up.join('-'),'Dégradé '+up.join(' → '),{colors:up,name:'Dégradé',css:$('#gCss').textContent})};
function sampleImg(){const cv=document.createElement('canvas');cv.width=300;cv.height=200;const x=cv.getContext('2d');x.fillStyle='#1f3fd1';x.fillRect(0,0,300,200);x.fillStyle='#ffc400';x.beginPath();x.arc(200,90,62,0,7);x.fill();x.fillStyle='#e4002b';x.fillRect(0,120,170,80);x.fillStyle='#f2f0eb';x.fillRect(24,24,110,22);x.fillStyle='#111';x.fillRect(24,56,70,12);
  const url=cv.toDataURL(),img=new Image();img.onload=()=>{$('#dropTxt').innerHTML=`<img src="${url}" alt="Image d'exemple"><span class="small">Exemple. Cliquez ou déposez votre propre image.</span>`;extract(img);$('#imgName').value='Palette exemple'};img.src=url}
let toolsInit=false;onShow.outils=()=>{if(toolsInit)return;toolsInit=true;conv();printCalc();units();ratioCalc();grad();sampleImg()};

/* ---------- références (guide Boîte à outils du designer web) ---------- */
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
$('#refnav').innerHTML=RES.map((g,i)=>`<a class="btn sm" href="#references" data-ref="${i}">${g[0]} <span class="small" style="color:inherit;opacity:.7">${g[2].length}</span></a>`).join('');
$('#refnav').addEventListener('click',e=>{const b=e.target.closest('[data-ref]');if(!b)return;e.preventDefault();document.getElementById('rg'+b.dataset.ref).scrollIntoView({behavior:'smooth'})});
const refCard=r=>`<article class="ref"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><a class="n" href="${r[1]}" target="_blank" rel="noopener">${r[0]} ↗</a>${r[4]?`<span class="lang ${r[4]==='FR'?'fr':''}" title="${r[4]==='FR'?'Contenu en français':'En anglais, facile à utiliser'}">${r[4]}</span>`:''}</div><span class="small" style="margin-top:-4px;overflow-wrap:anywhere">${r[1].replace(/^https?:\/\/(www\.)?/,'').replace(/\/$/,'')}</span><p class="lab">À quoi ça sert</p><p style="margin:0;font-size:15px">${r[2]}</p>${r[3]?`<p class="lab">En quoi ça vous aide</p><p class="tip" style="margin:0">${r[3]}</p>`:''}<div class="acts">${favBtn('resource',r[1],r[0],{name:r[0],url:r[1],desc:r[2]},false)}</div></article>`;
const COLTIP=`<div class="coltip"><div><h4>Récupérer une couleur en code</h4><p style="margin:0;font-size:15px">Sur Coolors, Color Hunt ou UI Colors, un clic sur une couleur copie son code hex (par exemple #010d94). Collez-le dans une variable CSS : vous changez la couleur à un seul endroit et tout le site suit.</p><div class="chips" style="margin-top:10px"><span><i style="background:#010d94"></i>#010d94</span><span><i style="background:#f7f7fa;box-shadow:0 0 0 1px #ccc inset"></i>#f7f7fa</span><span><i style="background:#0b0d22"></i>#0b0d22</span></div></div><pre><code>:root {\n  --couleur-principale: #010d94;\n  --couleur-fond: #f7f7fa;\n  --couleur-texte: #0b0d22;\n}\n.bouton {\n  background: var(--couleur-principale);\n  color: var(--couleur-fond);\n}</code></pre></div>`;
onShow.references=()=>{const pdf=RES.slice(0,9),n=pdf.reduce((t,g)=>t+g[2].length,0),fr=pdf.reduce((t,g)=>t+g[2].filter(r=>r[4]==='FR').length,0);
  $('#refStats').innerHTML=`<div><b>${n}</b>sites</div><div><b>9</b>catégories</div><div><b>${fr}</b>en français</div><div><b>${RES.reduce((t,g)=>t+g[2].length,0)-n}</b>compléments Atelier</div>`;
  $('#refs').innerHTML=RES.map((g,i)=>`${i===9?'<h2 class="sec" style="font-size:32px">Pour aller plus loin</h2>':''}<div class="sec rule" id="rg${i}" style="${i?'':'margin-top:0'}"><h3>${i<9?`<span class="eyebrow" style="margin-right:10px">0${i+1} / 9</span>`:''}${g[0]}</h3><p class="lead" style="margin:6px 0 16px">${g[1]}</p><div class="refs">${g[2].map(refCard).join('')}</div>${g[0]==='Couleurs'?COLTIP:''}</div>`).join('')};

/* ---------- méthode ---------- */
$('#mTabs').addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(!b)return;$$('#mTabs .btn').forEach(x=>x.setAttribute('aria-pressed',x===b));$$('.mtp').forEach(p=>p.hidden=p.id!=='mt-'+b.dataset.mt)});
const CK='atelier-check';
function renderChecks(){const st=store.get(CK,{});let n=0,t=0;
  $('#checks').innerHTML=CHECK.map((g,gi)=>`<fieldset><legend>${g[0]}</legend>${g[1].map((it,ii)=>{const k=gi+'-'+ii,on=!!st[k];t++;if(on)n++;return `<label><input type="checkbox" data-ck="${k}"${on?' checked':''}><span>${esc(it)}</span></label>`}).join('')}</fieldset>`).join('');
  $('#ckScore').textContent=n+' / '+t}
$('#checks').addEventListener('change',e=>{const k=e.target.dataset.ck;if(!k)return;const st=store.get(CK,{});if(e.target.checked)st[k]=1;else delete st[k];store.set(CK,st);const n=Object.keys(st).length;$('#ckScore').textContent=n+' / '+CHECK.reduce((t,g)=>t+g[1].length,0)});
$('#ckReset').onclick=()=>{store.del(CK);renderChecks()};
$('#briefCopy').onclick=()=>copy(BRIEF.map((q,i)=>(i+1)+'. '+q).join('\n'),'Questions copiées');
const row3=r=>`<tr><td data-l="${r===0?'':''}"><b>${r[0]}</b></td><td class="n">${r[1]}</td><td>${r[2]}</td></tr>`;
let methInit=false;
onShow.methode=()=>{
  $('#gestalt').innerHTML=GESTALT.map(g=>`<div class="forme"><svg viewBox="0 0 100 56" style="width:120px;height:68px;fill:none;stroke:none;color:var(--ink)" aria-hidden="true">${g[3]}</svg><h4>${g[0]} ${favBtn('term','Gestalt : '+g[0],'Gestalt : '+g[0],{},true)}</h4><p>${g[1]}</p><p class="small">${g[2]}</p></div>`).join('');
  $('#heur').innerHTML=HEUR.map((x,i)=>`<div class="num"><div class="top2"><b class="n">${i+1}</b>${favBtn('term','Heuristique : '+x[0],'Heuristique : '+x[0],{},true)}</div><h4>${x[0]}</h4><p>${x[1]}</p><p class="small"><b>Exemple : </b>${x[2]}</p></div>`).join('');
  $('#lois').innerHTML=LOIS.map(x=>`<div class="fig2"><h4 style="display:flex;justify-content:space-between;gap:8px;align-items:center">${x[0]} ${favBtn('term','Loi UX : '+x[0],'Loi UX : '+x[0],{},true)}</h4><p>${x[1]}</p><p class="small"><b>En pratique : </b>${x[2]}</p></div>`).join('');
  $('#uirep').innerHTML=UIREP.map(x=>`<div><span>${x[0]}</span><b>${x[1]}</b><p>${x[2]}</p></div>`).join('');
  const EST=[["var(--ink)","var(--bg)",""],["var(--red)","#fff",""],["var(--ink)","var(--bg)","outline:3px solid var(--blue);outline-offset:3px"],["#000","#fff","transform:scale(.96)"],["var(--panel)","var(--mute)","border-color:var(--line)"],["var(--ink)","var(--bg)","opacity:.8"],["var(--bg)","var(--red)","border-color:var(--red)"],["#0a6b2f","#fff",""],["var(--bg)","var(--mute)","border:2px dashed var(--line)"]];
  const LBL=["Envoyer","Envoyer","Envoyer","Envoyer","Envoyer","Envoi…","Réessayer","✓ Envoyé","Aucun projet"];
  $('#etats').innerHTML=ETATS.map((x,i)=>`<div class="etat"><span class="demo-btn" style="background:${EST[i][0]};color:${EST[i][1]};${EST[i][2]}">${LBL[i]}</span><div><b>${x[0]}</b><p class="small" style="margin:2px 0 0">${x[1]}</p></div></div>`).join('');
  const tr=(r,l)=>`<tr><td data-l="${l[0]}"><b>${r[0]}</b></td><td data-l="${l[1]}" class="n">${r[1]}</td><td data-l="${l[2]}">${r[2]}</td></tr>`;
  $('#fSoc').innerHTML=FMT_SOCIAL.map(r=>tr(r,['Support','Taille','À savoir'])).join('');
  $('#fWeb').innerHTML=FMT_WEB.map(r=>tr(r,['Élément','Taille','À savoir'])).join('');
  $('#fFiles').innerHTML=FMT_FILES.map(r=>tr(r,['Format','Pour','À savoir'])).join('');
  renderChecks();
  $('#etapes').innerHTML=ETAPES.map(x=>`<li><h4>${x[0]}</h4><p>${x[1]}</p><p class="small"><b>Livrable : </b>${x[2]}</p></li>`).join('');
  $('#brief').innerHTML=BRIEF.map(q=>`<li>${q}</li>`).join('');
  $('#etapesWeb').innerHTML=ETAPES_WEB.map(q=>`<li>${q}</li>`).join('');
  $('#metier').innerHTML=METIER.map(x=>`<div class="fig2"><h4>${x[0]}</h4><p>${x[1]}</p></div>`).join('')};

/* ---------- code ---------- */
const bip=c=>`<svg viewBox="0 0 96 96" aria-hidden="true"><line x1="48" y1="6" x2="48" y2="20" stroke="#111" stroke-width="4"/><circle cx="48" cy="6" r="5" fill="#e4002b"/><rect x="18" y="20" width="60" height="46" rx="12" fill="#fff" stroke="#111" stroke-width="4"/><circle cx="36" cy="42" r="7" fill="#111"/><circle cx="60" cy="42" r="7" fill="#111"/><rect x="36" y="54" width="24" height="5" rx="2.5" fill="${c}"/><rect x="28" y="70" width="40" height="20" rx="6" fill="#111"/></svg>`;
let codeInit=false;
onShow.code=()=>{
  $('#games').innerHTML=GAMES.map(g=>`<article class="game"><div class="scr" style="--g:${g[6]};color:${g[6]==='#ffc400'?'#111':'#fff'}">${bip(g[6]==='#ffc400'?'#1f3fd1':'#ffc400')}<div><b>${g[0]}</b><br><span>${g[3]}</span></div></div><div class="in"><p style="font-size:17px;margin:0">${g[4]}</p><p class="small" style="margin:0">${g[5]}</p><div class="acts"><a class="btn solid" href="${g[1]}" target="_blank" rel="noopener">Jouer ↗</a><a class="btn sm" href="${g[2]}" target="_blank" rel="noopener">Code source ↗</a>${favBtn('resource',g[1],g[0],{name:g[0],url:g[1],desc:g[4]},true)}</div></div></article>`).join('');
  $('#snips').innerHTML=SNIPS.map(s=>`<div class="snip"><h4>${esc(s[0])} <span class="lang">${s[1]}</span></h4><pre><code>${esc(s[2])}</code></pre><button class="btn sm" data-copy="${esc(s[2])}" data-copy-label="Code copié">Copier</button></div>`).join('');
  $('#learn').innerHTML=[...RES[0][2],...RES[1][2]].map(refCard).join('')};

/* ---------- mon espace ---------- */
const KINDS=[['artist','Artistes'],['palette','Palettes'],['color','Couleurs'],['font','Polices'],['pair','Associations de polices'],['term','Vocabulaire et symboles'],['gabarit','Gabarits d’affiche'],['logo','Familles de logos'],['resource','Références']];
function renderEspace(){const rows=[...favs.values()];rows.forEach(r=>REG.set(fid(r.kind,r.key),r));
  let h=user?`<div class="hero-acct"><div><span class="eyebrow" style="color:#bbb">Mon espace</span><h1 style="margin-top:6px">Bonjour ${esc(pseudo())}</h1><p style="margin:8px 0 0;color:#ccc">${esc(user.email)} · ${rows.length} favori${rows.length>1?'s':''} · le même compte que Mission Bip et Bip Agence.</p></div><div class="seg"><button class="btn" id="logout">Se déconnecter</button></div></div>`
  :`<div class="hero-acct"><div><h1>Mon espace</h1><p style="margin:8px 0 0;color:#ccc">Créez un compte gratuit pour garder vos artistes, palettes, polices et mots préférés, et les retrouver sur tous vos appareils, même après la formation.${rows.length?(rows.length>1?` Les ${rows.length} favoris de cet appareil seront ajoutés à votre compte.`:' Le favori de cet appareil sera ajouté à votre compte.'):''}</p></div><div class="seg"><button class="btn" data-open-auth="up">Créer un compte</button><button class="btn" data-open-auth="in">Se connecter</button></div></div>`;
  if(!rows.length)h+=`<div class="empty" style="margin-top:24px"><b>Rien ici pour l'instant.</b> Cliquez ☆ sur un artiste, une couleur, une police, un mot du lexique ou une référence ; enregistrez une palette depuis l'onglet Couleurs ou Outils.</div>`;
  for(const [k,n] of KINDS){const l=rows.filter(r=>r.kind===k);if(!l.length)continue;h+=`<div class="sec rule"><h3>${n} <span class="count">${l.length}</span></h3>${espaceGroup(k,l)}</div>`}
  if(rows.some(r=>r.kind==='palette'))h+=`<p style="margin-top:16px"><button class="btn" id="allPal">Copier toutes mes palettes en CSS</button></p>`;
  if(user)h+=`<div class="sec rule"><h3>Mes jeux de code</h3><div class="games" id="myGames"><p class="small"><span class="spin"></span>Chargement de ta progression…</p></div></div>`;
  $('#espace').innerHTML=h;if(user)loadGames();
  const lo=$('#logout');if(lo)lo.onclick=async()=>{await auth.signOut();toast('Déconnecté')};
  const ap=$('#allPal');if(ap)ap.onclick=()=>copy(rows.filter(r=>r.kind==='palette').map(r=>`/* ${r.label} */\n`+cssVars(r.data.colors||[])).join('\n\n'),'Palettes copiées')}
async function loadGames(){const box=$('#myGames');if(!box)return;
  const G2=[["mission-bip","Mission Bip",22,"https://diurndesign.github.io/javascript_game/","#ffc400"],["bip-agence","Bip Agence",52,"https://diurndesign.github.io/javascript_avance/","#1f3fd1"]];
  const out=await Promise.all(G2.map(async g=>{let d=null;try{const s=await db.collection('eleves').doc(user.uid).collection('jeux').doc(g[0]).get();if(s.exists)d=JSON.parse(s.data().data||'{}')}catch(e){}
    const p=(d&&d.progress)||{},done=Object.keys(p).length,stars=Object.values(p).reduce((t,v)=>t+(v&&v.stars||0),0),pct=Math.min(100,Math.round(done/g[2]*100));
    return `<div class="panel" style="background:var(--bg);border:2px solid var(--line)"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b style="font-size:20px">${g[1]}</b><span class="small">${stars} ★</span></div><p style="margin:8px 0 6px">${d?`<b>${done}</b> mission${done>1?'s':''} réussie${done>1?'s':''} sur ${g[2]}`:'Pas encore commencé'}</p><div style="height:10px;border-radius:99px;background:var(--panel);overflow:hidden"><i style="display:block;height:100%;width:${pct}%;background:${g[4]}"></i></div><p style="margin-top:12px"><a class="btn sm solid" href="${g[3]}" target="_blank" rel="noopener">${d?'Continuer':'Commencer'} ↗</a></p></div>`}));
  if($('#myGames'))$('#myGames').innerHTML=out.join('')}
function espaceGroup(k,l){const del=r=>favBtn(r.kind,r.key,r.label,r.data,true);
  if(k==='artist')return `<div class="agrid">${l.map(r=>BYID.get(r.key)).filter(Boolean).map(acard).join('')}</div>`;
  if(k==='palette')return `<div class="grid3">${l.map(r=>{const c=r.data.colors||[];return `<div class="panel" style="background:var(--bg);border:2px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>${esc(r.label)}</b>${del(r)}</div><div class="mine-pal">${c.map(x=>`<i style="background:${esc(x)}" data-copy="${esc(x)}" data-copy-label="${esc(x)} copié" title="${esc(x)}"></i>`).join('')}</div><p class="small" style="margin:0 0 8px">${c.map(esc).join(' · ')}</p><button class="btn sm" data-copy="${esc(cssVars(c))}" data-copy-label="Variables CSS copiées">Copier en CSS</button></div>`}).join('')}</div>`;
  if(k==='color')return `<div class="swatches">${l.map(r=>`<div class="sw" style="cursor:default"><i style="background:${esc(r.data.hex)}"></i><span><b>${esc(r.data.hex)}</b>${esc(r.label)}<span style="display:flex;gap:6px;margin-top:6px;padding:0"><button class="btn sm" data-copy="${esc(r.data.hex)}">Copier</button>${del(r)}</span></span></div>`).join('')}</div>`;
  if(k==='font'){l.forEach(r=>loadFont(r.data.font));return `<div class="grid2">${l.map(r=>`<div class="panel" style="background:var(--bg);border:2px solid var(--line)"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><b>${esc(r.data.font)} · ${esc(r.data.weight)}</b>${del(r)}</div><p style="font-family:'${esc(r.data.font)}',serif;font-weight:${esc(r.data.weight)};font-size:36px;line-height:1.15;margin:10px 0;overflow-wrap:anywhere">Aa Le vif zéphyr</p><div class="seg"><button class="btn sm" data-copy="${esc(`@import url('${fontURL(r.data.font)}');`)}" data-copy-label="@import copié">Copier l'@import</button><a class="btn sm" href="https://fonts.google.com/specimen/${esc(r.data.font.replace(/ /g,'+'))}" target="_blank" rel="noopener">Google Fonts ↗</a></div></div>`).join('')}</div>`}
  if(k==='pair'){const ps=l.map(r=>PAIRS.find(p=>p[0]+'+'+p[2]===r.key)).filter(Boolean);ps.forEach(p=>{loadFont(p[0]);loadFont(p[2])});return `<div class="pairs">${ps.map(pairCard).join('')}</div>`}
  if(k==='term')return `<dl class="lexgrid">${l.map(r=>{const t=LEX.find(x=>x[0]===r.key)||[r.key,'Symbolique','<a href="#symbolique">Voir dans l\u2019onglet Symbolique</a>'];return `<div class="term"><dt>${esc(r.label||t[0])}<span>${t[1]}</span></dt><dd>${t[2]}</dd>${favBtn('term',r.key,r.label,{},true)}</div>`}).join('')}</dl>`;
  if(k==='gabarit')return `<div class="gab show-grid show-read">${l.map(r=>G.find(g=>g[0]===r.key)).filter(Boolean).map(g=>`<article>${gabSvg(g)}<div><h4 style="display:flex;justify-content:space-between;gap:8px">${g[0]} ${favBtn('gabarit',g[0],g[0],{},true)}</h4><p class="small">${g[5]}</p></div></article>`).join('')}</div>`;
  if(k==='logo')return `<div class="seg">${l.map(r=>`<span class="panel" style="padding:8px 14px;display:inline-flex;gap:10px;align-items:center"><b>${esc(r.key)}</b>${del(r)}</span>`).join('')} <a class="btn sm" href="#logos">Voir les familles</a></div>`;
  if(k==='resource')return `<div class="refs">${l.map(r=>{const f=RES.flatMap(g=>g[2]).find(x=>x[1]===r.key)||[r.data.name,r.key,r.data.desc||'','',''];return refCard(f)}).join('')}</div>`;
  return ''}
onShow.espace=renderEspace;

/* ---------- start ---------- */
renderDay();route();
if(!auth)renderAcct();
})();
