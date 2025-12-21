// Grump 2.0 - Mega Expansion
// 800+ idle anims + multiple mega-sequences + advanced autonomous chat

import { useEffect, useRef } from 'react'
import './Grump2.css'

interface Grump2Props {
  chatMessagesId?: string
  chatInputId?: string
}

export default function Grump2({ chatMessagesId = 'chatMessages', chatInputId = 'chatInput' }: Grump2Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Load and inject the full Grump 2.0 script
    const script = document.createElement('script')
    script.type = 'text/javascript'
    
    // Import the full script content
    import('./Grump2Full.js').then(() => {
      // Script will auto-execute when loaded
      // We need to ensure it runs with correct selectors
      const initScript = document.createElement('script')
      initScript.textContent = `
        (() => {
          // Wait for DOM
          setTimeout(() => {
            const root = document.documentElement;
            const face = document.querySelector('.grump2-container .face');
            if (!face) return;
            
            // Set IDs for chat elements
            const chatMsgs = document.getElementById('${chatMessagesId}');
            const chatInp = document.getElementById('${chatInputId}');
            
            // Initialize Grump 2.0 systems
            if (window.initGrump2) {
              window.initGrump2(face, chatMsgs, chatInp);
            }
          }, 100);
        })();
      `
      containerRef.current?.appendChild(initScript)
    }).catch(err => {
      console.error('Failed to load Grump2Full:', err)
      // Fallback: inject minimal version
      script.textContent = `
        (() => {
          const face = document.querySelector('.grump2-container .face');
          if (!face) return;
          console.log('Grump 2.0 initialized (minimal)');
        })();
      `
      containerRef.current?.appendChild(script)
    })

    return () => {
      // Cleanup
      if (containerRef.current) {
        const scripts = containerRef.current.querySelectorAll('script')
        scripts.forEach(s => s.remove())
      }
    }
  }, [chatMessagesId, chatInputId])

/* ---------- EMOTIONAL STATE SYSTEM ---------- */
let currentMood = 'grumpy';
let moodIntensity = 5;
let energyLevel = 5;
let conversationHistory = [];
let userAnnoyanceLevel = 0;

const moods = {
  grumpy: { color: '#888', eyebrowL: 8, eyebrowR: -8, mouthCurve: -5 },
  angry: { color: '#f44', eyebrowL: 15, eyebrowR: -15, mouthCurve: -12 },
  sad: { color: '#668', eyebrowL: -12, eyebrowR: -12, mouthCurve: -8 },
  bored: { color: '#777', eyebrowL: 2, eyebrowR: -2, mouthCurve: -2 },
  annoyed: { color: '#966', eyebrowL: 12, eyebrowR: -8, mouthCurve: -6 },
  sarcastic: { color: '#797', eyebrowL: -5, eyebrowR: 10, mouthCurve: 3 },
  tired: { color: '#556', eyebrowL: -8, eyebrowR: -8, mouthCurve: -3 },
  glitchy: { color: '#0f0', eyebrowL: 20, eyebrowR: -5, mouthCurve: 0 },
  manic: { color: '#f8f', eyebrowL: 18, eyebrowR: 18, mouthCurve: 15 },
  depressed: { color: '#445', eyebrowL: -15, eyebrowR: -15, mouthCurve: -15 }
};

/* ---------- TINY TWEEN ENGINE ---------- */
const tween = (target, props, dur, easing = t => t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2) => {
  return new Promise(resolve => {
    const start = performance.now(), keys = Object.keys(props);
    const init = keys.reduce((a,k)=>(a[k]=parseFloat(getComputedStyle(root).getPropertyValue(props[k]))||0,a),{});
    const step = now => {
      const t = Math.min((now-start)/dur,1), eased = easing(t);
      keys.forEach(k=> root.style.setProperty(props[k], (init[k]+(target[k]-init[k])*eased).toFixed(2)+'px'));
      if(t<1) requestAnimationFrame(step);
      else resolve();
    }; requestAnimationFrame(step);
  });
};

/* ---------- RANDOM HELPERS ---------- */
const rand = (min,max) => Math.random()*(max-min)+min;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const chance = prob => Math.random() < prob;

/* ---------- FACE MANIPULATION HELPERS ---------- */
const resetFace=()=>{ 
  const m = moods[currentMood];
  setEyebrows(m.eyebrowL, m.eyebrowR); 
  eyes.forEach(e=>e.style.transform=''); 
  movePupils(0,0); 
  setMouthOpen(m.mouthCurve); 
};

