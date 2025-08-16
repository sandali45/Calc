const THEMES = {
  cotton: {bg:"#fdf7ff", panel:"#ffffff", accent:"#a3d5ff", text:"#2d2a32", btn:"#f0f6ff", btnText:"#2d2a32", op:"#ffe8a3", eq:"#b8f3c8", danger:"#ffb3c7"},
  sky:    {bg:"#f4fbff", panel:"#ffffff", accent:"#b9e1ff", text:"#233143", btn:"#eef7ff", btnText:"#233143", op:"#ffefb0", eq:"#c9ffd8", danger:"#ffc2d1"},
  mint:   {bg:"#f1fffb", panel:"#ffffff", accent:"#bff5e1", text:"#1f2a2a", btn:"#ecfffa", btnText:"#1f2a2a", op:"#fff1b8", eq:"#c3f9d8", danger:"#ffc9dd"},
  peach:  {bg:"#fff8f3", panel:"#ffffff", accent:"#ffd0b3", text:"#3b2b2b", btn:"#fff3ec", btnText:"#3b2b2b", op:"#ffe6a7", eq:"#d4ffd8", danger:"#ffc3c3"},
  lavender:{bg:"#fbf7ff", panel:"#ffffff", accent:"#d4c6ff", text:"#2b2b3b", btn:"#f4f0ff", btnText:"#2b2b3b", op:"#ffefb6", eq:"#c6ffd8", danger:"#ffc6de"}
};

const root = document.documentElement;
const themeSel = document.getElementById('theme');

function applyTheme(name){
  const t = THEMES[name] || THEMES.cotton;
  root.style.setProperty('--bg', t.bg);
  root.style.setProperty('--panel', t.panel);
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--text', t.text);
  root.style.setProperty('--btn', t.btn);
  root.style.setProperty('--btn-text', t.btnText);
  root.style.setProperty('--op', t.op);
  root.style.setProperty('--eq', t.eq);
  root.style.setProperty('--danger', t.danger);

  document.querySelectorAll('button').forEach(btn=>{
    if(btn.classList.contains('op')) btn.style.background=t.op;
    else if(btn.classList.contains('eq')) btn.style.background=t.eq;
    else if(btn.classList.contains('danger')) btn.style.background=t.danger;
    else btn.style.background=t.btn;
    btn.style.color = t.btnText;
  });
}

themeSel.addEventListener('change', e=>applyTheme(e.target.value));
applyTheme(themeSel.value);

const keys = document.getElementById('keys');
const expr = document.getElementById('expr');
const value = document.getElementById('value');

let current = "0";
let history = "";

function press(k){
  if(k==='C'){ current="0"; history=""; render(); return; }
  if(k==='DEL'){ current=current.length>1?current.slice(0,-1):"0"; render(); return; }
  if(k==='='){ 
    let res = safeEval(current.replace(/÷/g,'/').replace(/×/g,'*'));
    history = current+' ='; current=res==="ERR"?"0":String(res); render(true); return;
  }
  if(k==='%'){ let num=Number(current); if(!isNaN(num)) current=String(num/100); render(); return; }
  if(current==="0" && /[\d.]/.test(k)) current=k==='.'?'0.':k;
  else {
    if(k==='.') { const parts=current.split(/([+\-*/])/); const last=parts[parts.length-1]; if(last.includes('.')) return; }
    current += k;
  }
  render();
}

function render(bounce=false){ 
  value.textContent=current; expr.textContent=history;
  if(bounce){ value.style.transition='transform .18s ease'; value.style.transform='scale(1.06)'; setTimeout(()=>value.style.transform='scale(1)',120); } 
}

function safeEval(expr){ 
  try{ if(!/^[\d+\-*/%.() ]+$/.test(expr)) return "ERR"; const out=Function(`"use strict";return (${expr})`)(); if(typeof out!=="number"||!isFinite(out)) return "ERR"; return out;
  }catch{return "ERR"; }
}

keys.addEventListener('click', e=>{ const btn=e.target.closest('button'); if(!btn)return; press(btn.dataset.k); });
window.addEventListener('keydown', e=>{ const map={Enter:'=', '=':'=', Backspace:'DEL', Escape:'C', x:'*'}; let k=map[e.key]||e.key; if("0123456789.+-*/%".includes(k)||k==='C'||k==='DEL'||k==='='){ e.preventDefault(); press(k); }});
