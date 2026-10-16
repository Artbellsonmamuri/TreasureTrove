(() => {
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  function closeMenu() { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }
  menu?.addEventListener('click', () => { const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Close navigation':'Open navigation'); });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeMenu(); });
  window.addEventListener('resize',()=>{if(window.innerWidth>960)closeMenu();});

  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  document.querySelectorAll('input[type=date]').forEach(i=>{i.min=today;});
  const quick=document.querySelector('.quick-form');
  quick?.addEventListener('submit', e=>{e.preventDefault(); const data=new FormData(quick);const params=new URLSearchParams();if(data.get('event'))params.set('event',data.get('event'));if(data.get('date'))params.set('date',data.get('date'));window.location.href='/contact/?'+params.toString()+'#inquiry';});

  const gallery=document.querySelector('.photo-grid');
  const galleryCount=document.querySelector('#gallery-count');
  document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;gallery?.querySelectorAll('figure').forEach(figure=>{figure.hidden=button.dataset.filter!=='all'&&figure.dataset.category!==button.dataset.filter;if(!figure.hidden)count++;});if(galleryCount)galleryCount.textContent=count+(count===1?' photograph':' photographs');}));
  const lightbox=document.querySelector('#lightbox');
  let selected=0, previousFocus, photos=[];
  function getPhotos(){return [...document.querySelectorAll('.gallery-image-button')].filter(b=>!b.closest('[hidden]'));}
  function showPhoto(){const p=photos[selected]; if(!p)return;const img=lightbox.querySelector('img');img.src=p.dataset.full;img.alt=p.querySelector('img').alt;lightbox.querySelector('#photo-caption').textContent=p.dataset.caption;lightbox.querySelector('#photo-index').textContent=(selected+1)+' / '+photos.length;lightbox.querySelector('#photo-source').href=p.dataset.source;lightbox.querySelectorAll('.lightbox-prev,.lightbox-next').forEach(b=>b.hidden=photos.length<2);}
  document.querySelectorAll('.gallery-image-button').forEach(b=>b.addEventListener('click',()=>{photos=getPhotos();selected=photos.indexOf(b);previousFocus=b;showPhoto();lightbox.showModal();document.body.classList.add('locked');}));
  lightbox?.querySelector('.lightbox-close').addEventListener('click',()=>lightbox.close());
  lightbox?.querySelector('.lightbox-prev').addEventListener('click',()=>{selected=(selected-1+photos.length)%photos.length;showPhoto();});
  lightbox?.querySelector('.lightbox-next').addEventListener('click',()=>{selected=(selected+1)%photos.length;showPhoto();});
  lightbox?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();selected=(selected+1)%photos.length;showPhoto();}if(e.key==='ArrowLeft'){e.preventDefault();selected=(selected-1+photos.length)%photos.length;showPhoto();}});
  lightbox?.addEventListener('close',()=>{document.body.classList.remove('locked');previousFocus?.focus();});
  lightbox?.addEventListener('click',e=>{if(e.target===lightbox){const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close();}});

  const form=document.querySelector('#quote-form');
  const quoteDialog=document.querySelector('#quote-dialog');
  if(form){
    form.querySelector('.form-submit').disabled=false;
    const params=new URLSearchParams(window.location.search);
    const type=form.elements.event;
    if([...type.options].some(o=>o.value===params.get('event')))type.value=params.get('event');
    const date=params.get('date');
    if(date&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&date>=today)form.elements.date.value=date;
    if(params.get('interest'))form.elements.message.value='I would like to inquire about '+params.get('interest').slice(0,100)+'.';
    form.addEventListener('submit',e=>{
      e.preventDefault(); if(!form.reportValidity())return;
      const d=new FormData(form);
      const prettyDate=d.get('date')?new Intl.DateTimeFormat('en-PH',{dateStyle:'long',timeZone:'Asia/Manila'}).format(new Date(d.get('date')+'T12:00:00+08:00')):'To be discussed';
      const message=['Hello Treasure Trove Resort,','I would like to request a quotation and check date availability.','',`Name: ${d.get('name')}`,`Mobile: ${d.get('mobile')}`,`Email: ${d.get('email')||'Not provided'}`,`Event: ${d.get('event')}`,`Preferred date: ${prettyDate}`,`Estimated guests: ${d.get('guests')}`,`Accommodation needed: ${d.get('accommodation')}`,`Catering needed: ${d.get('catering')}`,'',`Additional requirements: ${d.get('message')||'None at this stage.'}`,'','Please share your current rates, inclusions, and availability. Thank you!'].join('\n');
      quoteDialog.querySelector('#prepared-inquiry').value=message;
      quoteDialog.querySelector('#send-email').href='mailto:info@treasuretroveph.com?subject='+encodeURIComponent('Quotation request: '+d.get('event')+' — '+prettyDate)+'&body='+encodeURIComponent(message);
      quoteDialog.querySelector('.status').textContent='';
      quoteDialog.showModal();document.body.classList.add('locked');
    });
    quoteDialog.querySelector('.modal-close').addEventListener('click',()=>quoteDialog.close());
    quoteDialog.addEventListener('close',()=>{document.body.classList.remove('locked');form.querySelector('.form-submit').focus();});
    quoteDialog.querySelector('#copy-inquiry').addEventListener('click',async()=>{
      const text=quoteDialog.querySelector('#prepared-inquiry');const status=quoteDialog.querySelector('.status');
      try{await navigator.clipboard.writeText(text.value);status.textContent='Copied. Open Messenger, paste your inquiry, and send it to the resort.';}
      catch{ text.focus();text.select();status.textContent='Select and copy the message above, then paste it into Messenger.';}
    });
  }
})();
