// Bubbles, dolphins & music player
(() => {
  const ocean = document.getElementById('ocean');
  const ctx = ocean.getContext('2d');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W=0,H=0;
  const bubbles=[], rings=[], sparkles=[];
  const MAX_BUBBLES=60;

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
  (function loop(){ ctx.clearRect(0,0,W,H); const g=ctx.createLinearGradient(0,0,0,H); g.addColorStop(0,'rgba(255,255,255,.25)'); g.addColorStop(.5,'rgba(126,255,247,.15)'); g.addColorStop(1,'rgba(0,128,128,.15)'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    bubbles.forEach(b=>{b.step(); b.draw()}); rings.forEach(r=>{r.step(); r.draw()}); sparkles.forEach(s=>{s.step(); s.draw()});
    for(let i=rings.length-1;i>=0;i--) if(rings[i].dead) rings.splice(i,1); for(let i=sparkles.length-1;i>=0;i--) if(sparkles[i].dead) sparkles.splice(i,1);
    requestAnimationFrame(loop);
  })();

  ocean.addEventListener('click', (e)=>{
    const rect = ocean.getBoundingClientRect();
    const x = (e.clientX - rect.left) * DPR;
    const y = (e.clientY - rect.top) * DPR;
    let nearest=null, nd=1e9;
    bubbles.forEach(b=>{ const d=(b.x-x)**2 + (b.y-y)**2; if(d<nd){ nd=d; nearest=b; }});
    if(nearest && Math.sqrt(nd) < nearest.r*1.15) nearest.pop();
  });

  // Dolphins
  const dolphins = Array.from(document.querySelectorAll('.dolphin'));
  dolphins.forEach(svg => { // inject gradient defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    const lg = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
    lg.setAttribute('id','grad-blue'); lg.setAttribute('x1','0'); lg.setAttribute('y1','0'); lg.setAttribute('x2','1'); lg.setAttribute('y2','1');
    const s1 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s1.setAttribute('offset','0%'); s1.setAttribute('stop-color','#7dd3fc');
    const s2 = document.createElementNS('http://www.w3.org/2000/svg','stop'); s2.setAttribute('offset','100%'); s2.setAttribute('stop-color','#5eead4');
    lg.appendChild(s1); lg.appendChild(s2); defs.appendChild(lg); svg.insertBefore(defs, svg.firstChild);
  });

  function swim(el, opts={}){
    const start = Math.random()*2000;
    const amp = opts.amp || (el.classList.contains('mirror') ? 30 : 40);
    const speed = opts.speed || (el.classList.contains('mirror') ? 0.06 : 0.05);
    const baseY = parseFloat(getComputedStyle(el).top) || (el.classList.contains('mirror')? innerHeight*0.6: innerHeight*0.3);
    let x = el.classList.contains('mirror') ? innerWidth + 200 : -200;

    function step(t=0){
      const tt=(t+start)*speed;
      const y=baseY + Math.sin(tt/2)*amp;
      x += el.classList.contains('mirror')? -0.7 : 0.7;
      el.style.transform = `translate(${x}px, ${y}px) ${el.classList.contains('mirror')?'scaleX(-1)':''}`;
      if(el._jumping){ requestAnimationFrame(step); return; }
      if(!el.classList.contains('mirror') && x>innerWidth+220) x=-220;
      if(el.classList.contains('mirror') && x<-220) x=innerWidth+220;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  dolphins.forEach(d => swim(d));
  dolphins.forEach(d => d.addEventListener('click', (e)=>{ e.stopPropagation(); jump(d); splashAt(d.getBoundingClientRect()); }, {passive:true}));

  function jump(el){
    if(el._jumping) return;
    el._jumping=true;
    el.animate([
      { offset:0, transform: el.style.transform + ' translateY(0) rotate(0deg)' },
      { offset:.35, transform: el.style.transform + ' translateY(-120px) rotate(-12deg)' },
      { offset:.7, transform: el.style.transform + ' translateY(0) rotate(0deg)' },
      { offset:1, transform: el.style.transform }
    ], { duration:900, easing:'cubic-bezier(.2,.65,.3,1)' }).addEventListener('finish', ()=>{ el._jumping=false; blip(220); });
  }
  function splashAt(rect){
    const DPR = Math.min(window.devicePixelRatio||1,2);
    const x = (rect.left + rect.width/2) * DPR;
    const y = (rect.top + rect.height) * DPR;
    for(let i=0;i<18;i++) sparkles.push(new Sparkle(x + rand(-10,10)*DPR, y + rand(-4,4)*DPR));
    rings.push(new Ring(x,y,8*DPR));
  }

  // WebAudio blip
  const audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  function blip(freq=880){
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type='sine'; o.frequency.value=freq; o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.0001,audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2,audioCtx.currentTime+.01);
    g.gain.exponentialRampToValueAtTime(0.0001,audioCtx.currentTime+.15);
    o.start(); o.stop(audioCtx.currentTime+.16);
  }

  // Music player
  const songsBtn = document.getElementById('songsBtn');
  const panel = document.getElementById('playerPanel');
  const prevBtn = document.getElementById('prevBtn');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const nextBtn = document.getElementById('nextBtn');
  const addBtn = document.getElementById('addBtn');
  const nowPlaying = document.getElementById('nowPlaying');
  const songList = document.getElementById('songList');
  const audioEl = document.getElementById('audioPlayer');
  const ytContainer = document.getElementById('youtubeContainer');
  let YT_API_READY=false, ytPlayer=null;

  function ensureYouTubeAPI(){
    if(YT_API_READY) return Promise.resolve();
    return new Promise(resolve=>{
      const tag=document.createElement('script');
      tag.src='https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady=()=>{ YT_API_READY=true; resolve(); }
    });
  }

  let playlist=[], index=0;
  async function loadSongs(){
    const base = await fetch('data/songs.json').then(r=>r.json()).catch(()=>[]);
    const extra = JSON.parse(localStorage.getItem('extraSongs')||'[]');
    playlist = base.concat(extra);
    renderList();
  }
  function renderList(){
    songList.innerHTML = playlist.map((s,i)=>`<div class="song ${i===index?'on':''}" data-i="${i}">${s.title} <span class="muted">— ${s.artist}</span></div>`).join('');
    songList.querySelectorAll('.song').forEach(el=>el.addEventListener('click',()=>{ index=parseInt(el.dataset.i,10); playCurrent(); }));
  }
  function playCurrent(){
    const s = playlist[index];
    nowPlaying.textContent = s ? `${s.title} — ${s.artist}` : '—';
    if(!s) return;
    if(s.type==='audio'){
      audioEl.src=s.url; audioEl.play().catch(()=>{});
      if(ytPlayer) ytPlayer.stopVideo();
    } else if(s.type==='youtube'){
      ensureYouTubeAPI().then(()=>{
        if(!ytPlayer){
          ytPlayer=new YT.Player('youtubeContainer',{ videoId:s.youtubeId, playerVars:{rel:0}, events:{ onReady:()=>ytPlayer.playVideo(), onStateChange:(e)=>{ if(e.data===YT.PlayerState.ENDED) next(); }}});
        } else {
          ytPlayer.loadVideoById(s.youtubeId); ytPlayer.playVideo();
        }
      });
    }
    document.body.animate([{filter:'saturate(100%)'}, {filter:'saturate(120%)'}], {duration:300, direction:'alternate'});
  }
  function next(){ if(!playlist.length) return; index=(index+1)%playlist.length; playCurrent(); }
  function prev(){ if(!playlist.length) return; index=(index-1+playlist.length)%playlist.length; playCurrent(); }

  playPauseBtn.addEventListener('click',()=>{
    if(ytPlayer && ytPlayer.getPlayerState && ytPlayer.getPlayerState()===1){ ytPlayer.pauseVideo(); }
    else if(ytPlayer){ ytPlayer.playVideo(); }
    if(!ytPlayer){ if(audioEl.paused) audioEl.play().catch(()=>{}); else audioEl.pause(); }
  });
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  addBtn.addEventListener('click',()=>{
    const title=prompt('Song title?'); if(!title) return;
    const artist=prompt('Artist?')||'';
    const url=prompt('Paste a YouTube URL or direct audio URL (.mp3/.wav).'); if(!url) return;
    const m = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?]+)/);
    const entry = m ? {type:'youtube', title, artist, youtubeId:m[1]} : {type:'audio', title, artist, url};
    const store = JSON.parse(localStorage.getItem('extraSongs')||'[]'); store.push(entry); localStorage.setItem('extraSongs', JSON.stringify(store));
    loadSongs();
  });

  songsBtn.addEventListener('click', async()=>{
    if(typeof panel.showModal==='function') panel.showModal(); else panel.setAttribute('open','');
    if(!playlist.length) await loadSongs();
    if(playlist.length) playCurrent();
  });
  document.querySelector('#playerPanel .close')?.addEventListener('click',()=>panel.close());

  document.getElementById('year').textContent = new Date().getFullYear();
})();