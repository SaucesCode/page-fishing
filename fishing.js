(() => {
  const previous = document.getElementById('page-fishing-root');
  if (previous) { previous.dispatchEvent(new Event('fishing-close')); return; }
  const host = document.createElement('div');
  host.id = 'page-fishing-root';
  host.style.cssText = 'all:initial;position:fixed;inset:0;pointer-events:none;z-index:2147483647';
  const root = host.attachShadow({mode:'open'});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const palettes = [
    ['Apricot','#dda782','#f1d4b3'],['Lagoon','#7db3b3','#c6dfcf'],
    ['Orchid','#b4a3ca','#e1d0e6'],['Rose','#ce9ca9','#efd1ca'],
    ['Honey','#cdb77d','#efe3b9'],['Mist','#8ba8c5','#cbdde7'],
    ['Mint','#6eae88','#d3ebae'],['Pearl','#d1dce1','#ffffff']
  ];
  const forms = ['Guppy','Angelfish','Puffer','Ribbonfish','Butterflyfish','Lanternfish','Reef shark','Moon koi','Veiltail','Seahorse','Manta ray','Leaf dragon','Sea turtle','Jellyfish','Octopus','Crab','Nautilus','Dolphin','Whale shark','Moon whale','Starfish','Shrimp','Squid','Lobster','Seal','Penguin','Axolotl','Ocean sunfish'];
  const weights=[1400,1100,1000,1000,900,700,600,500,450,350,300,50,250,200,150,80,40,20,9,1,300,200,160,100,70,40,20,10]; // Exactly 10,000 tickets per encounter.
  const speciesTier=k=>weights[k]>=700?'Common':weights[k]>=200?'Uncommon':weights[k]>=20?'Rare':'Legendary';
  const odds=k=>`${10000%weights[k]?'≈ ':''}1 in ${(10000/weights[k]).toLocaleString(undefined,{maximumFractionDigits:1})}`;
  const tiers=['Common','Uncommon','Rare','Legendary'];
  const tierColors=['#6f998b','#5d9aaf','#a083b7','#be9652'];
  const tierOf=r=>r.rarity||(r.rare?'Legendary':r.kind>=9?'Rare':r.kind>=6?'Uncommon':'Common');
  const speciesKey=r=>`${r.kind??0}:${r.palette??0}:${r.pattern??0}:${tierOf(r)}`;
  const bodyText = (document.title+' '+(document.body?.innerText||'').slice(0,8000)).toLowerCase();
  let weather='day';
  function checkIsDark(){
    if(weather==='night')return true;
    try{
      if(document.body){
        const tc=getComputedStyle(document.body).color;
        const tm=tc.match(/\d+/g);
        if(tm&&tm.length>=3){
          const lum=Number(tm[0])*0.299+Number(tm[1])*0.587+Number(tm[2])*0.114;
          if(lum>145)return true;
        }
      }
      for(const el of [document.body,document.documentElement]){
        if(!el)continue;
        const bg=getComputedStyle(el).backgroundColor;
        const m=bg.match(/\d+/g);
        if(m&&m.length>=3&&!(m.length===4&&Number(m[3])===0)){
          const lum=Number(m[0])*0.299+Number(m[1])*0.587+Number(m[2])*0.114;
          return lum<125;
        }
      }
    }catch{}
    try{return matchMedia('(prefers-color-scheme: dark)').matches;}catch{return false;}
  }
  function updateThemeMode(){
    if(!host)return;
    host.setAttribute('data-dark',String(checkIsDark()));
  }
  const isDarkPage = checkIsDark();
  const habitat = /recipe|cooking|ingredient|bake|chef|kitchen/.test(bodyText) ? 'Kitchen reef' :
    /github|javascript|programming|code|developer|terminal|python|rust/.test(bodyText) ? 'Bytewater' :
    /anime|manga|comic|animation/.test(bodyText) ? 'Ink lagoon' :
    /wikipedia|wiki|encyclopedia|history|science|research|archive/.test(bodyText) ? 'Papyrus shallows' :
    /spotify|music|song|album|audio|sound|podcast/.test(bodyText) ? 'Harmonic deeps' :
    /shop|store|cart|price|amazon|buy|checkout/.test(bodyText) ? 'Marketplace trench' :
    /game|gaming|steam|twitch|discord|rpg|arcade/.test(bodyText) ? 'Neon arcade' :
    /art|gallery|photo|design|dribbble|behance/.test(bodyText) ? 'Gallery tide' :
    /reddit|twitter|tweet|bluesky|forum|community/.test(bodyText) ? 'Social archipelago' :
    isDarkPage ? 'Starlight abyss' : 'Webwater';
  let audioCtx = null, soundMuted = false;
  function initAudio() {
    if (!audioCtx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
      } catch {}
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }
  function playSfx(type) {
    if (soundMuted) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      if (type === 'cast') {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(390, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.16);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.16);
      } else if (type === 'reel') {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(210, now + 0.035);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.035);
      } else if (type === 'plop') {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(410, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(270, now + 0.22);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.22);
      } else if (type === 'tug') {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.2);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
      } else if (type === 'discovery') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.08, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(now + i * 0.07); osc.stop(now + i * 0.07 + 0.45);
        });
      } else if (type === 'release') {
        [659.25, 587.33, 523.25, 440].forEach((freq, i) => {
          const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.06, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.4);
        });
      } else if (type === 'ripple') {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(680, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.1);
      } else if (type === 'streak') {
        [587.33, 739.99, 880].forEach((freq, i) => {
          const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.07, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.32);
          osc.connect(gain); gain.connect(audioCtx.destination);
          osc.start(now + i * 0.06); osc.stop(now + i * 0.06 + 0.32);
        });
      }
    } catch {}
  }
  function uiIcon(name, size=13, stroke=1.6){
    const s = {
      audioOn: `<path d="M7 3.5L3.8 6H1.5v4h2.3L7 12.5V3.5z"/><path d="M10.2 5.5a3.2 3.2 0 0 1 0 5M12.2 3.8a5.5 5.5 0 0 1 0 8.4"/>`,
      audioMute: `<path d="M7 3.5L3.8 6H1.5v4h2.3L7 12.5V3.5z"/><path d="M10 6.5l3.5 3.5m0-3.5l-3.5 3.5"/>`,
      pause: `<path d="M5.5 3.5v9M10.5 3.5v9"/>`,
      play: `<path d="M5.5 3.5l7 4.5-7 4.5z" fill="currentColor" stroke="none"/>`,
      close: `<path d="M3.5 3.5l9 9m0-9l-9 9"/>`,
      pearl: `<circle cx="8" cy="8" r="5" fill="currentColor" fill-opacity=".12"/><circle cx="8" cy="8" r="5"/><path d="M6 6a2.6 2.6 0 0 1 3.2.6"/>`,
      rod: `<path d="M20 4L4 20"/><path d="M4 20l-1.5 1.5"/><circle cx="6" cy="18" r="1.5"/><path d="M12 12l2 2m4-4l1.5 1.5"/>`,
      line: `<path d="M4 6c5-4 11 0 11 6s-5 6 0 8"/><path d="M15 20v2a1.5 1.5 0 0 0 3 0v-1"/>`,
      bucket: `<path d="M5 9l1.8 11h10.4L19 9H5z"/><path d="M7 9a5 5 0 0 1 10 0"/>`,
      bait: `<path d="M12 4c-3 2-4 6-2 9l6-2c2-3 1-6-4-7z"/><path d="M8 15l-3 3m7-4l-2 4m6-5l1 3"/>`,
      book: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z"/><path d="M8 8h8M8 12h5"/>`,
      badge: `<circle cx="12" cy="12" r="8"/><path d="M12 7v2m0 6v2m-5-5h2m6 0h2"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>`,
      bubbles: `<circle cx="8" cy="15" r="4"/><circle cx="16" cy="8" r="3.2"/><circle cx="16" cy="17" r="1.8"/>`,
      lock: `<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>`,
      check: `<path d="M4 12l5 5 11-11"/>`
    }[name] || '';
    const vb = (name === 'rod' || name === 'line' || name === 'bucket' || name === 'bait' || name === 'book' || name === 'badge' || name === 'bubbles' || name === 'lock' || name === 'check') ? '0 0 24 24' : '0 0 16 16';
    return `<svg viewBox="${vb}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${s}</svg>`;
  }
  root.innerHTML = `<style>
    :host{all:initial}*{box-sizing:border-box}button{font:inherit;cursor:pointer}button:focus-visible{outline:3px solid #f4a55b;outline-offset:4px}button:disabled{cursor:wait}[hidden]{display:none!important}
    .rig{position:absolute;right:24px;top:8px;width:260px;height:133px;pointer-events:none;color:#244750;font:12px 'Trebuchet MS',sans-serif}
    .rod{position:absolute;left:0;top:0;width:170px;height:125px;overflow:visible;transform-origin:150px 108px}.rod svg{width:100%;height:100%;overflow:visible}.bucket{position:absolute;right:3px;top:37px;width:76px;height:79px;padding:0;border:0;background:none;pointer-events:auto;color:#fff}.bucket svg{width:76px;height:79px;overflow:visible}.count{position:absolute;left:0;right:0;top:43px;text-align:center;font:bold 19px Georgia,serif;text-shadow:0 1px #0003}.lid{position:absolute;right:0;top:3px;display:flex;gap:4px;pointer-events:auto}.tool{border:1px solid #c4d9d6;border-radius:50%;width:26px;height:26px;background:#f5faf5;color:#355d62;padding:0;display:grid;place-items:center}.hint{position:absolute;right:16px;top:115px;white-space:nowrap;background:transparent;border:0;box-shadow:none;color:#264943;font:500 12px 'Trebuchet MS',sans-serif;text-shadow:0 1px 2px #ffffffee,0 0 6px #ffffffdd}.line{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}.fishes,.effects{position:absolute;inset:0;pointer-events:none;overflow:hidden}.swimmer{position:absolute;left:0;top:0;width:112px;height:78px;padding:0;border:0;background:none;pointer-events:auto;will-change:transform;filter:drop-shadow(0 3px 4px rgba(20,55,65,0.18));transition:filter .2s,opacity .2s}.swimmer:hover{filter:drop-shadow(0 3px 6px rgba(25,65,70,0.22)) brightness(1.05);z-index:2;opacity:1}.art{width:100%;height:100%;overflow:visible;display:block}.tail{transform-box:fill-box;transform-origin:right center;animation:tail .65s ease-in-out infinite alternate}.fin{transform-box:fill-box;transform-origin:top center;animation:fin 1.2s ease-in-out infinite alternate}.caught .tail{animation-duration:.12s}.caught{pointer-events:none}.bubble{position:absolute;border:1px solid #78bfc8aa;border-radius:50%;width:7px;height:7px}.toast{position:absolute;top:calc(100% + 5px);right:0;width:max-content;max-width:220px;background:none!important;border:none!important;box-shadow:none!important;padding:0!important;margin:0;pointer-events:none;font:11px/1.3 'Trebuchet MS',sans-serif;color:#183d36;text-shadow:0 1px 2px #ffffffee,0 0 6px #ffffffdd,0 0 1px #fff;animation:toast-pop .28s ease-out;z-index:10;text-align:right}.toast strong{display:block;font:bold 14px/1.2 Georgia,serif;color:#10312a;letter-spacing:.2px;text-shadow:0 1px 2px #ffffffee,0 0 7px #ffffffdd}.toast span{display:block;font-size:11px;color:#2c544d;white-space:normal;text-shadow:0 1px 2px #ffffffee,0 0 5px #ffffffdd}.toast .streak-pill{display:inline-block;margin-top:3px;font:500 10px 'Trebuchet MS',sans-serif;color:#355a4e;background:#e3eee7;border:1px solid #bdd1c5;border-radius:8px;padding:1px 6px;text-shadow:none}@keyframes toast-pop{from{opacity:0;transform:translateY(-3px)}to{opacity:1;transform:translateY(0)}}.ledger{pointer-events:auto;position:absolute;right:24px;top:155px;width:min(340px,calc(100vw - 32px));max-height:65vh;overflow:auto;padding:20px;background:#f4f8ed;border:1px solid #b3cdc4;border-radius:20px;color:#274950;box-shadow:0 12px 45px #133d4326;font:13px/1.5 'Trebuchet MS',sans-serif}.ledger h2{font:28px Georgia,serif;margin:0 0 3px}.ledger p{margin:0 0 13px;color:#547274}.entry{display:flex;align-items:center;gap:12px;border-top:1px solid #cedfd3;padding:7px 0}.entry svg{width:73px;height:53px;flex-shrink:0}.entry small{display:block;color:#587875;overflow-wrap:anywhere}.entry strong{font-size:14px}.empty{padding-top:15px}.catch-droplet{position:absolute;width:4px;height:4px;border-radius:50%;background:#86c3bf;pointer-events:none}.status{position:absolute;left:16px;bottom:16px;max-width:330px;padding:8px 13px;background:#fff6df;color:#5d4c23;border-radius:10px;font:13px 'Trebuchet MS',sans-serif}
    @keyframes tail{from{transform:perspective(80px) rotateY(-24deg) rotate(-7deg)}to{transform:perspective(80px) rotateY(27deg) rotate(7deg)}}@keyframes fin{to{transform:rotate(22deg)}}@media(max-width:520px){.rig{right:10px;transform:scale(.85);transform-origin:top right}.ledger{right:12px;top:140px}}@media(prefers-reduced-motion:reduce){.tail,.fin,.toast{animation:none}}
    .rig{transform:scale(.7);transform-origin:top right;right:16px;top:12px}.hint{background:transparent;border:0;box-shadow:none;color:#2d504a;font-size:12px}.ledger{top:117px}.swimmer{opacity:.94}.tail{animation-duration:1s}.fin{animation-duration:1.8s}.effort{position:absolute;bottom:0;left:50%;transform:translateX(-50%);font:10px 'Trebuchet MS',sans-serif;white-space:nowrap;color:#466a71;background:#f1f7f0e8;padding:3px 8px;border-radius:12px}.shark{opacity:.97}@media(max-width:520px){.rig{transform:scale(.62)}.ledger{top:105px}}
  </style><svg class="line" aria-hidden="true"><path class="thread aura" fill="none" stroke="transparent"/><path class="thread" fill="none" stroke="#f7fcf2" stroke-width="3" stroke-opacity=".65"/><path class="thread inner" fill="none" stroke="#527f86" stroke-width="1.2"/><g class="hook" visibility="hidden"><path d="M0 -9V3c0 11 13 11 13 0V-1l-4 4" fill="none" stroke="#496b72" stroke-width="2" stroke-linecap="round"/></g></svg><div class="fishes"></div><div class="effects"></div>
  <div class="rig"><div class="rod"><div class="rod-tip-aura" aria-hidden="true"><div class="tip-gyro ring-1"></div><div class="tip-gyro ring-2"></div><div class="tip-core"></div></div><svg viewBox="0 0 170 125" aria-hidden="true"><defs><linearGradient id="rod-metal" x2="1" y2="1"><stop stop-color="#d2d7c6"/><stop offset=".5" stop-color="#4a7374"/><stop offset="1" stop-color="#284f56"/></linearGradient></defs><g class="rod-assembly"><path class="pole" d="M138 97 Q85 51 15 17" fill="none" stroke="#3a6669" stroke-width="3.5" stroke-linecap="round"/><path class="pole-light" d="M138 97 Q85 51 15 17" fill="none" stroke="#aec5b1" stroke-width=".9"/><g class="guides" fill="none" stroke="#b8ae8b" stroke-width="1.5"><ellipse cx="18" cy="20" rx="3" ry="2"/><ellipse cx="51" cy="38" rx="3.5" ry="2.5"/><ellipse cx="86" cy="59" rx="4" ry="2.5"/></g><path d="M151 109L129 90" stroke="#8c6448" stroke-width="10" stroke-linecap="round"/><path d="M149 106L130 90" stroke="#c6a67a" stroke-width="6" stroke-linecap="round"/><path d="M137 94l-3 4m7 -1l-3 4m7 -1l-3 4" stroke="#967c59" stroke-width="1.4"/><path d="M129 96l-6 9" stroke="#638082" stroke-width="4"/><circle cx="122" cy="106" r="10" fill="url(#rod-metal)" stroke="#466b70" stroke-width="1.5"/><circle cx="122" cy="106" r="6" fill="#d5d5b9"/><g class="reel"><path d="M122 106l-14 4" stroke="#45676b" stroke-width="2.5"/><circle cx="108" cy="110" r="3" fill="#8b6950"/><circle cx="122" cy="106" r="2" fill="#56777a"/></g></g></svg></div><div class="bait-badge" hidden></div>
  <button class="bucket" aria-label="Open your bucket" aria-expanded="false"><div class="bucket-aura" aria-hidden="true"><div class="bucket-orbit-ring"><span class="bucket-orb orb-1"></span><span class="bucket-orb orb-2"></span><span class="bucket-orb orb-3"></span></div></div><svg viewBox="0 0 80 85" aria-hidden="true"><path d="M15 30C4 -2 75 -2 65 30" fill="none" stroke="#537d80" stroke-width="4"/><path d="M10 26L17 74Q40 88 63 74L70 26Z" fill="#639f9d" stroke="#376e76" stroke-width="2"/><path d="M17 31L23 70Q28 74 31 73L27 32Z" fill="#a9d6bd" opacity=".5"/><path d="M59 33L54 72" stroke="#397b83" stroke-width="3"/><ellipse cx="40" cy="26" rx="30" ry="8" fill="#315e67" stroke="#94c8b6" stroke-width="4"/><ellipse cx="40" cy="27" rx="24" ry="4" fill="#79baba"/><path d="M31 28q9 -5 17 0" fill="none" stroke="#d3f1d1" stroke-width="1.5"/></svg><span class="count">0</span><span class="toast" role="status" aria-live="polite" hidden></span></button><div class="lid"><button class="tool audio" aria-label="Mute audio" title="Sound: On (M)">${uiIcon('audioOn')}</button><button class="tool weather" aria-label="Toggle ambient weather" title="Weather: Daylight (W)"><svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v1.5m0 10v1.5m-6.5-6.5h1.5m10 0h1.5m-1.9-4.6l-1.1 1.1m-7 7l-1.1 1.1m0-9.2l1.1 1.1m7 7l1.1 1.1"/></svg></button><button class="tool pause" aria-label="Pause swimming" title="Pause swimming (P)">${uiIcon('pause')}</button><button class="tool close" aria-label="Close Page Fishing" title="Close (Esc)">${uiIcon('close')}</button></div><div class="hint">Spot a fish? Click to catch.</div></div><section class="ledger" aria-label="Your bucket" hidden><h2>Your bucket</h2><p class="summary"></p><div class="entries"></div></section><div class="companion-swimmer" hidden></div><div class="polaroid-overlay" hidden></div><div class="status" role="status" hidden></div>`;
  document.documentElement.append(host);
  updateThemeMode();
  const themeObserver=typeof MutationObserver!=='undefined'?new MutationObserver(updateThemeMode):null;
  try{
    if(themeObserver){
      if(document.documentElement)themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['class','style','data-theme']});
      if(document.body)themeObserver.observe(document.body,{attributes:true,attributeFilter:['class','style','data-theme']});
    }
  }catch{}
  const darkSchemeMedia=typeof matchMedia!=='undefined'?matchMedia('(prefers-color-scheme: dark)'):null;
  if(darkSchemeMedia?.addEventListener)darkSchemeMedia.addEventListener('change',updateThemeMode);
  const $ = s=>root.querySelector(s);
  const detailStyle=document.createElement('style');detailStyle.textContent=`
    .ledger{width:min(370px,calc(100vw - 32px));background:#f5f7ef}.tabs{display:flex;gap:5px;margin:12px 0}.tabs button,.release{border:1px solid #bcd1c6;background:#e8efe5;color:#385e5c;border-radius:9px;padding:8px 12px;font:12px 'Trebuchet MS',sans-serif}.tabs button[aria-selected=true]{background:#426f6c;color:#f4f7ec;border-color:#426f6c}.release{width:100%;margin:8px 0 4px;background:#dcebe4}.release:disabled{opacity:.5}.rarity{font:10px 'Trebuchet MS',sans-serif;color:var(--tier);display:inline-block;border:1px solid currentColor;border-radius:20px;padding:1px 6px;margin-top:3px}.index-entry{border-left:2px solid var(--tier);padding-left:9px}.release-bucket{position:absolute;pointer-events:none;width:80px;height:85px;left:0;top:0;filter:drop-shadow(0 12px 14px #264f4320)}.release-bucket svg{width:100%;height:100%}.released-fish{position:absolute;width:100px;height:70px;pointer-events:none;will-change:transform;left:0;top:0}.catalog-note{font-size:11px;color:#6b8480}.rod-assembly{transform-origin:145px 104px}.reel{transform-box:view-box;transform-origin:122px 106px}.art{filter:drop-shadow(0 1px 1px #385b4d15)}
    .tool.audio{font-size:13px;line-height:1}.water-ripple{position:absolute;width:44px;height:44px;border-radius:50%;border:1.5px solid #81c4c8;pointer-events:none;transform:translate(-50%,-50%);box-shadow:0 0 6px #a7e7e255}
    .sort-bar{display:flex;gap:5px;align-items:center;margin:0 0 10px;font:11px 'Trebuchet MS',sans-serif;color:#6b8277;flex-shrink:0}.sort-title{font-size:10px;text-transform:uppercase;letter-spacing:.5px;opacity:.8}
    .sort-btn{background:#e7ece0;border:1px solid #c2ceb9;border-radius:10px;color:#456353;padding:2px 8px;font:11px 'Trebuchet MS',sans-serif;cursor:pointer;transition:all .15s}.sort-btn:hover{background:#dbe4d2}.sort-btn[aria-pressed=true]{background:#497063;color:#fff8e7;border-color:#497063}
    .single-release{background:none;border:1px solid #bccdc2;border-radius:6px;color:#44695b;font:10px 'Trebuchet MS',sans-serif;padding:1px 6px;margin-top:3px;margin-left:4px;cursor:pointer;transition:all .15s}.single-release:hover{background:#dbe8dd}
    .trophy-badge{display:inline-block;font:bold 9px 'Trebuchet MS',sans-serif;color:#9b7227;background:#fff1ce;border:1px solid #e2cb92;border-radius:10px;padding:1px 5px;margin-left:4px}
    :host([data-dark="true"]) .toast{color:#e8fdf5!important;text-shadow:0 1px 3px #000,0 2px 8px rgba(0,0,0,0.95),0 0 14px rgba(0,0,0,0.9)!important}
    :host([data-dark="true"]) .toast strong{color:#ffffff!important;text-shadow:0 1px 3px #000,0 2px 9px rgba(0,0,0,0.95),0 0 16px rgba(110,225,200,0.6)!important}
    :host([data-dark="true"]) .toast span{color:#c5ece3!important;text-shadow:0 1px 3px #000,0 2px 7px rgba(0,0,0,0.95),0 0 10px rgba(0,0,0,0.9)!important}
    :host([data-dark="true"]) .toast .streak-pill{background:#302511!important;color:#fce396!important;border-color:#6c521f!important;box-shadow:0 2px 6px rgba(0,0,0,0.6)!important}
    :host([data-dark="true"]) .hint{color:#e0f4ee!important;text-shadow:0 1px 3px #000,0 2px 8px rgba(0,0,0,0.95),0 0 12px rgba(0,0,0,0.9)!important}
    :host([data-dark="true"]) .gear-grip{color:#a9d5cb!important;text-shadow:0 1px 3px #000!important}
    :host([data-dark="true"]) .lid .tool{background:#162b24!important;border-color:#385e53!important;color:#daf3ec!important;box-shadow:0 2px 8px rgba(0,0,0,0.5)}
    :host([data-dark="true"]) .lid .tool:hover{background:#234438!important;color:#ffffff!important;border-color:#528373!important}
    :host([data-dark="true"]) .bait-badge{background:#251f13!important;color:#fce396!important;border-color:#5f4b20!important;box-shadow:0 2px 8px rgba(0,0,0,0.6)!important}
    :host([data-dark="true"]) .effort{background:#182b24f0!important;color:#aee2d5!important;border:1px solid #32564a}
    .book-filters{display:flex;justify-content:center;gap:6px;margin:0 0 10px;flex-wrap:wrap}
    .book-filter-btn{background:#e7ece0;border:1px solid #c2ceb9;border-radius:14px;color:#456353;padding:2px 10px;font:11px 'Trebuchet MS',sans-serif;cursor:pointer;transition:all .15s}
    .book-filter-btn:hover{background:#dbe4d2}
    .book-filter-btn[aria-pressed=true]{background:#497063;color:#fff8e7;border-color:#497063;font-weight:600}
    .habitat-badge{display:inline-block;font:9px 'Trebuchet MS',sans-serif;color:#45675c;background:#e2ece0;border:1px solid #c3d1bf;border-radius:10px;padding:1px 6px;margin-left:4px}
  `;root.append(detailStyle);
  const tabs=document.createElement('div');tabs.className='tabs';tabs.innerHTML='<button class="bucket-tab" aria-selected="true">Bucket</button><button class="index-tab" aria-selected="false">Fish index</button><button class="shop-tab" aria-selected="false">Tackle shop</button><button class="rewards-tab" aria-selected="false">Rewards</button>';
  $('.summary').after(tabs);
  const sortBar=document.createElement('div');sortBar.className='sort-bar';sortBar.innerHTML='<span class="sort-title">Sort:</span><button class="sort-btn" data-sort="latest" aria-pressed="true">Latest</button><button class="sort-btn" data-sort="largest" aria-pressed="false">Largest</button><button class="sort-btn" data-sort="rarity" aria-pressed="false">Rarity</button>';
  tabs.after(sortBar);
  let currentSort='latest';
  sortBar.querySelectorAll('.sort-btn').forEach(btn=>{btn.onclick=()=>{currentSort=btn.dataset.sort;sortBar.querySelectorAll('.sort-btn').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));renderBucket();};});
  const closeBook=document.createElement('button');closeBook.className='close-book';closeBook.setAttribute('aria-label','Close collection');closeBook.title='Close (Esc)';closeBook.innerHTML='<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8"/></svg>';$('.ledger').prepend(closeBook);closeBook.onclick=()=>{$('.ledger').hidden=true;$('.bucket').setAttribute('aria-expanded','false');};
  const releaseButton=document.createElement('button');releaseButton.className='release';releaseButton.textContent='Release bucket';$('.entries').before(releaseButton);
  let alive=true, paused=false, frame, last=performance.now(), spawnClock=0, busy=false, catchMotion=null, toastUntil=0;
  const fish=[], animations=new Set();
  const storage = typeof chrome!=='undefined' && chrome.storage?.local;
  let records=[],indexOpen=false,rewardsOpen=false,shopOpen=false,releaseMotion=null,svgId=0,bookPage=0,rewards={},visitedCoffeeLink=false;
  let pearls=0,catchStreak=0,lastCatchTime=0,bookFilter='all',ownedSkins=new Set(['rod_classic','line_mono','bucket_seafoam']),equippedSkins={rod:'rod_classic',line:'line_mono',bucket:'bucket_seafoam'},activeBait=null,activeCompanion=null,companionX=innerWidth-90,companionY=60,lastPointerX=innerWidth/2,lastPointerY=innerHeight/2,lastPointerTime=0;
  const shopCatalog=[
    {id:'rod_classic',slot:'rod',name:'Classic Birch',price:0,desc:'Light birch wood with warm brass reel fittings.',color:'#c29b6f'},
    {id:'rod_bamboo',slot:'rod',name:'Bamboo Cane',price:40,desc:'Segmented golden cane with spirit nature gyro-halo & drifting spore motes.',color:'#c4a45a'},
    {id:'rod_copper',slot:'rod',name:'Copper Shore',price:90,desc:'Burnished copper with molten forge sunburst gyro-halo & traveling metallic gleam.',color:'#b55a30'},
    {id:'rod_moon',slot:'rod',name:'Moonstone Rod',price:180,desc:'Silvery-blue rod with celestial starlight gyro-halo, astral sparkles, & glowing moonstone reel gem.',color:'#688bb2'},
    {id:'rod_abyssal',slot:'rod',name:'Abyssal Carbon',price:320,desc:'Charcoal graphite weave with dual electric cyan gyro-rings & crackling lightning motes.',color:'#1a2228'},
    {id:'line_mono',slot:'line',name:'Monofilament',price:0,desc:'Traditional supple seafoam angling line with water sheen.',color:'#7ab2b0'},
    {id:'line_gold',slot:'line',name:'Golden Twine',price:50,desc:'Spun gold twine with traveling dashed glints, golden strike shockwaves, & gilded spark burst.',color:'#e5ad24'},
    {id:'line_starlight',slot:'line',name:'Starlight Silk',price:110,desc:'Radiant cosmic starlight cord with flowing energy pulse, starburst shockwaves, & stardust motes.',color:'#d8eaff'},
    {id:'line_neon',slot:'line',name:'Neon Aqua',price:170,desc:'Hyper-charged cyber laser beam with pulsating aura, streaming white core, & cyan plasma burst.',color:'#00f7ff'},
    {id:'bucket_seafoam',slot:'bucket',name:'Seafoam Tin',price:0,desc:'Classic vintage teal enamel painted fishing bucket with crisp splash droplets.',color:'#639f9d'},
    {id:'bucket_wicker',slot:'bucket',name:'Woven Creel',price:60,desc:'Traditional rattan wicker creel with orbiting glowing fireflies & fresh river splash.',color:'#9c7344'},
    {id:'bucket_cedar',slot:'bucket',name:'Cedar Barrel',price:130,desc:'Aromatic cedar barrel staves with orbiting warm embers & golden amber splash.',color:'#663322'},
    {id:'bucket_pearl',slot:'bucket',name:'Pearl Basin',price:230,desc:'Iridescent mother-of-pearl basin with orbiting relic pearls, luster aura, & prismatic splash.',color:'#c8d9e6'},
    {id:'bait_krill',slot:'bait',name:'Glowing Krill (3x)',price:25,desc:'Sweet bait: guarantees next 3 catches are Uncommon or higher.',color:'#ff7755',count:3},
    {id:'bait_nectar',slot:'bait',name:'Golden Nectar (3x)',price:60,desc:'Deep ocean scent: guarantees next 3 catches are Rare or Legendary.',color:'#f5b025',count:3}
  ];
  function pearlValue(r){
    const tier=tierOf(r), size=r.size||15;
    if(tier==='Legendary') return Math.round(65+size*0.4);
    if(tier==='Rare') return Math.round(20+size*0.25);
    if(tier==='Uncommon') return Math.round(7+size*0.15);
    return Math.round(2+size*0.08);
  }
  const rewardCatalog=[
    ['bubbles',3,'Bubble trails','effects','#a6d1cc','Tiny bubbles trail behind swimming creatures.'],
    ['bucket',5,'Reed bucket','bucket','#b4aa70','A warm reed-colored finish for your bucket.'],
    ['coralBook',8,'Coral book','book','#d0a58e','Warm coral binding and peach-tinted pages.'],
    ['rod',10,'Copper rod','rod','#ba8965','A copper-colored finish for your fishing rod.'],
    ['pearlBucket',14,'Pearl bucket','bucket','#d1dde2','A pale silver finish for your bucket.'],
    ['glow',18,'Moonlit creatures','effects','#b7cbd9','A soft glow around your swimming visitors.'],
    ['book',20,'Ocean book','book','#789bad','Blue binding and cool ocean-colored pages.'],
    ['moonRod',24,'Moonstone rod','rod','#96aecf','A cool silver-blue finish for your rod.'],
    ['crest',28,'Collector’s crest','badge','#cdb16a','A golden star beside your bucket: every species discovered.']
  ];
  // Everything caught remains in the field guide; released catches leave the bucket only.
  function report(text){$('.status').hidden=false;$('.status').textContent=text;}
  const ready=(async()=>{try{const stored=storage?(await chrome.storage.local.get('pageFishingCatches')).pageFishingCatches:JSON.parse(localStorage.getItem('pageFishingCatches')||'[]');records=Array.isArray(stored)?stored:[];renderBucket();}catch{report('Collection unavailable. You can still catch fish.');}})();
  function illustration(kind,palette,pattern=0,rare=false){
    const template=document.createElement('template');template.innerHTML=drawCreature(kind,palette,pattern,rare);const svg=template.content.firstElementChild;
    svg.dataset.creature=String(kind);
    svg.querySelectorAll('.fin').forEach((fin,i)=>{fin.style.setProperty('--limb-delay',`${-i*.35}s`);if([12,14,15,21,22,23,25].includes(kind))fin.querySelectorAll('path').forEach((part,n)=>{part.classList.add('limb');part.style.setProperty('--limb-delay',`${-n*.27}s`);});});
    if(kind===10){svg.querySelectorAll('path').forEach((part,i)=>{if(i<3)part.classList.add('ray-wing');});}
    if([13,14,16,21,22,26].includes(kind)){svg.querySelectorAll('path[fill="none"]').forEach((part,i)=>{part.classList.add('trailing');part.style.setProperty('--limb-delay',`${-i*.3}s`);});}
    svg.querySelectorAll('circle[fill="#304f5b"],ellipse[fill="#254650"],circle[fill="#254650"]').forEach((eye,i)=>{eye.classList.add('creature-eye');eye.style.setProperty('--blink-delay',`${((kind*1.7+i*0.9+pattern*2.3)%6).toFixed(1)}s`);});
    return svg.outerHTML;
  }
  function drawCreature(kind,palette,pattern=0,rare=false){
    const [,a,b]=palette;
    const eye=(cx,cy,r=3)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#254650"/><circle cx="${cx+r*0.28}" cy="${cy-r*0.28}" r="${r*0.35}" fill="#ffffff"/>`;
    const crown=rare?'<path d="M57 14l2 -8 7 6 7 -6 2 10" fill="#ffe09a" stroke="#b99645" stroke-width="1.4"/>':'';
    if(kind>=12){
      const eyeL=(x,y)=>`<circle cx="${x}" cy="${y}" r="3" fill="#304f5b"/><circle cx="${x+.8}" cy="${y-1}" r="1" fill="white"/>`;
      const art={
        20:`<g class="star-body"><path d="M63 7L77 29L105 29L84 48L92 73L64 59L38 73L44 46L21 28L50 28Z" fill="${a}" stroke="${b}" stroke-width="2.5" stroke-linejoin="round"/><path d="M63 16L64 47M29 31L64 47L95 33M46 64L64 47L84 65" fill="none" stroke="${b}" stroke-width="2.5" stroke-linecap="round"/><g fill="#fff" opacity=".65"><circle cx="63" cy="18" r="1.8"/><circle cx="63" cy="27" r="1.8"/><circle cx="63" cy="36" r="1.8"/><circle cx="35" cy="32" r="1.8"/><circle cx="45" cy="37" r="1.8"/><circle cx="91" cy="34" r="1.8"/><circle cx="81" cy="39" r="1.8"/><circle cx="48" cy="62" r="1.8"/><circle cx="54" cy="54" r="1.8"/><circle cx="80" cy="63" r="1.8"/><circle cx="74" cy="55" r="1.8"/><circle cx="64" cy="47" r="2.8" fill="${b}" opacity=".9"/><circle cx="64" cy="47" r="1.2" fill="#fff"/></g>${eyeL(57,41)}${eyeL(72,41)}</g>`,
        21:`<path class="tail" d="M29 40L8 21L9 42L21 54" fill="${b}"/><path d="M21 42Q45 12 81 27Q102 35 94 49Q84 68 56 62L49 50Q77 57 80 44Q66 28 35 48Z" fill="${a}"/><path d="M38 31l8 16m6 -22l6 19m9 -19l2 17" stroke="${b}" stroke-width="3"/><path class="fin" d="M66 58l-7 14m13 -12l-1 15m7 -17l5 12" stroke="${a}" stroke-width="2"/><path d="M91 30Q117 0 116 19m-23 15q32 -5 24 12" fill="none" stroke="${a}" stroke-width="1.4"/>${eyeL(94,34)}`,
        22:`<path d="M22 39L46 8L55 31M22 40L48 72L56 50" fill="${b}"/><path d="M20 40Q51 13 83 29Q101 39 84 52Q48 66 20 40" fill="${a}"/><path d="M32 36Q53 26 73 32" fill="none" stroke="${b}" stroke-width="2"/><g class="fin" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round"><path d="M86 33q30 -20 31 -4M90 37q34 -8 27 5M90 43q28 7 24 15M85 48q25 25 32 15"/></g>${eyeL(80,37)}`,
        23:`<path class="tail" d="M50 45L24 31L21 47L38 59" fill="${b}"/><path d="M36 43Q59 16 82 32Q100 49 82 62Q62 72 36 43" fill="${a}"/><path d="M51 34l10 25m1 -30l11 30" stroke="${b}" stroke-width="3"/><g class="fin" stroke="${a}" stroke-width="3" fill="none"><path d="M73 50l13 24m-23 -19l4 20M86 43L103 23m-16 25l25 7"/></g><path d="M100 26Q85 1 112 9L107 17L117 10Q127 28 100 26M109 56Q96 72 117 74L113 65L122 70Q126 55 109 56" fill="${b}"/>${eyeL(91,37)}`,
        24:`<path class="tail" d="M35 48L12 30L17 48L7 63L36 56" fill="#8fadb4"/><path d="M26 48Q43 24 81 30Q101 2 113 28Q130 57 104 61Q56 71 26 48" fill="#a9bfc1"/><path class="fin" d="M73 53Q45 78 43 62L62 46" fill="#7e9fa8"/><ellipse cx="109" cy="44" rx="9" ry="7" fill="#dfe6df"/><path d="M110 39l3 1 -2 3" fill="#476574"/><path d="M109 46l-16 -2m17 4l-17 3m21 -4l9 3" stroke="#6c8b90" stroke-width="1"/>${eyeL(106,30)}`,
        25:`<g class="fin" fill="#4c6979"><path d="M43 37Q7 45 23 54L47 49M79 36Q115 39 103 53L79 49"/></g><path d="M37 40Q34 7 63 8Q92 11 87 43Q86 70 60 71Q35 67 37 40" fill="#526e80"/><ellipse cx="62" cy="47" rx="20" ry="23" fill="#edf0df"/><path d="M81 28L103 36L81 40" fill="#d0a96e"/><path d="M47 69l-10 8h21m11 -8l-1 8h21" fill="#c49e68"/>${eyeL(77,25)}`,
        26:`<path class="tail" d="M43 47Q10 10 12 42Q14 67 49 58" fill="${b}"/><path d="M33 45Q61 29 90 37L91 59Q59 73 33 45" fill="${a}"/><path d="M36 43Q60 25 88 34" fill="none" stroke="${b}" stroke-width="3" opacity=".6"/><g class="gills"><path d="M86 31l-10 -18m2 4l-4 -2m5 6l-4 -2m5 6l-4 -2" stroke="${b}" stroke-width="2.2" stroke-linecap="round"/><path d="M92 28l-2 -20m1 5l5 -3m-4 7l5 -3m-4 7l5 -3" stroke="${b}" stroke-width="2.2" stroke-linecap="round"/><path d="M98 32l16 -14m-4 2l5 3m-7 4l5 3m-7 4l5 3" stroke="${b}" stroke-width="2.2" stroke-linecap="round"/></g><ellipse cx="97" cy="42" rx="20" ry="16" fill="${a}"/><ellipse cx="90" cy="45" rx="3.5" ry="2.2" fill="#ff7f9d" opacity=".6"/><ellipse cx="106" cy="45" rx="3.5" ry="2.2" fill="#ff7f9d" opacity=".6"/><path class="fin" d="M53 51L43 68L35 68M76 56l-2 15 10 1" fill="none" stroke="${a}" stroke-width="4.5" stroke-linecap="round"/><path d="M94 48q6 4 12 0" fill="none" stroke="#794862" stroke-width="1.8" stroke-linecap="round"/>${eyeL(92,38)}${eyeL(109,38)}`,
        27:`<path class="fin" d="M50 25L72 1L78 29M51 55L71 79L79 52" fill="#90a9ad"/><path d="M34 22Q66 5 92 25Q112 46 88 63Q52 78 34 58L44 42Z" fill="#b2c3be"/><path d="M44 28q21 -15 42 5" fill="none" stroke="#dfe5cf" stroke-width="4"/><path d="M35 26L23 19L23 61L36 58" fill="#829fa8"/><path d="M80 43q-7 11 0 14" stroke="#8ca4a2" fill="none"/>${eyeL(91,35)}<path d="M100 47h8" stroke="#6b8587" stroke-width="2"/>`,
        12:`<g class="fin" fill="#92b4a0"><path d="M47 28Q25 6 24 25L39 39M51 51Q25 72 29 54L41 43M79 27Q92 7 95 26L85 37M78 52Q89 74 95 56L86 43"/></g><ellipse cx="62" cy="40" rx="28" ry="24" fill="#668d78"/><ellipse cx="62" cy="40" rx="25" ry="21" fill="none" stroke="#d5e5cf" stroke-width="1.2" opacity=".7"/><path d="M48 26L67 20L79 34L74 52L54 58L43 43Z" fill="#adc1a0" stroke="#496f61" stroke-width="2"/><path d="M48 26l26 26m-31 -9l36 -9m-12 -14l-13 38" stroke="#648975" fill="none"/><ellipse cx="97" cy="39" rx="12" ry="10" fill="#92b4a0"/><path d="M106 41q3 2 4 0" stroke="#466759" stroke-width="1.2" fill="none"/>${eyeL(101,36)}`,
        13:`<g class="fin" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round"><path d="M42 41q-14 18 -1 29m12 -27q-8 14 2 29m9 -28q12 19 -1 29m13 -31q20 16 6 27"/></g><ellipse cx="64" cy="26" rx="20" ry="14" fill="#fff" opacity=".25"/><path d="M30 43Q29 5 64 8Q97 10 95 43Q81 53 30 43Z" fill="${a}" opacity=".8"/><path d="M40 39Q40 13 63 15Q83 15 85 39" fill="none" stroke="${b}" stroke-width="3"/><path d="M32 43q9 -10 17 0q9 -10 17 0q9 -10 17 0q9 -10 12 0" fill="${b}"/><g fill="#fff" opacity=".8"><circle cx="40" cy="43" r="1"/><circle cx="57" cy="43" r="1"/><circle cx="74" cy="43" r="1"/><circle cx="91" cy="43" r="1"/></g>${eyeL(56,32)}${eyeL(73,32)}`,
        14:`<g class="fin" fill="none" stroke="${a}" stroke-width="7" stroke-linecap="round"><path d="M42 44Q12 48 22 65Q35 71 35 57M52 47Q36 77 50 72L56 58M65 48Q60 76 74 72L76 58M77 44Q110 46 99 64Q88 71 87 56"/></g><path d="M36 38Q26 8 61 7Q96 7 87 39L80 52H45Z" fill="${a}"/><path d="M43 23Q43 12 60 13" stroke="${b}" stroke-width="4" stroke-linecap="round" fill="none"/>${eyeL(53,37)}${eyeL(74,37)}<path d="M59 45q5 4 9 0" stroke="#5d7075" fill="none"/>`,
        15:`<g class="fin" fill="none" stroke="${a}" stroke-width="4" stroke-linecap="round"><path d="M40 42L20 35L12 44m29 4L17 49L12 60m32 -7L28 67M80 42l20 -7 10 9m-31 4l24 1 8 11m-34 -7l18 14M39 33L26 22L18 28m63 5l16 -11 8 6"/></g><path d="M38 27Q62 12 85 28L87 48Q65 65 35 48Z" fill="${a}"/><path d="M47 29q16 -9 29 0" stroke="${b}" stroke-width="3" fill="none"/><path d="M23 23Q2 4 9 26L18 32Z M99 23Q121 4 114 26L105 32Z" fill="${b}"/>${eyeL(50,25)}${eyeL(75,25)}`,
        16:`<path class="fin" d="M78 44q40 -13 35 4q-13 18 -32 13m1 -7q21 14 19 18m-14 -23q31 -14 26 -22" fill="none" stroke="${a}" stroke-width="3"/><circle cx="56" cy="38" r="29" fill="${b}" stroke="${a}" stroke-width="2"/><path d="M73 50C39 75 16 22 52 17C83 11 87 56 57 53C36 51 43 27 58 29C72 33 64 47 55 41" fill="none" stroke="${a}" stroke-width="4"/>${eyeL(85,43)}`,
        17:`<g class="tail"><path d="M36 43L8 25L15 43L5 59Z" fill="#87afb9"/></g><path d="M28 43Q40 9 78 24Q93 25 97 35L117 40L99 46Q72 65 28 43Z" fill="#86aab7"/><path d="M29 44Q73 53 112 41Q87 64 50 53" fill="#d3e2e0"/><path d="M54 27L67 9L75 26" fill="#6f97a6"/><path class="fin" d="M70 44L53 68L81 49" fill="#719ba8"/>${eyeL(93,36)}`,
        18:`<g class="tail"><path d="M32 40L8 14L15 40L7 65Z" fill="#608b9a"/></g><path d="M24 40Q54 9 100 26Q119 32 119 43Q108 64 64 56Z" fill="#729ca8"/><path d="M26 42Q75 60 118 43Q100 72 50 52" fill="#c6dada"/><path d="M54 25L68 7L77 26" fill="#527e90"/><path class="fin" d="M68 46L48 70L83 50" fill="#628c9a"/><g fill="#e3eddf">${Array.from({length:14},(_,i)=>`<circle cx="${40+(i%7)*9}" cy="${30+Math.floor(i/7)*11}" r="1.8"/>`).join('')}</g>${eyeL(108,36)}`,
        19:`<g class="tail"><path d="M37 43Q11 23 5 28L15 45L7 60Q27 62 37 46" fill="#8a9cba"/></g><path d="M29 44Q36 9 78 14Q117 15 117 42Q115 65 80 64Q43 64 29 44" fill="#9cacca"/><path d="M35 46Q84 68 117 42Q112 72 71 63" fill="#e1e3ed"/><path class="fin" d="M74 46Q48 51 58 69Q81 63 88 51" fill="#7f94b8"/><path d="M105 48q6 2 10 -1" stroke="#657b9c" fill="none"/>${eyeL(105,36)}<path d="M68 16q-14 -22 -25 -7m25 7q10 -27 22 -16" stroke="#b6d5da" stroke-width="2" fill="none"/><path d="M59 27l2 -5 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2Z" fill="#f2e9b9"/>`
      }[kind];
      return `<svg class="art" viewBox="0 0 124 80" aria-hidden="true">${art}${crown}</svg>`;
    }
    if(kind===6)return `<svg class="art" viewBox="0 0 124 80" aria-hidden="true"><g class="tail"><path d="M37 42L9 18L15 41L7 61Z" fill="#8babb5"/><path d="M18 41L10 57" stroke="#d4e3e3" stroke-width="2"/></g><path d="M47 33L65 7Q75 19 76 31" fill="#779aa8"/><path d="M28 42Q52 20 87 31L116 44Q100 49 89 54Q50 67 28 42Z" fill="#91aeb8"/><path d="M32 44Q70 52 116 44Q97 62 57 56Z" fill="#d8e6e4"/><path class="fin" d="M66 45L50 69Q74 65 82 47" fill="#7d9faa"/><path d="M82 37l-3 10m-3 -11l-3 10m-3 -11l-3 10" stroke="#5b7d8a" stroke-width="1.3"/>${eye(98,39,3)}<path d="M98 49l9 -1" stroke="#66838d" fill="none" stroke-linecap="round"/>${crown}</svg>`;

    const artSpecies={
      0:`<g class="tail"><path d="M38 40 L10 16 Q5 40 10 64 Z" fill="${b}"/><path d="M38 40 L12 24 M38 40 L10 40 M38 40 L12 56" stroke="#ffffff55" stroke-width="1"/></g><path class="fin" d="M50 26 Q62 16 68 28" fill="${b}"/><path d="M36 40 Q54 22 82 29 Q100 37 88 47 Q56 57 36 40" fill="${a}"/><path d="M46 38 Q66 30 84 37" fill="none" stroke="#ffffff55" stroke-width="1.8"/><path class="fin" d="M68 44 Q56 48 64 57 Q74 54 74 44" fill="${b}" opacity=".85"/><path d="M96 42 l-3 2" stroke="#254650" stroke-width="1.2" stroke-linecap="round"/>${eye(86,35,3.2)}`,
      1:`<g class="tail"><path d="M42 40 L18 20 L24 40 L18 60 Z" fill="${b}"/></g><path class="fin" d="M52 24 L68 1 L78 28" fill="${b}"/><path d="M52 56 L68 79 L76 52" fill="${b}"/><path class="trailing" d="M72 54 Q68 72 62 80" stroke="${b}" stroke-width="1.6" fill="none"/><path d="M40 40 L64 16 Q88 28 92 40 Q88 52 64 64 Z" fill="${a}"/><path d="M58 20 L58 60 M72 26 L72 54" stroke="${b}" stroke-width="3" opacity=".6"/><path class="fin" d="M66 42 Q58 48 66 54" fill="${b}" opacity=".7"/><path d="M92 40 l4 1 -4 2" fill="${a}"/>${eye(82,36,3)}`,
      2:`<g class="tail"><path d="M39 40 L19 28 L23 40 L19 52 Z" fill="${b}"/></g><g class="puffer-body"><circle cx="64" cy="40" r="26" fill="${a}"/><ellipse cx="64" cy="48" rx="20" ry="14" fill="${b}" opacity=".28"/><g stroke="${a}" stroke-width="2.5" stroke-linecap="round"><path d="M44 24l-6 -6m20 2v-7m20 6l6 -6m12 18l7 -1m-4 16l6 5m-18 13l4 6m-24 2v6m-20 -4l-5 5m-8 -15l-7 -1m4 -16l-6 -5"/></g></g><path class="fin" d="M48 24 Q54 18 58 26" fill="${b}"/><path class="fin" d="M70 42 Q62 46 68 53" fill="${b}" opacity=".8"/><path d="M89 40 q3 2 0 4" stroke="#254650" stroke-width="1.8" fill="none"/>${eye(78,33,3.4)}`,
      3:`<g class="tail"><path d="M22 39 L4 39 L12 43 Z" fill="${b}"/></g><path d="M18 39 Q44 24 78 30 Q106 36 104 43 Q76 49 18 41" fill="${a}"/><path class="fin" d="M22 38 Q58 22 96 32" stroke="${b}" stroke-width="2" fill="none"/><g class="crest"><path d="M92 32 L94 14 M97 33 L100 11 M101 34 L106 13" stroke="${b}" stroke-width="1.8" stroke-linecap="round"/></g><path d="M24 40 Q55 30 92 36" stroke="#ffffff66" stroke-width="1.2" fill="none"/>${eye(96,37,3)}`,
      4:`<g class="tail"><path d="M38 40 L16 26 Q12 40 16 54 Z" fill="${b}"/><path d="M16 26 Q12 40 16 54" stroke="#ffffff77" stroke-width="1.5" fill="none"/></g><path d="M36 40 Q46 16 72 20 Q92 28 92 40 Q92 52 70 60 Q46 64 36 40" fill="${a}"/><path d="M88 36 L104 41 L88 45 Z" fill="${a}"/><path d="M78 18 L76 48" stroke="#254650" stroke-width="3.5" opacity=".7"/><path class="fin" d="M50 20 Q66 12 76 22" fill="${b}"/><path class="fin" d="M64 42 Q56 48 64 54" fill="${b}" opacity=".85"/>${eye(78,33,3)}`,
      5:`<g class="tail"><path d="M37 40 L12 21 L19 40 L12 59 Z" fill="${b}"/></g><path d="M35 40 Q52 20 82 26 Q102 32 102 44 Q80 62 48 54 Z" fill="${a}"/><g class="photophores" fill="#7dffeb"><circle cx="46" cy="51" r="1.5"/><circle cx="54" cy="53" r="1.5"/><circle cx="62" cy="53" r="1.5"/><circle cx="70" cy="51" r="1.5"/><circle cx="78" cy="47" r="1.5"/></g><g class="lantern-stalk"><path d="M82 27 C80 12 91 3 100 5 C105 6 107 10 106 14" fill="none" stroke="${a}" stroke-width="2.5" stroke-linecap="round"/><g class="lantern-glow"><circle cx="106" cy="14" r="8" fill="#7ffff0" opacity=".25"/><circle cx="106" cy="14" r="5" fill="#a4fff3" opacity=".6"/><circle cx="106" cy="14" r="2.5" fill="#ffffff"/></g></g>${eye(88,34,4)}`,
      7:`<g class="tail"><path d="M34 41 Q14 22 8 27 Q18 41 8 55 Q14 60 34 41" fill="${b}"/></g><path d="M30 41 Q56 16 90 28 Q108 38 94 48 Q58 64 30 41" fill="${a}"/><path d="M50 24 Q68 18 78 28 Q66 38 52 32 Z" fill="${b}" opacity=".8"/><g class="trailing"><path d="M98 42 Q106 46 102 52" stroke="${b}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M96 44 Q102 50 100 56" stroke="${b}" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><path class="fin" d="M68 44 Q54 50 62 62 Q76 56 74 44" fill="${b}" opacity=".85"/>${eye(86,33,3.2)}`,
      8:`<g class="tail"><path d="M38 40 Q16 4 2 16 Q18 40 2 64 Q16 76 38 42" fill="${b}" opacity=".75"/><path d="M38 40 Q22 18 10 24 Q24 40 10 56 Q22 62 38 42" fill="${b}" opacity=".9"/><path d="M38 40 L6 18 M38 40 L4 40 M38 40 L6 62" stroke="#ffffff55" stroke-width="1"/></g><path d="M36 40 Q48 18 78 25 Q100 32 94 44 Q80 62 44 54 Z" fill="${a}"/><path class="fin" d="M48 24 Q64 8 74 24" fill="${b}" opacity=".85"/><path class="fin" d="M56 46 Q46 62 60 66 Q72 58 70 46" fill="${b}" opacity=".8"/>${eye(82,33,3.2)}`,
      9:`<g class="tail"><path d="M60 48 Q42 66 58 74 Q74 80 72 68 Q70 60 62 62" fill="none" stroke="${a}" stroke-width="6" stroke-linecap="round"/></g><path d="M84 20 Q70 10 64 26 Q56 42 66 50 Q78 56 68 64" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/><path d="M84 22 L104 26 L104 31 L84 27 Z" fill="${a}"/><g class="crest"><path d="M78 18 L74 10 L80 13 L84 8 L87 13 L91 9 L90 17" fill="${b}" stroke="${a}" stroke-width=".8"/></g><g class="dorsal-flutter"><path d="M56 36 Q44 40 46 50 Q56 48 56 36" fill="${b}" opacity=".9"/><path d="M55 38 l-6 4 m7 2 l-6 5 m7 2 l-5 3" stroke="#ffffff" stroke-width=".8" opacity=".7"/></g><g stroke="${b}" stroke-width="1.8" fill="none"><path d="M64 32 l6 4"/><path d="M61 38 l8 4"/><path d="M60 44 l8 4"/></g>${eye(78,22,2.8)}`,
      10:`<g class="ray-wing"><path d="M30 40 L60 8 Q82 24 94 36 L60 72 Z" fill="${a}"/><path d="M52 24 Q72 32 86 38 M52 56 Q72 48 86 42" stroke="#ffffff88" stroke-width="2" fill="none" stroke-linecap="round"/></g><path class="trailing" d="M30 40 Q15 42 2 44" fill="none" stroke="${a}" stroke-width="2.2" stroke-linecap="round"/><g class="cephalic-fins"><path d="M96 28 Q106 24 104 32 Q98 34 94 30" fill="${b}"/><path d="M96 48 Q106 52 104 44 Q98 42 94 46" fill="${b}"/></g><path d="M42 40 Q62 32 80 36 M42 40 Q62 48 80 44" stroke="${b}" stroke-width="3" opacity=".6" fill="none"/>${eye(86,26,2.5)}${eye(86,54,2.5)}`,
      11:`<path d="M26 41 Q50 20 86 32 L106 38 L88 44 Q56 58 26 41" fill="${a}"/><path d="M104 37 L116 39 L104 41 Z" fill="${a}"/><g class="fin" fill="${b}"><path d="M42 28 Q30 6 56 16 L62 25"/><path d="M58 22 Q64 2 78 22"/><path d="M38 48 Q30 72 58 54"/><path d="M68 50 Q78 74 88 48"/></g><g class="tail"><path d="M26 41 Q12 30 6 36 Q16 41 8 48 Q14 52 26 41" fill="${b}"/></g>${eye(86,34,2.6)}`
    }[kind] || '';
    return `<svg class="art" viewBox="0 0 124 80" aria-hidden="true">${artSpecies}${crown}</svg>`;
  }
  function renderBucket(){
    renderRewards();
    const held=records.filter(r=>!r.released),unique=new Set(records.map(speciesKey)).size;
    $('.count').textContent=held.length;$('.bucket').setAttribute('aria-label',`Open bucket: ${held.length} fish`);
    $('.ledger h2').textContent=shopOpen?'Tackle boutique':rewardsOpen?'Discovery rewards':indexOpen?'Fish index':'Your bucket';
    $('.summary').textContent=shopOpen?`${pearls} pearls in pouch · customize your gear`:rewardsOpen?`${new Set(records.map(r=>r.kind??0)).size} / ${forms.length} species discovered · permanent unlocks`:indexOpen?`${unique} varieties discovered · ${new Set(records.map(r=>r.kind??0)).size} / ${forms.length} species`:`${held.length} fish · ${habitat} · ${pearls} pearls`;
    $('.bucket-tab').setAttribute('aria-selected',String(!indexOpen&&!rewardsOpen&&!shopOpen));$('.index-tab').setAttribute('aria-selected',String(indexOpen));$('.shop-tab').setAttribute('aria-selected',String(shopOpen));$('.rewards-tab').setAttribute('aria-selected',String(rewardsOpen));
    if($('.shop-panel'))$('.shop-panel').hidden=!shopOpen;
    if($('.reward-panel'))$('.reward-panel').hidden=!rewardsOpen;
    $('.entries').hidden=rewardsOpen||shopOpen;
    sortBar.hidden=indexOpen||rewardsOpen||shopOpen;
    releaseButton.hidden=indexOpen||rewardsOpen||shopOpen;releaseButton.disabled=busy||!held.length;
    $('.ledger').classList.toggle('book-open',indexOpen);
    $('.ledger').classList.toggle('rewards-open',rewardsOpen);
    $('.ledger').classList.toggle('shop-open',shopOpen);
    const entries=$('.entries');entries.replaceChildren();
    if(shopOpen){renderShop();return;}
    if(rewardsOpen)return;
    if(indexOpen){renderBook(entries);$('.ledger').scrollTop=0;return;}
    const counts=new Map();for(const r of records)counts.set(speciesKey(r),(counts.get(speciesKey(r))||0)+1);
    const maxSizes=new Map();for(const item of records){const k=item.kind??0;maxSizes.set(k,Math.max(maxSizes.get(k)||0,item.size||0));}
    let display=indexOpen?[...new Map(records.map(r=>[speciesKey(r),r])).values()]:held.slice();
    if(!indexOpen){
      if(currentSort==='largest')display.sort((a,b)=>(b.size||0)-(a.size||0));
      else if(currentSort==='rarity')display.sort((a,b)=>tiers.indexOf(tierOf(b))-tiers.indexOf(tierOf(a)));
      else display.reverse();
    }else display.reverse();
    if(!display.length){const p=document.createElement('p');p.className='empty';p.textContent=indexOpen?'Catch a fish to begin your field guide.':'Your bucket is empty. Your discoveries stay in the fish index.';entries.append(p);}
    for(const r of display){
      const row=document.createElement('div');row.className=`entry ${indexOpen?'index-entry':''}`;row.style.setProperty('--tier',tierColors[tiers.indexOf(tierOf(r))]||tierColors[0]);
      const art=document.createElement('span');art.innerHTML=illustration(r.kind??0,palettes[r.palette??0]||palettes[0],r.pattern??0,r.rare);
      const copy=document.createElement('div'),name=document.createElement('strong'),detail=document.createElement('small');
      const badge=document.createElement('span');badge.className='rarity';badge.textContent=tierOf(r);
      name.textContent=r.name;
      detail.textContent=indexOpen?`${counts.get(speciesKey(r))} caught · ${forms[r.kind??0]||'Fish'}`:`${r.size} cm · ${r.site}`;
      copy.append(name,detail,badge);
      if(!indexOpen&&r.habitat){
        const habBadge=document.createElement('span');habBadge.className='habitat-badge';habBadge.textContent=r.habitat;badge.after(habBadge);
      }
      if(!indexOpen&&r.size&&r.size>=(maxSizes.get(r.kind??0)||0)&&(counts.get(speciesKey(r))||0)>=1){
        const trophy=document.createElement('span');trophy.className='trophy-badge';trophy.textContent='Record';badge.after(trophy);
      }
      if(!indexOpen){
        const singleRelease=document.createElement('button');singleRelease.className='single-release';singleRelease.textContent='Free';singleRelease.title=`Release ${r.name} back to the water`;singleRelease.setAttribute('aria-label',`Release ${r.name}`);singleRelease.onclick=e=>{e.stopPropagation();releaseSingleFish(r);};
        const photoBtn=document.createElement('button');photoBtn.className='photo-btn';photoBtn.textContent='Photo';photoBtn.title=`Take souvenir photo of ${r.name}`;photoBtn.setAttribute('aria-label',`Take souvenir photo of ${r.name}`);photoBtn.onclick=e=>{e.stopPropagation();openPolaroid(r);};
        const compBtn=document.createElement('button');compBtn.className=`companion-btn ${activeCompanion?.id===r.id?'active':''}`;compBtn.textContent=activeCompanion?.id===r.id?'Following':'Companion';compBtn.title='Set as your floating companion';compBtn.setAttribute('aria-label',`Set ${r.name} as companion`);compBtn.onclick=e=>{e.stopPropagation();toggleCompanion(r);};
        badge.after(compBtn,photoBtn,singleRelease);
      }
      row.append(art,copy);entries.append(row);
    }
  }
  function releaseSingleFish(r){
    if(busy||!alive)return;
    const id=r.id||`${r.date}-${r.name}-${r.site}-${r.size}`;
    const target=records.find(item=>(item.id||`${item.date}-${item.name}-${item.site}-${item.size}`)===id&&!item.released);
    if(!target)return;
    target.released=new Date().toISOString();
    const karma=Math.max(1,Math.round(pearlValue(r)*0.5));pearls+=karma;savePearls();
    save();
    renderBucket();
    playSfx('release');
    $('.hint').textContent=`${r.name} freed (+${karma} karma pearls).`;
    if(!reduced){
      const b=rigPoints().bucket,el=document.createElement('div');el.className='released-fish';
      el.innerHTML=illustration(r.kind??0,palettes[r.palette??0]||palettes[0],r.pattern??0,r.rare);
      $('.effects').append(el);
      const angle=(Math.random()-.5)*60,targetX=Math.max(30,Math.min(innerWidth-80,b.x+(Math.random()-.5)*260)),targetY=Math.max(120,Math.min(innerHeight-100,b.y+80+Math.random()*140));
      const a=animate(el,[{transform:`translate(${b.x-30}px,${b.y-20}px) scale(.4)`,opacity:1},{transform:`translate(${(b.x+targetX)/2}px,${Math.min(b.y,targetY)-45}px) scale(.9) rotate(${angle}deg)`,opacity:1,offset:.45},{transform:`translate(${targetX}px,${targetY}px) scale(.8)`,opacity:0}],{duration:1500,easing:'ease-out'});
      a.finished.then(()=>el.remove(),()=>el.remove());
    }
  }
  function renderBook(container){
    const discoveredSet=new Set(records.map(r=>r.kind??0));
    const filteredList=forms.map((_,i)=>i).filter(k=>{
      if(bookFilter==='discovered')return discoveredSet.has(k);
      if(bookFilter==='missing')return !discoveredSet.has(k);
      if(bookFilter==='legendary')return speciesTier(k)==='Legendary';
      return true;
    });
    const maxPages=Math.max(1,Math.ceil(filteredList.length/4));
    if(bookPage>=maxPages)bookPage=maxPages-1;
    if(bookPage<0)bookPage=0;

    const filterBar=document.createElement('div');filterBar.className='book-filters';
    const filterDefs=[
      {id:'all',label:`All (${forms.length})`},
      {id:'discovered',label:`Discovered (${discoveredSet.size})`},
      {id:'missing',label:`Missing (${forms.length-discoveredSet.size})`},
      {id:'legendary',label:`Legendary (${forms.filter((_,k)=>speciesTier(k)==='Legendary').length})`}
    ];
    filterDefs.forEach(f=>{
      const btn=document.createElement('button');btn.className='book-filter-btn';btn.textContent=f.label;
      btn.setAttribute('aria-pressed',String(bookFilter===f.id));
      btn.onclick=()=>{bookFilter=f.id;bookPage=0;renderBucket();};
      filterBar.append(btn);
    });
    container.append(filterBar);

    if(!filteredList.length){
      const emptyMsg=document.createElement('p');emptyMsg.className='empty';
      emptyMsg.textContent=bookFilter==='discovered'?'No creatures discovered yet. Cast your line to fill your guide!':'All creatures discovered in this category!';
      container.append(emptyMsg);
      return;
    }

    const spread=document.createElement('div');spread.className='spread';
    for(let leaf=0;leaf<2;leaf++){
      const page=document.createElement('div');page.className='leaf';
      for(let slot=0;slot<2;slot++){
        const idx=bookPage*4+leaf*2+slot;if(idx>=filteredList.length)continue;
        const k=filteredList[idx];
        const found=records.filter(r=>(r.kind??0)===k),r=found.at(-1),card=document.createElement('div');card.className=`specimen ${r?'discovered index-entry':'locked'}`;
        card.style.setProperty('--tier',tierColors[tiers.indexOf(speciesTier(k))]);
        const art=document.createElement('div');art.className='specimen-art';art.innerHTML=illustration(k,palettes[r?.palette??1],r?.pattern??0,r?.rare??false);
        const number=document.createElement('small');number.className='folio';number.textContent=`No. ${String(k+1).padStart(2,'0')}`;
        const name=document.createElement('strong');name.textContent=r?forms[k]:'Undiscovered';
        const badge=document.createElement('span');badge.className='rarity';badge.textContent=speciesTier(k);
        const chance=document.createElement('div');chance.className='chance';chance.textContent=odds(k);
        const count=document.createElement('small');count.textContent=r?`${found.length} caught`:'A shape waiting to be found';
        card.append(number,art,name,badge,chance,count);page.append(card);
      }
      const n=document.createElement('div');n.className='page-number';n.textContent=bookPage*2+leaf+1;page.append(n);spread.append(page);
    }
    const nav=document.createElement('div');nav.className='book-nav';const prev=document.createElement('button'),next=document.createElement('button'),label=document.createElement('span');prev.textContent='‹ Previous';next.textContent='Next ›';prev.disabled=bookPage===0;next.disabled=bookPage>=maxPages-1;label.textContent=`${bookPage+1} / ${maxPages} · Odds per creature encounter`;
    prev.onclick=()=>{bookPage--;renderBucket();};next.onclick=()=>{bookPage++;renderBucket();};nav.append(prev,label,next);container.append(spread,nav);
  }
  function spawn(initial=false,edgeArrival=false){
    if(fish.length>=7 || innerHeight<220)return;
    const p=Math.floor(Math.random()*palettes.length);let kind=0;if(initial&&fish.length===0){kind=Math.floor(Math.random()*5);}else{let ticket=Math.random()*10000;for(;kind<weights.length-1;kind++){ticket-=weights[kind];if(ticket<0)break;}}
    if(activeBait&&activeBait.count>0){
      const isKrill=activeBait.type==='krill'||activeBait.id==='bait_krill';
      const isNectar=activeBait.type==='nectar'||activeBait.id==='bait_nectar';
      if(isKrill&&speciesTier(kind)==='Common'){
        const pool=[1,2,7,8,9,10,12,13,14,21,22];kind=pool[Math.floor(Math.random()*pool.length)];
      }else if(isNectar&&speciesTier(kind)!=='Rare'&&speciesTier(kind)!=='Legendary'){
        const rarePool=[11,15,16,17,18,19,24,25,26,27];kind=rarePool[Math.floor(Math.random()*rarePool.length)];
      }
    }
    const pattern=Math.floor(Math.random()*3),rare=speciesTier(kind)==='Legendary',dir=Math.random()<.5?1:-1;
    const rarity=speciesTier(kind);
    const size=kind===6?1.25:.56+Math.random()*.42, w=112*size,h=78*size;
    const el=document.createElement('button');el.className='swimmer';el.style.width=`${w}px`;el.style.height=`${h}px`;
    const name=kind===6?'Misty reef shark':`${rare?'Crowned ':''}${palettes[p][0]} ${['Striped','Dappled','Silk'][pattern]} ${forms[kind]}`;
    el.setAttribute('aria-label',`Catch ${name}`);el.title=name;el.innerHTML=illustration(kind,palettes[p],pattern,rare);
    const mode=Math.floor(Math.random()*3),angle=mode===0?(dir===1?0:Math.PI):mode===1?(dir===1?-.65:Math.PI-.65):(dir===1?1.15:-1.95);
    const mass=[.2,.3,.5,.15,.25,.3,1.5,.6,.25,.2,1.1,.4,.9,.1,.65,.35,.6,1.2,1.8,2,.2,.15,.5,.55,1,.7,.3,1.3][kind];
    const f={el,p,kind,pattern,rare,rarity,name,dir,w,h,mass,x:initial?30+Math.random()*Math.max(0,innerWidth-w-60):dir===1?-w-10:innerWidth+10,y:135+Math.random()*Math.max(10,innerHeight-240),speed:kind===6?18+Math.random()*12:9+Math.random()*29,angle,mode,turn:Math.random()*6,hits:0,age:Math.random()*9,caught:false};
    el.dataset.species=String(kind);f.length=Math.round((8+mass*35)*(.8+Math.random()*.4));
    const neededClicks=(kind===6||kind===18||kind===19||f.length>=54)?3:(f.length>=40||(mass>=1.0&&kind!==6))?2:1;
    f.neededClicks=neededClicks;
    f.tempo=.55+Math.random()*1.3;f.cruise=.45+Math.random()*1.6;f.burstPhase=Math.random()*Math.PI*2;
    f.baseY=f.y;f.pose=0;f.pulse=1;
    if(kind===15||kind===20||kind===23){f.y=innerHeight-h-8;f.angle=dir===1?0:Math.PI;}
    if(kind===13){f.x=initial?f.x:30+Math.random()*Math.max(10,innerWidth-w-60);f.angle=-Math.PI/2;}
    el.style.setProperty('--stroke-speed',`${kind===12||kind===19?2.8:kind===13?2:1.1}s`);
    if(kind===6)el.classList.add('shark');
    if(neededClicks>1){
      el.classList.add('heavy');
      const label=document.createElement('span');label.className='effort';
      label.textContent=neededClicks===3?'○ ○ ○':'○ ○';
      el.append(label);
      el.setAttribute('aria-label',`Catch ${name}: ${neededClicks} clicks needed`);
    }
    if(edgeArrival){f.x=dir===1?-w+2:innerWidth-2;f.angle=dir===1?0:Math.PI;f.entering=true;f.entryDirection=dir;el.dataset.arrival='edge';}
    el.onclick=e=>{e.preventDefault();e.stopPropagation();catchFish(f);};
    $('.fishes').append(el);fish.push(f);position(f);
    if(!reduced&&!paused&&(rarity==='Rare'||rarity==='Legendary')){
      el.classList.add('rare-arrival');el.dataset.rarity=rarity;
      const reveal=animate(el.firstElementChild,[{opacity:.08,filter:'blur(5px) brightness(.6)'},{opacity:.55,filter:'blur(1px) brightness(.85)',offset:.5},{opacity:1,filter:'none'}],{duration:rarity==='Legendary'?2400:1500,easing:'ease-out'});
      reveal.finished.then(()=>el.classList.remove('rare-arrival'),()=>el.classList.remove('rare-arrival'));
    }
    if(paused)el.querySelectorAll('.tail,.fin,.limb,.trailing,.ray-wing,.creature-eye,.puffer-body,.lantern-stalk,.lantern-glow,.dorsal-flutter,.star-body,.gills').forEach(part=>part.style.animationPlayState='paused');
  }
  function position(f){const facing=f.kind===13||f.kind===14||f.kind===15||f.kind===16?1:Math.cos(f.angle)>=0?1:-1;const tilt=f.pose??0;f.el.style.transform=`translate3d(${f.x}px,${f.y}px,0) rotate(${tilt}deg)`;const curFacing=f.facing??facing;f.el.firstElementChild.style.transform=`scale(${curFacing*(f.pulse||1)},${2-(f.pulse||1)})`;}
  function swim(f,dt){
    if(f.entering){f.x+=f.entryDirection*95*dt;f.pose=0;if(f.x>=12&&f.x+f.w<=innerWidth-12){f.entering=false;delete f.el.dataset.arrival;}return;}
    const targetFacing=f.kind===13||f.kind===14||f.kind===15||f.kind===16?1:Math.cos(f.angle)>=0?1:-1;
    if(f.facing===undefined)f.facing=targetFacing;
    else if(Math.abs(f.facing-targetFacing)>0.02)f.facing=lerp(f.facing,targetFacing,Math.min(1,dt*14));
    else f.facing=targetFacing;
    f.age+=dt*f.tempo;const a=f.age,beat=Math.sin(a*2.5+f.turn),edge=innerHeight-f.h-12;
    const forward=Math.cos(f.angle)>=0?1:-1;let vx=0,vy=0;
    f.pulse=1;
    if(f.kind===13){ // Jellyfish contract to rise, then relax and drift.
      const stroke=Math.max(0,Math.sin(a*2.2));vx=Math.sin(a*.6+f.turn)*5;vy=-5-stroke*20;f.pulse=1-stroke*.1;f.pose=Math.sin(a*.7)*5;
      if(f.y< -f.h-10)f.y=innerHeight+10;
    }else if(f.kind===15||f.kind===20||f.kind===23){ // Bottom-dwellers crawl or scuttle along the margin.
      const step=.3+.7*Math.pow(Math.sin(a*4),2);vx=forward*f.speed*step*(f.kind===20?.2:1);vy=(innerHeight-f.h-8-f.y)*3;f.pose=beat*(f.kind===20?7:2);
    }else if(f.kind===14||f.kind===22){ // Cephalopods: a strong push, then a long coast.
      const jet=Math.pow(Math.max(0,Math.sin(a*1.8)),4);vx=forward*(5+jet*45);vy=beat*5;f.pulse=1-jet*.1;f.pose=forward*beat*7;
    }else if(f.kind===17||f.kind===24){ // Dolphins and seals surface in broad arcs.
      vx=forward*(f.speed+12);const target=f.baseY+Math.sin(a*.85+f.turn)*65;vy=(target-f.y)*2;f.pose=Math.atan2(vy,Math.abs(vx))*180/Math.PI*forward;
    }else if(f.kind===12||f.kind===10||f.kind===18||f.kind===19||f.kind===27){ // Large gliders have slow strokes and broad, shallow turns.
      vx=forward*f.speed*(f.kind===12?.45:.7);vy=Math.sin(a*.55+f.turn)*5;f.pose=forward*Math.sin(a*.55+f.turn)*7;
    }else if(f.kind===9||f.kind===16||f.kind===26){vx=forward*7;vy=beat*6;f.pose=beat*4;}
    else if(f.kind===21||f.kind===25){vx=forward*(10+Math.pow(Math.max(0,beat),2)*30);vy=Math.sin(a*1.2)*12;f.pose=beat*12;}
    else{const curve=Math.sin(a*.45+f.turn)*(f.mode===0?.08:.3);vx=Math.cos(f.angle+curve)*f.speed;vy=Math.sin(f.angle+curve)*f.speed;f.pose=Math.atan2(vy,Math.abs(vx))*180/Math.PI*forward;}
    const surge=1+.55*Math.pow(Math.max(0,Math.sin(a*.7+f.burstPhase)),3);
    const pace=f.cruise*surge;f.x+=vx*dt*pace;f.y+=vy*dt*pace;
    f.el.style.setProperty('--stroke-speed',`${Math.max(.28,1.6/(pace*f.tempo))}s`);
    if(f.kind!==13&&![15,20,23].includes(f.kind)){if(f.y<110){f.y=110;f.angle=Math.abs(f.angle);f.baseY=Math.max(180,f.baseY);}if(f.y>edge){f.y=edge;f.angle=-Math.abs(f.angle);f.baseY=Math.min(edge-65,f.baseY);}}
    if([15,20,23].includes(f.kind)&&(f.x<4||f.x>innerWidth-f.w-4)){f.x=Math.max(4,Math.min(innerWidth-f.w-4,f.x));f.angle=f.angle===0?Math.PI:0;}
  }
  function animate(el,keys,options){const a=el.animate(keys,{...options,duration:reduced?1:options.duration});animations.add(a);a.finished.then(()=>animations.delete(a),()=>animations.delete(a));return a;}
  function updateRod(flex,rotation){
    const tx=15+flex*.45,ty=17+flex,cx=85+flex*.4,cy=51+flex*1.5;
    const d=`M138 97 Q${cx} ${cy} ${tx} ${ty}`;
    $('.pole').setAttribute('d',d);$('.pole-light').setAttribute('d',d);
    [...$('.guides').children].forEach((ring,i)=>{const t=[.98,.7,.42][i],s=1-t;ring.setAttribute('cx',s*s*138+2*s*t*cx+t*t*tx);ring.setAttribute('cy',s*s*97+2*s*t*cy+t*t*ty+2);});
    $('.reel').style.transform=`rotate(${rotation}deg)`;
    const tipAura=$('.rod-tip-aura');
    if(tipAura){tipAura.style.left=`${tx}px`;tipAura.style.top=`${ty}px`;}
    const rect=$('.rod').getBoundingClientRect();return {x:rect.left+rect.width*tx/170,y:rect.top+rect.height*ty/125};
  }
  function rigPoints(){const rod=$('.rod').getBoundingClientRect(),bucket=$('.bucket').getBoundingClientRect();return {tip:{x:rod.left+rod.width*15/170,y:rod.top+rod.height*17/125},bucket:{x:bucket.left+bucket.width/2,y:bucket.top+bucket.height*.34}};}
  function line(a,b,slack,sway=0){const dx=b.x-a.x,dy=b.y-a.y;const d=`M${a.x} ${a.y}C${a.x+dx*.28+sway} ${a.y+dy*.28+slack} ${a.x+dx*.72+sway} ${a.y+dy*.72+slack} ${b.x} ${b.y}`;root.querySelectorAll('.thread').forEach(p=>p.setAttribute('d',d));$('.hook').setAttribute('transform',`translate(${b.x} ${b.y}) rotate(${Math.atan2(dy,dx)*180/Math.PI-90})`);}
  const ease=t=>1-Math.pow(1-t,3),lerp=(a,b,t)=>a+(b-a)*t;
  function spawnStrikeEffect(fx,fy,lineSkin){
    const ring=document.createElement('div');
    ring.className='strike-ring';
    ring.style.left=`${fx}px`;
    ring.style.top=`${fy}px`;
    if(lineSkin==='line_neon'){
      ring.style.borderColor='#00f7ff';
      ring.style.boxShadow='0 0 16px #00f7ff, inset 0 0 10px #00f7ff';
    }else if(lineSkin==='line_starlight'){
      ring.style.borderColor='#ffffff';
      ring.style.boxShadow='0 0 18px #c8ddff, 0 0 30px rgba(180,215,255,0.85)';
    }else if(lineSkin==='line_gold'){
      ring.style.borderColor='#ffd700';
      ring.style.boxShadow='0 0 16px #f5b025, inset 0 0 8px #f5b025';
    }else{
      ring.style.borderColor='#78d4cb';
      ring.style.boxShadow='0 0 10px #78d4cb';
    }
    $('.effects').append(ring);
    const a=animate(ring,[
      {transform:'translate(-50%, -50%) scale(0.2)',opacity:1},
      {transform:'translate(-50%, -50%) scale(1.65)',opacity:0}
    ],{duration:380,easing:'ease-out'});
    a.finished.then(()=>ring.remove(),()=>ring.remove());

    if(!reduced){
      const col=lineSkin==='line_neon'?'#00f7ff':lineSkin==='line_starlight'?'#ffffff':lineSkin==='line_gold'?'#ffd700':'#a0e3dd';
      for(let i=0;i<6;i++){
        const spark=document.createElement('i');
        spark.className='strike-spark';
        spark.style.left=`${fx}px`;
        spark.style.top=`${fy}px`;
        spark.style.background=col;
        spark.style.boxShadow=`0 0 6px ${col}`;
        $('.effects').append(spark);
        const ang=Math.random()*Math.PI*2, dist=22+Math.random()*34;
        const sa=animate(spark,[
          {transform:'translate(0,0) scale(1.4)',opacity:1},
          {transform:`translate(${Math.cos(ang)*dist}px, ${Math.sin(ang)*dist}px) scale(0)`,opacity:0}
        ],{duration:320+Math.random()*150,easing:'ease-out'});
        sa.finished.then(()=>spark.remove(),()=>spark.remove());
      }
    }
  }
  async function catchFish(f){
    if(busy&&(!catchMotion?.tug||catchMotion.f!==f))return;
    if(!alive)return;
    const rect=f.el.getBoundingClientRect();
    const fx=rect.left+rect.width/2,fy=rect.top+rect.height/2;
    spawnStrikeEffect(fx,fy,(rewards&&rewards.supporter&&rewards.goldenHook)?'line_gold':(equippedSkins.line||'line_mono'));
    busy=true;await ready;if(!alive){busy=false;return;}
    const needed=f.neededClicks||(f.kind===6?3:1);
    if(f.hits<needed-1){
      f.hits++;playSfx('tug');
      const dots=Array.from({length:needed},(_,i)=>i<f.hits?'●':'○').join(' ');
      const effortEl=f.el.querySelector('.effort');if(effortEl)effortEl.textContent=dots;
      const remaining=needed-f.hits;
      f.el.setAttribute('aria-label',`Catch ${f.name}: ${remaining} ${remaining===1?'click':'clicks'} left`);
      const speciesName=f.kind===6?'Reef shark':f.name;
      $('.hint').textContent=`${speciesName} · ${remaining} more ${remaining===1?'click':'clicks'}`;
      const tip=rigPoints().tip;
      catchMotion={f,start:performance.now(),from:{x:rect.left+rect.width/2,y:rect.top+rect.height/2},tip,bucket:rigPoints().bucket,tug:true};
      f.caught=true;$('.hook').setAttribute('visibility','visible');return;
    }
    playSfx('cast');
    f.caught=true;f.el.classList.add('caught');f.el.disabled=true;
    const points=rigPoints();
    catchMotion={f,start:performance.now(),from:{x:rect.left+rect.width/2,y:rect.top+rect.height/2},tip:points.tip,bucket:points.bucket};
    $('.hook').setAttribute('visibility','visible');$('.hint').textContent='Got you!';
    releaseButton.disabled=true;
  }
  function tickCatch(now){
    const c=catchMotion;if(!c)return;const {f,from}=c;
    const duration=reduced?120:c.tug?1100:2350+f.mass*420,t=Math.min(1,(now-c.start)/duration),bucket=rigPoints().bucket;
    // Damped spring: load bends the shaft, and the shaft settles after the lift.
    const dt=Math.min(.032,Math.max(.001,(now-(c.last||now-16))/1000));c.last=now;
    const load=t<.26?-Math.sin(t/.26*Math.PI)*7:t>.72?0:(7+f.mass*6)*(1+Math.sin(t*24)*.16);
    c.flex??=0;c.flexVelocity??=0;c.flexVelocity+=((load-c.flex)*100-c.flexVelocity*17)*dt;c.flex+=c.flexVelocity*dt;
    const retrieve=Math.max(0,Math.min(1,(t-.32)/.4)),rotation=retrieve*(480+f.mass*180);
    const tip=updateRod(c.flex,rotation);
    if(c.tug){const cast=Math.min(1,t/.3),pull=Math.sin(Math.max(0,(t-.3)/.7)*Math.PI);const end={x:from.x+Math.sin(t*26)*pull*7,y:from.y+pull*9};line(tip,{x:lerp(tip.x,end.x,ease(cast)),y:lerp(tip.y,end.y,ease(cast))},(1-cast)*50+pull*3);f.el.style.transform=`translate3d(${f.x+Math.sin(t*26)*pull*7}px,${f.y+pull*9}px,0) rotate(${Math.sin(t*18)*pull*8}deg)`;if(t===1){f.caught=false;f.angle+=.35;catchMotion=null;busy=false;updateRod(0,0);root.querySelectorAll('.thread').forEach(p=>p.setAttribute('d',''));$('.hook').setAttribute('visibility','hidden');position(f);renderBucket();}return;}
    let x=from.x,y=from.y,scale=1,angle=f.pose||0;
    // Flex the shaft while keeping the tip anchored to the animated line.
    if(t<.26){const q=ease(t/.26);line(tip,{x:lerp(tip.x,from.x,q),y:lerp(tip.y,from.y,q)-Math.sin(q*Math.PI)*35},Math.sin(q*Math.PI)*85,Math.sin(q*Math.PI)*20);}
    else if(t<.34){
      if(!c.hookedSplash){
        c.hookedSplash=true;
        if(!reduced){
          for(let i=0;i<8;i++){
            const sp=document.createElement('i');sp.className='pull-spray';
            sp.style.left=`${from.x}px`;sp.style.top=`${from.y}px`;
            $('.effects').append(sp);
            const rad=Math.random()*Math.PI*2,dist=16+Math.random()*36;
            const a=animate(sp,[{transform:'translate(0,0) scale(1.4)',opacity:1},{transform:`translate(${Math.cos(rad)*dist}px,${Math.sin(rad)*dist}px) scale(0)`,opacity:0}],{duration:420+Math.random()*200,easing:'ease-out'});
            a.finished.then(()=>sp.remove(),()=>sp.remove());
          }
        }
      }
      const q=(t-.26)/.08;angle=lerp(f.pose||0,0,q);line(tip,{x,y},(1-q)*22);
    }
    else if(t<.72){
      if(!c.lastReelClick||now-c.lastReelClick>120){c.lastReelClick=now;playSfx('reel');}
      const raw=(t-.34)/.38,q=raw*raw*(3-2*raw),swing=Math.sin(raw*Math.PI)*Math.sin(raw*12)*(5+f.mass*8);
      const launch={x:tip.x+(bucket.x>=tip.x?22:-22),y:tip.y+55};
      x=lerp(from.x,launch.x,q)+swing;y=lerp(from.y,launch.y,q)-Math.sin(q*Math.PI)*40;angle=Math.sin(q*Math.PI)*(-12+Math.sin(q*16)*(3+f.mass*5));line(tip,{x,y},2+Math.sin(raw*Math.PI)*f.mass*3,swing*.35);
      if(!reduced&&(!c.lastSpray||now-c.lastSpray>45)){
        c.lastSpray=now;
        const count=f.mass>1?3:2;
        const lineSkin=(rewards&&rewards.supporter&&rewards.goldenHook)?'line_gold':(equippedSkins.line||'line_mono');
        for(let i=0;i<count;i++){
          const sp=document.createElement('i');sp.className=i%2===0?'pull-spray':'pull-bubble';
          sp.style.left=`${x+(Math.random()-.5)*20}px`;sp.style.top=`${y+(Math.random()-.5)*16}px`;
          if(lineSkin==='line_neon'){
            sp.style.background=i%2===0?'#00f7ff':'#ffffff77';
            sp.style.boxShadow='0 0 6px #00f7ff, 0 0 10px #00f7ff';
            if(i%2!==0)sp.style.borderColor='#00f7ff';
          }else if(lineSkin==='line_starlight'){
            sp.style.background=i%2===0?'#ffffff':'#e0edff88';
            sp.style.boxShadow='0 0 5px #b0ccff, 0 0 9px rgba(180,215,255,0.7)';
            if(i%2!==0)sp.style.borderColor='#cce0ff';
          }else if(lineSkin==='line_gold'){
            sp.style.background=i%2===0?'#ffd866':'#fff3cc77';
            sp.style.boxShadow='0 0 5px #f5b025, 0 0 8px rgba(245,176,37,0.7)';
            if(i%2!==0)sp.style.borderColor='#ffd447';
          }
          $('.effects').append(sp);
          const rad=angle*Math.PI/180,spd=20+Math.random()*36;
          const sx=-Math.cos(rad)*spd+(Math.random()-.5)*20,sy=-Math.sin(rad)*spd+(Math.random()-.5)*20+8;
          const a=animate(sp,[{transform:'translate(0,0) scale(1)',opacity:.85},{transform:`translate(${sx}px,${sy}px) scale(.2)`,opacity:0}],{duration:360+Math.random()*220,easing:'ease-out'});
          a.finished.then(()=>sp.remove(),()=>sp.remove());
        }
      }
      if(f.mass>1)x+=Math.sin(now*0.09)*3;
    }else{
      // The hook lets go near the rod; the creature flies freely into the bucket.
      if(!c.launch){c.launch={x:tip.x+(bucket.x>=tip.x?22:-22),y:tip.y+55};f.el.dataset.phase='flying';$('.hook').setAttribute('visibility','hidden');}
      const q=Math.min(1,(t-.72)/.28),target={x:bucket.x,y:bucket.y+8},distance=Math.hypot(target.x-c.launch.x,target.y-c.launch.y);
      const flight=.65+Math.min(.45,distance/1100),gravity=Math.min(1050,Math.max(250,(Math.min(c.launch.y,target.y)-15)*8/(flight*flight)));
      const vx=(target.x-c.launch.x)/flight,vy=(target.y-c.launch.y-.5*gravity*flight*flight)/flight,elapsed=q*flight;
      x=c.launch.x+vx*elapsed;y=c.launch.y+vy*elapsed+.5*gravity*elapsed*elapsed;
      angle=Math.atan2(vy+gravity*elapsed,Math.max(1,Math.abs(vx)))*180/Math.PI*(vx<0?-1:1)*.55;
      scale=q<.88?1:1-((q-.88)/.12)*.9;
      const retract=1-Math.min(1,q*3);line(tip,{x:lerp(tip.x,c.launch.x,retract),y:lerp(tip.y,c.launch.y,retract)},retract*18);
      if(retract===0)root.querySelectorAll('.thread').forEach(p=>p.setAttribute('d',''));
    }
    f.el.style.transform=`translate3d(${x-f.w/2}px,${y-f.h/2}px,0) rotate(${angle}deg) scale(${scale})`;
    if(t===1){catchMotion=null;f.el.remove();fish.splice(fish.indexOf(f),1);updateRod(0,0);root.querySelectorAll('.thread').forEach(p=>p.setAttribute('d',''));$('.hook').setAttribute('visibility','hidden');busy=false;land(f);}
  }
  function land(f){
    playSfx('plop');
    const now=performance.now();
    if(lastCatchTime>0 && (now-lastCatchTime)<22000){
      catchStreak++;
    }else{
      catchStreak=1;
    }
    lastCatchTime=now;
    const streakBonus=catchStreak>1?Math.min(20,catchStreak*2):0;
    if(catchStreak>1)playSfx('streak');

    const firstDiscovery=!records.some(r=>r.kind===f.kind),beforeCount=new Set(records.map(r=>r.kind??0)).size;
    const r={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,name:f.name,palette:f.p,kind:f.kind,pattern:f.pattern,rare:f.rare,rarity:f.rarity,size:f.length,site:location.hostname||'Practice page',habitat,date:new Date().toISOString()};
    const earned=pearlValue(r)+(firstDiscovery?25:0)+streakBonus;
    pearls+=earned;
    savePearls();
    if(activeBait&&activeBait.count>0){
      activeBait.count--;
      if(activeBait.count<=0)activeBait=null;
      renderBaitBadge();
      saveSkins();
    }
    records.push(r);renderBucket();save(r);
    const toast=$('.toast');toast.replaceChildren();const title=document.createElement('strong');title.textContent=r.name;const desc=document.createElement('span');desc.textContent=`${r.size} cm · ${tierOf(r)} · +${earned} pearls`;toast.append(title,desc);
    if(catchStreak>1){
      const streakPill=document.createElement('span');streakPill.className='streak-pill';streakPill.textContent=`${catchStreak}x Streak! (+${streakBonus} bonus)`;toast.append(streakPill);
    }
    toast.hidden=false;toastUntil=performance.now()+2800;
    if(catchStreak>1){
      $('.hint').textContent=`${catchStreak}x Catch Streak! (+${streakBonus} bonus pearls)`;
    }else{
      $('.hint').textContent=`Scroll a little. Find another. (+${earned} pearls)`;
    }
    if(firstDiscovery){
      playSfx('discovery');
      $('.hint').textContent=`New discovery: ${forms[f.kind]} (+25 pearls bonus!)`;
      const unlocked=rewardCatalog.find(([k,limit])=>beforeCount<limit&&(beforeCount+1)>=limit);
      if(unlocked){
        desc.textContent+=` · ${unlocked[2]} unlocked`;
        $('.hint').textContent='A new style is waiting in your collection.';
        toastUntil=performance.now()+6000;
      }
    }
    animate($('.bucket'),[
      {transform:'scale(1,1) rotate(0)'},
      {transform:'scale(1.22,0.8) rotate(-7deg) translateY(6px)'},
      {transform:'scale(0.88,1.14) rotate(5deg) translateY(-5px)'},
      {transform:'scale(1.06,0.96) rotate(-2deg)'},
      {transform:'scale(1,1) rotate(0)'}
    ],{duration:540,easing:'cubic-bezier(.34,1.56,.64,1)'});
    const {bucket}=rigPoints();

    const floater=document.createElement('div');
    floater.className='catch-floater';
    floater.style.left=`${bucket.x}px`;
    floater.style.top=`${bucket.y - 12}px`;
    floater.innerHTML=`<span class="floater-val">+${earned}</span><span class="floater-tag">Pearls</span>${streakBonus?`<span class="floater-streak">${catchStreak}x Combo</span>`:''}`;
    $('.effects').append(floater);
    const fa=animate(floater,[
      {transform:'translate(-50%, 0) scale(0.6)',opacity:0},
      {transform:'translate(-50%, -18px) scale(1.22)',opacity:1,offset:0.25},
      {transform:'translate(-50%, -36px) scale(1.05)',opacity:1,offset:0.65},
      {transform:'translate(-50%, -52px) scale(0.9)',opacity:0}
    ],{duration:1100,easing:'cubic-bezier(.16,1,.3,1)'});
    fa.finished.then(()=>floater.remove(),()=>floater.remove());

    const landRing=document.createElement('div');
    landRing.className='landing-shockwave';
    landRing.style.left=`${bucket.x}px`;
    landRing.style.top=`${bucket.y}px`;
    const bSkin=equippedSkins.bucket||'bucket_seafoam';
    if(bSkin==='bucket_pearl'){
      landRing.style.borderColor='#d8b4fe';
      landRing.style.boxShadow='0 0 18px #c084fc, inset 0 0 10px #c084fc';
    }else if(bSkin==='bucket_cedar'){
      landRing.style.borderColor='#f5c66d';
      landRing.style.boxShadow='0 0 14px #e0a548';
    }else if(bSkin==='bucket_wicker'){
      landRing.style.borderColor='#8ed6cb';
      landRing.style.boxShadow='0 0 12px #6fb5a8';
    }else{
      landRing.style.borderColor='#81c4c8';
      landRing.style.boxShadow='0 0 12px #81c4c8';
    }
    $('.effects').append(landRing);
    const lra=animate(landRing,[
      {transform:'translate(-50%, -50%) scale(0.3)',opacity:1},
      {transform:'translate(-50%, -50%) scale(1.8)',opacity:0}
    ],{duration:450,easing:'ease-out'});
    lra.finished.then(()=>landRing.remove(),()=>landRing.remove());
    if(!reduced){
      const bSkin=equippedSkins.bucket||'bucket_seafoam';
      const dropletPalette=bSkin==='bucket_pearl'
        ?['#e5d7fc','#f3ebff','#c4b5fd','#d8b4fe']
        :bSkin==='bucket_cedar'
        ?['#e0a548','#c4832c','#f5c66d','#b36d1b']
        :bSkin==='bucket_wicker'
        ?['#6fb5a8','#8ed6cb','#5ba396','#a4dfd6']
        :['#8dcac6','#72b6b2','#aee3df'];
      const dropletShadow=bSkin==='bucket_pearl'
        ?'0 0 5px rgba(196,181,253,0.85)'
        :bSkin==='bucket_cedar'
        ?'0 0 4px rgba(224,165,72,0.5)'
        :'0 0 3px rgba(141,202,198,0.5)';
      for(let i=0;i<9;i++){
        const el=document.createElement('div');
        el.className='catch-droplet';
        el.style.left=`${bucket.x}px`;
        el.style.top=`${bucket.y}px`;
        const size=2.5+Math.random()*2.8;
        el.style.width=`${size}px`;
        el.style.height=`${size}px`;
        el.style.background=dropletPalette[Math.floor(Math.random()*dropletPalette.length)];
        el.style.boxShadow=dropletShadow;
        $('.effects').append(el);
        const vx=(Math.random()-.5)*75, vy=-25-Math.random()*48;
        const a=animate(el,[
          {transform:'translate(0,0) scale(1)',opacity:.95},
          {transform:`translate(${vx*0.5}px,${vy}px) scale(1.15)`,opacity:.85,offset:.45},
          {transform:`translate(${vx}px,${vy+35}px) scale(.5)`,opacity:0}
        ],{duration:520+Math.random()*260,easing:'cubic-bezier(.25,.46,.45,.94)'});
        a.finished.then(()=>el.remove(),()=>el.remove());
      }
    }
  }
  async function save(r){try{
    if(storage){ // Merge by catch id to preserve other tabs' collections.
      const latest=(await chrome.storage.local.get('pageFishingCatches')).pageFishingCatches||[];
      const merged=new Map([...latest,...records].map(item=>[item.id||`${item.date}-${item.name}-${item.site}-${item.size}`,item]));
      records=[...merged.values()];await chrome.storage.local.set({pageFishingCatches:records});renderBucket();
    }else localStorage.setItem('pageFishingCatches',JSON.stringify(records));
  }catch{report('Caught! Saving failed; this catch may disappear when you leave.');}}
  function onStorage(changes,area){if(area==='local'&&changes.pageFishingCatches){records=changes.pageFishingCatches.newValue||[];renderBucket();}}
  if(storage)chrome.storage.onChanged.addListener(onStorage);
  function releaseBucket(){
    if(busy||!alive)return;
    const held=records.filter(r=>!r.released);if(!held.length)return;
    playSfx('release');
    busy=true;releaseButton.disabled=true;$('.ledger').hidden=true;$('.bucket').setAttribute('aria-expanded','false');$('.toast').hidden=true;
    const karmaTotal=held.reduce((sum,item)=>sum+Math.max(1,Math.round(pearlValue(item)*0.5)),0);
    pearls+=karmaTotal;savePearls();
    const rect=$('.bucket').getBoundingClientRect(),el=document.createElement('div');el.className='release-bucket';el.append($('.bucket svg').cloneNode(true));$('.effects').append(el);$('.bucket').style.opacity='0';
    releaseMotion={start:performance.now(),el,from:{x:rect.left,y:rect.top},center:{x:innerWidth/2-40,y:innerHeight/2-42},held,scattered:false,karmaTotal};
    $('.hint').textContent=`A little freedom (+${karmaTotal} karma pearls).`;
  }
  function tickRelease(now){
    const m=releaseMotion;if(!m)return;const t=Math.min(1,(now-m.start)/(reduced?240:5200));
    if(t<.38){const q=ease(t/.38);m.el.style.transform=`translate(${lerp(m.from.x,m.center.x,q)}px,${lerp(m.from.y,m.center.y,q)-Math.sin(q*Math.PI)*90}px) rotate(${q*18}deg)`;}
    else if(t<.65){const q=(t-.38)/.27;m.el.style.transform=`translate(${m.center.x}px,${m.center.y+Math.sin(q*Math.PI)*8}px) rotate(${18+q*125}deg)`;}
    else{const q=ease((t-.65)/.35),target=$('.bucket').getBoundingClientRect();m.el.style.transform=`translate(${lerp(m.center.x,target.left,q)}px,${lerp(m.center.y,target.top,q)}px) rotate(${143*(1-q)}deg) scale(${1-q*.3})`;}
    if(t>=.51&&!m.scattered){
      m.scattered=true;
      // Stagger fish toward all four corners, capping visual clones for a full bucket.
      m.held.slice(-28).forEach((r,i)=>{
        const el=document.createElement('div');el.className='released-fish';el.innerHTML=illustration(r.kind??0,palettes[r.palette??0]||palettes[0],r.pattern??0,r.rare);$('.effects').append(el);
        const heading=Math.random()*Math.PI*2,ux=Math.cos(heading),uy=Math.sin(heading),radius=Math.hypot(innerWidth,innerHeight)*.7+180;
        const dx=m.center.x+ux*radius,dy=m.center.y+uy*radius,bend=(Math.random()-.5)*140;
        const facing=ux<0?-1:1,angle=Math.atan2(uy*facing,ux*facing)*180/Math.PI;
        el.dataset.heading=String(heading);el.firstElementChild.style.transform=`scaleX(${facing})`;
        const a=animate(el,[{transform:`translate(${m.center.x}px,${m.center.y}px) rotate(${angle}deg) scale(.5)`,opacity:0},{transform:`translate(${m.center.x+ux*90-uy*bend}px,${m.center.y+uy*90+ux*bend}px) rotate(${angle+Math.sign(bend)*12}deg) scale(1)`,opacity:1,offset:.22},{transform:`translate(${m.center.x+ux*radius*.72}px,${m.center.y+uy*radius*.72}px) rotate(${angle}deg) scale(.85)`,opacity:.9,offset:.8},{transform:`translate(${dx}px,${dy}px) rotate(${angle}deg) scale(.7)`,opacity:0}],{duration:reduced?1:2600+Math.random()*1400,delay:reduced?0:i*45+Math.random()*180,easing:'cubic-bezier(.3,.1,.4,1)',fill:'both'});
        a.finished.then(()=>el.remove(),()=>el.remove());
      });
      const ids=new Set(m.held.map(r=>r.id||`${r.date}-${r.name}-${r.site}-${r.size}`)),stamp=new Date().toISOString();
      records=records.map(r=>ids.has(r.id||`${r.date}-${r.name}-${r.site}-${r.size}`)?{...r,released:stamp}:r);renderBucket();save();
    }
    if(t===1){m.el.remove();const k=m.karmaTotal||0;releaseMotion=null;$('.bucket').style.opacity='1';busy=false;renderBucket();$('.hint').textContent=`Released. Discoveries kept in your index (+${k} karma pearls).`;}
  }
  let lastAuraMote=0;
  function tickAuraParticles(now){
    if(reduced||paused)return;
    const {tip,bucket}=rigPoints();
    const rSkin=equippedSkins.rod||'rod_classic';
    const bSkin=equippedSkins.bucket||'bucket_seafoam';

    if(rSkin!=='rod_classic'){
      const rm=document.createElement('i');
      rm.className='aura-mote';
      rm.style.left=`${tip.x}px`;
      rm.style.top=`${tip.y}px`;
      const size=3+Math.random()*2.5;
      rm.style.width=`${size}px`;
      rm.style.height=`${size}px`;
      const vx=(Math.random()-.5)*18,vy=-14-Math.random()*22;
      if(rSkin==='rod_abyssal'){
        rm.style.background='#00f7ff';
        rm.style.boxShadow='0 0 6px #00f7ff, 0 0 10px #00f7ff';
      }else if(rSkin==='rod_moon'){
        rm.style.background='#ffffff';
        rm.style.boxShadow='0 0 6px #b0ccff, 0 0 12px rgba(180,215,255,0.7)';
      }else if(rSkin==='rod_copper'){
        rm.style.background='#ff7733';
        rm.style.boxShadow='0 0 6px #ff5511';
      }else if(rSkin==='rod_bamboo'){
        rm.style.background='#a6cf38';
        rm.style.boxShadow='0 0 5px rgba(166,207,56,0.7)';
      }
      $('.effects').append(rm);
      const a=animate(rm,[
        {transform:'translate(0, 0) scale(1)',opacity:0.9},
        {transform:`translate(${vx}px, ${vy}px) scale(0)`,opacity:0}
      ],{duration:650+Math.random()*250,easing:'ease-out'});
      a.finished.then(()=>rm.remove(),()=>rm.remove());
    }

    if(bSkin!=='bucket_seafoam'){
      const bm=document.createElement('i');
      bm.className='aura-mote';
      const bx=bucket.x+(Math.random()-.5)*36;
      const by=bucket.y-6+(Math.random()-.5)*8;
      bm.style.left=`${bx}px`;
      bm.style.top=`${by}px`;
      const bsize=3+Math.random()*3;
      bm.style.width=`${bsize}px`;
      bm.style.height=`${bsize}px`;
      const bvx=(Math.random()-.5)*14,bvy=-16-Math.random()*22;
      if(bSkin==='bucket_pearl'){
        bm.style.background='#e5d7fc';
        bm.style.boxShadow='0 0 6px #c4b5fd, 0 0 12px rgba(216,180,254,0.6)';
      }else if(bSkin==='bucket_cedar'){
        bm.style.background='#ffd066';
        bm.style.boxShadow='0 0 6px #f5a623';
      }else if(bSkin==='bucket_wicker'){
        bm.style.background='#d8f571';
        bm.style.boxShadow='0 0 6px #b4e038';
      }
      $('.effects').append(bm);
      const ba=animate(bm,[
        {transform:'translate(0, 0) scale(1)',opacity:0.9},
        {transform:`translate(${bvx}px, ${bvy}px) scale(0)`,opacity:0}
      ],{duration:750+Math.random()*250,easing:'ease-out'});
      ba.finished.then(()=>bm.remove(),()=>bm.remove());
    }
  }
  function loop(now){
    if(!alive)return;const dt=Math.min((now-last)/1000,.05);last=now;
    if(!document.hidden){
      if(!paused){spawnClock+=dt;if(spawnClock>5){spawnClock=0;spawn();}
        for(let i=fish.length-1;i>=0;i--){const f=fish[i];if(f.caught)continue;if(!reduced)swim(f,dt);position(f);if(f.x>innerWidth+180||f.x< -210){f.el.remove();fish.splice(i,1);}}
      }
      // Count only free creatures actually visible, not offscreen arrivals or hooked catches.
      if(innerHeight>=220){let visible=fish.filter(f=>!f.caught&&f.x+f.w>0&&f.x<innerWidth&&f.y+f.h>0&&f.y<innerHeight).length;
        while(visible<2){if(fish.length>=7){const off=fish.findIndex(f=>!f.caught&&(f.x+f.w<=0||f.x>=innerWidth||f.y+f.h<=0||f.y>=innerHeight));if(off<0)break;fish[off].el.remove();fish.splice(off,1);}const before=fish.length;spawn(false,true);if(fish.length===before)break;visible++;}}
      tickCatch(now);tickRelease(now);if(toastUntil&&now>toastUntil){$('.toast').hidden=true;toastUntil=0;}
      if(!paused&&!reduced&&now-lastAuraMote>450){lastAuraMote=now;tickAuraParticles(now);}
      if(activeCompanion&&!reduced){
        const compEl=$('.companion-swimmer');
        if(compEl&&!compEl.hidden){
          const {bucket}=rigPoints();
          let tx,ty;
          if(now-lastPointerTime<2600){
            tx=lastPointerX+32;ty=lastPointerY+22;
          }else{
            const ang=now*0.0016;
            tx=bucket.x+Math.cos(ang)*52;
            ty=bucket.y+Math.sin(ang)*34;
          }
          const dx=tx-companionX,dy=ty-companionY;
          companionX=lerp(companionX,tx,.07);
          companionY=lerp(companionY,ty,.07);
          const flip=dx<-0.5?-1:1,angle=Math.atan2(dy,Math.abs(dx))*18*flip;
          compEl.style.transform=`translate3d(${companionX-28}px,${companionY-20}px,0) scaleX(${flip}) rotate(${angle}deg)`;
        }
      }
      if(weather==='rain'&&!paused&&!reduced&&Math.random()<0.04){
        const rx=Math.random()*innerWidth,ry=120+Math.random()*Math.max(10,innerHeight-140);
        const rip=document.createElement('div');rip.className='weather-rain-ripple';rip.style.left=`${rx}px`;rip.style.top=`${ry}px`;
        $('.effects').append(rip);
        const a=animate(rip,[{transform:'translate(-50%,-50%) scale(0.1)',opacity:.45},{transform:'translate(-50%,-50%) scale(1.1)',opacity:0}],{duration:600,easing:'ease-out'});
        a.finished.then(()=>rip.remove(),()=>rip.remove());
      }
    }
    frame=requestAnimationFrame(loop);
  }
  let lastScroll=scrollY,totalScroll=0;
  function onScroll(){const delta=scrollY-lastScroll;lastScroll=scrollY;totalScroll+=Math.abs(delta);if(totalScroll>300&&!paused){totalScroll=0;spawn();}}
  function onResize(){for(const f of fish){if(!f.caught){f.x=Math.max(-f.w,Math.min(innerWidth-f.w,f.x));f.y=Math.max(148,Math.min(innerHeight-f.h-12,f.y));position(f);}}for(const el of [$('.rod'),$('.bucket')]){const r=el.getBoundingClientRect();placeGear(el,r.left,r.top);}placeLedger();}
  function close(){alive=false;cancelAnimationFrame(frame);removeEventListener('scroll',onScroll);removeEventListener('resize',onResize);removeEventListener('keydown',onKeyDown);removeEventListener('pointerdown',onPointerDown);removeEventListener('pointermove',onPointerMove);if(storage)chrome.storage.onChanged.removeListener(onStorage);if(themeObserver)themeObserver.disconnect();if(darkSchemeMedia?.removeEventListener)darkSchemeMedia.removeEventListener('change',updateThemeMode);animations.forEach(a=>a.cancel());host.remove();}
  host.addEventListener('fishing-close',close);$('.close').onclick=close;
  const audioBtn=$('.tool.audio');
  if(audioBtn){
    audioBtn.onclick=()=>{
      initAudio();soundMuted=!soundMuted;
      audioBtn.innerHTML=soundMuted?uiIcon('audioMute'):uiIcon('audioOn');
      audioBtn.setAttribute('aria-label',soundMuted?'Unmute audio':'Mute audio');
      audioBtn.title=soundMuted?'Sound: Muted (M)':'Sound: On (M)';
      $('.hint').textContent=soundMuted?'Audio muted.':'Audio enabled.';
      try{if(storage)chrome.storage.local.set({pageFishingMuted:soundMuted});else localStorage.setItem('pageFishingMuted',JSON.stringify(soundMuted));}catch{}
    };
  }
  const weatherBtn=$('.tool.weather');
  if(weatherBtn){
    weatherBtn.onclick=()=>{
      if(weather==='day')weather='night';
      else if(weather==='night')weather='rain';
      else weather='day';
      applyWeather();
      saveWeather();
    };
  }
  function onKeyDown(e){
    const tag=(e.target?.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea'||e.target?.isContentEditable)return;
    if(e.key==='Escape'){if(!$('.ledger').hidden){$('.ledger').hidden=true;$('.bucket').setAttribute('aria-expanded','false');}}
    else if(e.key==='p'||e.key==='P'){$('.pause').click();}
    else if(e.key==='b'||e.key==='B'){$('.bucket').click();}
    else if(e.key==='m'||e.key==='M'){if(audioBtn)audioBtn.click();}
    else if(e.key==='w'||e.key==='W'){if(weatherBtn)weatherBtn.click();}
  }
  addEventListener('keydown',onKeyDown);
  function createRipple(x,y){
    if(reduced)return;
    const ripple=document.createElement('div');ripple.className='water-ripple';ripple.style.left=`${x}px`;ripple.style.top=`${y}px`;$('.effects').append(ripple);
    const a=animate(ripple,[{transform:'translate(-50%,-50%) scale(0.1)',opacity:.75},{transform:'translate(-50%,-50%) scale(1)',opacity:0}],{duration:750,easing:'ease-out'});
    a.finished.then(()=>ripple.remove(),()=>ripple.remove());
    playSfx('ripple');
    for(const f of fish){
      if(f.caught||f.entering)continue;
      const dx=x-(f.x+f.w/2),dy=y-(f.y+f.h/2),dist=Math.hypot(dx,dy);
      if(dist<130&&dist>15)f.angle=lerp(f.angle,Math.atan2(dy,dx),.35);
    }
  }
  function onPointerDown(e){initAudio();if(!alive||paused)return;if(host.contains(e.target)||e.target?.closest?.('#page-fishing-root'))return;createRipple(e.clientX,e.clientY);}
  addEventListener('pointerdown',onPointerDown,{passive:true});
  let lastMouse={x:0,y:0,time:0};
  function onPointerMove(e){
    lastPointerX=e.clientX;lastPointerY=e.clientY;lastPointerTime=performance.now();
    const now=performance.now(),dt=now-lastMouse.time;
    if(dt>35){
      const vx=(e.clientX-lastMouse.x)/dt,vy=(e.clientY-lastMouse.y)/dt;
      lastMouse={x:e.clientX,y:e.clientY,time:now};
      if(Math.hypot(vx,vy)>1.2&&!paused&&!reduced){
        for(const f of fish){
          if(f.caught||f.entering)continue;
          const dx=e.clientX-(f.x+f.w/2),dy=e.clientY-(f.y+f.h/2);
          if(Math.hypot(dx,dy)<70){f.burstPhase=Math.random()*Math.PI*2;f.age+=.25;}
        }
      }
    }
  }
  addEventListener('pointermove',onPointerMove,{passive:true});
  $('.pause').onclick=()=>{paused=!paused;$('.pause').innerHTML=paused?uiIcon('play'):uiIcon('pause');$('.pause').setAttribute('aria-label',paused?'Resume swimming':'Pause swimming');$('.hint').textContent=paused?'Swimming paused. You can still catch.':'Spot a fish? Click to catch.';root.querySelectorAll('.art').forEach(el=>el.style.animationPlayState=paused?'paused':'running');root.querySelectorAll('.tail,.fin,.limb,.trailing,.ray-wing,.creature-eye,.puffer-body,.lantern-stalk,.lantern-glow,.dorsal-flutter,.star-body,.gills').forEach(el=>el.style.animationPlayState=paused?'paused':'running');};
  $('.bucket').onclick=()=>{if(performance.now()<ignoreBucketClick)return;$('.ledger').hidden=!$('.ledger').hidden;$('.bucket').setAttribute('aria-expanded',String(!$('.ledger').hidden));$('.toast').hidden=true;renderBucket();placeLedger();};
  $('.bucket-tab').onclick=()=>{indexOpen=false;rewardsOpen=false;shopOpen=false;renderBucket();placeLedger();};$('.index-tab').onclick=()=>{indexOpen=true;rewardsOpen=false;shopOpen=false;renderBucket();placeLedger();};$('.shop-tab').onclick=()=>{indexOpen=false;rewardsOpen=false;shopOpen=true;renderBucket();placeLedger();};$('.rewards-tab').onclick=()=>{indexOpen=false;rewardsOpen=true;shopOpen=false;renderBucket();placeLedger();};releaseButton.onclick=releaseBucket;
  const bookStyle=document.createElement('style');bookStyle.textContent=`
    .rod,.bucket{position:absolute!important;right:auto!important;pointer-events:auto;touch-action:none;cursor:grab;user-select:none}.rod{width:119px!important;height:88px!important}.bucket{width:54px!important;height:56px!important}.bucket svg{width:54px!important;height:56px!important}.bucket .count{top:30px;font-size:13px}.rod:active,.bucket:active{cursor:grabbing}.rod svg{pointer-events:none}.gear-grip{position:absolute;bottom:-10px;left:40%;font:10px sans-serif;color:#6d8d87;opacity:0}.rod:hover .gear-grip{opacity:1}
    .spread{display:grid;grid-template-columns:1fr 1fr;box-shadow:inset 0 1px #c2baa1;background:#f7f2e4}
    .leaf{padding:8px 16px 0;position:relative;background:linear-gradient(90deg,#f8f3e7 90%,#dfd8c5)}.leaf+.leaf{border-left:1px solid #b9ae92;background:linear-gradient(90deg,#dbd3bc,#f8f3e7 10%)}
    .specimen{position:relative;min-height:190px;text-align:center;padding:9px 0 12px;border:0!important;border-bottom:1px solid #d7d0bc!important}
    .specimen-art{height:85px;display:flex;justify-content:center}.specimen-art svg{width:132px;height:85px}
    .specimen strong{display:block;font:18px Georgia,serif;color:#354e49}.specimen small{display:block;color:#879084;font-size:10px}.folio{text-align:left;letter-spacing:1px}
    .locked .specimen-art{filter:brightness(0);opacity:.16}.locked .tail,.locked .fin{animation:none}.locked strong{color:#8f9789;font-style:italic}
    .chance{font:13px Georgia,serif;color:#6e725c;margin:5px}.page-number{text-align:center;font:12px Georgia,serif;color:#8d8c75;padding:9px}
    .book-nav{display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:10px;font-size:10px;color:#768274}
    .book-nav button{background:none;border:0;color:#4b6d60;padding:8px;font:13px Georgia,serif}.book-nav button:disabled{opacity:.3}
    .book-open .entries{flex:1 1 auto;min-height:0;height:auto;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column;justify-content:space-between;scrollbar-width:thin;scrollbar-color:#a6b9a2 #ece9db;overscroll-behavior:contain}
    @media(max-width:520px){.leaf{padding:8px 6px 0}.specimen strong{font-size:15px}.specimen-art svg{width:110px}.specimen{min-height:177px}.book-nav{flex-wrap:wrap}.book-nav span{order:3;width:100%;text-align:center}}
  `;root.append(bookStyle);
  const bookFix=document.createElement('style');bookFix.textContent='.ledger{z-index:10;box-sizing:border-box}.rod,.bucket{z-index:2}.close-book{margin-left:auto}.book-open .spread .leaf{overflow:hidden}';root.append(bookFix);
  const rewardPanel=document.createElement('div');rewardPanel.className='reward-panel';rewardPanel.hidden=true;rewardPanel.innerHTML='<summary class="reward-summary" style="display:none"></summary><div class="reward-buttons"></div><p>Released creatures still count. Equip one finish per item; effects can be combined.</p>';
  rewardPanel.querySelector('summary').onclick=()=>{if(rewardsOpen)$('.bucket-tab').click();else $('.rewards-tab').click();};
  $('.tabs').after(rewardPanel);
  function renderRewards(){
    const panel=$('.reward-buttons');if(!panel)return;const count=new Set(records.map(r=>r.kind??0)).size;panel.replaceChildren();
    for(const [key,limit,label,group,color,description] of rewardCatalog){
      const card=document.createElement('section');card.className='reward-card';const swatch=document.createElement('span');swatch.className='reward-swatch';swatch.style.background=color;swatch.innerHTML=uiIcon(group==='effects'?'bubbles':group==='badge'?'badge':group,20);
      const copy=document.createElement('div'),title=document.createElement('strong'),detail=document.createElement('p'),progress=document.createElement('small');title.textContent=label;detail.textContent=description;progress.textContent=count<limit?`${count} / ${limit} species`:`Unlocked at ${limit} species`;
      const btn=document.createElement('button');btn.dataset.reward=key;btn.disabled=count<limit;btn.textContent=count<limit?'Locked':rewards[key]?'Equipped · remove':'Equip';btn.setAttribute('aria-pressed',String(!!rewards[key]));btn.setAttribute('aria-label',`${label}: ${btn.textContent}`);
      btn.onclick=async()=>{const enabled=!rewards[key];if(enabled&&['bucket','rod','book'].includes(group))rewardCatalog.filter(r=>r[3]===group).forEach(r=>rewards[r[0]]=false);rewards[key]=enabled;applyRewards();renderRewards();try{if(storage)await chrome.storage.local.set({pageFishingRewards:rewards});else localStorage.setItem('pageFishingRewards',JSON.stringify(rewards));}catch{report('Style applied but could not be saved.');}};copy.append(title,detail,progress,btn);card.append(swatch,copy);panel.append(card);
    }
    const extra=panel.parentElement;
    let mastery=extra.querySelector('.mastery-section');
    if(!mastery){mastery=document.createElement('div');mastery.className='mastery-section';extra.append(mastery);}
    const badges=[
      {id:'c10',name:'Shore Caster',desc:'10 catches',unlocked:records.length>=10,icon:'I'},
      {id:'c25',name:'Reef Scout',desc:'25 catches',unlocked:records.length>=25,icon:'II'},
      {id:'c50',name:'Grand Angler',desc:'50 catches',unlocked:records.length>=50,icon:'III'},
      {id:'legend',name:'Abyssal Master',desc:'Catch a Legendary',unlocked:records.some(r=>r.rare||tierOf(r)==='Legendary'),icon:'IV'}
    ];
    mastery.innerHTML=`<span class="mastery-title">Angler Mastery</span><div class="mastery-grid">${badges.map(b=>`<div class="mastery-badge ${b.unlocked?'':'locked'}"><span class="mastery-icon">${b.icon}</span><div class="mastery-info"><strong>${b.name}</strong><small>${b.unlocked?'Unlocked':b.desc}</small></div></div>`).join('')}</div>`;
    let tipJar=extra.querySelector('.tip-jar-card');
    if(!tipJar){tipJar=document.createElement('section');tipJar.className='tip-jar-card';extra.append(tipJar);}
    const isSupporter=Boolean(rewards.supporter);
    if(isSupporter){
      tipJar.innerHTML=`
        <div class="tip-jar-header"><span class="tip-icon supporter-icon">${uiIcon('badge', 22)}</span><div><strong>Supporter Verified</strong><p>Thank you for supporting Page Fishing! Your exclusive Golden Thread & Gilded Hook are unlocked.</p></div></div>
        <div class="tip-jar-actions">
          <button class="gold-hook-btn" aria-pressed="${String(Boolean(rewards.goldenHook))}">${rewards.goldenHook?'Golden Thread: Equipped':'Equip Golden Thread & Hook'}</button>
          <a class="tip-btn tip-btn-subtle" href="https://buymeacoffee.com/saucescode" target="_blank" rel="noopener">Buy Me a Coffee</a>
        </div>`;
      tipJar.querySelector('.gold-hook-btn').onclick=async()=>{
        rewards.goldenHook=!rewards.goldenHook;applyRewards();renderRewards();
        try{if(storage)await chrome.storage.local.set({pageFishingRewards:rewards});else localStorage.setItem('pageFishingRewards',JSON.stringify(rewards));}catch{}
        playSfx('plop');
      };
      tipJar.querySelector('.tip-btn').onclick=()=>{visitedCoffeeLink=true;};
    }else{
      tipJar.innerHTML=`
        <div class="tip-jar-header"><span class="tip-icon">${uiIcon('badge', 22)}</span><div><strong>Support Page Fishing</strong><p>Enjoying the wildlife? Tips keep this project ad-free and help craft new wildlife & animations. Supporters unlock the exclusive Golden Thread & Hook!</p></div></div>
        <div class="tip-jar-actions">
          <a class="tip-btn" href="https://buymeacoffee.com/saucescode" target="_blank" rel="noopener">Buy Me a Coffee</a>
          <button class="gold-hook-btn gold-hook-locked" disabled title="Supporter Exclusive">${uiIcon('lock', 12)} Locked · Supporter Gear</button>
          <button class="unlock-prompt-btn">Unlock with Tip / Code</button>
        </div>
        <div class="unlock-form" hidden>
          <label class="unlock-label" for="supporter-code-input">Enter supporter passcode or confirm tip:</label>
          <div class="unlock-row">
            <input type="text" id="supporter-code-input" class="supporter-code-input" placeholder="e.g. COFFEE or GOLDEN" autocomplete="off" />
            <button class="verify-tip-btn">Verify Tip</button>
            <button class="cancel-unlock-btn">Cancel</button>
          </div>
          <div class="unlock-msg" hidden></div>
        </div>`;
      const tipBtn=tipJar.querySelector('.tip-btn');
      tipBtn.onclick=()=>{visitedCoffeeLink=true;};
      const unlockBtn=tipJar.querySelector('.unlock-prompt-btn');
      const unlockForm=tipJar.querySelector('.unlock-form');
      const codeInput=tipJar.querySelector('.supporter-code-input');
      const verifyBtn=tipJar.querySelector('.verify-tip-btn');
      const cancelBtn=tipJar.querySelector('.cancel-unlock-btn');
      const msg=tipJar.querySelector('.unlock-msg');
      unlockBtn.onclick=()=>{unlockForm.hidden=false;unlockBtn.hidden=true;codeInput.focus();};
      cancelBtn.onclick=()=>{unlockForm.hidden=true;unlockBtn.hidden=false;msg.hidden=true;};
      const doVerify=async()=>{
        const val=(codeInput.value||'').trim().toLowerCase();
        const validCodes=['coffee','golden','gold','supporter','donate','tip','thanks','thank you','backer','sauce','fish'];
        if(validCodes.includes(val)||(visitedCoffeeLink&&(!val||val==='yes'||val==='done'||val==='tipped'))){
          rewards.supporter=true;
          rewards.goldenHook=true;
          applyRewards();
          renderRewards();
          try{if(storage)await chrome.storage.local.set({pageFishingRewards:rewards});else localStorage.setItem('pageFishingRewards',JSON.stringify(rewards));}catch{}
          playSfx('discovery');
          $('.hint').textContent='Golden Thread & Gilded Hook unlocked! Thank you for your support!';
        }else{
          msg.hidden=false;
          msg.textContent="Enter 'COFFEE' or 'GOLDEN', or visit Buy Me a Coffee to verify.";
        }
      };
      verifyBtn.onclick=doVerify;
      codeInput.onkeydown=(e)=>{if(e.key==='Enter'){e.preventDefault();doVerify();}};
    }
  }
  let shopFilter='all';
  const shopPanel=document.createElement('div');shopPanel.className='shop-panel';shopPanel.hidden=true;
  rewardPanel.after(shopPanel);

  function renderBaitBadge(){
    const b=$('.bait-badge');if(!b)return;
    if(activeBait&&activeBait.count>0){
      b.hidden=false;b.textContent=`${activeBait.name.split(' ')[0]} (${activeBait.count})`;
      b.title=`Active bait: ${activeBait.name} (${activeBait.count} catches remaining)`;
    }else{
      b.hidden=true;
    }
  }

  const weatherIcons={
    day:'<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8" cy="8" r="3.2"/><path d="M8 1.5v1.5m0 10v1.5m-6.5-6.5h1.5m10 0h1.5m-1.9-4.6l-1.1 1.1m-7 7l-1.1 1.1m0-9.2l1.1 1.1m7 7l1.1 1.1"/></svg>',
    night:'<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M13.5 9.8A6 6 0 1 1 6.2 2.5a4.8 4.8 0 0 0 7.3 7.3z"/></svg>',
    rain:'<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4 8.5a3 3 0 0 1 5.8-1 2.5 2.5 0 0 1 3.2 2.7 2.3 2.3 0 0 1-2 2.3H4.5A2.5 2.5 0 0 1 4 8.5z"/><path d="M5.5 13.5l-1 2m4-2l-1 2m4-2l-1 2"/></svg>'
  };

  function applyWeather(){
    host.setAttribute('data-weather',weather);
    updateThemeMode();
    if(weatherBtn){
      if(weather==='night'){
        weatherBtn.innerHTML=weatherIcons.night;weatherBtn.title='Weather: Moonlit Night (W)';weatherBtn.setAttribute('aria-label','Weather: Moonlit Night (W)');$('.hint').textContent='Moonlit Night: luminous ocean glow.';
      }else if(weather==='rain'){
        weatherBtn.innerHTML=weatherIcons.rain;weatherBtn.title='Weather: Gentle Rain (W)';weatherBtn.setAttribute('aria-label','Weather: Gentle Rain (W)');$('.hint').textContent='Gentle Rain: soothing ripples across the surface.';
      }else{
        weatherBtn.innerHTML=weatherIcons.day;weatherBtn.title='Weather: Daylight (W)';weatherBtn.setAttribute('aria-label','Weather: Daylight (W)');$('.hint').textContent='Daylight: crisp water visibility.';
      }
    }
  }

  function applySkins(){
    host.setAttribute('data-skin-rod',equippedSkins.rod||'rod_classic');
    host.setAttribute('data-skin-line',equippedSkins.line||'line_mono');
    host.setAttribute('data-skin-bucket',equippedSkins.bucket||'bucket_seafoam');
  }

  async function savePearls(){
    try{
      if(storage)await chrome.storage.local.set({pageFishingPearls:pearls});
      else localStorage.setItem('pageFishingPearls',JSON.stringify(pearls));
    }catch{}
  }
  async function saveSkins(){
    try{
      const state={owned:[...ownedSkins],equipped:equippedSkins,bait:activeBait};
      if(storage)await chrome.storage.local.set({pageFishingSkins:state});
      else localStorage.setItem('pageFishingSkins',JSON.stringify(state));
    }catch{}
  }
  async function saveWeather(){
    try{
      if(storage)await chrome.storage.local.set({pageFishingWeather:weather});
      else localStorage.setItem('pageFishingWeather',JSON.stringify(weather));
    }catch{}
  }
  async function saveCompanion(){
    try{
      if(storage)await chrome.storage.local.set({pageFishingCompanion:activeCompanion});
      else localStorage.setItem('pageFishingCompanion',JSON.stringify(activeCompanion));
    }catch{}
  }

  function updateCompanionVisual(){
    const compEl=$('.companion-swimmer');if(!compEl)return;
    if(activeCompanion){
      compEl.hidden=false;
      compEl.innerHTML=`<span class="companion-halo"><svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#79bfb5" stroke-width="1.6" stroke-dasharray="2.5 2.5"><circle cx="8" cy="8" r="5.5"/></svg></span>${illustration(activeCompanion.kind??0,palettes[activeCompanion.palette??0]||palettes[0],activeCompanion.pattern??0,activeCompanion.rare)}`;
      compEl.title=`Companion: ${activeCompanion.name}`;
    }else{
      compEl.hidden=true;compEl.replaceChildren();
    }
  }

  function toggleCompanion(r){
    if(activeCompanion&&activeCompanion.id===r.id){
      activeCompanion=null;
      $('.hint').textContent='Companion returned to the bucket.';
    }else{
      activeCompanion={id:r.id,name:r.name,kind:r.kind,palette:r.palette,pattern:r.pattern,rare:r.rare,size:r.size};
      playSfx('discovery');
      $('.hint').textContent=`${r.name} is now following you!`;
    }
    saveCompanion();updateCompanionVisual();renderBucket();
  }

  function openPolaroid(r){
    const overlay=$('.polaroid-overlay');if(!overlay)return;
    overlay.replaceChildren();
    const card=document.createElement('div');card.className='polaroid-card';
    card.innerHTML=`
      <button class="polaroid-close" aria-label="Close keepsake">×</button>
      <div class="polaroid-photo">
        ${illustration(r.kind??0,palettes[r.palette??0]||palettes[0],r.pattern??0,r.rare)}
      </div>
      <div class="polaroid-caption">
        <strong>${r.name}</strong>
        <div class="polaroid-meta">${r.size} cm · ${tierOf(r)} · ${r.habitat||'Wild'}</div>
        <div class="polaroid-stamp">Angler's Keepsake · ${r.site||'Page Fishing'}</div>
      </div>
      <div class="polaroid-actions">
        <button class="polaroid-save-btn">Download Snap</button>
      </div>
    `;
    card.querySelector('.polaroid-close').onclick=()=>{overlay.hidden=true;overlay.replaceChildren();};
    overlay.onclick=e=>{if(e.target===overlay){overlay.hidden=true;overlay.replaceChildren();}};
    card.querySelector('.polaroid-save-btn').onclick=()=>{
      try{
        const svgContent=`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="490" viewBox="0 0 400 490">
  <rect width="400" height="490" rx="16" fill="#fcfaf2" stroke="#d5ceba" stroke-width="3"/>
  <rect x="25" y="25" width="350" height="310" rx="10" fill="#e8f0eb" stroke="#c0d1c8" stroke-width="1.5"/>
  <g transform="translate(138, 140) scale(1.65)">
    ${illustration(r.kind??0,palettes[r.palette??0]||palettes[0],r.pattern??0,r.rare)}
  </g>
  <text x="200" y="375" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-style="italic" fill="#2d493f">${r.name}</text>
  <text x="200" y="405" text-anchor="middle" font-family="'Trebuchet MS', sans-serif" font-size="13" fill="#69776b">${r.size} cm · ${tierOf(r)} · ${r.habitat||'Coastal Waters'}</text>
  <text x="200" y="445" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#9ba89c">Angler's Keepsake · ${r.site||'Page Fishing'} · ${new Date(r.date||Date.now()).toLocaleDateString()}</text>
</svg>`;
        const blob=new Blob([svgContent],{type:'image/svg+xml;charset=utf-8'});
        const url=URL.createObjectURL(blob);
        const a=document.createElement('a');a.href=url;a.download=`${r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-snap.svg`;a.click();
        URL.revokeObjectURL(url);
        $('.hint').textContent='Souvenir snap downloaded!';
      }catch{}
    };
    overlay.append(card);
    overlay.hidden=false;
  }

  function renderShop(){
    if(!shopPanel)return;
    shopPanel.replaceChildren();
    const header=document.createElement('div');header.className='shop-header';
    header.innerHTML=`
      <div class="shop-balance">
        <span class="pearl-gem">${uiIcon('pearl',20)}</span>
        <div>
          <strong>${pearls} Pearls in Pouch</strong>
          <p>Earn pearls on every catch and by freeing fish into the wild.</p>
        </div>
      </div>
      ${activeBait?`<div class="active-bait-banner">Active Bait: <strong>${activeBait.name}</strong> (${activeBait.count} catches left)</div>`:''}
    `;

    const filters=document.createElement('div');filters.className='shop-filters';
    const categories=[
      {id:'all',label:'All Gear'},
      {id:'rod',label:'Rods'},
      {id:'line',label:'Lines'},
      {id:'bucket',label:'Buckets'},
      {id:'bait',label:'Baits'}
    ];
    categories.forEach(cat=>{
      const btn=document.createElement('button');btn.className='shop-filter-btn';btn.textContent=cat.label;
      btn.setAttribute('aria-pressed',String(shopFilter===cat.id));
      btn.onclick=()=>{shopFilter=cat.id;renderShop();};
      filters.append(btn);
    });

    const grid=document.createElement('div');grid.className='shop-grid';
    const items=shopCatalog.filter(item=>shopFilter==='all'||item.slot===shopFilter);
    for(const item of items){
      const card=document.createElement('section');card.className='shop-card';
      card.dataset.itemId=item.id;
      const isOwned=ownedSkins.has(item.id);
      const isEquipped=item.slot!=='bait'&&equippedSkins[item.slot]===item.id;
      const isBaitActive=item.slot==='bait'&&activeBait?.id===item.id;

      card.innerHTML=`
        <div class="shop-icon" style="background:${item.color}22;border-color:${item.color}55;color:${item.color}">${uiIcon(item.slot, 20)}</div>
        <div class="shop-details">
          <div class="shop-title-row">
            <strong>${item.name}</strong>
            <span class="shop-slot-pill">${item.slot.toUpperCase()}</span>
          </div>
          <p>${item.desc}</p>
          <span class="shop-price">${item.price===0?'Starter Gear':`${item.price} Pearls`}</span>
        </div>
      `;

      const actionBtn=document.createElement('button');actionBtn.className='shop-action-btn';
      if(item.slot==='bait'){
        if(isBaitActive){
          actionBtn.textContent=`Active (${activeBait.count}x)`;actionBtn.classList.add('equipped');actionBtn.disabled=true;
        }else{
          actionBtn.textContent=pearls>=item.price?`Bait Up · ${item.price} pearls`:`Need ${item.price} pearls`;
          actionBtn.disabled=pearls<item.price;
          actionBtn.onclick=()=>{
            if(pearls>=item.price){
              pearls-=item.price;activeBait={id:item.id,name:item.name,count:item.count||3};
              savePearls();saveSkins();applySkins();renderShop();renderBaitBadge();playSfx('discovery');
              $('.hint').textContent=`Applied ${item.name}! Next ${item.count} catches boosted.`;
            }
          };
        }
      }else if(isOwned){
        if(isEquipped){
          actionBtn.textContent='Equipped';actionBtn.classList.add('equipped');actionBtn.setAttribute('aria-pressed','true');actionBtn.disabled=true;
        }else{
          actionBtn.textContent='Equip';
          actionBtn.onclick=()=>{
            equippedSkins[item.slot]=item.id;saveSkins();applySkins();renderShop();playSfx('plop');
            $('.hint').textContent=`Equipped ${item.name}!`;
          };
        }
      }else{
        actionBtn.textContent=pearls>=item.price?`Buy · ${item.price} pearls`:`Need ${item.price} pearls`;
        actionBtn.disabled=pearls<item.price;
        actionBtn.onclick=()=>{
          if(pearls>=item.price){
            pearls-=item.price;ownedSkins.add(item.id);equippedSkins[item.slot]=item.id;
            savePearls();saveSkins();applySkins();renderShop();playSfx('discovery');
            $('.hint').textContent=`Purchased & equipped ${item.name}!`;
          }
        };
      }
      card.append(actionBtn);
      grid.append(card);
    }
    shopPanel.append(header,filters,grid);
  }

  function applyRewards(){const count=new Set(records.map(r=>r.kind??0)).size;host.dataset.reed=String(!!rewards.bucket&&count>=5);host.dataset.copper=String(!!rewards.rod&&count>=10);host.dataset.ocean=String(!!rewards.book&&count>=20);for(const [key,limit] of rewardCatalog)host.setAttribute('data-reward-'+key.toLowerCase(),String(!!rewards[key]&&count>=limit));host.setAttribute('data-reward-goldenhook',String(Boolean(rewards.supporter&&rewards.goldenHook)));}
  renderRewards();
  (async()=>{
    await ready;
    try{
      rewards=(storage?(await chrome.storage.local.get('pageFishingRewards')).pageFishingRewards:JSON.parse(localStorage.getItem('pageFishingRewards')||'{}'))||{};
      const m=storage?(await chrome.storage.local.get('pageFishingMuted')).pageFishingMuted:JSON.parse(localStorage.getItem('pageFishingMuted')||'false');
      if(m&&audioBtn){soundMuted=true;audioBtn.innerHTML=uiIcon('audioMute');audioBtn.setAttribute('aria-label','Unmute audio');audioBtn.title='Sound: Muted (M)';}

      const p=storage?(await chrome.storage.local.get('pageFishingPearls')).pageFishingPearls:JSON.parse(localStorage.getItem('pageFishingPearls')||'null');
      if(p!==null&&p!==undefined){pearls=Number(p)||0;}
      else{pearls=records.reduce((s,r)=>s+pearlValue(r),0);savePearls();}

      const sk=storage?(await chrome.storage.local.get('pageFishingSkins')).pageFishingSkins:JSON.parse(localStorage.getItem('pageFishingSkins')||'null');
      if(sk){
        if(Array.isArray(sk.owned))sk.owned.forEach(id=>ownedSkins.add(id));
        if(sk.equipped)equippedSkins={...equippedSkins,...sk.equipped};
        if(sk.bait&&sk.bait.count>0)activeBait=sk.bait;
      }

      const w=storage?(await chrome.storage.local.get('pageFishingWeather')).pageFishingWeather:JSON.parse(localStorage.getItem('pageFishingWeather')||'null');
      if(w&&['day','night','rain'].includes(w))weather=w;

      const comp=storage?(await chrome.storage.local.get('pageFishingCompanion')).pageFishingCompanion:JSON.parse(localStorage.getItem('pageFishingCompanion')||'null');
      if(comp&&comp.id)activeCompanion=comp;

      if(alive){
        applyRewards();applySkins();applyWeather();renderBaitBadge();updateCompanionVisual();renderRewards();renderBucket();
      }
    }catch{}
  })();
  const creatureStyle=document.createElement('style');creatureStyle.textContent=`
    .reward-panel{margin:0 0 12px;font:11px/1.5 'Trebuchet MS',sans-serif;color:#657b64;flex-shrink:0;max-height:145px;overflow:auto}.reward-panel summary{cursor:pointer;padding:7px 2px}.reward-panel p{font-size:10px;margin:6px 0}.reward-buttons{display:flex;flex-wrap:wrap;gap:5px}.reward-buttons button{border:1px solid #b9c7ac;border-radius:7px;background:#e6ecdc;color:#48604d;padding:6px 9px;font:11px 'Trebuchet MS',sans-serif}.reward-buttons button:disabled{opacity:.55;cursor:default}.reward-buttons button[aria-pressed=true]{background:#526f59;color:#fff8df}
    :host([data-reed="true"]) .bucket svg{filter:sepia(.5) hue-rotate(335deg) saturate(.8)}:host([data-copper="true"]) .rod svg{filter:sepia(.7) hue-rotate(330deg) saturate(1.4)}:host([data-ocean="true"]) .leaf{background:linear-gradient(90deg,#edf4f4 90%,#bdced8)}:host([data-ocean="true"]) .leaf+.leaf{background:linear-gradient(90deg,#bdced8,#edf4f4 10%)}
    .rare-arrival::before{content:'';position:absolute;inset:15% 0;border-radius:50%;background:#73949d33;filter:blur(8px);animation:arrival-shadow 2s ease-out both;pointer-events:none}.rare-arrival::after{content:'';position:absolute;left:25%;top:-6px;width:5px;height:5px;border-radius:50%;background:#86b8b6;box-shadow:12px -5px 0 -1px #86b8b6, 24px -2px 0 1px #86b8b6;animation:arrival-bubbles 2s ease-out both;pointer-events:none}.rare-arrival[data-rarity="Legendary"]::after{background:#d5bb79;box-shadow:12px -5px 0 -1px #d5bb79, 24px -2px 0 1px #d5bb79}
    .swimmer .limb{transform-box:fill-box;transform-origin:top center;animation:limb-stroke 1.7s ease-in-out infinite alternate;animation-delay:var(--limb-delay,0s)}.swimmer[data-species="15"] .limb,.swimmer[data-species="23"] .limb{animation-duration:.38s}.swimmer[data-species="12"] .limb{animation-duration:2.5s}.swimmer .trailing{transform-box:fill-box;transform-origin:left center;animation:trail-wave 2s ease-in-out infinite alternate;animation-delay:var(--limb-delay,0s)}.swimmer .ray-wing{transform-box:fill-box;transform-origin:60% 50%;animation:ray-glide 2.8s ease-in-out infinite alternate}.swimmer .creature-eye{transform-box:fill-box;transform-origin:center;animation:eye-blink 7s ease-in-out infinite;animation-delay:var(--blink-delay,0s)}.swimmer .fin{animation-delay:var(--limb-delay,0s)}
    @keyframes limb-stroke{from{transform:rotate(-8deg)}to{transform:rotate(9deg)}}@keyframes trail-wave{from{transform:skewY(-5deg)}to{transform:skewY(6deg)}}@keyframes ray-glide{from{transform:scaleY(.93) skewX(-2deg)}to{transform:scaleY(1.05) skewX(2deg)}}@keyframes eye-blink{0%,44%,48%,100%{transform:scaleY(1)}46%{transform:scaleY(.15)}}@keyframes arrival-shadow{from{opacity:1;transform:scale(1.5)}to{opacity:0;transform:scale(.8)}}@keyframes arrival-bubbles{from{opacity:.8;translate:0 15px}to{opacity:0;translate:5px -24px}}
    @media(prefers-reduced-motion:reduce){.swimmer .limb,.swimmer .trailing,.swimmer .ray-wing,.swimmer .creature-eye{animation:none!important}}
  `;root.append(creatureStyle);
  const rewardStyle=document.createElement('style');rewardStyle.textContent=`
    .ledger .reward-panel{flex:1 1 auto;min-height:0;max-height:none;overflow:auto;margin:0;padding:2px 6px 0 0;scrollbar-width:thin}.ledger .reward-buttons{display:grid;gap:10px}.reward-card{display:flex;gap:12px;border:1px solid #d4dcc6;border-radius:12px;background:#e9eddf;padding:12px}.reward-swatch{width:44px;height:48px;flex-shrink:0;display:grid;place-items:center;color:#fff8e8;font:30px Georgia;border-radius:10px;box-shadow:inset 0 -6px #0000000c}.reward-card strong{font:16px Georgia;color:#425e4c}.reward-card p{font:11px/1.5 'Trebuchet MS',sans-serif;margin:4px 0;color:#75816b}.reward-card small{display:block;font-size:10px;margin:4px 0 8px;color:#7b876e}.reward-card button{min-width:82px}.ledger:not(.book-open):not(.rewards-open) .tabs{gap:4px}.ledger:not(.book-open):not(.rewards-open) .tabs button{padding:7px 8px;font-size:11px}
    :host([data-reward-pearlbucket="true"]) .bucket svg{filter:grayscale(.8) brightness(1.4)}:host([data-reward-moonrod="true"]) .rod svg{filter:hue-rotate(30deg) saturate(.65) brightness(1.4)}:host([data-reward-coralbook="true"]) .leaf{background:linear-gradient(90deg,#faf0e5 90%,#dbc3b2)}:host([data-reward-coralbook="true"]) .leaf+.leaf{background:linear-gradient(90deg,#dbc3b2,#faf0e5 10%)}
    :host([data-reward-glow="true"]) .swimmer{filter:drop-shadow(0 0 6px #accedb88)}:host([data-reward-bubbles="true"]) .swimmer:not(.rare-arrival):not(.caught)::after{content:'';position:absolute;left:-16px;top:40%;width:5px;height:5px;border-radius:50%;border:1px solid #8cbab5;box-shadow:-6px -4px 0 -1px #8cbab5;pointer-events:none;animation:reward-bubbles 2s ease-out infinite}:host([data-reward-crest="true"]) .bucket::after{content:'';position:absolute;right:-7px;top:19px;width:12px;height:12px;border-radius:50%;border:2px solid #c7a65a;box-shadow:0 0 0 1px #fff8df, 0 1px 3px rgba(0,0,0,.15);background:radial-gradient(circle at 35% 35%,#ffe8a3,#c7a65a);pointer-events:none}
    .pull-spray{position:absolute;width:5px;height:5px;border-radius:50%;background:#b9e7eb;box-shadow:0 0 6px #7ed6dd;pointer-events:none}.pull-bubble{position:absolute;width:6px;height:6px;border-radius:50%;border:1.2px solid #a3dde2;background:#ffffff55;pointer-events:none}
    .tip-jar-card{margin-top:14px;border:1px solid #d4c498;background:linear-gradient(135deg,#fcf8ec,#f5edd6);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:10px}
    .tip-jar-header{display:flex;gap:10px;align-items:flex-start}.tip-icon{font-size:24px;line-height:1;display:flex;align-items:center}.tip-jar-header strong{font:15px Georgia,serif;color:#544322}.tip-jar-header p{margin:3px 0 0;font:11px/1.4 'Trebuchet MS',sans-serif;color:#786642}
    .tip-jar-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.tip-btn{display:inline-flex;align-items:center;background:#577a67;color:#fff9eb;text-decoration:none;padding:6px 12px;border-radius:8px;font:bold 11px 'Trebuchet MS',sans-serif;box-shadow:0 2px 6px #3b5a4a33;transition:background .2s}.tip-btn:hover{background:#456754}
    .tip-btn-subtle{background:#8a9c8b;font-weight:normal;opacity:.88}.tip-btn-subtle:hover{background:#6e826f;opacity:1}
    .gold-hook-btn{border:1px solid #c9b16e;background:#faf3de;color:#5c471c;border-radius:8px;padding:6px 11px;font:11px 'Trebuchet MS',sans-serif;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
    .gold-hook-btn[aria-pressed="true"]{background:#dcb754;color:#3b2d07;font-weight:bold;box-shadow:inset 0 1px 3px rgba(0,0,0,.15)}
    .gold-hook-btn.gold-hook-locked{opacity:.65;cursor:not-allowed;background:#ebe6d8;border-color:#cfc7b4;color:#766c56}
    .unlock-prompt-btn{border:1px dashed #bba46c;background:#fffaf0;color:#6b5321;border-radius:8px;padding:6px 11px;font:11px 'Trebuchet MS',sans-serif;cursor:pointer;transition:all .15s}
    .unlock-prompt-btn:hover{background:#fdf2da;border-color:#9e844a;color:#4c380f}
    .unlock-form{background:#fdf9ee;border:1px solid #e0d4b6;border-radius:10px;padding:9px 12px;margin-top:2px;display:flex;flex-direction:column;gap:6px}
    .unlock-label{font:11px 'Trebuchet MS',sans-serif;color:#66542d;font-weight:600}
    .unlock-row{display:flex;gap:6px;align-items:center}
    .supporter-code-input{flex:1 1 auto;min-width:0;padding:5px 9px;border:1px solid #c9bc9c;border-radius:6px;font:11px 'Trebuchet MS',sans-serif;background:#fff;color:#362c16}
    .supporter-code-input:focus{outline:2px solid #dcb754;border-color:#b59132}
    .verify-tip-btn{border:1px solid #4a755d;background:#577a67;color:#fff9eb;border-radius:6px;padding:5px 12px;font:bold 11px 'Trebuchet MS',sans-serif;cursor:pointer}
    .verify-tip-btn:hover{background:#456754}
    .cancel-unlock-btn{border:1px solid #c9c2b0;background:#ede8da;color:#675e4c;border-radius:6px;padding:5px 10px;font:11px 'Trebuchet MS',sans-serif;cursor:pointer}
    .cancel-unlock-btn:hover{background:#ded8c7}
    .unlock-msg{font:italic 10.5px/1.3 Georgia,serif;color:#855e1a}
    .tip-icon.supporter-icon{color:#d4981d;filter:drop-shadow(0 0 5px #ffd700)}
    .mastery-section{margin-top:14px}.mastery-title{font:italic 16px Georgia,serif;color:#3d5c50;margin:0 0 8px;display:block}
    .mastery-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .mastery-badge{display:flex;gap:8px;align-items:center;padding:8px 10px;background:#e8ece0;border:1px solid #c8d3bf;border-radius:10px}
    .mastery-badge.locked{opacity:.55;filter:grayscale(.7)}.mastery-icon{font-size:18px}.mastery-info strong{display:block;font:12px Georgia,serif;color:#365345}.mastery-info small{display:block;font-size:10px;color:#75836f}
    @keyframes reward-bubbles{from{opacity:.7;translate:0 5px}to{opacity:0;translate:-8px -14px}}@media(prefers-reduced-motion:reduce){:host([data-reward-bubbles="true"]) .swimmer::after{animation:none!important}}
  `;root.append(rewardStyle);
  const motionStyle=document.createElement('style');motionStyle.textContent=`
    .swimmer .tail{animation-duration:var(--stroke-speed,1.1s)}
    .swimmer[data-species="12"] .fin,.swimmer[data-species="10"] .fin,.swimmer[data-species="19"] .fin{animation-duration:2.8s;animation-timing-function:ease-in-out}
    .swimmer[data-species="15"] .fin{animation-duration:.32s;animation-name:scuttle}
    .swimmer[data-species="13"] .fin{animation-name:tentacles;animation-duration:2.8s;transform-origin:top center}
    .swimmer[data-species="14"] .fin{animation-duration:1.8s;animation-name:tentacles}
    .swimmer[data-species="9"] .tail,.swimmer[data-species="16"] .tail{animation-duration:2.6s}
    .swimmer.caught .tail{animation-duration:.2s}
    .swimmer[data-species="2"] .puffer-body{transform-box:fill-box;transform-origin:center;animation:puffer-puff 2s ease-in-out infinite}
    .swimmer[data-species="5"] .lantern-stalk{transform-box:fill-box;transform-origin:82px 27px;animation:lure-bob 2.4s ease-in-out infinite}
    .swimmer[data-species="5"] .lantern-glow{transform-box:fill-box;transform-origin:106px 14px;animation:lantern-glow 1.6s ease-in-out infinite}
    .swimmer[data-species="9"] .dorsal-flutter{transform-box:fill-box;transform-origin:58px 45px;animation:seahorse-flutter .22s linear infinite}
    .swimmer[data-species="20"] .star-body{transform-box:fill-box;transform-origin:64px 47px;animation:starfish-pulse 2.8s ease-in-out infinite}
    .swimmer[data-species="26"] .gills{transform-box:fill-box;transform-origin:90px 35px;animation:gill-sway 2s ease-in-out infinite}
    @keyframes scuttle{from{transform:translateY(-1px) rotate(-3deg)}to{transform:translateY(1px) rotate(3deg)}}
    @keyframes tentacles{0%,100%{transform:skewX(-5deg) scaleY(.95)}50%{transform:skewX(5deg) scaleY(1.05)}}
    @keyframes puffer-puff{0%,100%{transform:scale(1)}50%{transform:scale(1.06,1.04)}}
    @keyframes lure-bob{0%,100%{transform:rotate(0deg)}50%{transform:rotate(-6deg)}}
    @keyframes lantern-glow{0%,100%{opacity:.7;transform:scale(.92)}50%{opacity:1;transform:scale(1.12)}}
    @keyframes seahorse-flutter{0%,100%{transform:skewY(-8deg) scaleX(.9)}50%{transform:skewY(8deg) scaleX(1.08)}}
    @keyframes starfish-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03,.97)}}
    @keyframes gill-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(5deg)}}
    @media(prefers-reduced-motion:reduce){.swimmer .puffer-body,.swimmer .lantern-stalk,.swimmer .lantern-glow,.swimmer .dorsal-flutter,.swimmer .star-body,.swimmer .gills{animation:none!important}}
  `;root.append(motionStyle);
  const creelStyle=document.createElement('style');creelStyle.textContent=`
    .bucket svg{transform-origin:50% 80%;animation:bucket-rest 5s ease-in-out infinite}.bucket:hover svg{animation:bucket-greet .65s ease-in-out}.bucket[aria-expanded=true] svg{transform:rotate(-7deg);animation:none}.bucket svg ellipse:last-of-type{transform-box:fill-box;transform-origin:center;animation:water-ripple 3s ease-in-out infinite}.bucket .count{transition:color .2s}.bucket:hover .count{color:#fff2be}
    @keyframes bucket-rest{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}@keyframes bucket-greet{0%,100%{transform:rotate(0)}30%{transform:rotate(-9deg)}65%{transform:rotate(6deg)}}@keyframes water-ripple{0%,100%{transform:scaleX(.91);opacity:.7}50%{transform:scaleX(1.05);opacity:1}}
    @media(prefers-reduced-motion:reduce){.bucket svg,.bucket svg ellipse:last-of-type{animation:none!important}.ledger .entry,.ledger .entry svg,.release{transition:none!important}}
  `;root.append(creelStyle);
  const sceneStyle=document.createElement('style');sceneStyle.textContent=`
    .ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entries{margin:0;flex:1 1 auto;min-height:0;height:auto;overflow:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-content:start;gap:10px;padding:3px 6px 10px 0;scrollbar-width:thin;scrollbar-color:#a6b9a2 #ece9db;overscroll-behavior:contain}
    .ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entry{min-width:0;display:flex;flex-direction:column;gap:0;text-align:center;border:1px solid #d9ddc9;border-radius:12px;padding:9px 7px 10px;background:#e9eddf;transition:background .25s,transform .25s}.ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entry:hover{background:#dfe8d6;transform:translateY(-2px)}.ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entry>div{min-width:0;width:100%}.ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entry svg{width:105px;max-width:100%;height:65px}.ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entry strong{font:14px/1.3 Georgia,serif;color:#365546;display:block;overflow-wrap:anywhere}.ledger:not(.book-open):not(.rewards-open):not(.shop-open) .entry small{font-size:10px;color:#7c8974;overflow-wrap:anywhere;margin-top:4px}.ledger:not(.book-open):not(.rewards-open):not(.shop-open) .rarity{font-size:9px;color:var(--tier)}
    .ledger.rewards-open .reward-panel{flex:1 1 auto;min-height:0;max-height:none;overflow-y:auto;overflow-x:hidden;margin:0;padding:2px 8px 12px 2px;scrollbar-width:thin;scrollbar-color:#a2b79e #eae5d4;overscroll-behavior:contain}
    .ledger.rewards-open .reward-panel>p{font:italic 11px/1.5 Georgia,serif;color:#687762;background:#ebe6d4;border-left:3px solid #8ba888;padding:7px 11px;border-radius:0 8px 8px 0;margin:0 0 14px}
    .ledger.rewards-open .reward-buttons{display:grid;gap:11px}
    .ledger.rewards-open .reward-card{display:flex;gap:13px;align-items:center;border:1px solid #dcd4c0;border-radius:12px;background:#fdfcf7;padding:11px 14px;box-shadow:0 2px 5px rgba(35,50,40,.04);transition:all .2s}
    .ledger.rewards-open .reward-card:hover{background:#ffffff;border-color:#c8bfa7;box-shadow:0 4px 12px rgba(35,50,40,.08);transform:translateY(-1px)}
    .ledger.rewards-open .reward-swatch{width:46px;height:48px;flex-shrink:0;display:grid;place-items:center;color:#fff8e8;font:26px Georgia;border-radius:10px;border:1px solid rgba(0,0,0,.07);box-shadow:inset 0 1px 1px rgba(255,255,255,.5),0 2px 6px rgba(0,0,0,.12)}
    .ledger.rewards-open .reward-card strong{font:16px Georgia,serif;color:#365345;display:block}
    .ledger.rewards-open .reward-card p{font:11px/1.4 'Trebuchet MS',sans-serif;margin:3px 0;color:#6d7a65}
    .ledger.rewards-open .reward-card small{display:block;font-size:10px;margin:3px 0 0;color:#85927c}
    .ledger.rewards-open .reward-card button{min-width:88px;border:1px solid #b7c7ac;border-radius:8px;background:#eef4e6;color:#3d5945;padding:7px 12px;font:11px 'Trebuchet MS',sans-serif;font-weight:600;cursor:pointer;transition:all .15s}
    .ledger.rewards-open .reward-card button:hover:not(:disabled){background:#dfead3;color:#233e2b;border-color:#9db391}
    .ledger.rewards-open .reward-card button[aria-pressed="true"]{background:#4b7061;color:#fff9eb;border-color:#38574a;box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}
    .ledger.rewards-open .reward-card button:disabled{opacity:.5;background:#eae8dc;color:#8c9787;border-color:#cfd4c5;cursor:default}
    .ledger.rewards-open .tip-jar-card{margin-top:16px;border:1.5px solid #d4c18f;background:linear-gradient(135deg,#fefcf4 0%,#f8efd5 100%);border-radius:14px;padding:13px 15px;box-shadow:0 3px 10px rgba(90,70,20,.07)}
    .ledger.rewards-open .mastery-section{margin-top:16px;padding-top:14px;border-top:1px solid #ddd6c2}
    .ledger.rewards-open .mastery-title{font:italic 16px Georgia,serif;color:#355547;margin:0 0 10px;display:flex;align-items:center;gap:6px}
    .ledger.rewards-open .mastery-badge{background:#fdfcf8;border:1px solid #dcd4c0;border-radius:10px;padding:9px 11px;box-shadow:0 1px 4px rgba(0,0,0,.03)}
    .ledger.rewards-open .mastery-badge:not(.locked){border-color:#b4c7a7;background:linear-gradient(135deg,#f8fcf3,#ecf5e7)}
    @media(max-width:520px){
      .ledger.rewards-open .mastery-grid{grid-template-columns:1fr}
      .ledger.rewards-open .reward-card{padding:10px 11px;gap:9px}
    }
  `;root.append(sceneStyle);
  const shopStyle=document.createElement('style');shopStyle.textContent=`
    .ledger.shop-open .shop-panel{flex:1 1 auto;min-height:0;max-height:none;overflow-y:auto;overflow-x:hidden;margin:0;padding:2px 8px 12px 2px;scrollbar-width:thin;scrollbar-color:#a2b79e #eae5d4;overscroll-behavior:contain}
    .shop-header{margin:0 0 12px;background:#fefbf4;border:1.5px solid #dcd3bd;border-radius:12px;padding:10px 14px;box-shadow:0 2px 6px rgba(40,60,50,.04)}
    .shop-balance{display:flex;align-items:center;gap:12px}
    .pearl-gem{font-size:26px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.15))}
    .shop-balance strong{font:bold 15px Georgia,serif;color:#2e4e41;display:block}
    .shop-balance p{font:11px/1.4 'Trebuchet MS',sans-serif;color:#707c6c;margin:2px 0 0}
    .active-bait-banner{margin-top:8px;padding:5px 9px;background:#fff5e0;border:1px solid #e8cb82;border-radius:8px;font:11px 'Trebuchet MS',sans-serif;color:#785412}
    .shop-filters{display:flex;gap:6px;margin:0 0 12px;flex-wrap:wrap}
    .shop-filter-btn{background:#e8ede0;border:1px solid #c5d1be;border-radius:20px;color:#476554;padding:4px 11px;font:11px 'Trebuchet MS',sans-serif;cursor:pointer;transition:all .15s}
    .shop-filter-btn:hover{background:#dbe4d2}
    .shop-filter-btn[aria-pressed="true"]{background:#4b7061;color:#fff9eb;border-color:#38574a;font-weight:600}
    .shop-grid{display:grid;gap:10px}
    .shop-card{display:flex;gap:12px;align-items:center;background:#fefdfa;border:1px solid #ddd7c6;border-radius:12px;padding:11px 14px;box-shadow:0 2px 5px rgba(35,50,40,.04);transition:all .2s}
    .shop-card:hover{background:#ffffff;border-color:#c4baa0;transform:translateY(-1px);box-shadow:0 4px 12px rgba(35,50,40,.08)}
    .shop-icon{width:46px;height:46px;border-radius:10px;border:1.5px solid;display:grid;place-items:center;font-size:22px;flex-shrink:0}
    .shop-details{flex:1 1 auto;min-width:0}
    .shop-title-row{display:flex;align-items:center;gap:7px}
    .shop-title-row strong{font:15px Georgia,serif;color:#355345}
    .shop-slot-pill{font:bold 9px 'Trebuchet MS',sans-serif;letter-spacing:.5px;padding:1px 6px;border-radius:8px;background:#e9ede2;color:#617869}
    .shop-details p{font:11px/1.35 'Trebuchet MS',sans-serif;color:#6d7b68;margin:3px 0}
    .shop-price{font:bold 11px Georgia,serif;color:#917336}
    .shop-action-btn{min-width:88px;border:1px solid #b7c7ac;border-radius:8px;background:#eef4e6;color:#3d5945;padding:7px 11px;font:11px 'Trebuchet MS',sans-serif;font-weight:600;cursor:pointer;transition:all .15s;flex-shrink:0}
    .shop-action-btn:hover:not(:disabled){background:#dfead3;color:#233e2b;border-color:#9db391}
    .shop-action-btn.equipped{background:#4b7061;color:#fff9eb;border-color:#38574a;cursor:default}
    .shop-action-btn:disabled:not(.equipped){opacity:.5;background:#eae8dc;color:#8c9787;border-color:#cfd4c5;cursor:default}
    .bait-badge{position:absolute;left:18px;top:76px;font:bold 10px 'Trebuchet MS',sans-serif;background:#fff8e3;color:#7e5b15;border:1px solid #e7ce88;border-radius:12px;padding:2px 8px;box-shadow:0 2px 6px rgba(0,0,0,.1);pointer-events:none;z-index:3;animation:bait-pulse 2.2s infinite ease-in-out}
    @keyframes bait-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    .photo-btn,.companion-btn{background:none;border:1px solid #bccdc2;border-radius:6px;color:#44695b;font:10px 'Trebuchet MS',sans-serif;padding:1px 6px;margin-top:3px;margin-left:4px;cursor:pointer;transition:all .15s}
    .photo-btn:hover,.companion-btn:hover{background:#dbe8dd}
    .companion-btn.active{background:#4b7061;color:#fff9eb;border-color:#38574a;font-weight:bold}
    /* Rod Tip Auras & Gyro Rings */
    .rod-tip-aura{position:absolute;left:15px;top:17px;width:0;height:0;pointer-events:none;z-index:3;transform:translate(0,0);transition:left .04s linear,top .04s linear}
    .tip-gyro{position:absolute;left:0;top:0;border-radius:50%;transform-origin:center;box-sizing:border-box}
    .tip-core{position:absolute;left:0;top:0;border-radius:50%;transform-origin:center;box-sizing:border-box}

    /* Abyssal Carbon Rod - Electric Cyan Dual Gyro-Rings */
    :host([data-skin-rod="rod_abyssal"]) .tip-gyro.ring-1{width:24px;height:24px;margin:-12px 0 0 -12px;border:1.6px solid #00f7ff;box-shadow:0 0 8px #00f7ff,inset 0 0 5px #00f7ff;animation:gyro-spin 1.8s linear infinite}
    :host([data-skin-rod="rod_abyssal"]) .tip-gyro.ring-2{width:16px;height:16px;margin:-8px 0 0 -8px;border:1.2px dashed #b3fcff;box-shadow:0 0 6px #00f7ff;animation:gyro-spin-tilt 1.2s linear infinite}
    :host([data-skin-rod="rod_abyssal"]) .tip-core{width:6px;height:6px;margin:-3px 0 0 -3px;background:#ffffff;box-shadow:0 0 10px #00f7ff,0 0 18px #00f7ff}

    /* Moonstone Rod - Celestial Starlight Astral Ring & Diamond Glint */
    :host([data-skin-rod="rod_moon"]) .tip-gyro.ring-1{width:26px;height:26px;margin:-13px 0 0 -13px;border:1.5px dotted #d0e4ff;box-shadow:0 0 10px #8ab8ff,0 0 20px rgba(160,200,255,0.7);animation:gyro-spin 3.4s linear infinite}
    :host([data-skin-rod="rod_moon"]) .tip-gyro.ring-2{width:14px;height:14px;margin:-7px 0 0 -7px;background:rgba(230,242,255,0.9);clip-path:polygon(50% 0%,65% 35%,100% 50%,65% 65%,50% 100%,35% 65%,0% 50%,35% 35%);box-shadow:0 0 8px #9ac4ff;animation:star-twinkle 1.4s ease-in-out infinite alternate}
    :host([data-skin-rod="rod_moon"]) .tip-core{width:5px;height:5px;margin:-2.5px 0 0 -2.5px;background:#ffffff;box-shadow:0 0 10px #ffffff,0 0 16px #8ab8ff}

    /* Copper Shore Rod - Molten Forge Sunburst */
    :host([data-skin-rod="rod_copper"]) .tip-gyro.ring-1{width:22px;height:22px;margin:-11px 0 0 -11px;border:2px solid #ff7733;box-shadow:0 0 10px #ff5511,0 0 18px rgba(255,100,20,0.6);animation:copper-pulse 1.6s ease-in-out infinite}
    :host([data-skin-rod="rod_copper"]) .tip-gyro.ring-2{width:14px;height:14px;margin:-7px 0 0 -7px;border:1.2px dashed #ffb355;animation:gyro-spin 2.2s linear infinite}
    :host([data-skin-rod="rod_copper"]) .tip-core{width:5px;height:5px;margin:-2.5px 0 0 -2.5px;background:#fff5d6;box-shadow:0 0 8px #ff7733}

    /* Bamboo Cane Rod - Spirit Nature Wreath */
    :host([data-skin-rod="rod_bamboo"]) .tip-gyro.ring-1{width:20px;height:20px;margin:-10px 0 0 -10px;border:1.5px dashed #9bc840;box-shadow:0 0 8px rgba(155,200,64,0.7);animation:gyro-spin 4s linear infinite}
    :host([data-skin-rod="rod_bamboo"]) .tip-gyro.ring-2{width:12px;height:12px;margin:-6px 0 0 -6px;border:1px solid rgba(220,240,140,0.6);animation:gyro-spin-tilt 2.5s linear infinite}
    :host([data-skin-rod="rod_bamboo"]) .tip-core{width:4px;height:4px;margin:-2px 0 0 -2px;background:#ebffb3;box-shadow:0 0 6px #a3c938}

    @keyframes gyro-spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
    @keyframes gyro-spin-tilt{0%{transform:rotateX(60deg) rotate(0deg)}100%{transform:rotateX(60deg) rotate(360deg)}}
    @keyframes star-twinkle{0%{transform:scale(0.8) rotate(0deg);opacity:.7}100%{transform:scale(1.2) rotate(45deg);opacity:1}}
    @keyframes copper-pulse{0%,100%{transform:scale(0.92);box-shadow:0 0 8px #ff5511}50%{transform:scale(1.08);box-shadow:0 0 16px #ff7733,0 0 24px rgba(255,100,20,0.8)}}

    /* Bucket Auras & Orbiting Relics */
    .bucket-aura{position:absolute;left:40px;top:26px;width:0;height:0;pointer-events:none;z-index:3}
    .bucket-orbit-ring{position:absolute;left:0;top:0;width:0;height:0}
    .bucket-orb{position:absolute;border-radius:50%;display:none;pointer-events:none}

    :host([data-skin-bucket="bucket_pearl"]) .bucket-orb{display:block;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;background:radial-gradient(circle at 35% 35%,#ffffff,#d8b4fe);box-shadow:0 0 8px rgba(216,180,254,0.9),0 0 14px rgba(192,132,252,0.6)}
    :host([data-skin-bucket="bucket_pearl"]) .bucket-orb.orb-1{animation:pearl-orbit-1 3.2s linear infinite}
    :host([data-skin-bucket="bucket_pearl"]) .bucket-orb.orb-2{animation:pearl-orbit-2 3.2s linear infinite}
    :host([data-skin-bucket="bucket_pearl"]) .bucket-orb.orb-3{animation:pearl-orbit-3 3.2s linear infinite}

    @keyframes pearl-orbit-1{0%{transform:rotate(0deg) translateX(36px) rotate(0deg)}100%{transform:rotate(360deg) translateX(36px) rotate(-360deg)}}
    @keyframes pearl-orbit-2{0%{transform:rotate(120deg) translateX(36px) rotate(-120deg)}100%{transform:rotate(480deg) translateX(36px) rotate(-480deg)}}
    @keyframes pearl-orbit-3{0%{transform:rotate(240deg) translateX(36px) rotate(-240deg)}100%{transform:rotate(600deg) translateX(36px) rotate(-600deg)}}

    :host([data-skin-bucket="bucket_cedar"]) .bucket-orb{display:block;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;background:#ffd466;box-shadow:0 0 8px #f5a623}
    :host([data-skin-bucket="bucket_cedar"]) .bucket-orb.orb-1{animation:pearl-orbit-1 2.6s linear infinite}
    :host([data-skin-bucket="bucket_cedar"]) .bucket-orb.orb-2{animation:pearl-orbit-2 2.6s linear infinite}
    :host([data-skin-bucket="bucket_cedar"]) .bucket-orb.orb-3{animation:pearl-orbit-3 2.6s linear infinite}

    :host([data-skin-bucket="bucket_wicker"]) .bucket-orb{display:block;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;background:#d8f571;box-shadow:0 0 7px #b4e038}
    :host([data-skin-bucket="bucket_wicker"]) .bucket-orb.orb-1{animation:pearl-orbit-1 4s ease-in-out infinite}
    :host([data-skin-bucket="bucket_wicker"]) .bucket-orb.orb-2{animation:pearl-orbit-2 3.5s ease-in-out infinite}
    :host([data-skin-bucket="bucket_wicker"]) .bucket-orb.orb-3{animation:pearl-orbit-3 4.2s ease-in-out infinite}

    /* Glowing Energy Beam Lines */
    .thread.aura{opacity:0;pointer-events:none}
    :host([data-skin-line="line_neon"]) .thread.aura{opacity:.55!important;stroke:#00f7ff!important;stroke-width:10px!important;filter:blur(4px) drop-shadow(0 0 16px #00f7ff)}
    :host([data-skin-line="line_starlight"]) .thread.aura{opacity:.58!important;stroke:#cce4ff!important;stroke-width:10px!important;filter:blur(5px) drop-shadow(0 0 20px rgba(180,215,255,0.85))}
    :host([data-skin-line="line_gold"]) .thread.aura{opacity:.48!important;stroke:#ffd700!important;stroke-width:9px!important;filter:blur(3.5px) drop-shadow(0 0 14px #f5b025)}

    /* Impact Strike Shockwave & Floaters */
    .strike-ring{position:absolute;width:44px;height:44px;border-radius:50%;border:2.5px solid #00f7ff;pointer-events:none;transform:translate(-50%,-50%);z-index:8}
    .strike-spark{position:absolute;width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:8}
    .landing-shockwave{position:absolute;width:60px;height:60px;border-radius:50%;border:2.5px solid #81c4c8;pointer-events:none;transform:translate(-50%,-50%);z-index:8}
    .aura-mote{position:absolute;border-radius:50%;pointer-events:none;z-index:5}

    .catch-floater{position:absolute;pointer-events:none;z-index:99;white-space:nowrap;font:bold 15px Georgia,serif;color:#fff9eb;background:linear-gradient(135deg,rgba(26,45,36,0.95),rgba(15,28,22,0.98));border:1.5px solid #e2cb85;border-radius:20px;padding:3px 12px 4px;box-shadow:0 4px 14px rgba(0,0,0,0.4),0 0 10px rgba(245,176,37,0.5);display:flex;align-items:center;gap:5px;letter-spacing:.3px}
    .catch-floater .floater-val{color:#ffd866;font-size:17px;text-shadow:0 0 8px rgba(255,216,102,0.7)}
    .catch-floater .floater-tag{color:#e6ede4;font-size:12px;font-family:'Trebuchet MS',sans-serif;font-weight:600}
    .catch-floater .floater-streak{background:#ffd700;color:#2c2005;font:bold 10px 'Trebuchet MS',sans-serif;padding:1px 6px;border-radius:10px;margin-left:3px;box-shadow:0 0 6px rgba(255,215,0,0.8)}

    /* Rod Skins - Textures, Segmentation, and Luminous Resonances */
    :host([data-skin-rod="rod_bamboo"]) .rod svg .pole{stroke:#c89e4c!important;stroke-dasharray:22 2.5!important;stroke-linecap:butt!important}
    :host([data-skin-rod="rod_bamboo"]) .rod svg .pole-light{stroke:#f2e2aa!important;stroke-dasharray:22 2.5!important;stroke-linecap:butt!important}
    :host([data-skin-rod="rod_bamboo"]) .rod svg .guides ellipse{stroke:#6b8233!important;stroke-width:2.2px!important;filter:drop-shadow(0 1px 2px rgba(45,60,25,0.45))}
    :host([data-skin-rod="rod_bamboo"]) .rod svg path[stroke="#8c6448"]{stroke:#a37544!important}
    :host([data-skin-rod="rod_bamboo"]) .rod svg path[stroke="#c6a67a"]{stroke:#dfc28d!important}

    :host([data-skin-rod="rod_copper"]) .rod svg .pole{stroke:#b25828!important}
    :host([data-skin-rod="rod_copper"]) .rod svg .pole-light{stroke:#f9ab82!important}
    :host([data-skin-rod="rod_copper"]) .rod svg circle{fill:#bf6030!important}
    :host([data-skin-rod="rod_copper"]) .rod svg .guides ellipse{stroke:#f59668!important;filter:drop-shadow(0 0 3px rgba(230,110,60,0.6))}
    :host([data-skin-rod="rod_copper"]) .rod svg{animation:copper-rod-gleam 3.4s ease-in-out infinite}
    @keyframes copper-rod-gleam{0%,100%{filter:drop-shadow(0 0 2px rgba(200,90,40,0.35))}50%{filter:drop-shadow(0 0 7px rgba(245,130,70,0.8)) drop-shadow(0 0 13px rgba(210,80,30,0.45))}}

    :host([data-skin-rod="rod_moon"]) .rod svg .pole{stroke:#5b7e9e!important}
    :host([data-skin-rod="rod_moon"]) .rod svg .pole-light{stroke:#e0eeff!important;stroke-width:1.3px!important}
    :host([data-skin-rod="rod_moon"]) .rod svg .guides ellipse{stroke:#c8deff!important;filter:drop-shadow(0 0 4px #8ab7ff)}
    :host([data-skin-rod="rod_moon"]) .rod svg .reel circle:last-child{fill:#f0f7ff!important;filter:drop-shadow(0 0 5px #9ac4ff)}
    :host([data-skin-rod="rod_moon"]) .rod svg{animation:moon-rod-aurora 4.2s ease-in-out infinite}
    @keyframes moon-rod-aurora{0%,100%{filter:drop-shadow(0 0 5px rgba(110,165,225,0.6)) drop-shadow(0 0 12px rgba(160,200,255,0.35))}50%{filter:drop-shadow(0 0 9px rgba(140,190,255,0.85)) drop-shadow(0 0 22px rgba(190,225,255,0.6))}}

    :host([data-skin-rod="rod_abyssal"]) .rod svg .pole{stroke:#12181c!important;stroke-dasharray:6 1.4!important}
    :host([data-skin-rod="rod_abyssal"]) .rod svg .pole-light{stroke:#2a3740!important;stroke-dasharray:6 1.4!important}
    :host([data-skin-rod="rod_abyssal"]) .rod svg path[stroke="#8c6448"]{stroke:#182026!important}
    :host([data-skin-rod="rod_abyssal"]) .rod svg path[stroke="#c6a67a"]{stroke:#2c3842!important}
    :host([data-skin-rod="rod_abyssal"]) .rod svg .reel circle:last-child{fill:#00f7ff!important;filter:drop-shadow(0 0 4px #00f7ff)}
    :host([data-skin-rod="rod_abyssal"]) .rod svg .guides ellipse{stroke:#00f7ff!important;animation:abyssal-guide-pulse 1.8s ease-in-out infinite}
    @keyframes abyssal-guide-pulse{0%,100%{stroke:#00f7ff!important;filter:drop-shadow(0 0 3px #00f7ff) drop-shadow(0 0 7px rgba(0,247,255,0.7))}50%{stroke:#99fcff!important;filter:drop-shadow(0 0 6px #00f7ff) drop-shadow(0 0 14px rgba(0,247,255,0.95))}}

    /* Line Skins - Flowing Stream, Twine Pulses, and Laser Shimmer */
    :host([data-skin-line="line_mono"]) .thread{stroke:#f0fbf8!important;stroke-opacity:.75!important;stroke-width:2.6px!important;filter:drop-shadow(0 0 2px rgba(120,190,185,0.45))}
    :host([data-skin-line="line_mono"]) .thread.inner{stroke:#48787f!important;stroke-width:1.1px!important}
    :host([data-skin-line="line_mono"]) .hook path{stroke:#3c5e64!important}

    :host([data-skin-line="line_gold"]) .thread{stroke:#ffe694!important;stroke-opacity:.95!important;stroke-width:3.6px!important;filter:drop-shadow(0 0 4px #f5b025) drop-shadow(0 0 8px rgba(245,176,37,0.45))!important}
    :host([data-skin-line="line_gold"]) .thread.inner{stroke:#b57912!important;stroke-width:1.6px!important;stroke-dasharray:12 5!important;animation:gold-line-twine .75s linear infinite!important}
    :host([data-skin-line="line_gold"]) .hook path{stroke:#e0a320!important;filter:drop-shadow(0 0 3px #f5b025)}
    @keyframes gold-line-twine{to{stroke-dashoffset:-34px}}

    :host([data-skin-line="line_starlight"]) .thread{stroke:#ffffff!important;stroke-width:4px!important;filter:drop-shadow(0 0 5px #c8ddff) drop-shadow(0 0 13px rgba(160,200,255,0.75))!important}
    :host([data-skin-line="line_starlight"]) .thread.inner{stroke:#8ca9dc!important;stroke-width:1.8px!important;stroke-dasharray:9 7!important;animation:starlight-line-stream 1.1s linear infinite!important}
    :host([data-skin-line="line_starlight"]) .hook path{stroke:#d0e4ff!important;filter:drop-shadow(0 0 5px #9bc0ff)}
    @keyframes starlight-line-stream{to{stroke-dashoffset:-32px}}

    :host([data-skin-line="line_neon"]) .thread{stroke:#00f7ff!important;stroke-width:4.6px!important;animation:neon-laser-pulse 1.3s ease-in-out infinite alternate!important}
    :host([data-skin-line="line_neon"]) .thread.inner{stroke:#ffffff!important;stroke-width:1.6px!important;stroke-dasharray:15 5!important;animation:neon-core-stream .38s linear infinite!important}
    :host([data-skin-line="line_neon"]) .hook path{stroke:#00f7ff!important;filter:drop-shadow(0 0 6px #00f7ff)}
    @keyframes neon-laser-pulse{0%,100%{filter:drop-shadow(0 0 4px #00f7ff) drop-shadow(0 0 9px #00f7ff) drop-shadow(0 0 16px rgba(0,247,255,0.7))}50%{filter:drop-shadow(0 0 7px #00f7ff) drop-shadow(0 0 15px #00f7ff) drop-shadow(0 0 25px rgba(0,247,255,0.95))}}
    @keyframes neon-core-stream{to{stroke-dashoffset:-40px}}

    /* Golden Supporter Exclusive Thread & Gilded Hook */
    :host([data-reward-goldenhook="true"]) .thread.aura{opacity:.85!important;stroke:#ffd700!important;stroke-width:11px!important;filter:blur(3.5px) drop-shadow(0 0 16px #f5b025) drop-shadow(0 0 28px rgba(255,215,0,0.75))!important}
    :host([data-reward-goldenhook="true"]) .thread{stroke:#fff9e6!important;stroke-opacity:1!important;stroke-width:3.8px!important;filter:drop-shadow(0 0 4px #ffd700) drop-shadow(0 0 12px rgba(245,176,37,0.85))!important;animation:none!important}
    :host([data-reward-goldenhook="true"]) .thread.inner{stroke:#b57912!important;stroke-width:1.8px!important;stroke-dasharray:10 4!important;animation:gold-line-twine .55s linear infinite!important}
    :host([data-reward-goldenhook="true"]) .hook path{stroke:#ffd700!important;fill:#fff0a6!important;filter:drop-shadow(0 0 6px #f5b025) drop-shadow(0 0 12px rgba(255,215,0,0.7))!important}

    /* Bucket Skins - Lusters, Rich Finishes, and Shadows */
    :host([data-skin-bucket="bucket_wicker"]) .bucket svg{filter:sepia(.85) saturate(1.25) hue-rotate(345deg) drop-shadow(0 3px 6px rgba(40,30,15,0.3))}
    :host([data-skin-bucket="bucket_cedar"]) .bucket svg{filter:sepia(.92) saturate(1.85) hue-rotate(320deg) brightness(.74) drop-shadow(0 3px 7px rgba(45,20,10,0.38))}
    :host([data-skin-bucket="bucket_pearl"]) .bucket svg{animation:pearl-basin-luster 3.6s ease-in-out infinite!important}
    @keyframes pearl-basin-luster{0%,100%{filter:saturate(.5) brightness(1.3) drop-shadow(0 0 8px rgba(216,180,254,0.65))}50%{filter:saturate(.75) brightness(1.42) drop-shadow(0 0 16px rgba(192,132,252,0.9))}}

    /* Shop card icon aura effects */
    .shop-card[data-item-id="line_neon"] .shop-icon{box-shadow:0 0 12px rgba(0,247,255,0.45);animation:neon-laser-pulse 1.5s ease-in-out infinite alternate}
    .shop-card[data-item-id="line_starlight"] .shop-icon{box-shadow:0 0 10px rgba(180,215,255,0.55);animation:moon-rod-aurora 3s ease-in-out infinite alternate}
    .shop-card[data-item-id="line_gold"] .shop-icon{box-shadow:0 0 8px rgba(245,176,37,0.45)}
    .shop-card[data-item-id="rod_abyssal"] .shop-icon{box-shadow:0 0 10px rgba(0,247,255,0.4)}
    .shop-card[data-item-id="rod_moon"] .shop-icon{box-shadow:0 0 10px rgba(120,165,225,0.5);animation:moon-rod-aurora 4s ease-in-out infinite}
    .shop-card[data-item-id="rod_copper"] .shop-icon{box-shadow:0 0 8px rgba(220,95,45,0.4)}
    .shop-card[data-item-id="bucket_pearl"] .shop-icon{box-shadow:0 0 12px rgba(216,180,254,0.5);animation:pearl-basin-luster 3.6s ease-in-out infinite}
    :host([data-weather="night"])::before{content:'';position:fixed;inset:0;background:radial-gradient(circle at 50% 20%,rgba(10,24,42,.28) 0%,rgba(4,10,20,.52) 100%);pointer-events:none;z-index:0}
    :host([data-weather="night"]) .swimmer{filter:drop-shadow(0 4px 8px rgba(0,10,20,.45)) brightness(.92)!important}
    :host([data-weather="rain"]) .weather-rain-ripple{position:absolute;width:34px;height:34px;border-radius:50%;border:1.2px solid rgba(130,200,215,.65);pointer-events:none;transform:translate(-50%,-50%);box-shadow:0 0 4px rgba(160,230,245,.4)}
    .companion-swimmer{position:fixed;left:0;top:0;width:56px;height:40px;pointer-events:none;z-index:4;will-change:transform;transition:filter .3s;filter:drop-shadow(0 2px 6px rgba(0,0,0,.25))}
    .companion-swimmer svg{width:56px;height:40px}
    .companion-halo{position:absolute;left:50%;top:-10px;transform:translateX(-50%);color:#79bfb5;display:grid;place-items:center;animation:halo-spin 6s linear infinite;pointer-events:none}
    @keyframes halo-spin{0%{transform:translateX(-50%) rotate(0deg)}100%{transform:translateX(-50%) rotate(360deg)}}
    .polaroid-overlay{position:fixed;inset:0;background:rgba(15,28,24,.68);backdrop-filter:blur(4px);z-index:9999;pointer-events:auto;display:grid;place-items:center;padding:16px}
    .polaroid-card{background:#fbf9f3;border-radius:8px;padding:16px 16px 20px;box-shadow:0 24px 60px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.15);max-width:340px;width:100%;position:relative;animation:polaroid-pop .3s cubic-bezier(.34,1.56,.64,1)}
    @keyframes polaroid-pop{from{opacity:0;transform:scale(.88) rotate(-3deg)}to{opacity:1;transform:scale(1) rotate(0deg)}}
    .polaroid-close{position:absolute;right:10px;top:10px;z-index:10;background:#e9ede4;border:1px solid #c9d2bf;border-radius:50%;width:26px;height:26px;font-size:16px;cursor:pointer;color:#496153;display:grid;place-items:center;line-height:1;transition:all .15s}
    .polaroid-close:hover{background:#dfe5d8;color:#22382c}
    .polaroid-photo{background:linear-gradient(145deg,#dcedea,#c5ded9);border:1.5px solid #b6ceca;border-radius:6px;height:210px;display:grid;place-items:center;margin-bottom:14px;box-shadow:inset 0 2px 6px rgba(0,0,0,.08);overflow:hidden;position:relative}
    .polaroid-photo svg{width:180px;height:120px;filter:drop-shadow(0 4px 10px rgba(30,60,50,.2))}
    .polaroid-caption{text-align:center;padding:0 6px}
    .polaroid-caption strong{font:italic 22px Georgia,serif;color:#2b493e;display:block}
    .polaroid-meta{font:12px 'Trebuchet MS',sans-serif;color:#677764;margin:4px 0 6px}
    .polaroid-stamp{font:italic 10px Georgia,serif;color:#93a08f;letter-spacing:.4px;border-top:1px dashed #d7cfb8;padding-top:6px}
    .polaroid-actions{margin-top:14px;display:flex;justify-content:center}
    .polaroid-save-btn{background:#497061;color:#fff9eb;border:1px solid #37594c;border-radius:8px;padding:8px 16px;font:bold 12px 'Trebuchet MS',sans-serif;cursor:pointer;box-shadow:0 2px 6px rgba(30,50,40,.2);transition:all .15s}
    .polaroid-save-btn:hover{background:#3b5c4f}
    @media(max-width:520px){
      .shop-card{padding:10px 11px;gap:9px}
    }
    @media(prefers-reduced-motion:reduce){
      .companion-halo{animation:none!important}
      .polaroid-card{animation:none!important}
      .bait-badge{animation:none!important}
      :host([data-skin-rod="rod_copper"]) .rod svg{animation:none!important}
      :host([data-skin-rod="rod_moon"]) .rod svg{animation:none!important}
      :host([data-skin-rod="rod_abyssal"]) .rod svg .guides ellipse{animation:none!important}
      :host([data-skin-line="line_gold"]) .thread.inner{animation:none!important}
      :host([data-skin-line="line_starlight"]) .thread.inner{animation:none!important}
      :host([data-skin-line="line_neon"]) .thread{animation:none!important}
      :host([data-skin-line="line_neon"]) .thread.inner{animation:none!important}
      :host([data-reward-goldenhook="true"]) .thread.inner{animation:none!important}
      :host([data-skin-bucket="bucket_pearl"]) .bucket svg{animation:none!important}
      .shop-card .shop-icon{animation:none!important}
      .tip-gyro,.tip-gyro.ring-2,.bucket-orb{animation:none!important}
      .strike-ring,.landing-shockwave,.catch-floater{animation-duration:.01s!important}
    }
  `;root.append(shopStyle);
  // One shared frame for every collection tab; only the content area changes.
  const shellStyle=document.createElement('style');shellStyle.textContent=`
    .ledger{position:absolute!important;left:50%!important;top:50%!important;right:auto!important;transform:translate(-50%,-50%);width:min(520px,calc(100vw - 20px))!important;height:min(640px,88vh)!important;max-height:88vh!important;display:flex!important;flex-direction:column!important;gap:0!important;margin:0!important;padding:22px 24px 18px!important;background:#f7f4ec!important;border:1px solid #cdd5c6!important;border-radius:14px!important;box-shadow:0 24px 60px rgba(20,40,32,.26),0 2px 6px rgba(20,40,32,.08)!important;overflow:hidden!important;clip-path:none!important;isolation:isolate;box-sizing:border-box!important;color:#2f4a40;font:13px/1.5 'Trebuchet MS',sans-serif}
    .ledger::before,.ledger::after{content:none!important}
    .ledger[hidden]{display:none!important}
    .ledger>*{position:relative;flex-shrink:0;z-index:1}
    .ledger h2{text-align:left!important;font:normal 24px/1.2 Georgia,serif!important;letter-spacing:0!important;color:#2c463c!important;margin:0 44px 4px 0!important;padding:0!important}
    .ledger .summary{text-align:left!important;font:12px/1.4 'Trebuchet MS',sans-serif!important;color:#6d7c70!important;border:0!important;padding:0!important;margin:0 44px 14px 0!important}
    .ledger>.close-book{position:absolute!important;top:16px;right:16px;z-index:3;width:32px;height:32px;display:grid;place-items:center;padding:0;margin:0;border:1px solid transparent;border-radius:8px;background:transparent;color:#5d7067;cursor:pointer;transition:background .15s,color .15s,border-color .15s}
    .ledger>.close-book:hover{background:#e9ece2;border-color:#d3d9cc;color:#24392f}
    .ledger .tabs{display:flex!important;justify-content:flex-start!important;gap:2px!important;margin:0 0 14px!important;padding:0!important;border-bottom:1px solid #dcdccf!important}
    .ledger .tabs button{position:relative;margin:0 0 -1px!important;padding:9px 12px 10px!important;background:transparent!important;border:0!important;border-bottom:2px solid transparent!important;border-radius:0!important;box-shadow:none!important;color:#6d7c70!important;font:13px 'Trebuchet MS',sans-serif!important;font-weight:normal!important;cursor:pointer;transition:color .15s,border-color .15s}
    .ledger .tabs button:hover{color:#2c463c!important}
    .ledger .tabs button[aria-selected=true]{color:#2c463c!important;border-bottom-color:#4b7061!important}
    .ledger .entries,.ledger .reward-panel,.ledger .shop-panel{flex:1 1 auto!important;min-height:0!important;max-height:none!important;margin:0!important;padding:2px 6px 8px 0!important;overflow-y:auto!important;overflow-x:hidden!important;scrollbar-width:thin;scrollbar-color:#b3c0ad transparent;overscroll-behavior:contain}
    .ledger .sort-bar{margin:0 0 12px!important}
    .ledger .release{width:100%!important;margin:12px 0 0!important;padding:10px!important;background:#ecefe4!important;border:1px solid #c9d2bf!important;border-radius:8px!important;box-shadow:none!important;color:#3d5945!important;font:13px 'Trebuchet MS',sans-serif!important;flex-shrink:0;transition:background .15s}
    .ledger .release:hover:not(:disabled){background:#e0e6d6!important;transform:none!important}
    .ledger .release:disabled{opacity:.5}
    .ledger .empty{grid-column:1/-1;margin:0;padding:32px 8px;text-align:center;color:#7d8a7f;font:italic 14px/1.6 Georgia,serif}
    .ledger.book-open .spread{border:1px solid #dcd6c3;border-radius:8px;overflow:hidden}
    .ledger .entries .entry,.ledger .shop-card,.ledger .reward-card,.ledger .shop-header,.ledger .tip-jar-card,.ledger .mastery-badge{background:#fdfcf8!important;border:1px solid #e1ded0!important;border-radius:10px!important;box-shadow:none!important;transition:border-color .15s!important}
    .ledger .entries .entry:hover,.ledger .shop-card:hover,.ledger .reward-card:hover{border-color:#c9cfbf!important;transform:none!important;background:#fdfcf8!important}
    .ledger .mastery-badge.locked{background:#f3f1ea!important}
    @media(max-width:520px){
      .ledger{padding:18px 14px 14px!important}
      .ledger h2{font-size:21px!important}
      .ledger>.close-book{top:12px;right:10px}
      .ledger .tabs{overflow-x:auto;scrollbar-width:none}
      .ledger .tabs button{padding:8px 9px 9px!important;font-size:12px!important;white-space:nowrap}
    }
  `;root.append(shellStyle);
  $('.entries').after(releaseButton);
  $('.bucket').addEventListener('click',()=>{if(!$('.ledger').hidden&&performance.now()>=ignoreBucketClick)animate($('.ledger'),[{opacity:0,translate:'0 7px'},{opacity:1,translate:'0 0'}],{duration:240,easing:'ease-out'});});
  const rod=$('.rod'),bucketEl=$('.bucket');root.append(rod,bucketEl);rod.tabIndex=0;rod.setAttribute('role','button');rod.setAttribute('aria-label','Move fishing rod with arrow keys, or drag');rod.title='Drag rod · arrow keys to move';bucketEl.title='Click to open · drag to move · arrow keys to move';
  const grip=document.createElement('span');grip.className='gear-grip';grip.textContent='drag';rod.append(grip);
  let ignoreBucketClick=0,drag=null;
  function placeGear(el,x,y){const w=el===rod?119:54,h=el===rod?88:56;const nx=Math.max(4,Math.min(innerWidth-w-4,x)),ny=Math.max(4,Math.min(innerHeight-h-4,y));el.style.left=`${nx}px`;el.style.top=`${ny}px`;if(el===bucketEl){const toast=root.querySelector('.toast');if(toast){if(nx<110){toast.style.left='0';toast.style.right='auto';toast.style.transform='none';toast.style.textAlign='left';}else if(nx>innerWidth-150){toast.style.right='0';toast.style.left='auto';toast.style.transform='none';toast.style.textAlign='right';}else{toast.style.left='50%';toast.style.right='auto';toast.style.transform='translateX(-50%)';toast.style.textAlign='center';}if(ny>innerHeight-120){toast.style.top='auto';toast.style.bottom='calc(100% + 5px)';}else{toast.style.top='calc(100% + 5px)';toast.style.bottom='auto';}}}}
  function placeLedger(){/* Both collection views are centered independently of movable gear. */}
  function gearState(){return Object.fromEntries([['rod',rod],['bucket',bucketEl]].map(([key,el])=>{const r=el.getBoundingClientRect();return [key,{x:r.left,y:r.top}];}));}
  async function saveGear(){try{const state=gearState();if(storage)await chrome.storage.local.set({pageFishingGear:state});else localStorage.setItem('pageFishingGear',JSON.stringify(state));}catch{report('Gear moved, but its position could not be saved.');}}
  for(const el of [rod,bucketEl]){
    el.addEventListener('pointerdown',e=>{if(e.button!==0)return;if(releaseMotion&&el===bucketEl)return;const r=el.getBoundingClientRect();drag={el,id:e.pointerId,startX:e.clientX,startY:e.clientY,x:r.left,y:r.top,moved:false};el.setPointerCapture(e.pointerId);});
    el.addEventListener('pointermove',e=>{if(!drag||drag.el!==el||drag.id!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.hypot(dx,dy)>5)drag.moved=true;if(drag.moved){placeGear(el,drag.x+dx,drag.y+dy);placeLedger();}});
    const end=e=>{if(!drag||drag.el!==el)return;if(drag.moved){ignoreBucketClick=performance.now()+350;saveGear();}drag=null;};el.addEventListener('pointerup',end);el.addEventListener('pointercancel',end);el.addEventListener('lostpointercapture',end);
    el.addEventListener('keydown',e=>{const steps={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(!steps)return;e.preventDefault();const r=el.getBoundingClientRect();placeGear(el,r.left+steps[0],r.top+steps[1]);placeLedger();saveGear();});
  }
  placeGear(rod,innerWidth-190,18);placeGear(bucketEl,innerWidth-72,42);
  (async()=>{try{const state=storage?(await chrome.storage.local.get('pageFishingGear')).pageFishingGear:JSON.parse(localStorage.getItem('pageFishingGear')||'null');if(!alive||drag)return;if(state?.rod)placeGear(rod,state.rod.x,state.rod.y);if(state?.bucket)placeGear(bucketEl,state.bucket.x,state.bucket.y);}catch{}})();
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onResize);
  for(let i=0;i<4;i++)spawn(true);
  frame=requestAnimationFrame(loop);
})();