const setEyebrows=(l,r)=>{ 
  root.style.setProperty('--eyebrow-left-rotate',l+'deg'); 
  root.style.setProperty('--eyebrow-right-rotate',r+'deg'); 
};

const movePupils=(x,y)=>{ 
  root.style.setProperty('--pupil-x',x+'px'); 
  root.style.setProperty('--pupil-y',y+'px'); 
};

const setMouthOpen=v=>root.style.setProperty('--mouth-open',v+'px');

const moveFace=(x,y)=>{
  root.style.setProperty('--face-x',x+'px');
  root.style.setProperty('--face-y',y+'px');
};

const scaleFace=s=>root.style.setProperty('--face-scale',s);

const rotateFace=d=>root.style.setProperty('--face-rotate',d+'deg');

const setBackground=c=>root.style.setProperty('--bg-color',c);

const setVignette=v=>root.style.setProperty('--vignette-opacity',v);

const lookAt=(x,y)=>{ 
  if(!face) return;
  const f=face.getBoundingClientRect();
  const cx=f.left+f.width/2;
  const cy=f.top+f.height/2;
  const dx=(x-cx)/20;
  const dy=(y-cy)/20; 
  movePupils(Math.max(-12,Math.min(12,dx)),Math.max(-12,Math.min(12,dy))); 
  rotateFace(dx/100); 
};

const slapChat=()=>{ 
  if(!chatMessages) return;
  root.style.setProperty('--chat-x','800px'); 
  root.style.setProperty('--chat-rotate','45deg'); 
  root.style.setProperty('--chat-opacity','0'); 
  setTimeout(()=>{ 
    root.style.setProperty('--chat-x','0px'); 
    root.style.setProperty('--chat-rotate','0deg'); 
    root.style.setProperty('--chat-opacity','1'); 
  },3000); 
};

/* ---------- IDLE ANIMATIONS (simplified - full 800+ in separate file) ---------- */
const idles = [
  ()=> tween({x:0,y:-3}, {'--face-x':'--face-y'}, 600).then(()=>tween({x:0,y:0}, {'--face-x':'--face-y'}, 600)),
  ()=> moveFace(rand(-2,2), rand(-2,2)),
  ()=> { eyes.forEach(e=>e.style.transform='scaleY(0.1)'); setTimeout(()=>eyes.forEach(e=>e.style.transform=''),100); },
  ()=> movePupils(rand(-12,12), rand(-12,12)),
  ()=> setMouthOpen(rand(5,15)),
  ()=> setEyebrows(rand(-15,15), rand(-15,15)),
];

/* ---------- IDLE SCHEDULER ---------- */
let idleTimer;
let idleRunning = true;

const runIdle = () => {
  if(!idleRunning || !face) return;
  const baseDelay = 1200;
  const energyMultiplier = (10 - energyLevel) / 10;
  const delay = baseDelay + (energyMultiplier * 2000);
  pick(idles)();
  idleTimer = setTimeout(runIdle, delay + rand(-400,400));
};

/* ---------- MOOD SYSTEM ---------- */
const changeMood = (newMood) => {
  currentMood = newMood;
  const m = moods[currentMood];
  if(m) {
    setEyebrows(m.eyebrowL, m.eyebrowR);
    if(face) face.style.filter = \`hue-rotate(\${m.color})\`;
    setMouthOpen(m.mouthCurve);
  }
};

setInterval(() => {
  if(chance(0.1)) {
    const moodList = Object.keys(moods);
    changeMood(pick(moodList));
  }
  energyLevel = Math.max(1, Math.min(10, energyLevel + rand(-1, 1)));
  moodIntensity = Math.max(1, moodIntensity - 0.1);
}, 15000);

/* ---------- START SYSTEMS ---------- */
if(face) {
  runIdle();
  
  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    if(face && chance(0.3)) lookAt(e.clientX, e.clientY);
  });
}

})();
    `
    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current && script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [chatMessagesId, chatInputId])

  return (
    <div ref={containerRef} className="grump2-container">
      <div className="face">
        <div className="eyes-container">
          <div className="eye left-eye">
            <div className="pupil" />
          </div>
          <div className="eye right-eye">
            <div className="pupil" />
          </div>
        </div>
        <div className="eyebrows-container">
          <div className="eyebrow left-eyebrow" />
          <div className="eyebrow right-eyebrow" />
        </div>
        <div className="mouth" />
        <div className="nose" />
      </div>
    </div>
  )
}

