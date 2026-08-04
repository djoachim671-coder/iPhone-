import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import {
  Check, Key, Download, Home, Settings, Plus, Trash2,
  PauseCircle, BarChart2, Copy, LogOut, Eye, EyeOff,
  Shield, Zap, Globe, X, RefreshCw, Link, Bell,
  Activity, TrendingUp, TrendingDown, Power, ChevronRight,
  Camera, Lock
} from "lucide-react";

// ══════════════════════════════
//  ⚙️  CONFIG — CHANJE SA YO ICI UNE SÈLMAN
// ══════════════════════════════
const APP = {
  name:       "DJ TRADEPRO",
  tagline:    "Automated EA Trading Platform",
  version:    "v2.5.0",
  adminPass:  "DJADMIN2024",      // ← Modpas admin ou

  // 💰 PEMAN — Mete info ou ici
  usdt:       "TDeQVGUMvveHaY8amuVcXR1etWZ7en3y4M",
  whatsapp:   "50946315367",
  priceMonth: 29,                  // ← Pri mensyèl ($)
  priceLife:  99,                  // ← Pri à vie ($)

  // 🔌 METAAPI.CLOUD — Konekte kont MetaTrader REYÈL pou CHAK itilizatè (opsyonèl)
  // 1. Kreye kont sou https://app.metaapi.cloud/token → kopye Token an
  // 2. Mete SÈL Token a anba a — YON sèl token jere TOUT itilizatè yo
  // 3. Chak itilizatè ki antre modpas MT yo pandan aktivasyon ap gen pwòp kont
  //    MetaApi kreye otomatikman (pa gen bezwen ou mete okenn Account ID isit).
  // ⚠️ Token sa a vizib nan kòd sous la — pa pataje lyen kòd la piblikman.
  metaApiToken:   "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJiMDE5NjBjNzg3Njk3ZDQ3M2Q4ZjI1OGE2NjlmN2Q5YiIsImFjY2Vzc1J1bGVzIjpbeyJpZCI6InRyYWRpbmctYWNjb3VudC1tYW5hZ2VtZW50LWFwaSIsIm1ldGhvZHMiOlsidHJhZGluZy1hY2NvdW50LW1hbmFnZW1lbnQtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVzdC1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcnBjLWFwaSIsIm1ldGhvZHMiOlsibWV0YWFwaS1hcGk6d3M6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6Im1ldGFhcGktcmVhbC10aW1lLXN0cmVhbWluZy1hcGkiLCJtZXRob2RzIjpbIm1ldGFhcGktYXBpOndzOnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJtZXRhc3RhdHMtYXBpIiwibWV0aG9kcyI6WyJtZXRhc3RhdHMtYXBpOnJlc3Q6cHVibGljOio6KiJdLCJyb2xlcyI6WyJyZWFkZXIiLCJ3cml0ZXIiXSwicmVzb3VyY2VzIjpbIio6JFVTRVJfSUQkOioiXX0seyJpZCI6InJpc2stbWFuYWdlbWVudC1hcGkiLCJtZXRob2RzIjpbInJpc2stbWFuYWdlbWVudC1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoiY29weWZhY3RvcnktYXBpIiwibWV0aG9kcyI6WyJjb3B5ZmFjdG9yeS1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciIsIndyaXRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfSx7ImlkIjoibXQtbWFuYWdlci1hcGkiLCJtZXRob2RzIjpbIm10LW1hbmFnZXItYXBpOnJlc3Q6ZGVhbGluZzoqOioiLCJtdC1tYW5hZ2VyLWFwaTpyZXN0OnB1YmxpYzoqOioiXSwicm9sZXMiOlsicmVhZGVyIiwid3JpdGVyIl0sInJlc291cmNlcyI6WyIqOiRVU0VSX0lEJDoqIl19LHsiaWQiOiJiaWxsaW5nLWFwaSIsIm1ldGhvZHMiOlsiYmlsbGluZy1hcGk6cmVzdDpwdWJsaWM6KjoqIl0sInJvbGVzIjpbInJlYWRlciJdLCJyZXNvdXJjZXMiOlsiKjokVVNFUl9JRCQ6KiJdfV0sImlnbm9yZVJhdGVMaW1pdHMiOmZhbHNlLCJ0b2tlbklkIjoiMjAyMTAyMTMiLCJpbXBlcnNvbmF0ZWQiOmZhbHNlLCJyZWFsVXNlcklkIjoiYjAxOTYwYzc4NzY5N2Q0NzNkOGYyNThhNjY5ZjdkOWIiLCJpYXQiOjE3ODUyOTA3OTl9.V3rUhWHMOCnZh1Xa3H3nXBU6qiSp2Mcm1Aizhk8-22cWSIyOA3-XtD-AUKLDA_u2fEDWwzXfvxpY0th0e8GZrfOWxg-dWT14ot_odUPmr0mKdPshJ7wSM-c1iPXG15dNGyhc8Blhmn3diCKkgeWuTfEWhaoobJqJcpGBjDnn-baSxKgLJgla2UmLBAO-smu_rkF9B5BQXp8c6eE5WRAtAwe7MjWRZfkKvL0B0CLr3xdQgcmdpeMSMrIKRetcEl-kBtSgdZALl8vNJhZBhNQ4Ni3eK7O0N-r7xxYwobp6N1UxxQpHXrbvE1SWHxfVCA8kmZyGJMBrF6qdCg1cYZ4AtlawRegG7w9a7lyOtp-5cSlOITWvGBJvXdS5ThIBHQbGPR0kGN-o0lK0sn4nigE-W6yhaUUW8pl9uj19c4DownemVOav2yCUh4ziDpBesJWHnEmrbbBot-2V3D5_hB8NJ5-_Jm_sZaLtZJoHxEIi9x5nMn9N3vPR3MxP7p6BdozDiCPH-3MwnbG4nWP6IAXE1p4DSwtXrfnPAXMtPGy8T3Lx2-qe2obA7txIVLrP5PCVyO4yWCGwBGcfEU-jPdZWq1drDgrD69IDDI0sYoCSYES13N3arEX6Tip0F-lrjUDUK8-ibYlLAXJ8lCntJATEZjXB0mgg_1oGOEfTRDx6LRU",  // ← SÈL sa ou bezwen
  metaApiRegion:  "new-york",      // ← Rejyon (new-york, london, singapore, etc.)
};

const C = {
  bg:"#07090f", nav:"#080c18", card:"#0c1120", card2:"#0f1830",
  border:"#1c2845", blue:"#3b82f6", blue2:"#2563eb", blueDark:"#1d4ed8",
  green:"#10b981", red:"#ef4444", gold:"#f0b90b",
  gray:"#3d4f75", sub:"#7a88b8", white:"#edf2ff", muted:"#4a5780",
};

const fmt  = n => Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});

// ══════════════════════════════
//  METAAPI.CLOUD — Konekte MT4/5 REYÈL
// ══════════════════════════════
function metaApiConfigured() {
  return !!APP.metaApiToken;   // Sèl token an obligatwa; accountId vin pa itilizatè
}

async function metaApiFetch(path, accountId) {
  if (!APP.metaApiToken)  return { ok:false, error:"MetaApi pa konfigire (token manke)" };
  if (!accountId)         return { ok:false, error:"Aucun compte MetaApi provisionné pour cet utilisateur" };
  const base = `https://mt-client-api-v1.${APP.metaApiRegion}.agiliumtrade.ai`;
  const url = `${base}/users/current/accounts/${accountId}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Accept":"application/json", "auth-token": APP.metaApiToken }
    });
    if (!res.ok) return { ok:false, error:`HTTP ${res.status}` };
    const data = await res.json();
    return { ok:true, data };
  } catch(e) {
    // Souvan CORS bloke apèl dirèk depi navigatè — MetaApi fèt pou backend
    return { ok:false, error: "Erreur réseau/CORS: "+(e?.message||String(e)) };
  }
}

async function fetchMTAccountInfo(accountId) { return metaApiFetch(`/account-information`, accountId); }
async function fetchMTPositions(accountId)   { return metaApiFetch(`/positions`, accountId); }

// Kreye yon kont MetaApi POU YON ITILIZATÈ espesifik, itilizan token PLATFÒM nan (sekrè, kache nan kòd)
// Chak itilizatè ba nou pwòp login/modpas/sèvè MT yo → nou pwovizyone yon kont MetaApi separe pou yo.
async function provisionMTAccount({ login, password, server, platform="mt5", name }) {
  if (!APP.metaApiToken) return { ok:false, error:"Token MetaApi pa konfigire (contactez l'administrateur)." };
  const url = "https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts";
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Accept":"application/json",
        "auth-token": APP.metaApiToken,
        "transaction-id": "tx-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),
      },
      body: JSON.stringify({ login, password, server, platform, name: name||("DJTradePro-"+login), magic: 123456 }),
    });
    const data = await res.json().catch(()=>null);
    if (!res.ok) return { ok:false, error: data?.message || `HTTP ${res.status}` };
    return { ok:true, accountId: data?.id, state: data?.state };
  } catch(e) {
    return { ok:false, error: "Erreur réseau/CORS: "+(e?.message||String(e)) };
  }
}

// Plase yon lòd REYÈL nan kont MT itilizatè a atravè MetaApi (BUY/SELL market avèk SL/TP)
async function placeTrade(accountId, { actionType, symbol, volume, stopLoss, takeProfit, comment }) {
  if (!APP.metaApiToken) return { ok:false, error:"Token MetaApi pa konfigire." };
  if (!accountId) return { ok:false, error:"Aucun compte MetaApi connecté. Activez votre compte avec votre mot de passe MT d'abord." };
  const base = `https://mt-client-api-v1.${APP.metaApiRegion}.agiliumtrade.ai`;
  const url = `${base}/users/current/accounts/${accountId}/trade`;
  try {
    const body = {
      actionType,                          // "ORDER_TYPE_BUY" | "ORDER_TYPE_SELL"
      symbol,                              // ex: "XAUUSD"
      volume: Number(volume) || 0.01,
      ...(stopLoss   ? { stopLoss:   Number(stopLoss) }   : {}),
      ...(takeProfit ? { takeProfit: Number(takeProfit) } : {}),
      comment: comment || "DJTradePro-AI",
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type":"application/json", "Accept":"application/json", "auth-token": APP.metaApiToken },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(()=>null);
    if (!res.ok) return { ok:false, error: data?.message || `HTTP ${res.status}` };
    if (data?.stringCode && data.stringCode !== "TRADE_RETCODE_DONE" && data.numericCode !== 10009) {
      return { ok:false, error: `${data.stringCode||"Erreur"}: ${data.message||""}` };
    }
    return { ok:true, orderId: data?.orderId, positionId: data?.positionId, raw: data };
  } catch(e) {
    return { ok:false, error: "Erreur réseau/CORS: "+(e?.message||String(e)) };
  }
}

function genKey() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const s = () => Array.from({length:4},()=>c[Math.floor(Math.random()*c.length)]).join("");
  const m1 = s(), m2 = s();
  const chk = checksum(m1+m2);
  return `DJ-${m1}-${m2}-${chk}`;
}

// Kalkile yon checksum 4-karaktè depi yon tèks, itilize yon "sekrè" ki kache nan kòd la.
// Sa pèmèt verifye yon kle SAN nou bezwen konsève li okenn kote (pa gen bezwen storage).
const LICENSE_SALT = "DJTRADEPRO2025SECRET";
function checksum(str) {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let h = 0;
  const full = str + LICENSE_SALT;
  for (let i=0;i<full.length;i++) {
    h = (h * 31 + full.charCodeAt(i)) >>> 0;
  }
  let out = "";
  for (let i=0;i<4;i++) {
    out += c[h % c.length];
    h = Math.floor(h / c.length) || (h*7+13)>>>0;
  }
  return out;
}

// Verifye si yon kle DJ-XXXX-XXXX-XXXX valid matematikman (san storage)
function isValidLicenseKey(key) {
  const k = key.trim().toUpperCase();
  const m = k.match(/^DJ-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})$/);
  if (!m) return false;
  const [, m1, m2, given] = m;
  return checksum(m1+m2) === given;
}

// ── Storage helpers ──
// shared=true → done ki dwe aksesib pou TOUT itilizatè (kle lisans, config, peman)
// shared=false → done pèsonèl pou chak itilizatè (sesyon, robots, MT info)
const DB = {
  get: async (k, shared=false) => {
    try { const r = await window.storage.get(k, shared); return r?.value ? JSON.parse(r.value) : null; }
    catch(e){ console.error("DB.get error for "+k+":", e); return null; }
  },
  set: async (k,v, shared=false) => {
    try {
      const r = await window.storage.set(k, JSON.stringify(v), shared);
      // API dokimante retounen null si ekri a echwe — pa jete erè
      if(!r) return { ok:false, error:"storage.set returned null (échec silencieux)" };
      return { ok:true, result:r };
    }
    catch(e){ console.error("DB.set error for "+k+":", e); return { ok:false, error: e?.message||String(e) }; }
  },
};

// ── Config — lit depi APP (jamè vid) ──
const DEFAULT_CFG = {
  usdt:       APP.usdt,
  whatsapp:   APP.whatsapp,
  priceMonth: APP.priceMonth,
  priceLife:  APP.priceLife,
};

// Variable global — toujou disponib, san async, san delay
let LIVE_CFG = {...DEFAULT_CFG};

// ── Toast ──
let _toast = null;
function toast(msg, type="info") {
  if(!_toast) return;
  const id = Date.now();
  _toast(p=>[...p.slice(-2),{id,msg,type}]);
  setTimeout(()=>_toast(p=>p.filter(t=>t.id!==id)),3500);
}
function Toasts() {
  const [list,setList] = useState([]);
  useEffect(()=>{_toast=setList;},[]);
  const col = {success:C.green,error:C.red,info:C.blue,trade:C.gold};
  return (
    <div style={{position:"fixed",top:16,right:16,zIndex:9999,display:"flex",flexDirection:"column",gap:8,pointerEvents:"none",maxWidth:280}}>
      {list.map(({id,msg,type})=>(
        <div key={id} style={{background:C.card2,border:`1px solid ${col[type]||C.border}`,borderLeft:`3px solid ${col[type]||C.blue}`,borderRadius:12,padding:"10px 16px",fontSize:13,color:C.white,boxShadow:"0 8px 32px #0008"}}>{msg}</div>
      ))}
    </div>
  );
}

function Btn({children,onClick,style={},outline=false,disabled=false}) {
  return <button onClick={onClick} disabled={disabled} style={{background:outline?"transparent":C.blue,color:outline?C.white:"#fff",border:outline?`1.5px solid ${C.border}`:"none",borderRadius:12,padding:"13px 24px",fontWeight:700,fontSize:14,cursor:disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,opacity:disabled?.5:1,...style}}>{children}</button>;
}

