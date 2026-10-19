let audioContext;
let masterGain;
let ambience = null;
let whisperTimer = null;
let activeWorld = 'observatory';
const WORLD_PROFILES = {
  'solar-coast': { notes:[110,164.81,220], type:'triangle', filter:520, noise:0.012, pulse:0.035 },
  'moon-ocean': { notes:[73.42,110,146.83], type:'sine', filter:340, noise:0.018, pulse:0.018 },
  'angel-veil': { notes:[174.61,261.63,349.23], type:'sine', filter:1250, noise:0.009, pulse:0.025 },
  'living-tree': { notes:[82.41,123.47,164.81], type:'triangle', filter:620, noise:0.012, pulse:0.022 },
  'overflow': { notes:[98,146.83,196], type:'sine', filter:780, noise:0.012, pulse:0.03 },
  'garden-of-becoming': { notes:[130.81,196,261.63], type:'sine', filter:980, noise:0.01, pulse:0.022 },
  observatory: { notes:[55,82.41,110], type:'sine', filter:430, noise:0.008, pulse:0.014 }
};
function getContext(){
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext) {
    audioContext = new AudioCtx();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.72;
    masterGain.connect(audioContext.destination);
  }
  if (audioContext.state === 'suspended') audioContext.resume().catch(()=>{});
  return audioContext;
}
function destination(){ return masterGain || getContext()?.destination; }
function tone(ctx, frequency, start, duration, volume, type='sine', endFrequency=frequency){
  const oscillator=ctx.createOscillator(); const gain=ctx.createGain();
  oscillator.type=type;
  oscillator.frequency.setValueAtTime(frequency,start);
  if(endFrequency!==frequency) oscillator.frequency.exponentialRampToValueAtTime(Math.max(1,endFrequency),start+duration);
  gain.gain.setValueAtTime(0.0001,start);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0002,volume),start+Math.min(.35,duration*.18));
  gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);
  oscillator.connect(gain); gain.connect(destination());
  oscillator.start(start); oscillator.stop(start+duration+.04);
}
function noiseBurst(ctx, start, duration, volume, filterType='bandpass', frequency=900, q=0.7){
  const length=Math.max(1,Math.floor(ctx.sampleRate*duration));
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate); const data=buffer.getChannelData(0);
  for(let i=0;i<length;i++) data[i]=(Math.random()*2-1)*(.75+Math.random()*.25);
  const source=ctx.createBufferSource(); source.buffer=buffer;
  const filter=ctx.createBiquadFilter(); filter.type=filterType; filter.frequency.setValueAtTime(frequency,start); filter.Q.value=q;
  const gain=ctx.createGain(); gain.gain.setValueAtTime(.0001,start); gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),start+duration*.35); gain.gain.exponentialRampToValueAtTime(.0001,start+duration);
  source.connect(filter); filter.connect(gain); gain.connect(destination()); source.start(start); source.stop(start+duration+.03);
}
function stopAmbience(){
  if(whisperTimer){clearInterval(whisperTimer);whisperTimer=null;}
  if(ambience){
    const ctx=audioContext; const old=ambience; ambience=null;
    try{old.gain.gain.cancelScheduledValues(ctx.currentTime);old.gain.gain.setTargetAtTime(.0001,ctx.currentTime,.35);setTimeout(()=>{try{old.nodes.forEach(n=>{try{n.stop?.();n.disconnect();}catch{}});old.gain.disconnect();}catch{}},1600);}catch{}
  }
}
function whisper(ctx, intensity=.004){
  const now=ctx.currentTime;
  // A breath-like, airy spectral sweep — deliberately abstract, not intelligible speech.
  noiseBurst(ctx,now,1.8,intensity,'bandpass',520+Math.random()*950,1.2);
  tone(ctx,180+Math.random()*100,now+.12,1.25,intensity*.5,'sine',125+Math.random()*80);
}
function startAmbience(world=activeWorld){
  const ctx=getContext(); if(!ctx)return;
  stopAmbience(); activeWorld=WORLD_PROFILES[world]?world:'observatory';
  const profile=WORLD_PROFILES[activeWorld]; const now=ctx.currentTime;
  const gain=ctx.createGain(); gain.gain.setValueAtTime(.0001,now); gain.gain.linearRampToValueAtTime(.11,now+2.8); gain.connect(destination());
  const nodes=[];
  profile.notes.forEach((frequency,i)=>{
    const osc=ctx.createOscillator(); const voiceGain=ctx.createGain(); const lfo=ctx.createOscillator(); const lfoGain=ctx.createGain();
    osc.type=profile.type; osc.frequency.value=frequency; osc.detune.value=(i-1)*3;
    voiceGain.gain.value=[.12,.075,.045][i]||.04;
    lfo.frequency.value=.035+i*.018; lfoGain.gain.value=profile.pulse;
    lfo.connect(lfoGain);lfoGain.connect(voiceGain.gain);osc.connect(voiceGain);voiceGain.connect(gain);
    osc.start();lfo.start();nodes.push(osc,lfo,voiceGain,lfoGain);
  });
  const filter=ctx.createBiquadFilter(); filter.type='lowpass';filter.frequency.value=profile.filter;filter.Q.value=.35;
  const noiseLength=ctx.sampleRate*3; const noiseBuffer=ctx.createBuffer(1,noiseLength,ctx.sampleRate);const d=noiseBuffer.getChannelData(0);
  for(let i=0;i<noiseLength;i++)d[i]=(Math.random()*2-1)*.22;
  const noise=ctx.createBufferSource();noise.buffer=noiseBuffer;noise.loop=true;
  const noiseGain=ctx.createGain();noiseGain.gain.value=profile.noise;noise.connect(filter);filter.connect(noiseGain);noiseGain.connect(gain);noise.start();nodes.push(noise,filter,noiseGain);
  ambience={gain,nodes};
  // Infrequent soft spectral breaths, never intelligible or startling.
  whisperTimer=setInterval(()=>{if(audioContext?.state==='running'&&Math.random()>.38)whisper(ctx,activeWorld==='angel-veil'?.0035:.0024);},12500+Math.random()*2500);
}
export function setCosmicWorld(world){
  const next=WORLD_PROFILES[world]?world:'observatory';
  if(next===activeWorld)return;
  const previous=activeWorld;const audioIsOn=!!ambience;activeWorld=next;
  if(audioIsOn)startAmbience(next); else return;
  if(previous!=='observatory' && next==='observatory')return;
  if(next==='solar-coast'){
    const ctx=getContext();if(!ctx)return;const n=ctx.currentTime;
    tone(ctx,196,n,1.5,.035,'sine',392);tone(ctx,293.66,n+.18,1.9,.022,'triangle',587.33);tone(ctx,587.33,n+.42,2.4,.012,'sine',784);
  } else if(next==='moon-ocean'){
    const ctx=getContext();if(!ctx)return;const n=ctx.currentTime;
    tone(ctx,220,n,2.4,.024,'sine',164.81);tone(ctx,329.63,n+.25,2.7,.014,'sine',246.94);noiseBurst(ctx,n,.9,.008,'lowpass',420,.4);
  } else if(next==='angel-veil'){
    const ctx=getContext();if(!ctx)return;const n=ctx.currentTime;
    tone(ctx,523.25,n,2.8,.018,'sine',783.99);tone(ctx,659.25,n+.22,3.2,.014,'sine',987.77);tone(ctx,1046.5,n+.48,2.5,.008,'triangle',1318.5);whisper(ctx,.003);
  }
}
export function playPortalOpening(){
  try{const ctx=getContext();if(!ctx)return;const n=ctx.currentTime;
    // Low, slowly rising sub-bass swell, followed by a bright release.
    tone(ctx,42,n,2.2,.11,'sine',68);tone(ctx,55,n+.08,1.9,.065,'triangle',82.41);
    noiseBurst(ctx,n+.18,1.45,.025,'lowpass',260,.45);
    tone(ctx,110,n+1.15,1.4,.045,'sine',220);tone(ctx,440,n+1.38,1.8,.026,'sine',880);
    tone(ctx,659.25,n+1.7,2.1,.014,'triangle',987.77);
  }catch{}
}
export function playCosmicSound(kind='click'){
  try{
    const ctx=getContext();if(!ctx)return;const now=ctx.currentTime;
    if(kind==='portal'){playPortalOpening();return;}
    if(kind==='navigate'){
      tone(ctx,392,now,.24,.028,'sine');tone(ctx,587.33,now+.055,.34,.021,'sine');tone(ctx,783.99,now+.12,.42,.014,'triangle');
    }else if(kind==='toggle'){
      tone(ctx,659.25,now,.19,.025,'sine');tone(ctx,987.77,now+.07,.28,.018,'sine');
    }else{
      tone(ctx,523.25,now,.13,.018,'sine');tone(ctx,783.99,now+.035,.2,.012,'sine');
    }
  }catch{/* Sound is optional and must never interrupt navigation. */}
}
export function enableCosmicAudio(world='observatory'){startAmbience(world);}
export function disableCosmicAudio(){stopAmbience();}
