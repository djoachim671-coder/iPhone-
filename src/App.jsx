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
//  STORAGE SHIM — remplace window.storage (spécifique aux artifacts Claude)
//  par localStorage pour un déploiement web normal (Vercel/Netlify).
//  NOTE: "shared" reste local à CE navigateur — les clés de licence
//  fonctionnent quand même car elles sont validées par calcul (checksum),
//  pas par recherche dans le stockage.
// ══════════════════════════════
if (typeof window !== "undefined" && !window.storage) {
  const prefix = (shared) => (shared ? "dj_shared:" : "dj_personal:");
  window.storage = {
    get: async (key, shared = false) => {
      const v = localStorage.getItem(prefix(shared) + key);
      if (v === null) throw new Error("Key not found: " + key);
      return { key, value: v, shared };
    },
    set: async (key, value, shared = false) => {
      localStorage.setItem(prefix(shared) + key, value);
      return { key, value, shared };
    },
    delete: async (key, shared = false) => {
      localStorage.removeItem(prefix(shared) + key);
      return { key, deleted: true, shared };
    },
    list: async (pfx = "", shared = false) => {
      const p = prefix(shared) + pfx;
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(p))
        .map(k => k.slice(prefix(shared).length));
      return { keys, shared };
    },
  };
}

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