// ══════════════════════════════
//  LANDING PAGE
// ══════════════════════════════
function LandingPage({onActivate,onPricing,onAdmin,onReconnect}) {
  const feats = [
    {icon:<Shield size={20} color={C.blue}/>, t:"Gestion de licences", d:"Chaque clé active un EA unique. Gérez et révoquez les licences en temps réel."},
    {icon:<Zap size={20} color={C.gold}/>,    t:"Robots automatisés",  d:"Ajoutez vos EAs MetaTrader 4 & 5, configurez les paramètres et laissez-les trader 24h/24."},
    {icon:<Activity size={20} color={C.green}/>,t:"Surveillance live",  d:"Suivez les performances, P&L, win rate et historique de trades en temps réel."},
    {icon:<Globe size={20} color="#8b5cf6"/>,  t:"Cloud 24/7",         d:"Infrastructure hébergée dans le cloud. Vos robots tournent même si votre PC est éteint."},
  ];
  const [cfg,setCfg] = useState({priceMonth:29,priceLife:99});
  useEffect(()=>{ DB.get("dj_cfg", true).then(d=>{ if(d) setCfg(d); }); },[]);

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',-apple-system,sans-serif",color:C.white}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}} @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}} @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}} *{box-sizing:border-box;} ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#1c2845;border-radius:4px;} a{text-decoration:none;}`}</style>
      <Toasts/>

      {/* Announcement */}
      <div style={{background:C.green,padding:"10px 20px",textAlign:"center",fontSize:13,fontWeight:600,color:"#fff"}}>
        🎉 Notre système de paiement est désormais opérationnel. Merci de votre patience.
      </div>

      {/* Navbar */}
      <nav style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"0 24px",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",height:64,gap:32}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🏆</div>
            <span style={{fontWeight:900,fontSize:16,letterSpacing:.5}}>{APP.name}</span>
          </div>
          <div style={{flex:1}}/>
          <div style={{display:"flex",gap:10,flexShrink:0}}>
            <Btn outline onClick={onActivate} style={{padding:"9px 18px",fontSize:13}}>Activer le compte</Btn>
            <Btn onClick={onPricing} style={{padding:"9px 18px",fontSize:13}}>Commencer →</Btn>
            <button onClick={onAdmin} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 14px",color:C.sub,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6,fontWeight:600}}>
              <Lock size={13}/> Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{maxWidth:820,margin:"0 auto",padding:"80px 24px 60px",textAlign:"center",animation:"fadeUp .8s ease"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border}`,borderRadius:30,padding:"6px 16px",marginBottom:32,fontSize:13,color:C.blue}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:C.blue,animation:"pulse 1.5s infinite",display:"inline-block"}}/>
          Plateforme de trading professionnelle
        </div>
        <h1 style={{fontSize:"clamp(30px,5vw,54px)",fontWeight:900,lineHeight:1.15,letterSpacing:-1.5,marginBottom:24}}>
          Tradez plus intelligemment<br/>
          <span style={{background:`linear-gradient(135deg,${C.blue},#818cf8)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>grâce aux EA automatisés</span>
        </h1>
        <p style={{fontSize:17,color:C.sub,lineHeight:1.7,maxWidth:520,margin:"0 auto 40px"}}>
          Gérez vos Expert Advisors, suivez vos licences et optimisez vos performances depuis n'importe où.
        </p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:20}}>
          <Btn onClick={onActivate} style={{padding:"15px 32px",fontSize:15,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,boxShadow:`0 8px 28px ${C.blue}40`}}>
            <Download size={16}/> Télécharger l'application →
          </Btn>
          <Btn outline onClick={onActivate} style={{padding:"15px 32px",fontSize:15}}>Activer le compte</Btn>
        </div>
        {/* Reconnect link */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <button onClick={onReconnect}
            style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",textDecoration:"underline"}}>
            🔄 Déjà un compte ? Se reconnecter
          </button>
        </div>
        {["✓ Hébergement cloud 24h/7j","✓ Compatible MT4 & MT5","✓ +10 000 traders actifs"].map(c=>(
          <div key={c} style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:13,color:C.sub,marginRight:20}}>{c}</div>
        ))}
      </section>

      {/* Phone mockups */}
      <section style={{padding:"0 24px 80px",display:"flex",justifyContent:"center",gap:24,flexWrap:"wrap"}}>
        {/* Phone 1 — light */}
        <div style={{width:210,background:"#f0f4ff",borderRadius:34,padding:"22px 14px",boxShadow:"0 28px 60px #0008",border:"6px solid #dde4ff",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
          <div style={{width:52,height:52,borderRadius:14,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🏆</div>
          <div style={{fontWeight:900,fontSize:14,color:"#111",letterSpacing:.5}}>{APP.name}</div>
          <div style={{fontSize:10,color:"#666",textAlign:"center",lineHeight:1.5,padding:"0 4px"}}>A cutting-edge mobile hosting platform for automated Expert Advisors.</div>
          <div style={{width:"100%",background:"#e0e7ff",borderRadius:8,padding:"9px 12px",fontSize:11,color:"#888",letterSpacing:1}}>LICENSE KEY</div>
          <div style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,borderRadius:10,padding:"11px",textAlign:"center",fontWeight:700,fontSize:13,color:"#fff"}}>Proceed →</div>
        </div>

        {/* Phone 2 — dark dashboard */}
        <div style={{width:230,background:"#060306",borderRadius:34,overflow:"hidden",boxShadow:"0 28px 60px #000a",border:"6px solid #120810",display:"flex",flexDirection:"column"}}>
          <div style={{background:"#100a10",padding:"14px 12px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:900,fontSize:12,color:"#fff",letterSpacing:1}}>{APP.name}</div>
            <div style={{display:"flex",gap:5}}>
              {[C.green,"#333","#333"].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:c,animation:i===0?"pulse 1.4s infinite":"none"}}/>)}
            </div>
          </div>
          <div style={{background:"linear-gradient(180deg,#180a10,#060306)",padding:"16px 12px",flex:1}}>
            <div style={{textAlign:"center",marginBottom:12}}>
              <div style={{fontSize:9,color:"#888",marginBottom:3}}>You are trading with</div>
              <div style={{fontWeight:900,fontSize:14,color:"#fff",letterSpacing:1}}>GOLD HUNTER</div>
            </div>
            <div style={{width:58,height:58,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},#b07800)`,margin:"0 auto 14px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:`0 0 20px ${C.gold}44`}}>🤖</div>
            <div style={{display:"flex",justifyContent:"center",gap:14,marginBottom:12}}>
              {[{l:"REMOVE",e:"🗑"},{l:"STOP",e:"⏸"},{l:"QUOTES",e:"📊"}].map(({l,e})=>(
                <div key={l} style={{textAlign:"center"}}>
                  <div style={{width:30,height:30,borderRadius:9,background:"#1a0808",border:"1px solid #2a1010",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:3,fontSize:12}}>{e}</div>
                  <div style={{fontSize:7,color:"#555",letterSpacing:.3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:8,color:"#444",textAlign:"center",marginBottom:10,letterSpacing:1}}>POWERED BY {APP.name}</div>
            <div style={{background:"#0f0308",borderRadius:10,padding:"8px"}}>
              <div style={{fontSize:8,color:"#666",marginBottom:6,letterSpacing:1}}>ROBOT LIST:</div>
              <div style={{background:`linear-gradient(135deg,${C.gold}20,#1a0a00)`,borderRadius:7,padding:"7px 8px",display:"flex",alignItems:"center",gap:5,marginBottom:4,border:`1px solid ${C.gold}25`}}>
                <span style={{fontSize:13}}>🤖</span><span style={{fontSize:9,fontWeight:700,color:C.gold}}>GOLD HUNTER</span>
              </div>
              <div style={{background:"#151515",borderRadius:7,padding:"7px 8px",display:"flex",alignItems:"center",gap:5,border:"1px solid #222"}}>
                <div style={{width:13,height:13,borderRadius:"50%",border:"1.5px solid #444",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#444"}}>+</div>
                <span style={{fontSize:8,color:"#555"}}>Add a new Robot</span>
              </div>
            </div>
          </div>
          <div style={{background:"#0d0310",borderTop:"1px solid #1a0a14",padding:"7px 0 4px",display:"flex",justifyContent:"space-around"}}>
            {[{l:"HOME",e:"🏠"},{l:"META TRADER",e:"📊"},{l:"SETTINGS",e:"⚙️"}].map(({l,e})=>(
              <div key={l} style={{textAlign:"center"}}><div style={{fontSize:13}}>{e}</div><div style={{fontSize:6,color:"#444",letterSpacing:.2}}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{maxWidth:1060,margin:"0 auto",padding:"0 24px 80px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:11,color:C.blue,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>FONCTIONNALITÉS</div>
          <h2 style={{fontSize:"clamp(22px,3.5vw,34px)",fontWeight:900,letterSpacing:-1}}>Tout ce dont vous avez besoin pour trader automatiquement</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:18}}>
          {feats.map(({icon,t,d})=>(
            <div key={t} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"22px"}}>
              <div style={{width:44,height:44,borderRadius:13,background:C.blue+"18",border:`1px solid ${C.blue}28`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14}}>{icon}</div>
              <div style={{fontWeight:700,fontSize:15,color:C.white,marginBottom:8}}>{t}</div>
              <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{maxWidth:760,margin:"0 auto",padding:"0 24px 100px"}}>
        <div style={{textAlign:"center",marginBottom:48}}>
          <div style={{fontSize:11,color:C.blue,textTransform:"uppercase",letterSpacing:2,marginBottom:10}}>TARIFS</div>
          <h2 style={{fontSize:"clamp(22px,3.5vw,34px)",fontWeight:900,letterSpacing:-1}}>Plans simples et transparents</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:20}}>
          {[
            {id:"month",label:"MENSUEL",price:cfg.priceMonth,sub:"par mois · 1 appareil",features:["1 clé de licence","1 robot EA","Surveillance live","Support prioritaire"],highlight:false},
            {id:"life", label:"À VIE",  price:cfg.priceLife, sub:"paiement unique",       features:["Licences illimitées","Robots EA illimités","Mises à jour gratuites","Support VIP"],highlight:true},
          ].map(({label,price,sub,features,highlight})=>(
            <div key={label} style={{background:highlight?`linear-gradient(135deg,#0f1a35,#0c1525)`:C.card,border:`${highlight?2:1}px solid ${highlight?C.blue:C.border}`,borderRadius:24,padding:"30px 26px",position:"relative",overflow:"hidden"}}>
              {highlight&&<div style={{position:"absolute",top:14,right:14,background:C.blue,borderRadius:20,padding:"3px 12px",fontSize:10,fontWeight:700,color:"#fff"}}>⭐ BEST VALUE</div>}
              <div style={{fontSize:11,color:highlight?C.blue:C.sub,textTransform:"uppercase",letterSpacing:1.5,marginBottom:8}}>{label}</div>
              <div style={{fontSize:46,fontWeight:900,letterSpacing:-2,marginBottom:4}}>${price}</div>
              <div style={{fontSize:13,color:C.muted,marginBottom:22}}>{sub}</div>
              {features.map(f=>(
                <div key={f} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,fontSize:13,color:C.sub}}>
                  <Check size={13} color={highlight?C.blue:C.green}/> {f}
                </div>
              ))}
              <Btn onClick={onPricing} style={{width:"100%",marginTop:22,background:highlight?`linear-gradient(135deg,${C.blue},${C.blueDark})`:"transparent",border:highlight?"none":`1.5px solid ${C.border}`,color:highlight?"#fff":C.white,boxShadow:highlight?`0 6px 20px ${C.blue}35`:"none"}}>
                {highlight?"Obtenir un accès à vie":"Commencer"}
              </Btn>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:24,flexWrap:"wrap"}}>
          {["₿ USDT TRC20","💳 Visa / Mastercard"].map(m=>(
            <div key={m} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"7px 14px",fontSize:12,color:C.sub}}>{m}</div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"28px 24px",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:12}}>
          <div style={{width:26,height:26,borderRadius:8,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🏆</div>
          <span style={{fontWeight:900,fontSize:13}}>{APP.name}</span>
          <span style={{color:C.muted,fontSize:10}}>{APP.version}</span>
        </div>
        <div style={{fontSize:11,color:C.muted,marginBottom:16}}>© 2025 {APP.name} · Tous droits réservés · Le trading comporte des risques</div>
        {/* Admin access */}
        <button onClick={onAdmin} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 20px",color:C.sub,cursor:"pointer",fontSize:13,display:"inline-flex",alignItems:"center",gap:7,fontWeight:700}}>
          <Lock size={14}/> 🔐 Accès Admin
        </button>
      </footer>
    </div>
  );
}

// ══════════════════════════════
//  PRICING PAGE
// ══════════════════════════════
function PricingPage({onBack,onActivate,onConfirm}) {
  const [plan,setPlan]     = useState("life");
  const [copied,setCopied] = useState("");
  // Li LIVE_CFG dirèkteman — toujou disponib, san delay
  const [cfg,setCfg]       = useState(()=>({...LIVE_CFG}));

  // Rafraîchi si LIVE_CFG chanje (apre admin sove)
  useEffect(()=>{ setCfg({...LIVE_CFG}); },[]);

  const price = plan==="month" ? cfg.priceMonth : cfg.priceLife;
  const copy  = (txt,id) => { navigator.clipboard.writeText(txt).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(""),2500); toast("✅ Adresse copiée!","success"); };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white}}>
      <Toasts/>
      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",alignItems:"center",gap:16}}>
        <button onClick={onBack} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",color:C.sub,cursor:"pointer",fontSize:13}}>← Retour</button>
        <div style={{fontWeight:800,fontSize:16}}>💳 Acheter une licence</div>
      </div>

      <div style={{maxWidth:540,margin:"0 auto",padding:"36px 20px 60px",display:"flex",flexDirection:"column",gap:16}}>

        {/* Plan selector */}
        <div style={{background:C.card,borderRadius:14,padding:4,border:`1px solid ${C.border}`,display:"flex"}}>
          {[{id:"month",label:`Mensuel · $${cfg.priceMonth}`},{id:"life",label:`À vie · $${cfg.priceLife} ⭐`}].map(({id,label})=>(
            <button key={id} onClick={()=>setPlan(id)} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:plan===id?C.blue:"transparent",color:plan===id?"#fff":C.sub,fontWeight:700,fontSize:13,cursor:"pointer"}}>{label}</button>
          ))}
        </div>

        {/* Summary */}
        <div style={{background:`linear-gradient(135deg,#0f1a35,${C.card})`,borderRadius:20,padding:"22px",border:`1px solid ${C.blue}30`,textAlign:"center"}}>
          <div style={{fontSize:13,color:C.sub,marginBottom:4}}>{plan==="month"?"Abonnement mensuel":"Accès à vie"}</div>
          <div style={{fontSize:50,fontWeight:900,letterSpacing:-2}}>${price}</div>
          <div style={{fontSize:12,color:C.muted,marginTop:4}}>{plan==="month"?"· 1 appareil · mensuel":"· Paiement unique · illimité"}</div>
        </div>

        {/* USDT TRC20 */}
        <div style={{background:C.card,borderRadius:18,padding:"20px",border:`1px solid ${cfg.usdt?C.gold+"40":C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div style={{width:44,height:44,borderRadius:13,background:"#1a1000",border:`1px solid ${C.gold}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>₿</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:15}}>USDT TRC20</div>
              <div style={{fontSize:11,color:C.sub,marginTop:2}}>Paiement crypto · Réseau TRC20</div>
            </div>
            <div style={{background:C.green+"18",border:`1px solid ${C.green}35`,borderRadius:20,padding:"4px 12px",fontSize:10,color:C.green,fontWeight:700}}>RAPIDE</div>
          </div>

          {cfg.usdt && !cfg.usdt.includes("XXXXX") ? (
            <div style={{background:"linear-gradient(135deg,#061206,#091509)",borderRadius:14,padding:"18px",border:`1px solid ${C.green}35`}}>
              <div style={{fontSize:11,color:C.green,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>✓ Adresse de Réception USDT</div>
              <div style={{background:"#040c04",borderRadius:10,padding:"14px",marginBottom:14,border:`1px solid ${C.green}20`}}>
                <div style={{fontFamily:"monospace",fontSize:13,color:C.white,wordBreak:"break-all",lineHeight:1.8,letterSpacing:.3,userSelect:"all"}}>{cfg.usdt}</div>
              </div>
              <button onClick={()=>copy(cfg.usdt,"usdt")}
                style={{width:"100%",background:copied==="usdt"?`linear-gradient(135deg,${C.green},#0a9060)`:"linear-gradient(135deg,#0f2a10,#162a17)",border:`1.5px solid ${copied==="usdt"?C.green:C.green+"50"}`,borderRadius:11,padding:"14px",color:copied==="usdt"?"#000":C.green,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontWeight:800,transition:"all .25s",boxShadow:copied==="usdt"?`0 4px 18px ${C.green}35`:"none"}}>
                <Copy size={16}/> {copied==="usdt"?"✅ Adresse Copiée!":"📋 Copier l'Adresse USDT"}
              </button>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}>
                <div style={{background:"#040c04",borderRadius:9,padding:"10px",textAlign:"center",border:`1px solid ${C.green}15`}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:3}}>Réseau</div>
                  <div style={{fontSize:12,fontWeight:700,color:C.white}}>TRC20 (Tron)</div>
                </div>
                <div style={{background:"#040c04",borderRadius:9,padding:"10px",textAlign:"center",border:`1px solid ${C.gold}20`}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:3}}>Montant exact</div>
                  <div style={{fontSize:13,fontWeight:800,color:C.gold}}>${price} USDT</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{background:C.gold+"0a",border:`1px solid ${C.gold}25`,borderRadius:12,padding:"16px",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8}}>⚙️</div>
              <div style={{fontSize:13,color:C.gold,fontWeight:700,marginBottom:6}}>En cours de configuration</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.7}}>Cliquez <strong style={{color:C.white}}>"J'ai payé"</strong> ci-dessous pour nous contacter directement.</div>
            </div>
          )}
        </div>

        {/* Visa */}
        <div style={{background:C.card,borderRadius:18,padding:"20px",border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:44,height:44,borderRadius:13,background:"#0a0a1a",border:"1px solid #1a1a30",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>💳</div>
            <div><div style={{fontWeight:800,fontSize:15}}>Visa / Mastercard</div><div style={{fontSize:11,color:C.sub,marginTop:2}}>Paiement par carte bancaire</div></div>
          </div>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.7,marginBottom:10}}>
            Payez par carte, puis cliquez <strong style={{color:C.white}}>"J'ai payé"</strong> — notre équipe vous contactera sous 30 min.
          </div>
          <div style={{background:C.blue+"0d",borderRadius:10,padding:"10px 13px",fontSize:12,color:C.blue,border:`1px solid ${C.blue}18`}}>
            ⏱ Validation sous <strong style={{color:C.white}}>30 minutes</strong>
          </div>
        </div>

        {/* Process */}
        <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,marginBottom:14,fontSize:14}}>📋 Comment ça marche</div>
          {[
            {n:1,t:"Effectuez le paiement",s:"USDT TRC20 ou Visa/Mastercard",c:C.gold},
            {n:2,t:"Cliquez «J'ai payé»",   s:"Uploadez votre screenshot",     c:C.blue},
            {n:3,t:"Recevez votre clé",     s:"Envoyée sous 30 minutes",       c:C.green},
            {n:4,t:"Activez & créez robot", s:"Entrez la clé → Setup robot",   c:C.sub},
          ].map(({n,t,s,c})=>(
            <div key={n} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:12}}>
              <div style={{width:26,height:26,borderRadius:"50%",background:c+"18",border:`1px solid ${c}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:c,flexShrink:0}}>{n}</div>
              <div><div style={{fontSize:13,fontWeight:600,color:C.white}}>{t}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{s}</div></div>
            </div>
          ))}
        </div>

        <Btn onClick={()=>onConfirm(plan,price)} style={{width:"100%",padding:"17px",fontSize:16,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,boxShadow:`0 6px 28px ${C.blue}40`}}>
          ✅ J'ai payé → Confirmer le paiement
        </Btn>
        <Btn onClick={onActivate} outline style={{width:"100%",padding:"13px",fontSize:14}}>
          <Key size={15}/> J'ai déjà ma clé → Activer
        </Btn>
      </div>
    </div>
  );
}

// ══════════════════════════════
//  CONFIRM PAYMENT
// ══════════════════════════════
function ConfirmPage({onBack,onActivate,plan,price}) {
  const [name,setName]       = useState("");
  const [contact,setContact] = useState("");
  const [method,setMethod]   = useState("USDT");
  const [imgPrev,setImgPrev] = useState(null);
  const [sent,setSent]       = useState(false);
  const [loading,setLoading] = useState(false);
  const [refId]              = useState(()=>"REF-"+Math.random().toString(36).slice(2,8).toUpperCase());
  const cfg                  = LIVE_CFG;  // toujou disponib
  const fileRef              = useRef();

  const handleFile = e => {
    const f = e.target.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload = ev => setImgPrev(ev.target.result);
    r.readAsDataURL(f);
  };

  const submit = async () => {
    if(!name.trim())    { toast("Entrez votre nom","error"); return; }
    if(!contact.trim()) { toast("Entrez votre WhatsApp","error"); return; }
    if(!imgPrev)        { toast("Uploadez le screenshot","error"); return; }
    setLoading(true);

    const pay = { id:refId, name:name.trim(), contact:contact.trim(), method, plan:plan==="month"?"Mensuel":"À vie", price, submittedAt:new Date().toISOString(), status:"pending" };
    const existing = await DB.get("dj_payments", true) || [];
    await DB.set("dj_payments", [pay,...existing], true);

    const msg = encodeURIComponent(
      `🏆 *${APP.name} — Confirmation de paiement*\n\n`+
      `📋 Référence: *${refId}*\n👤 Nom: ${name}\n📱 Contact: ${contact}\n💳 Méthode: ${method}\n📦 Plan: ${plan==="month"?"Mensuel":"À vie"} — $${price}\n\n`+
      `J'ai effectué le paiement. Merci de m'envoyer ma clé de licence.`
    );
    const waNum = (cfg.whatsapp || APP.whatsapp || "").replace(/\D/g,"");
    const waUrl = waNum ? `https://wa.me/${waNum}?text=${msg}` : null;

    setLoading(false); setSent(true);
    if(waUrl) setTimeout(()=>window.open(waUrl,"_blank"),600);
    else toast("Confirmation enregistrée! Nous vous contacterons.","success");
  };

  if(sent) return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",textAlign:"center"}}>
      <Toasts/>
      <div style={{fontSize:64,marginBottom:20}}>✅</div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:8}}>Confirmation envoyée!</div>
      <div style={{fontSize:14,color:C.sub,marginBottom:16,lineHeight:1.7}}>WhatsApp s'est ouvert avec votre message.<br/>Envoyez aussi le screenshot de paiement.</div>
      <div style={{background:C.card,borderRadius:16,padding:"14px 24px",border:`1px solid ${C.border}`,marginBottom:24}}>
        <div style={{fontSize:10,color:C.muted,letterSpacing:1,marginBottom:4}}>RÉFÉRENCE</div>
        <div style={{fontSize:20,fontWeight:900,color:C.blue,letterSpacing:2}}>{refId}</div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>Clé reçue sous 30 minutes</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}}>
        <Btn onClick={onActivate} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,padding:"14px"}}><Key size={15}/> Entrer ma clé</Btn>
        <Btn onClick={onBack} outline style={{width:"100%",padding:"12px"}}>← Retour</Btn>
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white}}>
      <Toasts/>
      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",alignItems:"center",gap:16}}>
        <button onClick={onBack} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",color:C.sub,cursor:"pointer",fontSize:13}}>← Retour</button>
        <div style={{fontWeight:800,fontSize:16}}>✅ Confirmer le paiement</div>
      </div>
      <div style={{maxWidth:500,margin:"0 auto",padding:"28px 20px 60px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:`linear-gradient(135deg,#0a1528,${C.card})`,borderRadius:18,padding:"18px",border:`1px solid ${C.blue}40`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:15,fontWeight:800}}>{APP.name} · {plan==="month"?"Mensuel":"À vie"}</div><div style={{fontSize:11,color:C.muted,marginTop:3,fontFamily:"monospace"}}>Réf: {refId}</div></div>
          <div style={{fontSize:30,fontWeight:900,color:C.blue}}>${price}</div>
        </div>

        {/* Méthode */}
        <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Méthode utilisée</div>
          <div style={{display:"flex",gap:8}}>
            {["USDT","Visa/MC"].map(m=>(
              <button key={m} onClick={()=>setMethod(m)} style={{flex:1,padding:"9px 6px",borderRadius:20,border:`1.5px solid ${method===m?C.blue:C.border}`,background:method===m?C.blue+"18":"transparent",color:method===m?C.blue:C.sub,fontWeight:700,fontSize:13,cursor:"pointer"}}>{m==="USDT"?"₿ USDT":"💳 Visa/MC"}</button>
            ))}
          </div>
        </div>

        {/* Screenshot */}
        <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>📸 Screenshot du paiement</div>
          <div style={{fontSize:12,color:C.sub,marginBottom:12}}>Uploadez la preuve de votre paiement</div>
          <div onClick={()=>fileRef.current?.click()} style={{background:C.bg,borderRadius:12,border:`2px dashed ${imgPrev?C.green:C.border}`,padding:imgPrev?0:"24px 16px",textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:imgPrev?160:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
            {imgPrev
              ? <div style={{position:"relative",width:"100%"}}>
                  <img src={imgPrev} alt="proof" style={{width:"100%",borderRadius:10,display:"block",maxHeight:240,objectFit:"cover"}}/>
                  <button onClick={e=>{e.stopPropagation();setImgPrev(null);}} style={{position:"absolute",top:8,right:8,background:"#000a",border:"none",borderRadius:"50%",width:26,height:26,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><X size={12}/></button>
                  <div style={{position:"absolute",bottom:8,left:8,background:C.green+"cc",borderRadius:7,padding:"3px 9px",fontSize:10,fontWeight:700,color:"#fff"}}>✓ Ajouté</div>
                </div>
              : <div><div style={{fontSize:32,marginBottom:8}}>📸</div><div style={{fontWeight:600,color:C.sub,fontSize:13,marginBottom:4}}>Tap pour uploader</div><div style={{fontSize:11,color:C.muted}}>PNG · JPG</div></div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{display:"none"}}/>
        </div>

        {/* Infos */}
        <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:10}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Votre nom complet" style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.white,fontSize:14,outline:"none"}}/>
          <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="WhatsApp / email (pour recevoir la clé)" style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"12px 14px",color:C.white,fontSize:14,outline:"none"}}/>
        </div>

        <button onClick={submit} disabled={loading} style={{width:"100%",background:loading?C.gray:`linear-gradient(135deg,${C.green},#0a9060)`,color:"#000",fontWeight:900,fontSize:15,border:"none",borderRadius:13,padding:"16px",cursor:loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:loading?"none":"0 6px 24px rgba(16,185,129,.3)"}}>
          {loading?<><RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/> Envoi...</>:"📲 Envoyer la confirmation WhatsApp"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════
//  ACTIVATE PAGE
// ══════════════════════════════
function ActivatePage({onBack,onSuccess,onReconnect}) {
  const [licKey,setLicKey]   = useState("");
  const [email,setEmail]     = useState("");
  const [mtLogin,setMtLogin] = useState("");
  const [mtPass,setMtPass]   = useState("");
  const [showPass,setShowPass] = useState(false);
  const [broker,setBroker]   = useState("JustMarkets-Live");
  const [loading,setLoading] = useState(false);
  const [err,setErr]         = useState("");
  const [provisionStep,setProvisionStep] = useState("");
  const brokers = ["JustMarkets-Live","JustMarkets-Demo","Fusion Markets-Live","Fusion Markets-Demo","RoboForex-Live","Exness-Live","XM-Live","Autre"];
  const brokerServerMap = {
    "JustMarkets-Live":"JustMarkets-Live","JustMarkets-Demo":"JustMarkets-Demo",
    "Fusion Markets-Live":"FusionMarkets-Live","Fusion Markets-Demo":"FusionMarkets-Demo",
    "RoboForex-Live":"RoboForex-ECN","Exness-Live":"Exness-Real","XM-Live":"XMGlobal-Real",
  };

  const activate = async () => {
    const k = licKey.trim().toUpperCase();
    if(!k)               { setErr("Entrez votre clé de licence."); return; }
    if(!email.trim())    { setErr("Entrez votre adresse email."); return; }
    if(!email.includes("@")) { setErr("Email invalide."); return; }
    if(!mtLogin.trim())  { setErr("Entrez votre ID MetaTrader."); return; }
    setLoading(true); setErr("");

    // Verifikasyon matematik — pa depann sou storage ditou
    if(!isValidLicenseKey(k)) {
      setErr(`❌ Clé "${k}" invalide. Vérifiez le format: DJ-XXXX-XXXX-XXXX`);
      setLoading(false);
      return;
    }

    let metaApiAccountId = null;

    // Si token platfòm konfigire ET itilizatè bay modpas → eseye pwovizyone kont MetaApi REYÈL
    if (metaApiConfigured() && mtPass.trim()) {
      setProvisionStep("🔌 Connexion à votre compte MetaTrader...");
      const serverName = brokerServerMap[broker] || broker;
      const prov = await provisionMTAccount({
        login: mtLogin.trim(),
        password: mtPass,
        server: serverName,
        platform: "mt5",
        name: `DJTP-${mtLogin.trim()}`,
      });
      if (prov.ok) {
        metaApiAccountId = prov.accountId;
        toast("✅ Compte MetaTrader connecté en LIVE!","success");
      } else {
        // Pa bloke aktivasyon si pwovizyon echwe — kontinye an mòd simulation
        toast(`⚠️ Connexion live échouée (${prov.error}). Mode simulation activé.`,"error");
      }
      setProvisionStep("");
    }

    // Sove sesyon (best-effort — si storage echwe, kontinye kanmenm)
    try { await DB.set("dj_ul",k); } catch(_){}
    try {
      await DB.set("dj_mt",{
        login:mtLogin, broker, connected:true,
        balance:(Math.random()*3000+500).toFixed(2),
        metaApiAccountId,  // null si pa konekte an live
      });
    } catch(_){}
    try {
      const emails = await DB.get("dj_emails", true) || {};
      emails[email.toLowerCase().trim()] = { licKey:k, mtLogin, broker, activatedAt:new Date().toISOString() };
      await DB.set("dj_emails", emails, true);
    } catch(_){}

    toast("✅ Activation réussie!","success");
    setTimeout(onSuccess,700);
    setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white}}>
      <Toasts/>
      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",color:C.sub,cursor:"pointer",fontSize:13}}>← Retour</button>
        <div style={{fontWeight:800,fontSize:16}}>🔑 Activer le compte</div>
      </div>
      <div style={{maxWidth:460,margin:"0 auto",padding:"32px 20px",display:"flex",flexDirection:"column",gap:14}}>
        <div style={{textAlign:"center",marginBottom:4}}>
          <div style={{fontSize:44,marginBottom:10}}>🔑</div>
          <div style={{fontSize:22,fontWeight:900,marginBottom:6}}>Activer le compte</div>
          <div style={{fontSize:13,color:C.sub}}>Entrez votre clé de licence et connectez MetaTrader.</div>
        </div>

        {/* Email — pou rekonektion */}
        <div>
          <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📧 Adresse Email</div>
          <input value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} placeholder="votre@email.com" type="email"
            style={{width:"100%",background:C.card,border:`1.5px solid ${email.includes("@")?C.green:C.border}`,borderRadius:13,padding:"13px 16px",color:C.white,fontSize:15,outline:"none",transition:"border-color .2s"}}/>
          <div style={{fontSize:10,color:C.muted,marginTop:5}}>💡 Utilisé pour reconnecter votre compte ultérieurement</div>
        </div>

        {/* Clé */}
        <div>
          <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Clé de Licence</div>
          <input value={licKey} onChange={e=>{setLicKey(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,""));setErr("");}} placeholder="DJ-XXXX-XXXX-XXXX"
            style={{width:"100%",background:C.card,border:`1.5px solid ${licKey.length>5?C.blue:C.border}`,borderRadius:14,padding:"16px 18px",color:C.white,fontSize:18,fontWeight:800,outline:"none",letterSpacing:2,fontFamily:"monospace",textAlign:"center"}}/>
        </div>

        {/* MT Login */}
        <div>
          <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>ID Compte MetaTrader</div>
          <input value={mtLogin} onChange={e=>{setMtLogin(e.target.value);setErr("");}} placeholder="Ex: 12345678"
            style={{width:"100%",background:C.card,border:`1.5px solid ${C.border}`,borderRadius:13,padding:"13px 16px",color:C.white,fontSize:15,outline:"none",fontFamily:"monospace"}}/>
        </div>

        {/* MT Password — pou konneksyon LIVE */}
        <div>
          <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>
            Mot de passe MetaTrader {metaApiConfigured() && <span style={{color:C.green,textTransform:"none"}}>· pour connexion en direct</span>}
          </div>
          <div style={{position:"relative"}}>
            <input type={showPass?"text":"password"} value={mtPass} onChange={e=>{setMtPass(e.target.value);setErr("");}}
              placeholder={metaApiConfigured()?"Requis pour données en temps réel":"Optionnel (mode simulation)"}
              style={{width:"100%",background:C.card,border:`1.5px solid ${C.border}`,borderRadius:13,padding:"13px 46px 13px 16px",color:C.white,fontSize:14,outline:"none"}}/>
            <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer"}}>
              {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
            </button>
          </div>
          {metaApiConfigured() && (
            <div style={{fontSize:10,color:C.blue,marginTop:6,lineHeight:1.5}}>
              🔒 Utilisé uniquement pour connecter votre compte via MetaApi. Laissez vide pour rester en mode simulation.
            </div>
          )}
        </div>

        {/* Broker */}
        <div>
          <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Broker / Serveur</div>
          <select value={broker} onChange={e=>setBroker(e.target.value)} style={{width:"100%",background:C.card,border:`1.5px solid ${C.border}`,borderRadius:13,padding:"13px 16px",color:C.white,fontSize:14,outline:"none",cursor:"pointer"}}>
            {brokers.map(b=><option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {provisionStep && (
          <div style={{background:C.blue+"0d",border:`1px solid ${C.blue}30`,borderRadius:12,padding:"12px 16px",fontSize:13,color:C.blue,display:"flex",alignItems:"center",gap:8}}>
            <RefreshCw size={14} style={{animation:"spin 1s linear infinite"}}/> {provisionStep}
          </div>
        )}

        {err&&<div style={{background:C.red+"12",border:`1px solid ${C.red}35`,borderRadius:11,padding:"11px 14px",fontSize:13,color:C.red}}>{err}</div>}

        <Btn onClick={activate} disabled={loading} style={{width:"100%",padding:"16px",fontSize:15,background:loading?C.gray:`linear-gradient(135deg,${C.blue},${C.blueDark})`,marginTop:4,boxShadow:loading?"none":`0 6px 24px ${C.blue}35`}}>
          {loading?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Vérification...</>:<><Shield size={15}/> Activer & Connecter</>}
        </Btn>

        {/* Séparateur */}
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontSize:11,color:C.muted}}>ou</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>

        {/* Bouton rekonektion */}
        <button onClick={onReconnect}
          style={{width:"100%",background:C.card,border:`1.5px solid ${C.border}`,borderRadius:13,padding:"14px",color:C.sub,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontWeight:600}}>
          🔄 Se reconnecter
        </button>

        <div style={{textAlign:"center",fontSize:12,color:C.muted}}>
          Pas de clé ? <button onClick={onBack} style={{background:"none",border:"none",color:C.blue,cursor:"pointer",fontWeight:700,fontSize:12}}>Acheter une licence</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════
//  RECONNECT PAGE (pa email)
// ══════════════════════════════
function ReconnectPage({onBack,onSuccess}) {
  const [mode,setMode]     = useState("key");   // "key" | "email"
  const [licKey,setLicKey] = useState("");
  const [mtLogin,setMtLogin] = useState("");
  const [email,setEmail]   = useState("");
  const [loading,setLoading] = useState(false);
  const [err,setErr]       = useState("");
  const [found,setFound]   = useState(null);

  // ── Rekonekte ak Kle Lisans sèlman — MACHE TOUJOU, checksum matematik ──
  const reconnectWithKey = async () => {
    const k = licKey.trim().toUpperCase();
    if(!k) { setErr("Entrez votre clé de licence."); return; }
    if(!mtLogin.trim()) { setErr("Entrez votre ID MetaTrader."); return; }
    setLoading(true); setErr("");

    if(!isValidLicenseKey(k)) {
      setErr(`❌ Clé invalide. Vérifiez le format: DJ-XXXX-XXXX-XXXX`);
      setLoading(false);
      return;
    }

    // Kle valid pa kalkil — rekonektion reyisi TOUJOU, pa depann sou storage
    try { await DB.set("dj_ul", k); } catch(_){}
    try { await DB.set("dj_mt", { login:mtLogin.trim(), broker:"Broker existant", connected:true, balance:(Math.random()*3000+500).toFixed(2) }); } catch(_){}

    setFound({ mtLogin: mtLogin.trim(), broker:"Compte existant" });
    toast("✅ Reconnecté avec succès!","success");
    setTimeout(onSuccess, 1000);
  };

  // ── Rekonekte pa Email — depann sou storage (ka echwe si storage pa fyab) ──
  const reconnectWithEmail = async () => {
    if(!email.trim()||!email.includes("@")) { setErr("Entrez une adresse email valide."); return; }
    setLoading(true); setErr("");
    try {
      const emails = await DB.get("dj_emails", true) || {};
      const key = email.toLowerCase().trim();
      if(emails[key]) {
        const rec = emails[key];
        await DB.set("dj_ul", rec.licKey);
        await DB.set("dj_mt", { login:rec.mtLogin, broker:rec.broker, connected:true, balance:(Math.random()*3000+500).toFixed(2) });
        setFound(rec);
        toast("✅ Compte retrouvé!","success");
        setTimeout(onSuccess, 1200);
      } else {
        setErr("❌ Email introuvable (stockage indisponible ou jamais activé). Utilisez plutôt votre clé de licence — méthode recommandée.");
      }
    } catch(_){ setErr("❌ Erreur. Essayez avec votre clé de licence à la place."); }
    setLoading(false);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white}}>
      <Toasts/>
      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 14px",color:C.sub,cursor:"pointer",fontSize:13}}>← Retour</button>
        <div style={{fontWeight:800,fontSize:16}}>🔄 Reconnecter le compte</div>
      </div>

      <div style={{maxWidth:440,margin:"0 auto",padding:"40px 20px",display:"flex",flexDirection:"column",gap:16}}>
        <div style={{textAlign:"center",marginBottom:4}}>
          <div style={{fontSize:52,marginBottom:14}}>{mode==="key"?"🔑":"📧"}</div>
          <div style={{fontSize:22,fontWeight:900,marginBottom:8}}>Reconnecter votre compte</div>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>
            {mode==="key" ? "Entrez votre clé de licence pour un accès instantané." : "Entrez l'email utilisé lors de votre activation."}
          </div>
        </div>

        {found ? (
          <div style={{background:"linear-gradient(135deg,#061206,#091509)",borderRadius:20,padding:"28px",border:`1px solid ${C.green}40`,textAlign:"center",animation:"fadeUp .5s ease"}}>
            <div style={{fontSize:40,marginBottom:12}}>✅</div>
            <div style={{fontSize:16,fontWeight:800,color:C.green,marginBottom:8}}>Compte reconnecté!</div>
            <div style={{fontSize:13,color:C.sub,marginBottom:16}}>
              Connexion au compte <strong style={{color:C.white}}>#{found.mtLogin}</strong>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,fontSize:12,color:C.green}}>
              <RefreshCw size={13} style={{animation:"spin 1s linear infinite"}}/> Redirection vers le dashboard...
            </div>
          </div>
        ) : (
          <>
            {/* Tab selector */}
            <div style={{background:C.card,borderRadius:14,padding:4,border:`1px solid ${C.border}`,display:"flex"}}>
              <button onClick={()=>{setMode("key");setErr("");}} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:mode==="key"?C.blue:"transparent",color:mode==="key"?"#fff":C.sub,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                🔑 Clé de licence
              </button>
              <button onClick={()=>{setMode("email");setErr("");}} style={{flex:1,padding:"11px",borderRadius:10,border:"none",background:mode==="email"?C.blue:"transparent",color:mode==="email"?"#fff":C.sub,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                📧 Email
              </button>
            </div>

            {mode==="key" ? (
              <>
                <div style={{background:C.green+"0d",border:`1px solid ${C.green}30`,borderRadius:12,padding:"11px 14px",fontSize:12,color:C.green,lineHeight:1.6}}>
                  ✅ Méthode recommandée — fonctionne toujours, même hors ligne.
                </div>
                <div style={{background:C.card,borderRadius:18,padding:"22px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Clé de Licence</div>
                  <input
                    value={licKey} onChange={e=>{setLicKey(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,""));setErr("");}}
                    onKeyDown={e=>e.key==="Enter"&&reconnectWithKey()}
                    placeholder="DJ-XXXX-XXXX-XXXX"
                    style={{width:"100%",background:C.bg,border:`1.5px solid ${licKey.length>5?C.blue:C.border}`,borderRadius:12,padding:"15px 16px",color:C.white,fontSize:17,fontWeight:800,outline:"none",letterSpacing:2,fontFamily:"monospace",textAlign:"center",marginBottom:14}}
                  />
                  <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>ID Compte MetaTrader</div>
                  <input
                    value={mtLogin} onChange={e=>{setMtLogin(e.target.value);setErr("");}}
                    onKeyDown={e=>e.key==="Enter"&&reconnectWithKey()}
                    placeholder="Ex: 12345678"
                    style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.white,fontSize:15,outline:"none",fontFamily:"monospace"}}
                  />
                </div>

                {err && <div style={{background:C.red+"12",border:`1px solid ${C.red}35`,borderRadius:12,padding:"13px 16px",fontSize:13,color:C.red,lineHeight:1.6}}>{err}</div>}

                <Btn onClick={reconnectWithKey} disabled={loading}
                  style={{width:"100%",padding:"16px",fontSize:15,background:loading?C.gray:`linear-gradient(135deg,${C.green},#0a9060)`,color:"#000",boxShadow:!loading?`0 6px 24px ${C.green}35`:"none"}}>
                  {loading?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Connexion...</>:<>🔑 Reconnecter avec ma clé</>}
                </Btn>
              </>
            ) : (
              <>
                <div style={{background:C.gold+"0d",border:`1px solid ${C.gold}30`,borderRadius:12,padding:"11px 14px",fontSize:12,color:C.gold,lineHeight:1.6}}>
                  ⚠️ Dépend du stockage — peut échouer. Préférez la clé de licence.
                </div>
                <div style={{background:C.card,borderRadius:18,padding:"22px",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Votre Email</div>
                  <input
                    value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}
                    onKeyDown={e=>e.key==="Enter"&&reconnectWithEmail()}
                    placeholder="votre@email.com" type="email"
                    style={{width:"100%",background:C.bg,border:`1.5px solid ${email.includes("@")?C.blue:C.border}`,borderRadius:12,padding:"14px 16px",color:C.white,fontSize:16,outline:"none"}}
                  />
                </div>

                {err && <div style={{background:C.red+"12",border:`1px solid ${C.red}35`,borderRadius:12,padding:"13px 16px",fontSize:13,color:C.red,lineHeight:1.6}}>{err}</div>}

                <Btn onClick={reconnectWithEmail} disabled={loading||!email.includes("@")}
                  style={{width:"100%",padding:"16px",fontSize:15,background:!email.includes("@")||loading?C.gray:`linear-gradient(135deg,${C.blue},${C.blueDark})`}}>
                  {loading?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Recherche...</>:<>🔍 Retrouver mon compte</>}
                </Btn>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════
//  ROBOT SETUP PAGE (apre aktivasyon)
// ══════════════════════════════
function RobotSetupPage({onDone}) {
  const [name,setName]       = useState("");
  const [strategy,setStrategy] = useState("GOLD_SCALPER");
  const [lots,setLots]       = useState("0.01");
  const [loading,setLoading] = useState(false);
  const [mtInfo,setMtInfo]   = useState(null);

  const EMOJIS = ["🤖","🦾","⚡","🎯","🏆","🔥"];
  const STRATEGIES = [
    {id:"GOLD_SCALPER", label:"Gold Scalper",   desc:"Trades rapides · XAU/USD · Faible risque",  emoji:"⚡"},
    {id:"GOLD_HUNTER",  label:"Gold Hunter",    desc:"Tendance longue · Profit stable · Moyen",   emoji:"🎯"},
    {id:"TURBO_EA",     label:"Turbo EA",       desc:"Agressif · Haut rendement · Risque élevé",  emoji:"🔥"},
  ];

  useEffect(()=>{ DB.get("dj_mt").then(d=>{ if(d) setMtInfo(d); }); },[]);

  const create = async () => {
    if(!name.trim()) { toast("Entrez un nom pour votre robot","error"); return; }
    setLoading(true);
    const strat = STRATEGIES.find(s=>s.id===strategy);
    const robot = {
      id: Date.now(),
      name: name.trim().toUpperCase(),
      key: "DJ-SETUP-"+Math.random().toString(36).slice(2,6).toUpperCase(),
      emoji: strat?.emoji || EMOJIS[Math.floor(Math.random()*EMOJIS.length)],
      strategy,
      lots: parseFloat(lots),
      pnl: 0, winRate: 0, trades: 0,
      status: "running",
      added: new Date().toISOString()
    };
    const existing = await DB.get("dj_robots") || [];
    await DB.set("dj_robots", [robot, ...existing]);
    toast(`✅ ${robot.name} prêt à trader!`, "success");
    setTimeout(onDone, 700);
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white,display:"flex",flexDirection:"column"}}>
      <Toasts/>

      {/* Header */}
      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"20px 24px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
          <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏆</div>
          <span style={{fontWeight:900,fontSize:15}}>{APP.name}</span>
        </div>
        {/* Steps indicator */}
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:12}}>
          {[{n:1,l:"Licence",done:true},{n:2,l:"Robot",done:false},{n:3,l:"Dashboard",done:false}].map(({n,l,done},i)=>(
            <div key={n} style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:done?C.green:i===1?C.blue:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>
                  {done?"✓":n}
                </div>
                <span style={{fontSize:11,color:done?C.green:i===1?C.white:C.muted,fontWeight:i===1?700:400}}>{l}</span>
              </div>
              {i<2&&<div style={{width:24,height:1,background:C.border}}/>}
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"28px 20px 60px",maxWidth:480,margin:"0 auto",width:"100%"}}>

        {/* MT Connected badge */}
        {mtInfo&&(
          <div style={{background:`linear-gradient(135deg,#050f08,${C.card})`,borderRadius:16,padding:"14px 16px",border:`1px solid ${C.green}30`,display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.green+"15",display:"flex",alignItems:"center",justifyContent:"center"}}><Link size={16} color={C.green}/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13,color:C.green}}>✓ MetaTrader Connecté</div>
              <div style={{fontSize:11,color:C.sub}}>#{mtInfo.login} · {mtInfo.broker}</div>
            </div>
          </div>
        )}

        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:12}}>🤖</div>
          <div style={{fontSize:22,fontWeight:900,marginBottom:6}}>Configurez votre Robot</div>
          <div style={{fontSize:13,color:C.sub,lineHeight:1.7}}>Créez votre premier Expert Advisor.<br/>Il commencera à trader immédiatement.</div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>

          {/* Nom */}
          <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>Nom du Robot</div>
            <input
              value={name} onChange={e=>setName(e.target.value.toUpperCase())}
              placeholder="Ex: GOLD HUNTER"
              style={{width:"100%",background:C.bg,border:`1.5px solid ${name?C.blue:C.border}`,borderRadius:12,padding:"14px 16px",color:C.white,fontSize:16,fontWeight:800,outline:"none",letterSpacing:.5,transition:"border-color .2s"}}
            />
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
              {["GOLD HUNTER","XAUUSD BOT","TURBO EA","MY ROBOT"].map(n=>(
                <button key={n} onClick={()=>setName(n)} style={{background:name===n?C.blue+"20":"transparent",border:`1px solid ${name===n?C.blue:C.border}`,borderRadius:20,padding:"5px 12px",color:name===n?C.blue:C.muted,fontSize:11,fontWeight:600,cursor:"pointer"}}>{n}</button>
              ))}
            </div>
          </div>

          {/* Stratégie */}
          <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Stratégie de Trading</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {STRATEGIES.map(s=>(
                <div key={s.id} onClick={()=>setStrategy(s.id)}
                  style={{background:strategy===s.id?`linear-gradient(135deg,#0a1528,${C.card2})`:C.bg,borderRadius:12,padding:"14px 16px",border:`1.5px solid ${strategy===s.id?C.blue:C.border}`,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
                  <div style={{fontSize:24}}>{s.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:14,color:strategy===s.id?C.white:C.sub}}>{s.label}</div>
                    <div style={{fontSize:11,color:C.muted,marginTop:2}}>{s.desc}</div>
                  </div>
                  <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${strategy===s.id?C.blue:C.border}`,background:strategy===s.id?C.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {strategy===s.id&&<div style={{width:6,height:6,borderRadius:"50%",background:"#fff"}}/>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lot size */}
          <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:12,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Taille des Lots</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["0.01","0.02","0.05","0.1","0.5"].map(l=>(
                <button key={l} onClick={()=>setLots(l)}
                  style={{flex:1,padding:"10px 6px",borderRadius:12,border:`1.5px solid ${lots===l?C.blue:C.border}`,background:lots===l?C.blue+"18":"transparent",color:lots===l?C.blue:C.sub,fontWeight:700,fontSize:13,cursor:"pointer",minWidth:52}}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:10}}>
              💡 Recommandé pour débutants: <strong style={{color:C.white}}>0.01</strong> (risque minimal)
            </div>
          </div>

          {/* Summary */}
          {name&&(
            <div style={{background:`linear-gradient(135deg,#0a1020,${C.card})`,borderRadius:16,padding:"16px",border:`1px solid ${C.blue}35`}}>
              <div style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>📋 Résumé</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:32}}>{STRATEGIES.find(s=>s.id===strategy)?.emoji||"🤖"}</div>
                <div>
                  <div style={{fontWeight:900,fontSize:16}}>{name}</div>
                  <div style={{fontSize:12,color:C.sub,marginTop:3}}>{STRATEGIES.find(s=>s.id===strategy)?.label} · {lots} lots · XAU/USD</div>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginTop:5}}>
                    <span style={{width:5,height:5,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
                    <span style={{fontSize:10,color:C.green,fontWeight:700}}>Prêt à démarrer</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button onClick={create} disabled={loading||!name.trim()}
            style={{width:"100%",background:!name.trim()||loading?C.gray:`linear-gradient(135deg,${C.blue},${C.blueDark})`,color:"#fff",fontWeight:900,fontSize:16,border:"none",borderRadius:14,padding:"17px",cursor:!name.trim()||loading?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:name.trim()&&!loading?`0 6px 24px ${C.blue}35`:"none",transition:"all .3s"}}>
            {loading?<><RefreshCw size={17} style={{animation:"spin 1s linear infinite"}}/> Création...</>:<>🚀 Créer le Robot & Accéder au Dashboard</>}
          </button>

          <button onClick={onDone} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",textDecoration:"underline",textAlign:"center"}}>
            Passer cette étape →
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════
//  APP DASHBOARD
// ══════════════════════════════
function AppDashboard({onLogout}) {
  const [tab,setTab]               = useState("home");
  const [robots,setRobots]         = useState([]);
  const [mtInfo,setMtInfo]         = useState(null);
  const [showAdd,setShowAdd]       = useState(false);
  const [newName,setNewName]       = useState("");
  const [newKey,setNewKey]         = useState("");
  const [addErr,setAddErr]         = useState("");
  const [goldPrice,setGoldPrice]   = useState(3312.5);
  const [priceUp,setPriceUp]       = useState(true);
  const [priceHist,setPriceHist]   = useState(()=>{let p=3280;return Array.from({length:30},()=>{p+=(Math.random()-.45)*4;return{v:Math.round(p*100)/100}});});
  const [notifs,setNotifs]         = useState(0);
  // MetaApi — done reyèl si konfigire
  const [mtLive,setMtLive]         = useState(null);   // {balance, equity, ...} depi MetaApi
  const [mtLiveErr,setMtLiveErr]   = useState("");
  const [mtLiveLoading,setMtLiveLoading] = useState(false);
  // Trade Analyst AI — upload chart + analiz
  const [analystImg,setAnalystImg]       = useState(null);
  const [analystImgMime,setAnalystImgMime] = useState("image/jpeg");
  const [analystText,setAnalystText]     = useState("");
  const [analystLoading,setAnalystLoading] = useState(false);
  const [analystOrder,setAnalystOrder]   = useState(null);   // {signal,symbol,entry,sl,tp} pasé pa IA
  const [placingTrade,setPlacingTrade]   = useState(false);
  const [tradeResult,setTradeResult]     = useState(null);   // {ok,msg} apre plase lòd la
  const analystFileRef = useRef();
  const EMOJIS = ["🤖","🦾","⚡","🎯","🏆","🔥"];

  useEffect(()=>{
    (async()=>{
      const mt = await DB.get("dj_mt"); if(mt) setMtInfo(mt);
      const rb = await DB.get("dj_robots");
      if(rb && rb.length>0) setRobots(rb);
      else {
        const demo = [{id:1,name:"GOLD HUNTER",key:"DJ-DEMO-DEMO-0001",emoji:"🤖",pnl:24817.17,winRate:67,trades:842,status:"running",added:new Date().toISOString()}];
        setRobots(demo); await DB.set("dj_robots",demo);
      }
    })();
    const iv = setInterval(()=>{
      setGoldPrice(p=>{const d=(Math.random()-.47)*3;const np=Math.round((p+d)*100)/100;setPriceUp(d>=0);setPriceHist(h=>[...h.slice(-29),{v:np}]);return np;});
    },4000);
    return ()=>clearInterval(iv);
  },[]);

  // Chaje done MetaApi REYÈL si itilizatè sa gen yon kont pwovizyone — otomatik + rafrechi chak 10s
  useEffect(()=>{
    const accountId = mtInfo?.metaApiAccountId;
    if(!metaApiConfigured() || !accountId) return;
    let mounted = true;
    const load = async () => {
      setMtLiveLoading(true);
      const r = await fetchMTAccountInfo(accountId);
      if(!mounted) return;
      if(r.ok) { setMtLive(r.data); setMtLiveErr(""); }
      else { setMtLiveErr(r.error); }
      setMtLiveLoading(false);
    };
    load();
    const iv = setInterval(load, 10000);
    return ()=>{ mounted=false; clearInterval(iv); };
  },[mtInfo?.metaApiAccountId]);

  const saveRobots = async r => { setRobots(r); await DB.set("dj_robots",r); };

  // ── Trade Analyst AI ──
  const [uploadDebug,setUploadDebug] = useState(null);

  const handleAnalystFile = e => {
    setUploadDebug({ step: "1. Événement déclenché", ok: true });
    const f = e.target.files?.[0];
    if(!f) {
      setUploadDebug({ step: "❌ Aucun fichier dans e.target.files", ok: false });
      toast("⚠️ Aucun fichier détecté (sélection annulée?)","error");
      return;
    }
    setUploadDebug({ step: `2. Fichier trouvé: ${f.name||"?"} · ${f.type||"type vide"} · ${Math.round(f.size/1024)}KB`, ok: true });
    const mime = f.type || "";
    const supported = ["image/jpeg","image/jpg","image/png","image/gif","image/webp"];
    if (!supported.includes(mime)) {
      setUploadDebug({ step: `❌ Format rejeté: "${mime||"vide"}" (attendu: jpeg/png/gif/webp)`, ok: false });
      toast(`❌ Format "${mime||"inconnu"}" non supporté.`,"error");
      setAnalystText(`⚠️ Format d'image non supporté: ${mime||"inconnu (probablement HEIC)"}. L'IA accepte uniquement JPG, PNG, GIF ou WEBP. Sur iPhone: Réglages → Appareil photo → Formats → "Le plus compatible", ou utilisez une CAPTURE D'ÉCRAN.`);
      return;
    }
    setAnalystImgMime(mime);
    setUploadDebug({ step: "3. Format OK, lecture du fichier...", ok: true });
    const reader = new FileReader();
    reader.onerror = (err) => {
      setUploadDebug({ step: `❌ FileReader erreur: ${reader.error?.message||"inconnue"}`, ok: false });
      toast("❌ Erreur de lecture du fichier","error");
    };
    reader.onload = ev => {
      const result = ev.target.result;
      if(!result || typeof result !== "string" || !result.includes(",")) {
        setUploadDebug({ step: "❌ Résultat FileReader invalide/vide", ok: false });
        toast("❌ Erreur: fichier illisible","error");
        return;
      }
      const b64 = result.split(",")[1];
      setUploadDebug({ step: `✅ Image chargée avec succès! (${Math.round(b64.length/1024)}KB en base64)`, ok: true });
      setAnalystImg(b64);
      setAnalystText("");
      toast("✅ Image chargée! Cliquez Analyser.","success");
    };
    reader.readAsDataURL(f);
  };

  const analyzeChart = async () => {
    if(!analystImg) return;
    setAnalystLoading(true); setAnalystText(""); setAnalystOrder(null); setTradeResult(null);
    try {
      const prompt = "Vous êtes un analyste professionnel de trading MetaTrader (XAUUSD, Forex, indices). Analysez ce chart et donnez une réponse structurée:\n\n📊 TENDANCE: [Haussière/Baissière/Latérale] — une phrase\n🎯 SIGNAL: [ACHAT / VENTE / ATTENDRE]\n📍 Entrée: $[prix]\n🛡️ Stop Loss: $[prix]\n💰 Take Profit: $[prix]\n📈 Niveaux clés: 2-3 supports/résistances\n💡 Raisonnement: 2-3 phrases maximum\n\nSoyez précis avec les niveaux de prix. Si vous ne pouvez pas déterminer les prix exacts, donnez des fourchettes.\n\nÀ LA TOUTE FIN de votre réponse, ajoutez ce bloc JSON EXACT (rien d'autre après), avec le symbole exact visible sur le chart (ex: XAUUSD), et des NOMBRES uniquement (pas de texte) pour entry/sl/tp:\n\n```json\n{\"signal\":\"BUY\" ou \"SELL\" ou \"WAIT\",\"symbol\":\"XAUUSD\",\"entry\":0000.00,\"stopLoss\":0000.00,\"takeProfit\":0000.00}\n```";

      // Rele backend NOU pwòp (Vercel serverless) — pa Anthropic dirèkteman.
      // Sa kenbe kle API a sekrè epi evite bloke CORS.
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: analystImg, mimeType: analystImgMime, prompt }),
      });

      let d;
      try { d = await res.json(); }
      catch(parseErr) {
        setAnalystText(`⚠️ Réponse invalide du serveur (HTTP ${res.status}). Impossible de lire la réponse JSON.`);
        setAnalystLoading(false);
        return;
      }

      if (!res.ok) {
        setAnalystText(`❌ Erreur (HTTP ${res.status}): ${d?.error || "inconnue"}`);
        setAnalystLoading(false);
        return;
      }

      const fullText = d.text || "";
      if (!fullText) {
        setAnalystText(`⚠️ Réponse vide de l'IA.`);
        setAnalystLoading(false);
        return;
      }

      // Separe tèks lizib la ak bloc JSON lòd la
      const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
      const displayText = jsonMatch ? fullText.slice(0, jsonMatch.index).trim() : fullText;
      setAnalystText(displayText);

      if (jsonMatch) {
        try {
          const order = JSON.parse(jsonMatch[1]);
          if (order.signal === "BUY" || order.signal === "SELL") {
            setAnalystOrder(order);
          }
        } catch(_) { /* JSON pa valid — pa gen bouton trade, sa correct */ }
      }

      toast("✅ Analyse terminée!","success");
    } catch(e) {
      setAnalystText(`⚠️ Erreur réseau: ${e?.message || String(e)}`);
    }
    setAnalystLoading(false);
  };

  // ── Plase lòd la REYÈL nan MetaTrader atravè MetaApi ──
  const executeTrade = async () => {
    if (!analystOrder) return;
    const accountId = mtInfo?.metaApiAccountId;
    if (!accountId) {
      setTradeResult({ ok:false, msg:"❌ Aucun compte MetaTrader connecté en direct. Activez votre compte avec votre mot de passe MT pour trader réellement." });
      return;
    }
    setPlacingTrade(true); setTradeResult(null);
    const r = await placeTrade(accountId, {
      actionType: analystOrder.signal === "BUY" ? "ORDER_TYPE_BUY" : "ORDER_TYPE_SELL",
      symbol: analystOrder.symbol || "XAUUSD",
      volume: 0.01,
      stopLoss: analystOrder.stopLoss,
      takeProfit: analystOrder.takeProfit,
      comment: "DJTradePro-AI-Analyst",
    });
    if (r.ok) {
      setTradeResult({ ok:true, msg:`✅ Trade exécuté! Position #${r.positionId||r.orderId||"—"}` });
      toast("✅ Trade placé avec succès!","success");
    } else {
      setTradeResult({ ok:false, msg:`❌ ${r.error}` });
    }
    setPlacingTrade(false);
  };


  const toggleBot = async id => {
    const upd = robots.map(r=>r.id===id?{...r,status:r.status==="running"?"stopped":"running"}:r);
    await saveRobots(upd);
    const r = upd.find(r=>r.id===id);
    toast(r.status==="running"?`▶ ${r.name} démarré!`:`⏹ ${r.name} arrêté`, r.status==="running"?"success":"info");
    if(r.status==="running") setNotifs(n=>n+1);
  };

  const removeRobot = async id => { await saveRobots(robots.filter(r=>r.id!==id)); toast("Robot supprimé","info"); };

  const addRobot = async () => {
    if(!newName.trim()) { setAddErr("Entrez un nom pour le robot."); return; }
    const k = newKey.trim().toUpperCase();
    const emoji = EMOJIS[Math.floor(Math.random()*EMOJIS.length)];

    // Verifikasyon matematik — pa depann sou storage. Vid = mòd admin/test.
    if(k && !isValidLicenseKey(k)) {
      setAddErr("❌ Clé invalide. Format attendu: DJ-XXXX-XXXX-XXXX");
      return;
    }

    const robot = {id:Date.now(),name:newName.trim().toUpperCase(),key:k||"ADMIN-ACCESS",emoji,pnl:0,winRate:0,trades:0,status:"running",added:new Date().toISOString()};
    await saveRobots([...robots,robot]);
    toast(`✅ ${robot.name} ajouté!`,"success");
    setShowAdd(false); setNewName(""); setNewKey(""); setAddErr("");
  };

  const totalPnl = robots.reduce((s,r)=>s+(r.pnl||0),0);
  const activeRobots = robots.filter(r=>r.status==="running").length;

  const HomeTab = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {/* Trade Analyst AI banner */}
      <div onClick={()=>setTab("analyst")} style={{background:`linear-gradient(135deg,#100a00,${C.card})`,borderRadius:18,padding:"16px",display:"flex",alignItems:"center",gap:12,border:"1px solid #2a2100",cursor:"pointer"}}>
        <div style={{width:46,height:46,borderRadius:14,background:"#2a1800",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🧠</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:14}}>Trade Analyst <span style={{color:C.gold}}>AI</span></div>
          <div style={{fontSize:12,color:C.muted,marginTop:2}}>Uploadez un chart → Analyse pro instantanée</div>
        </div>
        <ChevronRight size={16} color={C.gold}/>
      </div>

      {mtInfo&&(
        <div style={{background:`linear-gradient(135deg,#080d1a,${C.card2})`,borderRadius:18,padding:"16px",border:`1px solid ${metaApiConfigured()?(mtLive?C.green+"50":C.gold+"50"):C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.blue+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Link size={16} color={C.blue}/></div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:13}}>MetaTrader 5 · {mtInfo.broker}</div>
              <div style={{fontSize:11,color:C.sub}}>Login: #{mtInfo.login}</div>
            </div>
            {!metaApiConfigured() ? (
              <div style={{display:"flex",alignItems:"center",gap:5,background:C.gold+"12",borderRadius:20,padding:"4px 10px",border:`1px solid ${C.gold}28`}}>
                <span style={{fontSize:10,color:C.gold,fontWeight:700}}>SIMULATION</span>
              </div>
            ) : mtLiveLoading && !mtLive ? (
              <div style={{display:"flex",alignItems:"center",gap:5,background:C.blue+"12",borderRadius:20,padding:"4px 10px",border:`1px solid ${C.blue}28`}}>
                <RefreshCw size={10} style={{animation:"spin 1s linear infinite"}} color={C.blue}/>
                <span style={{fontSize:10,color:C.blue,fontWeight:700}}>SYNC...</span>
              </div>
            ) : mtLive ? (
              <div style={{display:"flex",alignItems:"center",gap:5,background:C.green+"12",borderRadius:20,padding:"4px 10px",border:`1px solid ${C.green}28`}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 1.5s infinite"}}/>
                <span style={{fontSize:10,color:C.green,fontWeight:700}}>LIVE MT5</span>
              </div>
            ) : (
              <div style={{display:"flex",alignItems:"center",gap:5,background:C.red+"12",borderRadius:20,padding:"4px 10px",border:`1px solid ${C.red}28`}}>
                <span style={{fontSize:10,color:C.red,fontWeight:700}}>ERREUR</span>
              </div>
            )}
          </div>

          {/* Erè MetaApi si genyen */}
          {metaApiConfigured() && mtLiveErr && (
            <div style={{background:C.red+"0d",border:`1px solid ${C.red}30`,borderRadius:10,padding:"10px 12px",marginBottom:10,fontSize:11,color:C.red,lineHeight:1.5}}>
              ⚠️ {mtLiveErr}
            </div>
          )}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[
              {l:"Balance",v:`$${fmt(mtLive?.balance ?? mtInfo.balance)}`,c:C.white},
              {l: mtLive ? "Équité" : "Robots Actifs", v: mtLive ? `$${fmt(mtLive.equity)}` : `${activeRobots}/${robots.length}`, c:C.green},
            ].map(({l,v,c})=>(
              <div key={l} style={{background:C.bg,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:3}}>{l}</div>
                <div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{background:C.card,borderRadius:18,padding:"16px",border:`1px solid ${C.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>XAU/USD · Live</div><div style={{fontSize:26,fontWeight:900,letterSpacing:-1}}>${fmt(goldPrice)}</div></div>
          <div style={{color:priceUp?C.green:C.red,fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:4}}>{priceUp?<TrendingUp size={14}/>:<TrendingDown size={14}/>}{priceUp?"▲":"▼"}</div>
        </div>
        <div style={{height:55}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={priceHist}><defs><linearGradient id="gl" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={priceUp?C.green:C.red} stopOpacity={.3}/><stop offset="95%" stopColor={priceUp?C.green:C.red} stopOpacity={0}/></linearGradient></defs><Area type="monotone" dataKey="v" stroke={priceUp?C.green:C.red} strokeWidth={2} fill="url(#gl)" dot={false}/></AreaChart></ResponsiveContainer></div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {[{icon:"💰",l:"P&L Total",v:`$${fmt(totalPnl)}`,c:"#f87171"},{icon:"🤖",l:"Robots",v:`${activeRobots}/${robots.length}`,c:C.green}].map(({icon,l,v,c})=>(
          <div key={l} style={{background:C.card,borderRadius:16,padding:"16px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.8,marginBottom:4}}>{l}</div>
            <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
          </div>
        ))}
      </div>

      {robots.map(r=>(
        <div key={r.id} style={{background:C.card,borderRadius:16,padding:"14px 16px",border:`1px solid ${r.status==="running"?C.blue+"35":C.border}`,display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:12,background:r.status==="running"?C.blue+"18":C.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{r.emoji}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:14}}>{r.name}</div>
            <div style={{fontSize:11,color:r.status==="running"?C.green:C.muted,marginTop:2,display:"flex",alignItems:"center",gap:4}}>
              {r.status==="running"&&<span style={{width:5,height:5,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 1.5s infinite"}}/>}
              {r.status==="running"?"En cours":"Arrêté"}
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:15,fontWeight:800,color:r.pnl>=0?C.green:C.red}}>{r.pnl>=0?"+":""}${fmt(r.pnl)}</div>
            <div style={{fontSize:10,color:C.muted}}>{r.trades} trades</div>
          </div>
        </div>
      ))}
    </div>
  );

  const MetaTraderTab = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:18,fontWeight:900}}>🤖 Robot List</div>
        <button onClick={()=>setShowAdd(true)} style={{background:C.blue,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}><Plus size={14}/> Add Robot</button>
      </div>

      {robots.length===0
        ?<div style={{background:C.card,borderRadius:18,padding:"48px 20px",textAlign:"center",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:48,marginBottom:12}}>🤖</div>
            <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>Aucun robot</div>
            <div style={{fontSize:13,color:C.sub,marginBottom:20}}>Ajoutez votre premier robot EA.</div>
            <Btn onClick={()=>setShowAdd(true)} style={{margin:"0 auto"}}><Plus size={14}/> Ajouter un Robot</Btn>
          </div>
        :robots.map(r=>(
          <div key={r.id} style={{background:r.status==="running"?`linear-gradient(135deg,#0a1020,${C.card})`:C.card,borderRadius:20,padding:"18px",border:`1px solid ${r.status==="running"?C.blue+"45":C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
              <div style={{width:54,height:54,borderRadius:16,background:r.status==="running"?C.blue+"20":C.card2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,border:`2px solid ${r.status==="running"?C.blue+"45":C.border}`,boxShadow:r.status==="running"?`0 0 18px ${C.blue}18`:"none"}}>{r.emoji}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:900,fontSize:16}}>{r.name}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2,fontFamily:"monospace"}}>{r.key}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:5}}>
                  <span style={{width:5,height:5,borderRadius:"50%",background:r.status==="running"?C.green:C.muted,display:"inline-block",animation:r.status==="running"?"pulse 1.5s infinite":"none"}}/>
                  <span style={{fontSize:10,color:r.status==="running"?C.green:C.muted,fontWeight:700,textTransform:"uppercase"}}>{r.status==="running"?"En cours · MetaTrader":"Arrêté"}</span>
                </div>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
              {[{l:"P&L",v:`${r.pnl>=0?"+":""}$${fmt(r.pnl)}`,c:r.pnl>=0?C.green:C.red},{l:"Win Rate",v:`${r.winRate}%`,c:C.white},{l:"Trades",v:r.trades,c:C.sub}].map(({l,v,c})=>(
                <div key={l} style={{background:C.bg,borderRadius:9,padding:"9px 8px",textAlign:"center",border:`1px solid ${C.border}`}}>
                  <div style={{fontSize:13,fontWeight:800,color:c}}>{v}</div>
                  <div style={{fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>removeRobot(r.id)} style={{flex:1,background:C.red+"12",border:`1px solid ${C.red}28`,borderRadius:11,padding:"10px",color:C.red,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Trash2 size={12}/> REMOVE</button>
              <button onClick={()=>toggleBot(r.id)} style={{flex:1,background:r.status==="running"?C.gold+"12":C.green+"12",border:`1px solid ${r.status==="running"?C.gold+"35":C.green+"35"}`,borderRadius:11,padding:"10px",color:r.status==="running"?C.gold:C.green,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                {r.status==="running"?<><PauseCircle size={12}/> STOP</>:<><Power size={12}/> START</>}
              </button>
              <button style={{flex:1,background:C.blue+"12",border:`1px solid ${C.blue}28`,borderRadius:11,padding:"10px",color:C.blue,fontWeight:700,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><BarChart2 size={12}/> QUOTES</button>
            </div>
          </div>
        ))
      }

      <div onClick={()=>setShowAdd(true)} style={{background:C.card,borderRadius:16,padding:"14px",border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
        <div style={{width:42,height:42,borderRadius:12,background:C.bg,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={18} color={C.muted}/></div>
        <div><div style={{fontWeight:700,fontSize:14}}>Add a new Robot</div><div style={{fontSize:12,color:C.muted}}>En ayant une nouvelle clé de licence</div></div>
      </div>
      <div style={{textAlign:"center",fontSize:10,color:C.muted,letterSpacing:1}}>POWERED BY {APP.name}</div>
    </div>
  );

  const AnalystTab = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:2}}>
        <div style={{width:46,height:46,borderRadius:14,background:"#2a1800",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🧠</div>
        <div>
          <div style={{fontSize:19,fontWeight:900}}>Trade Analyst <span style={{color:C.gold}}>AI</span></div>
          <div style={{fontSize:12,color:C.muted}}>Uploadez un screenshot MetaTrader → analyse instantanée</div>
        </div>
      </div>

      {/* 🔬 Debug panel — pèsistan, pa disparèt tankou toast */}
      {uploadDebug && (
        <div style={{background:uploadDebug.ok?C.green+"0d":C.red+"0d",border:`1.5px solid ${uploadDebug.ok?C.green+"40":C.red+"40"}`,borderRadius:12,padding:"11px 14px",fontSize:12,color:uploadDebug.ok?C.green:C.red,fontFamily:"monospace",lineHeight:1.5}}>
          🔬 {uploadDebug.step}
        </div>
      )}

      {/* Upload zone */}
      <div onClick={()=>analystFileRef.current?.click()}
        style={{background:C.card,borderRadius:20,border:`2px dashed ${analystImg?C.green:C.border}`,padding:analystImg?0:"36px 16px",textAlign:"center",cursor:"pointer",overflow:"hidden",minHeight:analystImg?200:150,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {analystImg
          ? <div style={{position:"relative",width:"100%"}}>
              <img src={`data:${analystImgMime};base64,${analystImg}`} alt="chart" style={{width:"100%",borderRadius:16,display:"block"}}/>
              <button onClick={e=>{e.stopPropagation();setAnalystImg(null);setAnalystText("");}}
                style={{position:"absolute",top:10,right:10,background:"#000c",border:"none",borderRadius:"50%",width:30,height:30,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <X size={14}/>
              </button>
            </div>
          : <div>
              <Camera size={40} color={C.muted} style={{marginBottom:12}}/>
              <div style={{fontWeight:700,color:C.sub,marginBottom:6}}>Tap pour uploader votre chart</div>
              <div style={{fontSize:12,color:C.muted}}>Screenshot MetaTrader · PNG · JPG · Tout timeframe</div>
            </div>
        }
      </div>
      <input ref={analystFileRef} type="file" accept="image/*" onChange={handleAnalystFile} style={{display:"none"}}/>

      <button onClick={analyzeChart} disabled={!analystImg||analystLoading}
        style={{width:"100%",background:analystImg&&!analystLoading?`linear-gradient(135deg,${C.gold},#c9960a)`:C.card2,color:analystImg&&!analystLoading?"#000":C.muted,fontWeight:800,fontSize:15,border:"none",borderRadius:16,padding:"16px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:analystImg&&!analystLoading?"pointer":"not-allowed",boxShadow:analystImg&&!analystLoading?`0 6px 20px ${C.gold}30`:"none",transition:"all .3s"}}>
        {analystLoading?<><RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/> Analyse en cours...</>:<><Zap size={16}/> Analyser avec l'IA</>}
      </button>

      {analystText && (
        <div style={{background:`linear-gradient(135deg,#090f09,${C.card})`,borderRadius:18,padding:"20px",border:`1px solid ${C.green}40`}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{fontSize:15}}>🧠</span>
            <span style={{fontSize:12,fontWeight:800,color:C.gold,textTransform:"uppercase",letterSpacing:1.5}}>Analyse IA</span>
            <div style={{marginLeft:"auto",background:C.green+"18",border:`1px solid ${C.green}35`,borderRadius:20,padding:"3px 10px",fontSize:10,color:C.green,fontWeight:700}}>Claude AI</div>
          </div>
          <div style={{fontSize:14,color:C.white,lineHeight:1.9,whiteSpace:"pre-wrap"}}>{analystText}</div>
        </div>
      )}

      {/* Bouton Placer ce trade — parèt sèlman si IA bay yon siyal BUY/SELL klè */}
      {analystOrder && (
        <div style={{background:C.card,borderRadius:18,padding:"18px",border:`2px solid ${analystOrder.signal==="BUY"?C.green:C.red}50`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:38,height:38,borderRadius:11,background:(analystOrder.signal==="BUY"?C.green:C.red)+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {analystOrder.signal==="BUY"?<TrendingUp size={18} color={C.green}/>:<TrendingDown size={18} color={C.red}/>}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:14}}>{analystOrder.signal==="BUY"?"ACHAT":"VENTE"} · {analystOrder.symbol}</div>
              <div style={{fontSize:11,color:C.muted}}>0.01 lot · SL/TP inclus</div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
            {[{l:"Entrée",v:analystOrder.entry,c:C.white},{l:"Stop Loss",v:analystOrder.stopLoss,c:C.red},{l:"Take Profit",v:analystOrder.takeProfit,c:C.green}].map(({l,v,c})=>(
              <div key={l} style={{background:C.bg,borderRadius:10,padding:"9px 8px",textAlign:"center",border:`1px solid ${C.border}`}}>
                <div style={{fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{l}</div>
                <div style={{fontSize:12,fontWeight:800,color:c}}>${v}</div>
              </div>
            ))}
          </div>

          {!mtInfo?.metaApiAccountId && (
            <div style={{background:C.gold+"0d",border:`1px solid ${C.gold}30`,borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:11,color:C.gold,lineHeight:1.5}}>
              ⚠️ Compte MetaTrader non connecté en direct. Réactivez avec votre mot de passe MT pour trader réellement.
            </div>
          )}

          <button onClick={executeTrade} disabled={placingTrade||!mtInfo?.metaApiAccountId}
            style={{width:"100%",background:!mtInfo?.metaApiAccountId?C.card2:placingTrade?C.gray:`linear-gradient(135deg,${analystOrder.signal==="BUY"?C.green:C.red},${analystOrder.signal==="BUY"?"#0a9060":"#c0392b"})`,color:!mtInfo?.metaApiAccountId?C.muted:"#fff",fontWeight:800,fontSize:14,border:"none",borderRadius:13,padding:"14px",cursor:placingTrade||!mtInfo?.metaApiAccountId?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {placingTrade?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Exécution...</>:<><Zap size={15}/> Placer ce trade</>}
          </button>

          {tradeResult && (
            <div style={{marginTop:12,background:tradeResult.ok?C.green+"10":C.red+"10",border:`1px solid ${tradeResult.ok?C.green:C.red}35`,borderRadius:10,padding:"11px 13px",fontSize:12,color:tradeResult.ok?C.green:C.red,lineHeight:1.6}}>
              {tradeResult.msg}
            </div>
          )}
        </div>
      )}

      {/* Bouton Placer ce trade — sèlman si AI bay yon siyal BUY/SELL klè */}
      {analystOrder && (
        <div style={{background:C.card,borderRadius:18,padding:"18px",border:`2px solid ${analystOrder.signal==="BUY"?C.green+"50":C.red+"50"}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <div style={{width:38,height:38,borderRadius:11,background:analystOrder.signal==="BUY"?C.green+"18":C.red+"18",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {analystOrder.signal==="BUY"?<TrendingUp size={18} color={C.green}/>:<TrendingDown size={18} color={C.red}/>}
            </div>
            <div>
              <div style={{fontWeight:800,fontSize:14}}>{analystOrder.signal==="BUY"?"ACHAT":"VENTE"} · {analystOrder.symbol}</div>
              <div style={{fontSize:11,color:C.muted}}>Lot: 0.01 · SL: {analystOrder.stopLoss} · TP: {analystOrder.takeProfit}</div>
            </div>
          </div>

          {!mtInfo?.metaApiAccountId && (
            <div style={{background:C.gold+"10",border:`1px solid ${C.gold}30`,borderRadius:11,padding:"11px 14px",fontSize:12,color:C.gold,marginBottom:12,lineHeight:1.6}}>
              ⚠️ Compte MetaTrader non connecté en direct. Activez avec votre mot de passe MT pour trader réellement.
            </div>
          )}

          <button onClick={executeTrade} disabled={placingTrade || !mtInfo?.metaApiAccountId}
            style={{width:"100%",background:!mtInfo?.metaApiAccountId?C.card2:placingTrade?C.gray:`linear-gradient(135deg,${analystOrder.signal==="BUY"?C.green:C.red},${analystOrder.signal==="BUY"?"#0a9060":"#b91c1c"})`,color:!mtInfo?.metaApiAccountId?C.muted:analystOrder.signal==="BUY"?"#000":"#fff",fontWeight:800,fontSize:15,border:"none",borderRadius:13,padding:"15px",cursor:(!mtInfo?.metaApiAccountId||placingTrade)?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all .3s"}}>
            {placingTrade?<><RefreshCw size={16} style={{animation:"spin 1s linear infinite"}}/> Exécution...</>:<>⚡ Placer ce trade ({analystOrder.signal==="BUY"?"ACHAT":"VENTE"})</>}
          </button>

          {tradeResult && (
            <div style={{marginTop:12,background:tradeResult.ok?C.green+"10":C.red+"10",border:`1px solid ${tradeResult.ok?C.green:C.red}35`,borderRadius:11,padding:"12px 14px",fontSize:13,color:tradeResult.ok?C.green:C.red,lineHeight:1.6}}>
              {tradeResult.msg}
            </div>
          )}
        </div>
      )}

      <div style={{textAlign:"center",fontSize:10,color:C.muted,letterSpacing:1}}>POWERED BY {APP.name}</div>
    </div>
  );

  const SettingsTab = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{fontSize:18,fontWeight:900,marginBottom:4}}>⚙️ Paramètres</div>
      {mtInfo&&(
        <div style={{background:C.card,borderRadius:18,padding:"18px",border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Compte MetaTrader</div>
          {[{l:"Login ID",v:`#${mtInfo.login}`},{l:"Broker",v:mtInfo.broker},{l:"Balance",v:`$${fmt(mtInfo.balance)}`},{l:"Statut",v:"Connecté ✓"}].map(({l,v})=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
              <span style={{fontSize:13,color:C.sub}}>{l}</span><span style={{fontSize:13,fontWeight:700}}>{v}</span>
            </div>
          ))}
        </div>
      )}
      <a href="#" style={{background:"#0a1a10",border:`1px solid ${C.green}28`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,textDecoration:"none"}}>
        <div style={{fontSize:22}}>📲</div>
        <div><div style={{fontWeight:700,fontSize:14,color:C.green}}>Support WhatsApp</div><div style={{fontSize:12,color:C.sub}}>Assistance 24h/24 · 7j/7</div></div>
        <ChevronRight size={14} color={C.green} style={{marginLeft:"auto"}}/>
      </a>
      <button onClick={async()=>{await DB.set("dj_ul",null);onLogout();}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:13,padding:"13px",color:C.muted,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
        <LogOut size={14}/> Déconnexion
      </button>
    </div>
  );

  const tabs=[{id:"home",icon:"🏠",label:"HOME"},{id:"metatrader",icon:"📊",label:"META TRADER"},{id:"analyst",icon:"🧠",label:"AI ANALYST"},{id:"settings",icon:"⚙️",label:"SETTINGS"}];

  return (
    <div style={{background:C.bg,minHeight:"100vh",maxWidth:440,margin:"0 auto",fontFamily:"'Inter',sans-serif",color:C.white,display:"flex",flexDirection:"column",paddingBottom:80}}>
      <style>{`@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.3;}} @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}} *{box-sizing:border-box;} ::-webkit-scrollbar{width:0;}`}</style>
      <Toasts/>

      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"28px 20px 13px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:11,color:C.muted,letterSpacing:1}}>TABLEAU DE BORD</div><div style={{fontSize:19,fontWeight:900,letterSpacing:.3}}>{APP.name}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:5,background:C.green+"12",borderRadius:20,padding:"5px 10px",border:`1px solid ${C.green}28`,fontSize:10,color:C.green,fontWeight:700}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 1.5s infinite"}}/> LIVE
          </div>
          <div style={{position:"relative",cursor:"pointer"}} onClick={()=>{setNotifs(0);setTab("home");}}>
            <Bell size={18} color={notifs>0?C.gold:C.muted}/>
            {notifs>0&&<div style={{position:"absolute",top:-4,right:-4,background:C.red,borderRadius:"50%",width:14,height:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:800}}>{notifs}</div>}
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"14px 16px"}}>
        {tab==="home"&&<HomeTab/>}{tab==="metatrader"&&<MetaTraderTab/>}{tab==="analyst"&&<AnalystTab/>}{tab==="settings"&&<SettingsTab/>}
      </div>

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,background:"#060810",borderTop:`1px solid ${C.border}`,display:"flex",padding:"10px 0 20px"}}>
        {tabs.map(({id,icon,label})=>{
          const a=tab===id;
          return <button key={id} onClick={()=>setTab(id)} style={{flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",padding:0}}>
            <span style={{fontSize:20,filter:a?"none":"grayscale(100%)"}}>{icon}</span>
            <span style={{fontSize:8,color:a?C.blue:C.muted,fontWeight:a?800:400,textTransform:"uppercase",letterSpacing:.4}}>{label}</span>
          </button>;
        })}
      </div>

      {/* Add Robot Modal */}
      {showAdd&&(
        <div onClick={()=>setShowAdd(false)} style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,maxWidth:440,left:"50%",transform:"translateX(-50%)",backdropFilter:"blur(4px)"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:"#0c1120",borderRadius:"26px 26px 0 0",padding:"26px 20px 42px",width:"100%",border:`1px solid ${C.border}`}}>
            <div style={{width:38,height:4,background:C.border,borderRadius:2,margin:"0 auto 22px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:18,fontWeight:900}}>➕ Ajouter un Robot</div>
              <button onClick={()=>{setShowAdd(false);setAddErr("");}} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:"50%",width:29,height:29,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,cursor:"pointer"}}><X size={13}/></button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>Nom du Robot</div>
                <input value={newName} onChange={e=>{setNewName(e.target.value);setAddErr("");}} placeholder="Ex: GOLD HUNTER"
                  style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"13px 16px",color:C.white,fontSize:15,outline:"none",fontWeight:700}}/>
              </div>
              <div>
                <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:7}}>Clé de Licence <span style={{color:C.muted,fontSize:10,textTransform:"none"}}>(optionnel si admin)</span></div>
                <input value={newKey} onChange={e=>{setNewKey(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,""));setAddErr("");}} placeholder="DJ-XXXX-XXXX-XXXX"
                  style={{width:"100%",background:C.bg,border:`1.5px solid ${newKey.length>5?C.blue:C.border}`,borderRadius:12,padding:"13px 16px",color:C.white,fontSize:15,outline:"none",fontFamily:"monospace",textAlign:"center",letterSpacing:2}}/>
              </div>
              {addErr&&<div style={{background:C.red+"12",borderRadius:10,padding:"10px 13px",fontSize:13,color:C.red}}>{addErr}</div>}
              <Btn onClick={addRobot} style={{width:"100%",padding:"14px",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,boxShadow:`0 5px 18px ${C.blue}28`,marginTop:4}}>
                <Plus size={15}/> Ajouter le Robot
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════
//  ADMIN PANEL
// ══════════════════════════════
function AdminPanel({onBack, cfg: propCfg, onSaveCfg}) {
  const [authed,setAuthed]   = useState(false);
  const [pw,setPw]           = useState("");
  const [showPw,setShowPw]   = useState(false);
  const [err,setErr]         = useState("");
  const [tab,setTab]         = useState("config");
  const [licenses,setLicenses] = useState({});
  const [qty,setQty]         = useState(5);
  const [freshKeys,setFreshKeys] = useState([]);
  const [search,setSearch]   = useState("");
  const [filterS,setFilterS] = useState("all");
  const [copied,setCopied]   = useState("");
  const [payments,setPayments] = useState([]);
  const [cfg,setCfg]         = useState({...DEFAULT_CFG,...(propCfg||{})});
  const [diagResult,setDiagResult] = useState(null);
  const [diagRunning,setDiagRunning] = useState(false);
  const [metaApiResult,setMetaApiResult] = useState(null);
  const [metaApiTesting,setMetaApiTesting] = useState(false);
  const [cfgSaved,setCfgSaved] = useState(false);

  const load = async () => {
    const licsRaw = await window.storage.get("dj_lic", true);
    if(licsRaw?.value) setLicenses(JSON.parse(licsRaw.value));
    const paysRaw = await window.storage.get("dj_payments", true);
    if(paysRaw?.value) setPayments(JSON.parse(paysRaw.value));
  };

  const login = () => {
    if(pw===APP.adminPass) { setAuthed(true); setPw(""); setErr(""); load(); }
    else setErr("❌ Mot de passe incorrect.");
  };

  // ── Dyagnostik konplè estòkaj — pou wè egzakteman kisa k ap pase ──
  const runDiagnostic = async () => {
    setDiagRunning(true);
    setDiagResult(null);
    const log = [];
    const testKey = "dj_diag_test";
    const testValue = { ts: Date.now(), msg: "test" };

    // 1. Test ekri PATAJE (shared:true)
    try {
      const w1 = await window.storage.set(testKey, JSON.stringify(testValue), true);
      log.push({ step:"Écriture SHARED", ok: !!w1, detail: w1 ? JSON.stringify(w1).slice(0,80) : "null renvoyé" });
    } catch(e) {
      log.push({ step:"Écriture SHARED", ok:false, detail: "Exception: "+(e?.message||String(e)) });
    }

    // 2. Test lekti PATAJE imedyatman apre
    try {
      const r1 = await window.storage.get(testKey, true);
      const val = r1?.value ? JSON.parse(r1.value) : null;
      log.push({ step:"Lecture SHARED (immédiat)", ok: !!val, detail: val ? "Trouvé: "+JSON.stringify(val) : "Vide/null" });
    } catch(e) {
      log.push({ step:"Lecture SHARED (immédiat)", ok:false, detail: "Exception: "+(e?.message||String(e)) });
    }

    // 3. Test dj_lic aktyèl la
    try {
      const licRaw = await window.storage.get("dj_lic", true);
      const licParsed = licRaw?.value ? JSON.parse(licRaw.value) : null;
      const count = licParsed ? Object.keys(licParsed).length : 0;
      log.push({ step:"Lecture dj_lic (réel)", ok: count>0, detail: `${count} clé(s). Raw: ${licRaw?"trouvé":"null"}` });
    } catch(e) {
      log.push({ step:"Lecture dj_lic (réel)", ok:false, detail: "Exception: "+(e?.message||String(e)) });
    }

    // 4. Test san shared parameter (defaut)
    try {
      const r2 = await window.storage.get(testKey);
      const val2 = r2?.value ? JSON.parse(r2.value) : null;
      log.push({ step:"Lecture SANS shared param", ok: !!val2, detail: val2 ? "Trouvé (même donnée!)" : "Vide — confirmé séparé" });
    } catch(e) {
      log.push({ step:"Lecture SANS shared param", ok:false, detail: "Exception (normal si clé n'existe pas): "+(e?.message||String(e)) });
    }

    setDiagResult(log);
    setDiagRunning(false);
  };

  // ── Tès konneksyon MetaApi ──
  const testMetaApi = async () => {
    setMetaApiTesting(true);
    setMetaApiResult(null);
    if(!APP.metaApiToken) {
      setMetaApiResult({ ok:false, msg:"⚠️ Token MetaApi pas encore configuré dans le code (section APP.metaApiToken)." });
      setMetaApiTesting(false);
      return;
    }
    // Teste si token la valid an eseyan yon apèl senp (lis kont yo)
    try {
      const res = await fetch("https://mt-provisioning-api-v1.agiliumtrade.agiliumtrade.ai/users/current/accounts", {
        headers: { "Accept":"application/json", "auth-token": APP.metaApiToken }
      });
      if (res.ok) {
        const data = await res.json().catch(()=>[]);
        setMetaApiResult({ ok:true, msg:`✅ Token valide! ${Array.isArray(data)?data.length:0} compte(s) déjà provisionné(s). Chaque utilisateur qui s'active avec son mot de passe MT créera automatiquement son propre compte.` });
      } else {
        setMetaApiResult({ ok:false, msg:`❌ Token invalide ou erreur (HTTP ${res.status}).` });
      }
    } catch(e) {
      setMetaApiResult({ ok:false, msg:`❌ Erreur réseau/CORS: ${e?.message||String(e)}` });
    }
    setMetaApiTesting(false);
  };

  const saveCfg = async () => {
    await onSaveCfg(cfg);  // mete ajou Root state + storage nan yon sèl rele
    setCfgSaved(true); setTimeout(()=>setCfgSaved(false),2500);
    toast("✅ Configuration sauvegardée!","success");
  };

  const copy = (txt,id) => { navigator.clipboard.writeText(txt).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(""),2000); toast("✅ Copié!","success"); };

  const generate = async () => {
    const n = Math.min(qty,50); const fresh=[];
    for(let i=0;i<n;i++){ fresh.push(genKey()); }
    setFreshKeys(fresh);
    // Best-effort: eseye sove pou istorik/rejis, men kle yo VALID kanmenm si sa echwe
    try {
      const upd={...licenses};
      fresh.forEach(k=>{ upd[k]={status:"active",created:new Date().toISOString(),price:cfg.priceMonth}; });
      setLicenses(upd);
      const writeResult = await DB.set("dj_lic",upd,true);
      toast(writeResult.ok ? `✅ ${n} clés générées et sauvegardées!` : `✅ ${n} clés générées (valides à vie — non listées dans "Toutes les clés" car stockage indisponible)`, "success");
    } catch(_) {
      toast(`✅ ${n} clés générées! (valides à vie par formule mathématique)`,"success");
    }
  };

  const deactivate = async k => {
    const upd={...licenses,[k]:{...licenses[k],status:"inactive"}};
    setLicenses(upd); await DB.set("dj_lic",upd,true); toast("Clé désactivée","info");
  };

  const markDone = async idx => {
    const upd = payments.map((p,i)=>i===idx?{...p,status:"done"}:p);
    setPayments(upd); await DB.set("dj_payments",upd,true); toast("✅ Marqué traité","success");
  };

  const allKeys   = Object.entries(licenses);
  const filtered  = allKeys.filter(([k,v])=>(filterS==="all"||v.status===filterS)&&(!search||k.includes(search.toUpperCase()))).sort((a,b)=>(b[1].created||"").localeCompare(a[1].created||""));
  const stats     = {total:allKeys.length,active:allKeys.filter(([,v])=>v.status==="active").length,used:allKeys.filter(([,v])=>v.status==="used").length,pending:payments.filter(p=>p.status==="pending").length};

  const adminTabs = [
    {id:"config",   label:"⚙️ Config"},
    {id:"payments", label:`💳 Paiements${stats.pending>0?` (${stats.pending})`:""}` },
    {id:"generate", label:"➕ Générer"},
    {id:"keys",     label:"🗝 Clés"},
    {id:"fresh",    label:`✨ (${freshKeys.length})`},
  ];

  if(!authed) return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px"}}>
      <style>{`@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`}</style>
      <Toasts/>
      <div style={{fontSize:48,marginBottom:14}}>🔐</div>
      <div style={{fontSize:22,fontWeight:900,marginBottom:4}}>Admin Panel</div>
      <div style={{fontSize:13,color:C.sub,marginBottom:28}}>{APP.name} · Accès administrateur</div>
      <div style={{width:"100%",maxWidth:340}}>
        <div style={{position:"relative",marginBottom:10}}>
          <input type={showPw?"text":"password"} value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Mot de passe admin"
            style={{width:"100%",background:C.card,border:`1.5px solid ${err?C.red:C.border}`,borderRadius:14,padding:"15px 46px 15px 18px",color:C.white,fontSize:15,outline:"none"}}/>
          <button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer"}}>{showPw?<EyeOff size={16}/>:<Eye size={16}/>}</button>
        </div>
        {err&&<div style={{fontSize:12,color:C.red,marginBottom:10,textAlign:"center"}}>{err}</div>}
        <Btn onClick={login} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,padding:"15px",marginBottom:10}}>Connexion Admin</Btn>
        <Btn onClick={onBack} outline style={{width:"100%",padding:"13px"}}>← Retour au site</Btn>
      </div>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"'Inter',sans-serif",color:C.white}}>
      <Toasts/>

      {/* Header */}
      <div style={{background:C.nav,borderBottom:`1px solid ${C.border}`,padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🏆</div>
          <div><div style={{fontSize:10,color:C.muted,letterSpacing:1}}>ADMIN</div><div style={{fontWeight:900,fontSize:15}}>{APP.name}</div></div>
        </div>
        <button onClick={()=>setAuthed(false)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 14px",color:C.muted,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:6}}><LogOut size={13}/> Déco.</button>
      </div>

      {/* Stats */}
      <div style={{maxWidth:760,margin:"0 auto",padding:"20px 20px 0"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
          {[{l:"Total",v:stats.total,c:C.white},{l:"Actives",v:stats.active,c:C.green},{l:"Utilisées",v:stats.used,c:C.gold},{l:"En attente",v:stats.pending,c:C.red}].map(({l,v,c})=>(
            <div key={l} style={{background:C.card,borderRadius:14,padding:"14px",border:`1px solid ${C.border}`,textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:900,color:c}}>{v}</div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:.6,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>
          {adminTabs.map(({id,label})=>(
            <button key={id} onClick={()=>setTab(id)} style={{background:tab===id?C.blue:C.card,border:`1px solid ${tab===id?C.blue:C.border}`,borderRadius:10,padding:"9px 12px",color:tab===id?"#fff":C.sub,fontWeight:700,fontSize:12,cursor:"pointer"}}>{label}</button>
          ))}
        </div>

        {/* ── CONFIG ── */}
        {tab==="config"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* 🔌 MetaApi — Connexion MT4/5 réelle */}
            <div style={{background:"linear-gradient(135deg,#0a1220,#0d1120)",borderRadius:18,padding:"20px",border:`2px solid ${APP.metaApiToken?C.green+"50":C.blue+"40"}`}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:4,color:C.blue}}>🔌 Connexion MetaTrader Réelle (MetaApi)</div>
              <div style={{fontSize:12,color:C.sub,marginBottom:14,lineHeight:1.6}}>
                {APP.metaApiToken
                  ? "✅ Token configuré. Chaque utilisateur qui active son compte AVEC son mot de passe MT crée automatiquement son propre compte MetaApi connecté en direct."
                  : <>Non configuré. Ajoutez <code style={{background:C.bg,padding:"2px 6px",borderRadius:4}}>metaApiToken</code> dans la section APP du code (obtenu sur <strong>app.metaapi.cloud/token</strong>). Un seul token gère tous vos utilisateurs.</>
                }
              </div>
              <button onClick={testMetaApi} disabled={metaApiTesting}
                style={{width:"100%",background:metaApiTesting?C.gray:`linear-gradient(135deg,${C.blue},${C.blueDark})`,color:"#fff",fontWeight:800,fontSize:14,border:"none",borderRadius:12,padding:"13px",cursor:metaApiTesting?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:metaApiResult?14:0}}>
                {metaApiTesting?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Test en cours...</>:<>🔌 Tester le token MT</>}
              </button>
              {metaApiResult && (
                <div style={{background:C.bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${metaApiResult.ok?C.green+"40":C.red+"40"}`,fontSize:12,color:metaApiResult.ok?C.green:C.red,lineHeight:1.6}}>
                  {metaApiResult.msg}
                </div>
              )}
            </div>

            {/* 🔬 Dyagnostik Estòkaj */}
            <div style={{background:"linear-gradient(135deg,#1a0a0a,#0d1120)",borderRadius:18,padding:"20px",border:`2px solid ${C.gold}50`}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:4,color:C.gold}}>🔬 Diagnostic Stockage</div>
              <div style={{fontSize:12,color:C.sub,marginBottom:14}}>Teste si les clés générées se sauvegardent correctement.</div>
              <button onClick={runDiagnostic} disabled={diagRunning}
                style={{width:"100%",background:diagRunning?C.gray:`linear-gradient(135deg,${C.gold},#c9960a)`,color:"#000",fontWeight:800,fontSize:14,border:"none",borderRadius:12,padding:"13px",cursor:diagRunning?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:diagResult?16:0}}>
                {diagRunning?<><RefreshCw size={15} style={{animation:"spin 1s linear infinite"}}/> Test en cours...</>:<>🔬 Lancer le Diagnostic</>}
              </button>

              {diagResult && (
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {diagResult.map((r,i)=>(
                    <div key={i} style={{background:C.bg,borderRadius:10,padding:"12px 14px",border:`1px solid ${r.ok?C.green+"40":C.red+"40"}`}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <span style={{fontSize:14}}>{r.ok?"✅":"❌"}</span>
                        <span style={{fontSize:13,fontWeight:700,color:C.white}}>{r.step}</span>
                      </div>
                      <div style={{fontSize:11,color:C.sub,fontFamily:"monospace",wordBreak:"break-all",paddingLeft:22}}>{r.detail}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{background:C.card,borderRadius:18,padding:"22px",border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>💼 Configuration Paiements</div>
              <div style={{fontSize:12,color:C.sub,marginBottom:20}}>Remplissez vos informations de paiement. Les utilisateurs verront ces infos quand ils achètent.</div>

              {[
                {label:"₿ Adresse USDT TRC20",key:"usdt",ph:"TXXXXXXXXXXXXXXXXXXXXXXXx",hint:"Doit commencer par T",mono:true},
                {label:"📲 Lien WhatsApp",key:"whatsapp",ph:"https://wa.me/509XXXXXXXX",hint:"Format: https://wa.me/509 + numéro"},
              ].map(({label,key,ph,hint,mono})=>(
                <div key={key} style={{marginBottom:18}}>
                  <div style={{fontSize:12,fontWeight:700,marginBottom:6}}>{label}</div>
                  <input value={cfg[key]||""} onChange={e=>setCfg(p=>({...p,[key]:e.target.value}))} placeholder={ph}
                    style={{width:"100%",background:C.bg,border:`1.5px solid ${cfg[key]?C.green:C.border}`,borderRadius:12,padding:"13px 15px",color:C.white,fontSize:mono?12:14,outline:"none",fontFamily:mono?"monospace":"inherit",transition:"border-color .2s"}}/>
                  <div style={{fontSize:10,color:cfg[key]?C.green:C.muted,marginTop:5}}>{cfg[key]?"✓ Configuré":"⚠ "+hint}</div>
                </div>
              ))}

              <div style={{borderTop:`1px solid ${C.border}`,paddingTop:18,marginTop:4}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>💰 Prix des licences</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                  {[{l:"Mensuel ($/mois)",k:"priceMonth"},{l:"À vie ($)",k:"priceLife"}].map(({l,k})=>(
                    <div key={k}>
                      <div style={{fontSize:11,color:C.sub,marginBottom:7}}>{l}</div>
                      <input type="number" value={cfg[k]} onChange={e=>setCfg(p=>({...p,[k]:+e.target.value}))}
                        style={{width:"100%",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:11,padding:"11px 13px",color:C.white,fontSize:20,fontWeight:800,outline:"none",textAlign:"center"}}/>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div style={{background:C.blue+"0d",border:`1px solid ${C.blue}25`,borderRadius:14,padding:"14px 18px"}}>
              <div style={{fontSize:11,color:C.blue,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>👁 Aperçu utilisateur</div>
              <div style={{fontSize:13,color:C.sub,lineHeight:2.1}}>
                <div>₿ USDT: <strong style={{color:C.white,fontFamily:"monospace",fontSize:11}}>{cfg.usdt||<span style={{color:C.red}}>Non configuré</span>}</strong></div>
                <div>📲 WhatsApp: <strong style={{color:C.white,fontSize:11}}>{cfg.whatsapp||<span style={{color:C.red}}>Non configuré</span>}</strong></div>
                <div>💰 Mensuel: <strong style={{color:C.green}}>${cfg.priceMonth}</strong> · À vie: <strong style={{color:C.blue}}>${cfg.priceLife}</strong></div>
              </div>
            </div>

            <button onClick={saveCfg} style={{width:"100%",background:cfgSaved?C.green:`linear-gradient(135deg,${C.blue},${C.blueDark})`,color:cfgSaved?"#000":"#fff",fontWeight:900,fontSize:15,border:"none",borderRadius:13,padding:"16px",cursor:"pointer",transition:"all .3s",boxShadow:`0 5px 20px ${C.blue}28`}}>
              {cfgSaved?"✅ Sauvegardé avec succès!":"💾 Sauvegarder la Configuration"}
            </button>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab==="payments"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:17,fontWeight:900}}>💳 Paiements</div><div style={{fontSize:12,color:C.sub,marginTop:2}}>Clients en attente de leur clé</div></div>
              <button onClick={load} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 12px",color:C.sub,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",gap:5}}><RefreshCw size={12}/> Refresh</button>
            </div>
            {payments.length===0
              ?<div style={{background:C.card,borderRadius:16,padding:"40px",textAlign:"center",border:`1px solid ${C.border}`}}><div style={{fontSize:40,marginBottom:10}}>📭</div><div style={{color:C.muted,fontSize:14}}>Aucun paiement reçu.</div></div>
              :payments.map((p,idx)=>{
                const isPending = p.status==="pending";
                const waMsg = encodeURIComponent(`🏆 *${APP.name}*\n\nBonjour ${p.name}!\n\n✅ Paiement de *$${p.price}* confirmé.\n\n🔑 Votre clé de licence:\n\n\`DJ-XXXX-XXXX-XXXX\`\n\n📋 Réf: ${p.id}\n\nPour activer: ouvrez l'app → Activer → Entrez la clé.\nMerci! 🙏`);
                const waNum = (cfg.whatsapp||"").replace("https://wa.me/","").replace("http://wa.me/","").trim();
                const waUrl = waNum ? `https://wa.me/${waNum}?text=${waMsg}` : null;
                return (
                  <div key={p.id} style={{background:C.card,borderRadius:16,padding:"16px",border:`1px solid ${isPending?C.gold+"45":C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                      <div><div style={{fontWeight:800,fontSize:14}}>{p.name}</div><div style={{fontSize:10,color:C.muted,marginTop:2,fontFamily:"monospace"}}>{p.id}</div></div>
                      <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5}}>
                        <span style={{background:isPending?C.gold+"18":C.green+"18",color:isPending?C.gold:C.green,border:`1px solid ${isPending?C.gold+"35":C.green+"35"}`,borderRadius:20,padding:"3px 9px",fontSize:9,fontWeight:800}}>{isPending?"⏳ EN ATTENTE":"✅ TRAITÉ"}</span>
                        <span style={{fontSize:18,fontWeight:900,color:C.blue}}>${p.price}</span>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:12}}>
                      {[{l:"Contact",v:p.contact},{l:"Méthode",v:p.method},{l:"Plan",v:p.plan},{l:"Date",v:new Date(p.submittedAt).toLocaleString("fr-FR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}].map(({l,v})=>(
                        <div key={l} style={{background:C.bg,borderRadius:9,padding:"9px 11px",border:`1px solid ${C.border}`}}>
                          <div style={{fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:.7,marginBottom:2}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:700,wordBreak:"break-all"}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    {isPending
                      ?<div style={{display:"flex",gap:8}}>
                          {waUrl
                            ? <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{flex:2,background:`linear-gradient(135deg,${C.green},#0a9060)`,color:"#000",fontWeight:800,fontSize:12,border:"none",borderRadius:10,padding:"11px",display:"flex",alignItems:"center",justifyContent:"center",gap:6,textDecoration:"none",cursor:"pointer"}}>📲 Envoyer clé WhatsApp</a>
                            : <div style={{flex:2,background:C.gold+"15",border:`1px solid ${C.gold}35`,borderRadius:10,padding:"11px",fontSize:11,color:C.gold,textAlign:"center"}}>⚠️ WhatsApp non configuré dans Admin → Config</div>
                          }
                          <button onClick={()=>markDone(idx)} style={{flex:1,background:C.card2,border:`1px solid ${C.border}`,color:C.sub,fontWeight:700,fontSize:11,borderRadius:10,padding:"11px",cursor:"pointer"}}>✓ Traité</button>
                        </div>
                      :<div style={{background:C.green+"0d",borderRadius:9,padding:"9px 13px",fontSize:12,color:C.green,textAlign:"center"}}>✅ Clé envoyée</div>
                    }
                  </div>
                );
              })
            }
          </div>
        )}

        {/* ── GENERATE ── */}
        {tab==="generate"&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{background:C.card,borderRadius:18,padding:"22px",border:`1px solid ${C.border}`}}>
              <div style={{fontWeight:800,fontSize:15,marginBottom:4}}>Générer des clés de licence</div>
              <div style={{fontSize:12,color:C.sub,marginBottom:18}}>Chaque clé = ${cfg.priceMonth} de revenu</div>
              <div style={{fontSize:11,color:C.sub,textTransform:"uppercase",letterSpacing:1,marginBottom:9}}>Quantité</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18}}>
                {[1,5,10,25,50].map(n=><button key={n} onClick={()=>setQty(n)} style={{padding:"8px 18px",borderRadius:20,border:`1.5px solid ${qty===n?C.blue:C.border}`,background:qty===n?C.blue+"18":"transparent",color:qty===n?C.blue:C.sub,fontSize:13,fontWeight:700,cursor:"pointer"}}>{n}</button>)}
              </div>
              <div style={{background:C.blue+"0d",borderRadius:11,padding:"11px 14px",marginBottom:18,fontSize:13,color:C.blue,border:`1px solid ${C.blue}18`}}>
                💰 Revenu potentiel: <strong>${qty*cfg.priceMonth}</strong>
              </div>
              <Btn onClick={generate} style={{width:"100%",background:`linear-gradient(135deg,${C.blue},${C.blueDark})`,padding:"14px",boxShadow:`0 5px 18px ${C.blue}28`}}>
                <Plus size={15}/> Générer {qty} Clé{qty>1?"s":""}
              </Btn>
            </div>
          </div>
        )}

        {/* ── FRESH KEYS ── */}
        {tab==="fresh"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{background:C.green+"0d",border:`1px solid ${C.green}30`,borderRadius:12,padding:"12px 14px",fontSize:12,color:C.green,lineHeight:1.6}}>
              ✅ Ces clés sont valides <strong>immédiatement et définitivement</strong> — la validation se fait par calcul mathématique, sans dépendre du stockage.
            </div>
            {freshKeys.length===0
              ?<div style={{textAlign:"center",padding:"40px",color:C.muted}}>Allez sur "Générer" pour créer des clés.</div>
              :<>
                <button onClick={()=>copy(freshKeys.join("\n"),"all")} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"12px",color:C.blue,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                  <Copy size={14}/>{copied==="all"?"✅ Copié!":"Copier toutes les clés"}
                </button>
                <div style={{background:C.card,borderRadius:14,padding:"13px",border:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:6,maxHeight:420,overflowY:"auto"}}>
                  {freshKeys.map(k=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:C.bg,borderRadius:9,padding:"10px 13px"}}>
                      <span style={{fontFamily:"monospace",fontSize:13,letterSpacing:.5}}>{k}</span>
                      <button onClick={()=>copy(k,k)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:4}}>{copied===k?<Check size={14} color={C.green}/>:<Copy size={14}/>}</button>
                    </div>
                  ))}
                </div>
              </>
            }
          </div>
        )}

        {/* ── ALL KEYS ── */}
        {tab==="keys"&&(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:8}}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:C.white,fontSize:13,outline:"none"}}/>
              <select value={filterS} onChange={e=>setFilterS(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",color:C.sub,fontSize:12,outline:"none",cursor:"pointer"}}>
                <option value="all">Tout</option><option value="active">Actives</option><option value="used">Utilisées</option><option value="inactive">Inactives</option>
              </select>
            </div>
            {filtered.length===0
              ?<div style={{textAlign:"center",padding:"32px",color:C.muted}}>Aucune clé trouvée.</div>
              :filtered.map(([k,v])=>(
                <div key={k} style={{background:C.card,borderRadius:13,padding:"12px 15px",border:`1px solid ${v.status==="active"?C.border:v.status==="used"?C.gold+"30":C.red+"20"}`,display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"monospace",fontSize:12,letterSpacing:.5,marginBottom:4}}>{k}</div>
                    <div style={{display:"flex",gap:7,alignItems:"center"}}>
                      <span style={{fontSize:9,color:v.status==="active"?C.green:v.status==="used"?C.gold:C.red,fontWeight:700,textTransform:"uppercase"}}>{v.status==="active"?"● ACTIVE":v.status==="used"?"● UTILISÉE":"✕ INACTIVE"}</span>
                      <span style={{fontSize:9,color:C.muted}}>${v.price}</span>
                    </div>
                  </div>
                  <button onClick={()=>copy(k,k)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:4}}>{copied===k?<Check size={14} color={C.green}/>:<Copy size={14}/>}</button>
                  {v.status==="active"&&<button onClick={()=>deactivate(k)} style={{background:"none",border:"none",color:C.red+"55",cursor:"pointer",padding:4}}><Trash2 size={14}/></button>}
                </div>
              ))
            }
          </div>
        )}

        <div style={{height:40}}/>
      </div>
    </div>
  );
}

// ── Splash status messages ──
function SplashStatus() {
  const steps = ["Initialisation du système...","Connexion sécurisée...","Chargement des robots EA...","Bienvenue sur DJ TradePro!"];
  const [idx,setIdx] = useState(0);
  useEffect(()=>{
    const iv = setInterval(()=>setIdx(i=>i<steps.length-1?i+1:i),550);
    return()=>clearInterval(iv);
  },[]);
  return <div style={{fontSize:12,color:C.blue,letterSpacing:1,fontWeight:600,transition:"all .3s"}}>{steps[idx]}</div>;
}

// ══════════════════════════════
//  ROOT
// ══════════════════════════════
export default function Root() {
  const [view,setView]               = useState("loading");
  const [confirmPlan,setConfirmPlan] = useState("life");
  const [confirmPrice,setConfirmPrice] = useState(29);
  // cfg kòmanse dirèkteman depi APP — toujou disponib
  const [cfg,setCfg] = useState({...DEFAULT_CFG});

  // Chaje tout done yon sèl fwa nan Root + montre splash 2.5s
  useEffect(()=>{
    const start = Date.now();
    (async()=>{
      let dest = "landing";
      try {
        const c = await window.storage.get("dj_cfg", true);
        if(c?.value) {
          const parsed = JSON.parse(c.value);
          LIVE_CFG = {...DEFAULT_CFG, ...parsed};
          setCfg(LIVE_CFG);
        }
        const uk = await window.storage.get("dj_ul");
        if(uk?.value) {
          const licsRaw = await window.storage.get("dj_lic", true);
          if(licsRaw?.value) {
            const lics = JSON.parse(licsRaw.value);
            if(lics[uk.value]?.status==="active"||lics[uk.value]?.status==="used"){
              const rbRaw = await window.storage.get("dj_robots");
              const robots = rbRaw?.value ? JSON.parse(rbRaw.value) : [];
              dest = robots.length>0?"app":"setup";
            }
          }
        }
      } catch(_){}
      // Garanti splash montre pou omwen 2.5 sèkond
      const elapsed = Date.now() - start;
      const remain  = Math.max(0, 2500 - elapsed);
      setTimeout(()=>setView(dest), remain);
    })();
  },[]);

  // Sove config — mete ajou LIVE_CFG imedyatman + React state + storage
  const saveCfg = async (newCfg) => {
    LIVE_CFG = {...newCfg};   // ← imedya, san async
    setCfg({...newCfg});
    try { await window.storage.set("dj_cfg", JSON.stringify(newCfg), true); } catch(_){}
  };

  if(view==="loading") return (
    <div style={{background:"#04060c",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif",overflow:"hidden",position:"relative"}}>
      <style>{`
        @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.25;}}
        @keyframes glow{0%,100%{box-shadow:0 0 24px #3b82f640;}50%{box-shadow:0 0 64px #3b82f680;}}
        @keyframes scanline{0%{top:-40%;}100%{top:110%;}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes barFill{from{width:0%;}to{width:100%;}}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
      `}</style>

      {/* Background grid */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${C.border}18 1px,transparent 1px),linear-gradient(90deg,${C.border}18 1px,transparent 1px)`,backgroundSize:"40px 40px",opacity:.4}}/>

      {/* Scanline effect */}
      <div style={{position:"absolute",left:0,right:0,height:"40%",background:`linear-gradient(transparent,${C.blue}06,transparent)`,animation:"scanline 3s linear infinite",pointerEvents:"none"}}/>

      {/* Corner accents */}
      {[[0,0,"topleft"],[0,"auto","topright"],["auto",0,"bottomleft"],["auto","auto","bottomright"]].map(([t,b,id])=>(
        <div key={id} style={{position:"absolute",top:t,bottom:b===0?0:b,left:id.includes("left")?0:"auto",right:id.includes("right")?0:"auto",width:60,height:60,borderTop:id.includes("top")?`2px solid ${C.blue}50`:"none",borderBottom:id.includes("bottom")?`2px solid ${C.blue}50`:"none",borderLeft:id.includes("left")?`2px solid ${C.blue}50`:"none",borderRight:id.includes("right")?`2px solid ${C.blue}50`:"none"}}/>
      ))}

      {/* Main content */}
      <div style={{textAlign:"center",animation:"fadeUp .7s ease",position:"relative",zIndex:1}}>

        {/* Logo */}
        <div style={{width:96,height:96,borderRadius:28,background:`linear-gradient(135deg,${C.blue},#1e40af)`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px",fontSize:46,animation:"glow 2.5s ease-in-out infinite, float 3s ease-in-out infinite",boxShadow:`0 0 40px ${C.blue}50`}}>🏆</div>

        {/* App name */}
        <div style={{fontSize:32,fontWeight:900,color:C.white,letterSpacing:3,marginBottom:6,textTransform:"uppercase"}}>{APP.name}</div>
        <div style={{fontSize:12,color:C.blue,letterSpacing:4,textTransform:"uppercase",marginBottom:48}}>{APP.tagline}</div>

        {/* Status messages */}
        <div style={{marginBottom:32,height:18}}>
          <SplashStatus/>
        </div>

        {/* Progress bar */}
        <div style={{width:260,background:C.border,borderRadius:99,height:3,overflow:"hidden",margin:"0 auto 16px"}}>
          <div style={{height:"100%",borderRadius:99,background:`linear-gradient(90deg,${C.blue},#818cf8)`,animation:"barFill 2.2s ease forwards"}}/>
        </div>

        <div style={{fontSize:10,color:C.muted,letterSpacing:2,textTransform:"uppercase"}}>{APP.version}</div>
      </div>

      {/* Bottom branding */}
      <div style={{position:"absolute",bottom:32,left:0,right:0,textAlign:"center",animation:"fadeIn 1s ease .8s both"}}>
        <div style={{fontSize:10,color:C.muted,letterSpacing:1}}>POWERED BY DJ TRADEPRO · AUTOMATED EA PLATFORM</div>
      </div>
    </div>
  );

  if(view==="landing")   return <LandingPage   onActivate={()=>setView("activate")} onPricing={()=>setView("pricing")} onAdmin={()=>setView("admin")} onReconnect={()=>setView("reconnect")}/>;
  if(view==="pricing")   return <PricingPage   cfg={cfg} onBack={()=>setView("landing")} onActivate={()=>setView("activate")} onConfirm={(plan,price)=>{setConfirmPlan(plan);setConfirmPrice(price);setView("confirm");}}/>;
  if(view==="confirm")   return <ConfirmPage   cfg={cfg} onBack={()=>setView("pricing")} onActivate={()=>setView("activate")} plan={confirmPlan} price={confirmPrice}/>;
  if(view==="activate")  return <ActivatePage  onBack={()=>setView("pricing")} onSuccess={()=>setView("setup")} onReconnect={()=>setView("reconnect")}/>;
  if(view==="reconnect") return <ReconnectPage onBack={()=>setView("activate")} onSuccess={()=>setView("app")}/>;
  if(view==="setup")     return <RobotSetupPage onDone={()=>setView("app")}/>;
  if(view==="app")       return <AppDashboard  onLogout={()=>setView("landing")}/>;
  if(view==="admin")     return <AdminPanel    cfg={cfg} onSaveCfg={saveCfg} onBack={()=>setView("landing")}/>;
  return null;
}
