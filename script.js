(() => {
  const ocean = document.getElementById('ocean');
  const ctx = ocean.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W=0,H=0;
  const bubbles=[], rings=[], sparkles=[];
  const MAX_BUBBLES=45;

  function resize(){
    W = ocean.width = Math.floor(innerWidth * DPR);
    H = ocean.height = Math.floor(innerHeight * DPR);
    ocean.style.width = innerWidth + 'px';
    ocean.style.height = innerHeight + 'px';
  }
  resize(); addEventListener('resize', resize);

  function rand(a,b){ return Math.random()*(b-a)+a; }

  class Bubble{
    constructor(){ this.r=rand(8,26)*DPR; this.x=rand(this.r,W-this.r); this.y=H+rand(0,H*.5); this.vy=-rand(.3,1.1)*DPR; this.phase=rand(0,Math.PI*2); }
    step(){ this.phase+=.02; this.x+=Math.sin(this.phase)*.4*DPR; this.y+=this.vy; if(this.y<-this.r) this.reset(); }
    reset(){ this.r=rand(8,26)*DPR; this.x=rand(this.r,W-this.r); this.y=H+this.r+rand(0,H*.25); this.vy=-rand(.3,1.1)*DPR; this.phase=rand(0,Math.PI*2); }
    draw(){
      const grd=ctx.createRadialGradient(this.x-this.r*.35,this.y-this.r*.35,this.r*.1,this.x,this.y,this.r);
      grd.addColorStop(0,'rgba(255,255,255,.95)'); grd.addColorStop(.3,'rgba(255,255,255,.55)'); grd.addColorStop(1,'rgba(255,255,255,.04)');
      ctx.fillStyle=grd; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.45)'; ctx.beginPath(); ctx.arc(this.x-this.r*.4,this.y-this.r*.35,this.r*.25,-Math.PI*.1,Math.PI*.8); ctx.stroke();
    }
    contains(px,py){ const dx=px-this.x, dy=py-this.y; return dx*dx+dy*dy<=this.r*this.r; }
    pop(){ rings.push(new Ring(this.x,this.y,this.r)); for(let i=0;i<12;i++) sparkles.push(new Sparkle(this.x,this.y)); blip(); this.reset(); }
  }
  class Ring{ constructor(x,y,r){ this.x=x; this.y=y; this.r=r; this.a=1 } step(){ this.r+=2*DPR; this.a-=.02 } draw(){ ctx.strokeStyle=`rgba(255,255,255,${this.a*.7})`; ctx.lineWidth=2*DPR; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.stroke(); } get dead(){ return this.a<=0 } }
  class Sparkle{ constructor(x,y){ this.x=x; this.y=y; this.vx=rand(-1.5,1.5)*DPR; this.vy=rand(-2,-.5)*DPR; this.a=1; this.s=rand(1,2)*DPR } step(){ this.x+=this.vx; this.y+=this.vy; this.vy+=.05*DPR; this.a-=.03 } draw(){ ctx.fillStyle=`rgba(255,255,255,${this.a})`; ctx.fillRect(this.x,this.y,this.s,this.s) } get dead(){ return this.a<=0 } }

  for(let i=0;i<MAX_BUBBLES;i++) bubbles.push(new Bubble());
  (function loop(){ ctx.clearRect(0,0,W,H);
    bubbles.forEach(b=>{b.step(); b.draw()}); rings.forEach(r=>{r.step(); r.draw()}); sparkles.forEach(s=>{s.step(); s.draw()});
    for(let i=rings.length-1;i>=0;i--) if(rings[i].dead) rings.splice(i,1); for(let i=sparkles.length-1;i>=0;i--) if(sparkles[i].dead) sparkles.splice(i,1);
    requestAnimationFrame(loop);
  })();

  // Click to pop
  ocean.addEventListener('click',(e)=>{
    const rect = ocean.getBoundingClientRect();
    const x = (e.clientX - rect.left) * DPR;
    const y = (e.clientY - rect.top) * DPR;
    let nearest=null, nd=1e9;
    bubbles.forEach(b=>{ const d=(b.x-x)**2 + (b.y-y)**2; if(d<nd){ nd=d; nearest=b; }});
    if(nearest && Math.sqrt(nd) < nearest.r*1.15) nearest.pop();
  });

  // CC0 wallpaper if present
  fetch('assets/external/frutiger_aero_wallpaper.png', {cache:'no-store'}).then(r=>{
    if(r.ok){ document.querySelector('.wallpaper').style.backgroundImage = 'url(assets/external/frutiger_aero_wallpaper.png)'; }
  }).catch(()=>{});

  // Inject CC0 dolphin if present
  (async function useDolphin(){
    try{
      const res = await fetch('assets/external/dolphin.svg', {cache:'no-store'});
      if(!res.ok) return;
      const svg = await res.text();
      const layer = document.getElementById('cc0-dolphins');
      const wrap = document.createElement('div'); wrap.innerHTML = svg; const el = wrap.firstElementChild;
      el.style.position='absolute'; el.style.left='-200px'; el.style.top='30vh'; el.style.width='180px'; el.style.filter='drop-shadow(0 10px 30px rgba(0,0,0,.25))'; el.style.pointerEvents='auto'; el.style.cursor='pointer';
      layer.appendChild(el);
      let x=-200, amp=40, baseY=innerHeight*0.3;
      function swim(t=0){ const y=baseY + Math.sin(t*0.002)*amp; x += 0.7; el.style.transform = `translate(${x}px, ${y}px)`; if(x > innerWidth + 220) x=-220; requestAnimationFrame(swim); } requestAnimationFrame(swim);
      el.addEventListener('click',(e)=>{ e.stopPropagation(); el.animate([{transform:el.style.transform},{transform:el.style.transform+' translateY(-120px) rotate(-12deg)'},{transform:el.style.transform}], {duration:900, easing:'cubic-bezier(.2,.65,.3,1)'}); });
    }catch(e){}
  })();

  // Inject Animated SVG bubble if present
  (async function useAnimatedBubble(){
    try{
      const res = await fetch('assets/external/animated_svg_soap_bubble.svg', {cache:'no-store'});
      if(!res.ok) return;
      const svg = await res.text();
      const layer = document.getElementById('cc0-bubbles');
      for(let i=0;i<6;i++){ const wrap = document.createElement('div'); wrap.innerHTML = svg; const el = wrap.firstElementChild;
        el.style.width = (120 + Math.random()*80) + 'px'; el.style.left = (Math.random()*80)+'vw'; el.style.top = (60 + Math.random()*30)+'vh'; el.style.opacity=.85; el.style.filter='saturate(120%)';
        layer.appendChild(el);
        el.addEventListener('click', ()=>{ el.animate([{transform:'scale(1)'},{transform:'scale(1.15)'},{transform:'scale(0.8)'},{transform:'scale(1)'}], {duration:500}); });
      }
    }catch(e){}
  })();

  // WebAudio blip
  const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  function blip(freq=880){ const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type='sine'; o.frequency.value=freq; o.connect(g); g.connect(audioCtx.destination); g.gain.setValueAtTime(0.0001,audioCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.2,audioCtx.currentTime+.01); g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+.15); o.start(); o.stop(audioCtx.currentTime+.16); }

  // Music player
  const songsBtn=document.getElementById('songsBtn'); const panel=document.getElementById('playerPanel');
  const prevBtn=document.getElementById('prevBtn'); const playPauseBtn=document.getElementById('playPauseBtn'); const nextBtn=document.getElementById('nextBtn'); const addBtn=document.getElementById('addBtn');
  const nowPlaying=document.getElementById('nowPlaying'); const songList=document.getElementById('songList'); const audioEl=document.getElementById('audioPlayer');
  let ytPlayer=null, YT_API_READY=false;
  function ensureYouTubeAPI(){ if(YT_API_READY) return Promise.resolve(); return new Promise(resolve=>{ const tag=document.createElement('script'); tag.src='https://www.youtube.com/iframe_api'; document.head.appendChild(tag); window.onYouTubeIframeAPIReady=()=>{ YT_API_READY=true; resolve(); }; }); }
  let playlist=[], index=0;
  async function loadSongs(){ const base = await fetch('data/songs.json').then(r=>r.json()).catch(()=>[]); const extra = JSON.parse(localStorage.getItem('extraSongs')||'[]'); playlist = base.concat(extra); renderList(); }
  function renderList(){ songList.innerHTML = playlist.map((s,i)=>`<div class="song ${i===index?'on':''}" data-i="${i}">${s.title} <span class="muted">— ${s.artist}</span></div>`).join(''); songList.querySelectorAll('.song').forEach(el=>el.addEventListener('click',()=>{ index=parseInt(el.dataset.i,10); playCurrent(); })); }
  function playCurrent(){ const s=playlist[index]; nowPlaying.textContent = s ? `${s.title} — ${s.artist}` : '—'; if(!s) return; if(s.type==='audio'){ audioEl.src=s.url; audioEl.play().catch(()=>{}); if(ytPlayer) ytPlayer.stopVideo(); } else { ensureYouTubeAPI().then(()=>{ if(!ytPlayer){ ytPlayer=new YT.Player('youtubeContainer',{ videoId:s.youtubeId, playerVars:{rel:0}, events:{ onReady:()=>ytPlayer.playVideo(), onStateChange:(e)=>{ if(e.data===YT.PlayerState.ENDED) next(); }}}); } else { ytPlayer.loadVideoById(s.youtubeId); ytPlayer.playVideo(); } }); }
    document.body.animate([{filter:'saturate(100%)'},{filter:'saturate(120%)'}],{duration:300, direction:'alternate'}); }
  function next(){ if(!playlist.length) return; index=(index+1)%playlist.length; playCurrent(); }
  function prev(){ if(!playlist.length) return; index=(index-1+playlist.length)%playlist.length; playCurrent(); }
  playPauseBtn.addEventListener('click',()=>{ if(ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState()===1){ ytPlayer.pauseVideo(); } else if(ytPlayer){ ytPlayer.playVideo(); } if(!ytPlayer){ if(audioEl.paused) audioEl.play().catch(()=>{}); else audioEl.pause(); } });
  nextBtn.addEventListener('click', next); prevBtn.addEventListener('click', prev);
  addBtn.addEventListener('click',()=>{ const title=prompt('Song title?'); if(!title) return; const artist=prompt('Artist?')||''; const url=prompt('Paste a YouTube URL or direct audio URL (.mp3/.wav).'); if(!url) return; const m=url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/); const entry=m?{type:'youtube',title,artist,youtubeId:m[1]}:{type:'audio',title,artist,url}; const store=JSON.parse(localStorage.getItem('extraSongs')||'[]'); store.push(entry); localStorage.setItem('extraSongs', JSON.stringify(store)); loadSongs(); });
  songsBtn.addEventListener('click', async()=>{ if(typeof panel.showModal==='function') panel.showModal(); else panel.setAttribute('open',''); if(!playlist.length) await loadSongs(); if(playlist.length) playCurrent(); });
  document.querySelector('#playerPanel .close')?.addEventListener('click',()=>panel.close());
  document.getElementById('year').textContent = new Date().getFullYear();
})();