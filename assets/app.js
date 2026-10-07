(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const qs=new URLSearchParams(location.search),calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sw=(el,on,off,v)=>{on.forEach(c=>el.classList.toggle(c,v));off.forEach(c=>el.classList.toggle(c,!v))};
// mobile menu
const mb=$('#menu-btn'),mm=$('#mobile-menu');
if(mb)mb.onclick=()=>{const h=mm.classList.toggle('hidden');$('.i-open',mb).classList.toggle('hidden',!h);$('.i-close',mb).classList.toggle('hidden',h);mb.setAttribute('aria-expanded',String(!h))};
// hero background slider
$$('[data-hero]').forEach(h=>{const s=$$('.hs',h),d=$$('.hd',h);let i=0;
const show=n=>{i=n;s.forEach((e,k)=>{sw(e,['opacity-100'],['opacity-0'],k===i);sw($('img',e),['animate-kenburns'],[],k===i)});d.forEach((e,k)=>sw(e,['h-8','w-2','bg-white'],['h-2','bg-white/40'],k===i))};
d.forEach((e,k)=>e.onclick=()=>show(k));if(!calm)setInterval(()=>show((i+1)%s.length),5500);show(0)});
// carousels
$$('[data-slider]').forEach(el=>{
const tr=$('.st',el),it=[...tr.children],D=+el.dataset.d||3,T=+el.dataset.t||2,M=+el.dataset.m||1,iv=+el.dataset.i||4500,dots=$('.sd',el),pv0=$('.sp',el),nx=$('.sn',el);
let pv=D,ix=0,paused=false;const mx=()=>Math.max(0,it.length-pv);
function draw(){tr.style.transform='translateX(-'+(ix*100/it.length)+'%)';const m=mx();pv0.classList.toggle('hidden',!m);nx.classList.toggle('hidden',!m);dots.innerHTML='';
if(m)for(let k=0;k<=m;k++){const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Go to slide '+(k+1));b.className='h-2 rounded-full transition-all duration-300 '+(k===ix?'w-8 bg-emerald-600':'w-2 bg-slate-300 hover:bg-slate-400');b.onclick=()=>go(k);dots.appendChild(b)}}
function go(n){ix=n<0?mx():n>mx()?0:n;draw()}
function layout(){const w=innerWidth;pv=w<768?M:w<1024?T:D;tr.style.width=(it.length/pv*100)+'%';it.forEach(c=>c.style.width=(100/it.length)+'%');if(ix>mx())ix=mx();draw()}
pv0.onclick=()=>go(ix-1);nx.onclick=()=>go(ix+1);el.onmouseenter=()=>paused=true;el.onmouseleave=()=>paused=false;
let tx=null;el.addEventListener('touchstart',e=>tx=e.touches[0].clientX,{passive:true});
el.addEventListener('touchend',e=>{if(tx==null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>40)go(ix+(dx<0?1:-1));tx=null});
if(!calm)setInterval(()=>{if(!paused&&mx())go(ix>=mx()?0:ix+1)},iv);
addEventListener('resize',layout);layout()});
// hero search tabs
$$('[data-tabs]').forEach(w=>{const bs=$$('[data-tab]',w),ps=$$('[data-panel]',w),on=['bg-emerald-600','text-white','shadow-lg','shadow-emerald-200'],off=['bg-slate-100','text-slate-700','hover:bg-slate-200'];
const show=id=>{bs.forEach(b=>sw(b,on,off,b.dataset.tab===id));ps.forEach(p=>p.classList.toggle('hidden',p.dataset.panel!==id))};
bs.forEach(b=>b.onclick=()=>show(b.dataset.tab));show(bs[0].dataset.tab)});
// list filtering (tours, hotels, visa, hajj)
const f=$('[data-filterable]');
if(f){const items=$$('[data-item]',f),inp=$('[data-search]'),cnt=$('[data-count]'),tabs=$$('[data-type-tab]'),emp=$('[data-empty]');
let type=qs.get('type')||'',q=(qs.get('q')||'').toLowerCase();if(inp)inp.value=qs.get('q')||'';
const on=['bg-emerald-600','text-white'],off=['bg-white','text-slate-700','hover:bg-slate-100'];
const num=s=>{const v=parseFloat($(s)?.value);return isNaN(v)?null:v};
function apply(){const lo=num('[data-pmin]'),hi=num('[data-pmax]'),stars=$$('[data-star]:checked').map(x=>+x.value),am=$$('[data-amen]:checked').map(x=>x.value);let n=0;
items.forEach(e=>{const d=e.dataset,p=+d.price,ok=(!type||d.type===type)&&(!q||d.text.includes(q))&&(lo==null||p>=lo)&&(hi==null||p<=hi)&&(!stars.length||stars.includes(Math.round(+d.rating)))&&am.every(a=>(d.amen||'').includes(a));e.classList.toggle('hidden',!ok);if(ok)n++});
if(cnt)cnt.textContent=n;if(emp)emp.classList.toggle('hidden',n>0);tabs.forEach(t=>sw(t,on,off,(t.dataset.typeTab||'')===type))}
if(inp)inp.addEventListener('input',()=>{q=inp.value.toLowerCase();apply()});
$$('[data-q]').forEach(a=>a.onclick=e=>{e.preventDefault();q=a.dataset.q.toLowerCase();if(inp)inp.value=a.dataset.q;apply()});
$$('[data-pmin],[data-pmax],[data-star],[data-amen]').forEach(x=>x.addEventListener('input',apply));
tabs.forEach(t=>t.onclick=e=>{e.preventDefault();type=t.dataset.typeTab||'';history.replaceState(null,'',type?'?type='+type:location.pathname);apply()});apply()}
// contact page prefill
const cf=$('#contact-form');if(cf){['service','destination'].forEach(k=>{const v=qs.get(k),el=cf.elements[k==='service'?'serviceType':k];if(v&&el)el.value=v})}
// forms -> PHP
$$('form[data-ajax]').forEach(fm=>fm.addEventListener('submit',async e=>{e.preventDefault();const b=$('[type=submit]',fm),note=$('[data-note]',fm.parentElement),old=b.innerHTML;b.disabled=true;b.textContent='Sending...';
try{const r=await fetch(fm.action,{method:'POST',body:new FormData(fm)}),j=await r.json();if(j.success)fm.reset();note.textContent=j.success?j.message:(j.error||'Something went wrong. Please try again.');note.className='text-sm mt-3 '+(j.success?'text-emerald-600':'text-rose-600')}
catch(x){note.textContent='Network error. Please call us instead.';note.className='text-sm mt-3 text-rose-600'}b.disabled=false;b.innerHTML=old}));
// floating contact button
const cb=$('#cw-btn'),cp=$('#cw-panel');if(cb)cb.onclick=()=>cp.classList.toggle('hidden');
})();
