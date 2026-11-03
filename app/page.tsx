export default function Page() {
  const htmlContent = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>JumcartFlow | Autonomous Self-Healing Webhook Gateway</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com/3.4.17"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/htm@3.1.1/dist/htm.umd.js"></script>
  <script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
  <style>
    :root{
      --bg:#090b0f; --surface:#0e1116; --raised:#141a22; --line:#1c232d; --line2:#2a3340;
      --fg:#e8ecf1; --mute:#8d98a7; --dim:#5d6877;
      --accent:#8ea3ff; --accent-soft:rgba(142,163,255,.13); --accent-ink:#0a0d18;
      --ok:#3ecf8e; --ok-soft:rgba(62,207,142,.12);
      --warn:#f2a93b; --warn-soft:rgba(242,169,59,.12);
      --bad:#ff6370; --bad-soft:rgba(255,99,112,.12);
      --heal:#4cc9f0; --heal-soft:rgba(76,201,240,.12);
      --font-ui:'Hanken Grotesk',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif;
      --font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
      color-scheme:dark;
    }
    html,body{background:var(--bg)}
    body{margin:0;color:var(--fg);font-family:var(--font-ui);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
    *{box-sizing:border-box}
    button{font-family:inherit;color:inherit;cursor:pointer}
    input,select,textarea{font-family:inherit;color:var(--fg)}
    :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
    .mono{font-family:var(--font-mono)}
    .wrap{max-width:1320px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
    .t-mute{color:var(--mute)} .t-dim{color:var(--dim)} .t-ok{color:var(--ok)} .t-bad{color:var(--bad)} .t-warn{color:var(--warn)} .t-heal{color:var(--heal)} .t-acc{color:var(--accent)}
    .eyebrow{font:600 11px var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--dim)}
    .card [id^="m-"]{border-color:var(--line)!important}
    .topbar{border-bottom:1px solid var(--line);background:var(--bg)}
    .logo{display:flex;align-items:center;gap:10px}
    .logo-mark{width:28px;height:28px;border-radius:7px;background:var(--accent);display:grid;place-items:center}
    .logo-name{font-weight:700;font-size:18px;letter-spacing:-.02em}
    .by{font:500 11px var(--font-mono);color:var(--mute);border:1px solid var(--line2);border-radius:4px;padding:2px 7px;white-space:nowrap}
    .netpill{display:inline-flex;align-items:center;gap:8px;font:500 12px var(--font-mono);color:var(--ok);background:var(--ok-soft);border:1px solid rgba(62,207,142,.25);border-radius:4px;padding:5px 10px;white-space:nowrap}
    .dot{width:7px;height:7px;border-radius:99px;background:currentColor;display:inline-block;flex:none}
    .pulse{animation:pulse 1.8s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
    .tabs{display:flex;gap:2px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .tabs::-webkit-scrollbar{display:none}
    .tab{display:inline-flex;align-items:center;gap:8px;padding:12px 14px;background:none;border:0;border-bottom:2px solid transparent;color:var(--mute);font-weight:500;font-size:13.5px;white-space:nowrap}
    .tab:hover{color:var(--fg)}
    .tab[aria-selected="true"]{color:var(--fg);border-bottom-color:var(--accent)}
    .tab .count{font:600 10.5px var(--font-mono);background:var(--bad-soft);color:var(--bad);border-radius:4px;padding:1px 6px}
    .card{background:var(--surface);border:1px solid var(--line);border-radius:8px}
    .card-h{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid var(--line);flex-wrap:wrap}
    .card-h h2,.h2{margin:0;font-size:15px;font-weight:650;letter-spacing:-.01em}
    .card-b{padding:16px}
    .metric{padding:14px 16px;display:flex;justify-content:space-between;gap:10px;align-items:flex-end;min-width:0}
    .metric .v{font-size:26px;font-weight:650;letter-spacing:-.03em;line-height:1.1;margin-top:6px}
    .metric .s{font:500 11.5px var(--font-mono);color:var(--mute);margin-top:4px}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;height:34px;padding:0 13px;border-radius:6px;border:1px solid var(--line2);background:var(--raised);font-weight:550;font-size:13px;white-space:nowrap;transition:background .15s,border-color .15s}
    .btn:hover:not(:disabled){border-color:var(--dim);background:#19202a}
    .btn:disabled{opacity:.45;cursor:not-allowed}
    .btn-primary{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:650}
    .btn-primary:hover:not(:disabled){background:#a5b6ff;border-color:#a5b6ff}
    .btn-ok{background:var(--ok);border-color:var(--ok);color:#04150d;font-weight:650}
    .btn-ok:hover:not(:disabled){background:#5ddda5;border-color:#5ddda5}
    .btn-danger{color:var(--bad);border-color:rgba(255,99,112,.35)}
    .btn-danger:hover:not(:disabled){background:var(--bad-soft);border-color:var(--bad)}
    .btn-ghost{background:transparent;border-color:transparent;color:var(--mute)}
    .btn-ghost:hover:not(:disabled){background:var(--raised);color:var(--fg);border-color:var(--line2)}
    .btn-sm{height:28px;padding:0 10px;font-size:12px}
    .btn-icon{width:34px;padding:0}.btn-sm.btn-icon{width:28px}
    .input,.select{height:34px;background:var(--bg);border:1px solid var(--line2);border-radius:6px;padding:0 10px;font-size:13px;min-width:0;width:100%}
    .input.mono{font-size:12.5px}
    .input:focus,.select:focus{outline:2px solid var(--accent);outline-offset:0;border-color:var(--accent)}
    .seg{display:inline-flex;border:1px solid var(--line2);border-radius:6px;overflow:hidden;background:var(--bg)}
    .seg button{border:0;background:none;padding:0 11px;height:32px;font-size:12.5px;font-weight:550;color:var(--mute);display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
    .seg button+button{border-left:1px solid var(--line2)}
    .seg button[aria-pressed="true"]{background:var(--raised);color:var(--fg)}
    .switch{position:relative;width:36px;height:20px;border-radius:99px;background:var(--line2);border:0;flex:none;transition:background .15s}
    .switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:99px;background:var(--fg);transition:transform .15s}
    .switch[aria-checked="true"]{background:var(--accent)}
    .switch[aria-checked="true"]::after{transform:translateX(16px);background:var(--accent-ink)}
    .chk{width:16px;height:16px;accent-color:var(--accent)}
    input[type=range]{accent-color:var(--accent);width:100%}
    .pill{display:inline-flex;align-items:center;gap:6px;height:22px;padding:0 8px;border-radius:4px;font:600 11.5px var(--font-mono);white-space:nowrap}
    .pill.ok{color:var(--ok);background:var(--ok-soft)}
    .pill.bad{color:var(--bad);background:var(--bad-soft)}
    .pill.warn{color:var(--warn);background:var(--warn-soft)}
    .pill.heal{color:var(--heal);background:var(--heal-soft)}
    .pill.neutral{color:var(--mute);background:var(--raised)}
    .ptag{display:inline-flex;align-items:center;gap:8px;font-weight:550;font-size:13px;white-space:nowrap}
    .pbadge{width:20px;height:20px;border-radius:5px;display:grid;place-items:center;font:700 11px var(--font-mono);color:#0a0d12}
    .tscroll{overflow-x:auto}
    table.tbl{width:100%;border-collapse:collapse;min-width:880px}
    .tbl th{text-align:left;font:600 11px var(--font-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--dim);padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap;background:var(--surface)}
    .tbl td{padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:middle;font-size:13px}
    .tbl tbody tr:last-child td{border-bottom:0}
    .tbl tr.row{cursor:pointer}
    .tbl tr.row:hover td{background:rgba(255,255,255,.025)}
    .tbl tr.fresh td{animation:flash 1.8s ease-out}
    @keyframes flash{0%{background:var(--accent-soft)}100%{background:transparent}}
    .url{font-family:var(--font-mono);font-size:12px;color:var(--mute);max-width:320px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block}
    .sev-bad td:first-child{box-shadow:inset 2px 0 0 var(--bad)}
    .sev-warn td:first-child{box-shadow:inset 2px 0 0 var(--warn)}
    .code{font:12.5px/1.65 var(--font-mono);background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:12px 14px;overflow:auto;max-height:340px;white-space:pre;margin:0;color:#c9d2de}
    .code.wrapl{white-space:pre-wrap;word-break:break-all}
    .jk{color:#8ea3ff}.js{color:#7fdcb4}.jn{color:#f2b66c}.jb{color:#e58ad0}
    .dl{display:block;white-space:pre}
    .dl.add{color:var(--ok);background:var(--ok-soft)}.dl.del{color:var(--bad);background:var(--bad-soft)}.dl.ctx{color:var(--mute)}
    .kv{display:grid;grid-template-columns:minmax(120px,200px) minmax(0,1fr);gap:0;font:12px/1.5 var(--font-mono);border:1px solid var(--line);border-radius:6px;overflow:hidden}
    .kv>div{padding:6px 10px;border-bottom:1px solid var(--line);min-width:0;overflow-wrap:anywhere}
    .kv>div:nth-last-child(-n+2){border-bottom:0}
    .kv>div:nth-child(odd){color:var(--mute);background:rgba(255,255,255,.015)}
    .overlay{position:fixed;inset:0;background:rgba(3,5,8,.62);z-index:40;animation:fade .15s ease-out}
    .drawer{position:fixed;top:0;right:0;bottom:0;width:min(680px,100%);background:var(--surface);border-left:1px solid var(--line2);z-index:41;display:flex;flex-direction:column;animation:slide .2s ease-out;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
    .drawer-body{overflow-y:auto;flex:1;padding:18px max(16px,env(safe-area-inset-right,0px)) 32px 18px}
    @keyframes fade{from{opacity:0}}
    @keyframes slide{from{transform:translateX(24px);opacity:0}}
    .sec{margin-top:24px}
    .sec h3{margin:0 0 10px;font:600 11px var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--dim);display:flex;align-items:center;justify-content:space-between;gap:8px}
    .callout{border:1px solid var(--line2);border-radius:8px;padding:12px 14px;background:var(--raised)}
    .callout.bad{border-color:rgba(255,99,112,.3);background:var(--bad-soft)}
    .callout.heal{border-color:rgba(76,201,240,.3);background:var(--heal-soft)}
    .tl{position:relative;padding-left:22px;display:flex;flex-direction:column;gap:14px}
    .tl::before{content:"";position:absolute;left:6px;top:6px;bottom:6px;width:1px;background:var(--line2)}
    .tl-i{position:relative}
    .tl-i .node{position:absolute;left:-22px;top:3px;width:13px;height:13px;border-radius:99px;border:2px solid var(--surface);background:var(--dim)}
    .node.ok{background:var(--ok)}.node.bad{background:var(--bad)}.node.warn{background:var(--warn)}.node.heal{background:var(--heal)}
    .term{background:#05070a;border:1px solid var(--line);border-radius:8px;font:12.5px/1.6 var(--font-mono);overflow:hidden;display:flex;flex-direction:column;min-width:0}
    .term-bar{display:flex;align-items:center;gap:8px;padding:9px 12px;border-bottom:1px solid var(--line);color:var(--dim);font-size:11.5px;background:var(--surface)}
    .term-body{padding:12px 14px;height:440px;overflow:auto;white-space:pre-wrap;word-break:break-word}
    .tl-cmd{color:var(--accent)}.tl-info{color:var(--fg)}.tl-dim{color:var(--dim)}.tl-ok{color:var(--ok)}.tl-bad{color:var(--bad)}.tl-wait{color:var(--warn)}
    .caret{display:inline-block;width:8px;height:14px;background:var(--fg);vertical-align:-2px;animation:pulse 1s steps(1) infinite}
    .meter{height:4px;background:var(--line2);border-radius:99px;overflow:hidden}
    .meter>i{display:block;height:100%;background:var(--accent)}
    .steps{display:flex;flex-direction:column;gap:6px;font:12px var(--font-mono)}
    .toasts{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:60;display:flex;flex-direction:column;gap:8px;align-items:center;width:min(440px,calc(100% - 32px));pointer-events:none}
    .toast{pointer-events:auto;background:#1a212b;border:1px solid var(--line2);border-radius:8px;padding:10px 14px;font-size:13px;display:flex;gap:10px;align-items:center;width:100%;box-shadow:0 10px 30px rgba(0,0,0,.45);animation:slide .2s ease-out}
    .empty{padding:34px 16px;text-align:center;color:var(--mute)}
    .footer{border-top:1px solid var(--line);margin-top:40px;padding-block:22px;color:var(--dim);font-size:12.5px}
    hr.sep{border:0;border-top:1px solid var(--line);margin:0}
    .spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
  </style>
</head>
<body>
<div id="root"></div>

<script>
(function(){
'use strict';
var useState=React.useState,useEffect=React.useEffect,useRef=React.useRef,useCallback=React.useCallback;
var html=htm.bind(React.createElement);

var rnd=function(a,b){return Math.floor(Math.random()*(b-a+1))+a};
var pick=function(a){return a[Math.floor(Math.random()*a.length)]};
var chars=function(set,n){var s='';for(var i=0;i<n;i++)s+=set[rnd(0,set.length-1)];return s};
var hex=function(n){return chars('0123456789abcdef',n)};
var b62=function(n){return chars('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',n)};
var digits=function(n){return chars('0123456789',n)};
var uuid=function(){return hex(8)+'-'+hex(4)+'-4'+hex(3)+'-a'+hex(3)+'-'+hex(12)};
var sleep=function(ms){return new Promise(function(r){setTimeout(r,ms)})};
var fmtMs=function(ms){return ms==null?'\\u2014':ms>=1000?(ms/1000).toFixed(2)+' s':Math.round(ms)+' ms'};
var money=function(n){return '$'+Math.round(n).toLocaleString('en-US')};
var clock=function(ts){return new Date(ts).toLocaleTimeString('en-GB',{hour12:false})};
var ago=function(ts,now){var s=Math.max(0,Math.round((now-ts)/1000));return s<5?'just now':s<60?s+'s ago':s<3600?Math.floor(s/60)+'m ago':Math.floor(s/3600)+'h ago'};
var host=function(u){return u.replace(/^https?:\\/\\//,'')};
var iso=function(ts){return new Date(ts).toISOString()};

var PEOPLE=[['Amara','Okafor'],['Tunde','Bello'],['Chidi','Eze'],['Fatima','Yusuf'],['Kelechi','Nwosu'],['Ngozi','Adeyemi'],['Sam','Walker'],['Priya','Nair'],['Lena','Fischer'],['Omar','Haddad']];
var person=function(){var p=pick(PEOPLE);return{first:p[0],last:p[1],name:p[0]+' '+p[1],email:(p[0]+'.'+p[1]).toLowerCase()+'@'+pick(['gmail.com','fastmail.com','northwind.ng','haildesk.com']),code:'CUS_'+b62(11).toLowerCase()}};
var ip=function(){return rnd(34,197)+'.'+rnd(1,254)+'.'+rnd(1,254)+'.'+rnd(1,254)};

var copyText=function(t){
  return (navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(function(){return true},function(){
    try{var ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;opacity:0;top:0';document.body.appendChild(ta);ta.select();var ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}
  });
};
var esc=function(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')};
var hl=function(o,raw){
  var s=raw?JSON.stringify(o):JSON.stringify(o,null,2);
  return esc(s).replace(/("(?:\\\\.|[^"\\\\])*")(\\s*:)?|\\b(true|false|null)\\b|(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)/g,function(m,s1,c,b,n){
    if(s1)return c?'<span class="jk">'+s1+'</span>'+c:'<span class="js">'+s1+'</span>';
    if(b)return '<span class="jb">'+b+'</span>';
    return '<span class="jn">'+n+'</span>';
  });
};

function Icon(p){
  var node=(window.lucide&&lucide.icons&&lucide.icons[p.name])||null;
  var kids=node?node[2]:[];
  return React.createElement('svg',{width:p.size||16,height:p.size||16,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:p.stroke||2,strokeLinecap:'round',strokeLinejoin:'round',className:p.className,'aria-hidden':'true',style:{flex:'none'}},
    kids.map(function(k,i){var a=Object.assign({key:i},k[1]);return React.createElement(k[0],a)}));
}

var PROV={
  paystack:{name:'Paystack',letter:'P',color:'#4db8f0'},
  nomba:{name:'Nomba',letter:'N',color:'#ffb703'},
  stripe:{name:'Stripe',letter:'S',color:'#a597ff'},
  monnify:{name:'Monnify',letter:'M',color:'#ff9366'},
  shopify:{name:'Shopify',letter:'H',color:'#a9cf72'},
  github:{name:'GitHub',letter:'G',color:'#c9d1d9'}
};
var CLS_BY_PROV={paystack:'schema',nomba:'schema',monnify:'timeout',shopify:'locked',stripe:'secret'};
var RULE={schema:'paystack-amount-remap',timeout:'extended-timeout-backoff',locked:'hold-until-healthy',secret:'resign-with-new-secret'};
var FAIL={
  schema:{code:422,text:'Unprocessable Entity',ms:[38,64],resp:function(){return{error:'validation_failed',message:'Missing required field: data.total_amount',fields:[{path:'data.total_amount',rule:'required'}],request_id:'req_'+hex(8)}}},
  timeout:{code:504,text:'Gateway Timeout',ms:[10000,10000],resp:function(){return{error:'upstream_timeout',message:'No response from destination within 10000 ms',gateway:'jumcart-edge-lhr1'}}},
  locked:{code:503,text:'Service Unavailable',ms:[22,45],resp:function(){return{error:'service_unavailable',message:'Store is in maintenance mode. Orders API locked until 02:00 UTC.',retry_after:1800}}},
  secret:{code:401,text:'Unauthorized',ms:[18,40],resp:function(){return{error:'invalid_signature',message:'No signatures found matching expected signature for payload'}}}
};
var ATT={schema:3,timeout:5,locked:5,secret:3};
var ACK={paystack:{received:true},nomba:{status:'success'},stripe:{received:true},monnify:{status:'ok'},shopify:{ok:true},github:{ok:true}};

var DIAG={
  schema:{title:'Payload Schema Mismatch',icon:'Shuffle',conf:97,scope:'Paystack \\u2192 api.myapp.com/webhooks/payment',
    diagnosis:function(n){return 'Your endpoint now expects the payment amount in a field called data.total_amount in naira instead of kobo. Paystack still sends data.amount in kobo. Your server rejected '+n+' events with a 422 because the new field was missing. The payments themselves are fine.'},
    patch:[{t:'ctx',s:'rule paystack-amount-remap'},{t:'ctx',s:'  match  source == "paystack" and event == "charge.success"'},{t:'del',s:'- data.amount          // kobo, integer'},{t:'add',s:'+ data.total_amount    // naira = data.amount / 100'},{t:'ctx',s:'  keep   data.reference, data.currency, data.customer.email'}],
    steps:['Testing rule on 20 saved payloads','Compiling transform','Deploying to 14 edge regions','Replaying failed events']},
  timeout:{title:'Network Timeout',icon:'Timer',conf:94,scope:'Monnify \\u2192 billing.northwind.ng/hooks/monnify',
    diagnosis:function(n){return 'billing.northwind.ng took longer than 10 seconds to answer '+n+' events. Retrying with idempotency is safe.'},
    patch:[{t:'ctx',s:'rule extended-timeout-backoff'},{t:'del',s:'- timeout       10s'},{t:'add',s:'+ timeout       30s'},{t:'add',s:'+ backoff       2s x2, jitter 20%'}],
    steps:['Checking idempotency keys','Raising timeout to 30s','Deploying to edge regions','Replaying failed events']},
  locked:{title:'503 Gateway Locked',icon:'Lock',conf:91,scope:'Shopify \\u2192 orders.kola-store.com/api/shopify/hooks',
    diagnosis:function(n){return 'Your store is in maintenance mode and answers 503 until 02:00 UTC. Jumcart should hold these '+n+' events in queue until health check answers 200.'},
    patch:[{t:'ctx',s:'rule hold-until-healthy'},{t:'add',s:'+ on 503      hold events in queue (max 24h)'},{t:'add',s:'+ probe       GET /health every 30s'}],
    steps:['Finding health URL','Creating hold queue','Deploying edge configuration','Releasing held events']},
  secret:{title:'Signature Secret Rotated',icon:'KeyRound',conf:96,scope:'Stripe \\u2192 api.myapp.com/webhooks/stripe',
    diagnosis:function(n){return 'Your server checks the signature with an old secret. '+n+' valid events refused with 401. Jumcart can sign the forwarded request again with your new secret.'},
    patch:[{t:'ctx',s:'rule resign-with-new-secret'},{t:'del',s:'- stripe-signature  v1=<signed with old_secret>'},{t:'add',s:'+ stripe-signature  v1=<signed with new_secret>'}],
    steps:['Verifying new secret','Re-signing payloads','Deploying to edge regions','Replaying failed events']}
};

var TPL={
  paystack:function(ts){
    var amt=pick([9900000,18000000,45000000,75000000]),c=person();
    return{type:'charge.success',usd:amt/100/1550,body:{event:'charge.success',data:{id:rnd(4000000000,4900000000),reference:'PSK_'+hex(10),amount:amt,currency:'NGN',customer:{first_name:c.first,last_name:c.last,email:c.email,customer_code:c.code}}},headers:{'content-type':'application/json','x-paystack-signature':hex(128)}};
  },
  nomba:function(ts){
    var amt=pick([15000,35000,75000]),c=person();
    return{type:'payment.success',usd:amt/1550,body:{event:'payment.success',data:{orderReference:'NMB_'+hex(8),amount:amt,currency:'NGN',customer:{email:c.email,name:c.name}}},headers:{'content-type':'application/json'}};
  },
  stripe:function(ts){
    var amt=pick([4900,9900,19900]),c=person();
    return{type:'payment_intent.succeeded',usd:amt/100,body:{id:'evt_'+b62(24),type:'payment_intent.succeeded',data:{object:{id:'pi_'+b62(24),amount:amt,currency:'usd',receipt_email:c.email}}},headers:{'content-type':'application/json','stripe-signature':'t='+Math.floor(ts/1000)+',v1='+hex(64)}};
  },
  monnify:function(ts){
    var amt=pick([25000,48500,120000]),c=person();
    return{type:'SUCCESSFUL_TRANSACTION',usd:amt/1550,body:{eventType:'SUCCESSFUL_TRANSACTION',eventData:{transactionReference:'MNFY|'+digits(14),amountPaid:amt,customer:{email:c.email,name:c.name}}},headers:{'content-type':'application/json','monnify-signature':hex(128)}};
  },
  shopify:function(ts){
    var price=pick([24.5,48,84.5]),c=person();
    return{type:'orders/create',usd:price,body:{id:rnd(5e12,6e12),total_price:price.toFixed(2),currency:'USD',email:c.email},headers:{'content-type':'application/json','x-shopify-topic':'orders/create'}};
  },
  github:function(ts){
    return{type:'push',usd:0,body:{ref:'refs/heads/main',pusher:{name:'sjibo'}},headers:{'content-type':'application/json','x-github-event':'push'}};
  }
};

function makeEvent(ep,o){
  o=o||{};var ts=o.ts||Date.now(),status=o.status||'ok',cls=o.cls||null;
  var t=(TPL[ep.provider]||TPL.paystack)(ts);
  var headers=Object.assign({},t.headers,{host:'gateway.jumcart.com','x-forwarded-for':ip(),'x-jumcart-endpoint':ep.proxy,'x-jumcart-signature-verified':'true'});
  var ev={id:'evt_'+hex(10),provider:ep.provider,type:t.type,dest:ep.dest,epName:ep.name,ts:ts,usd:t.usd,headers:headers,body:t.body,cls:null,status:status,fresh:!!o.fresh,note:'',patched:false,replay:false};
  var okMs=rnd(14,38),ack=ACK[ep.provider]||{ok:true};
  if(status==='ok'){
    ev.latency=okMs;ev.attempts=[{n:1,code:200,text:'OK',ms:okMs,wait:0,at:0,ok:true}];ev.resp={code:200,body:ack};ev.note='Delivered on the first attempt.';
  }else if(status==='failed'){
    var f=FAIL[cls];ev.cls=cls;ev.attempts=[{n:1,code:f.code,text:f.text,ms:rnd(f.ms[0],f.ms[1]),wait:0,at:0,ok:false}];ev.latency=ev.attempts[0].ms;ev.resp={code:f.code,body:f.resp()};ev.note='Retries used up. Moved to the dead-letter queue.';
  }else if(status==='retrying'){
    ev.attempts=[{n:1,code:504,text:'Gateway Timeout',ms:10000,wait:0,at:0,ok:false},{n:2,pending:true,wait:8000,at:18000,ms:null}];ev.latency=null;ev.resp={code:504,body:FAIL.timeout.resp()};ev.note='Waiting 8.0 s before attempt 2.';
  }else if(status==='healed'){
    ev.cls=cls;ev.patched=true;ev.attempts=[{n:1,code:422,text:'Unprocessable',ms:40,wait:0,at:0,ok:false},{n:2,code:200,text:'OK',ms:okMs,wait:0,at:100,ok:true,kind:'patch'}];ev.latency=okMs;ev.resp={code:200,body:ack};ev.note='Fixed by rule '+RULE[cls]+' and delivered.';
  }
  return ev;
}

var EP_SEED=[
  {id:'ep1',name:'Payments',provider:'paystack',dest:'https://api.myapp.com/webhooks/payment',proxy:'gonze_live_839201',active:true,ev24h:18402,rate:99.91},
  {id:'ep2',name:'Haildesk Support Hooks',provider:'paystack',dest:'https://haildesk.com/api/webhooks/incoming',proxy:'haildesk_prod_01',active:true,ev24h:5240,rate:99.98},
  {id:'ep3',name:'Billing transfers',provider:'monnify',dest:'https://billing.northwind.ng/hooks/monnify',proxy:'gonze_live_702144',active:true,ev24h:6120,rate:99.74},
  {id:'ep4',name:'Store orders',provider:'shopify',dest:'https://orders.kola-store.com/api/shopify/hooks',proxy:'gonze_live_451907',active:true,ev24h:9377,rate:99.62},
  {id:'ep5',name:'Subscriptions',provider:'stripe',dest:'https://api.myapp.com/webhooks/stripe',proxy:'gonze_live_118563',active:true,ev24h:11890,rate:99.88}
];

function seedEvents(eps){
  var now=Date.now(),out=[],provs=['paystack','stripe','monnify','shopify','github'];
  for(var i=0;i<48;i++){
    var p=provs[i%provs.length],ep=eps.filter(function(e){return e.provider===p})[0]||eps[0];
    var isFail=(i===4||i===6||i===9||i===13||i===16);
    var isHealed=(i===8||i===21||i===30);
    var cls=CLS_BY_PROV[p]||'schema';
    out.push(makeEvent(ep,{ts:now-i*5200,status:isFail?'failed':isHealed?'healed':'ok',cls:isFail||isHealed?cls:null}));
  }
  return out;
}

function CopyBtn(p){
  var s=useState(false),done=s[0],setDone=s[1];
  return html\`<button className=\${\'btn \'+(p.small?\'btn-sm \':\'\')+(p.ghost?\'btn-ghost\':\'\')+(p.icon?\' btn-icon\':\'\')} onClick=\${function(e){e.stopPropagation();copyText(p.text).then(function(ok){setDone(ok?\'ok\':\'fail\');setTimeout(function(){setDone(false)},1600)})}}>
    <\${Icon} name=\${done===\'ok\'?\'Check\':\'Copy\'} size=\${p.small?13:15} />\${p.icon?\'\':(done===\'ok\'?\'Copied\':p.children||\'Copy\')}
  </button>\`;
}
function StatusPill(p){
  var e=p.e;
  if(e.status===\'ok\')return html\`<span className="pill ok"><span className="dot"></span>200 OK</span>\`;
  if(e.status===\'failed\')return html\`<span className="pill bad"><span className="dot"></span>\${e.resp.code} Failed</span>\`;
  if(e.status===\'retrying\')return html\`<span className="pill warn"><span className="dot pulse"></span>Retrying</span>\`;
  return html\`<span className="pill heal"><\${Icon} name="Sparkles" size=\${12} />Healed</span>\`;
}
function ProvTag(p){var d=PROV[p.p]||PROV.paystack;return html\`<span className="ptag"><span className="pbadge" style=\${\{background:d.color\}}>\${d.letter}</span>\${d.name}</span>\`}

function Spark(p){
  var w=116,h=34,pd=3,d=p.data,min=Math.min.apply(null,d),max=Math.max.apply(null,d),r=(max-min)||1;
  var pts=d.map(function(v,i){return[pd+i*(w-2*pd)/(d.length-1),h-pd-(v-min)/r*(h-2*pd)]});
  var line=pts.map(function(q){return q[0].toFixed(1)+\',\'+q[1].toFixed(1)}).join(\' \');
  var area=\'M\'+pts[0][0]+\',\'+h+\' L\'+line.split(\' \').join(\' L\')+\' L\'+pts[pts.length-1][0]+\',\'+h+\' Z\';
  var last=pts[pts.length-1];
  return html\`<svg width=\${w} height=\${h} viewBox=\${\'0 0 \'+w+\' \'+h} style=\${\{flex:\'none\'}} aria-hidden="true">
    <line x1="0" x2=\${w} y1=\${h/2} y2=\${h/2} stroke="var(--line)" strokeDasharray="2 3" />
    <path d=\${area} fill=\${p.color} opacity="0.14" />
    <polyline points=\${line} fill="none" stroke=\${p.color} strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx=\${last[0]} cy=\${last[1]} r="2.6" fill=\${p.color} />
  </svg>\`;
}

function Metric(p){
  return html\`<div className="metric">
    <div style=\${\{minWidth:0}}>
      <div className="eyebrow">\${p.label}</div>
      <div className="v">\${p.value}</div>
      <div className="s">\${p.sub}</div>
    </div>
    <\${Spark} data=\${p.data} color=\${p.color} />
  </div>\`;
}

function App(){
  var s1=useState(\'stream\'),tab=s1[0],setTab=s1[1];
  var s2=useState(EP_SEED),endpoints=s2[0],setEndpoints=s2[1];
  var s3=useState(function(){return seedEvents(EP_SEED)}),events=s3[0],setEvents=s3[1];
  var s4=useState(true),live=s4[0],setLive=s4[1];
  var s5=useState(null),openId=s5[0],setOpenId=s5[1];
  var s6=useState({schema:{status:\'pending\'},timeout:{status:\'pending\'},locked:{status:\'pending\'},secret:{status:\'pending\'}}),diags=s6[0],setDiags=s6[1];
  var s7=useState(Date.now()),now=s7[0],setNow=s7[1];
  var s8=useState([]),toasts=s8[0],setToasts=s8[1];
  var s9=useState({total:2418920,rev:48210,lat:24,rate:99.98,hist:{total:Array.from({length:30},function(){return rnd(12,28)}),rate:Array.from({length:30},function(){return 99.97+Math.random()*0.015}),rev:Array.from({length:30},function(_,i){return 47900+i*11}),lat:Array.from({length:30},function(){return 22+Math.random()*5})}}),m=s9[0],setM=s9[1];

  var toast=useCallback(function(msg,kind){
    var id=Date.now()+Math.random();
    setToasts(function(l){return l.concat([{id:id,msg:msg,kind:kind||\'info\'}]).slice(-3)});
    setTimeout(function(){setToasts(function(l){return l.filter(function(x){return x.id!==id})})},3600);
  },[]);

  useEffect(function(){
    var t=setInterval(function(){setNow(Date.now())},1000);
    return function(){clearInterval(t)};
  },[]);

  var openEv=openId?events.filter(function(e){return e.id===openId})[0]:null;
  var failedN=events.filter(function(e){return e.status===\'failed\'}).length;

  var approve=function(c){
    setDiags(function(prev){var n=Object.assign({},prev);n[c]={status:\'applied\'};return n});
    var count=0,rec=0;
    setEvents(function(prev){
      return prev.map(function(e){
        if(e.cls===c&&e.status===\'failed\'){
          count++;rec+=e.usd;
          return Object.assign({},e,{status:\'healed\',patched:true,note:\'Auto-repaired by \'+RULE[c]+\' and delivered.\'});
        }
        return e;
      });
    });
    setM(function(prev){return Object.assign({},prev,{rev:prev.rev+rec})});
    toast(\'Rule \'+RULE[c]+\' applied on 14 edge regions. Replayed \'+count+\' events.\',\'ok\');
  };

  return html\`<div>
    <header className="topbar">
      <div className="wrap">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3" style=\${\{paddingTop:14,paddingBottom:12}}>
          <div className="logo">
            <div className="logo-mark"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a0d18" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10a4.5 4.5 0 0 1-9 0"/><path d="M4 4h14"/></svg></div>
            <span className="logo-name">JumcartFlow</span>
            <span className="by">Autonomous Gateway</span>
          </div>
          <span className="netpill"><span className="dot pulse"></span>Network: 99.99% Operational</span>
        </div>
        <nav className="tabs">
          \${[[\'stream\',\'Live Stream\',\'Activity\'],[\'endpoints\',\'Endpoints & Proxies\',\'Webhook\'],[\'healing\',\'Self-Healing AI Logs\',\'Sparkles\'],[\'replay\',\'Replay Engine\',\'RotateCcw\'],[\'keys\',\'Settings & API Keys\',\'Settings\']].map(function(t){
            return html\`<button key=\${t[0]} className="tab" aria-selected=\${tab===t[0]} onClick=\${function(){setTab(t[0])}}>
              <\${Icon} name=\${t[2]} size=\${15} />\${t[1]}\${t[0]===\'healing\'&&failedN?html\`<span className="count">\${failedN}</span>\`:null}
            </button>\`;
          })}
        </nav>
      </div>
    </header>

    <main className="wrap" style=\${\{paddingTop:18}}>
      <section className="card grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" style=\${\{overflow:\'hidden\'}}>
        <div style=\${\{borderBottom:\'1px solid var(--line)\'}} className="xl:border-b-0 xl:border-r" id="m-total"><\${Metric} label="Events processed" value=\${\${m.total.toLocaleString()}} sub="last 30 days" data=\${m.hist.total} color="var(--accent)" /></div>
        <div style=\${\{borderBottom:\'1px solid var(--line)\'}} className="sm:border-l xl:border-l-0 xl:border-b-0 xl:border-r" id="m-rate"><\${Metric} label="Success rate" value=\${\${m.rate.toFixed(2)+\'%\'}} sub=\${\${failedN+\' open failures\'}} data=\${m.hist.rate} color="var(--ok)" /></div>
        <div style=\${\{borderBottom:\'1px solid var(--line)\'}} className="sm:border-b-0 xl:border-b-0 xl:border-r" id="m-rev"><\${Metric} label="Revenue saved" value=\${\${money(m.rev)}} sub="recovered from dropped events" data=\${m.hist.rev} color="var(--heal)" /></div>
        <div className="sm:border-l xl:border-l" id="m-lat"><\${Metric} label="Avg gateway latency" value=\${\${m.lat.toFixed(0)+\' ms\'}} sub="p50, edge regions" data=\${m.hist.lat} color="var(--warn)" /></div>
      </section>

      <div style=\${\{marginTop:16}}>
        \${tab===\'stream\'?html\`<div className="card">
          <div className="card-h">
            <h2>Live webhook stream</h2>
            <div className="flex gap-2">
              <button className="btn btn-sm" onClick=\${function(){setLive(!live)}}><\${Icon} name=\${live?\'Pause\':\'Play\'} size=\${13} />\${live?\'Pause\':\'Resume\'}</button>
            </div>
          </div>
          <div className="tscroll">
            <table className="tbl">
              <thead><tr><th>Status</th><th>Event type</th><th>Source</th><th>Destination URL</th><th style=\${\{textAlign:\'right\'}}>Latency</th><th>Timestamp</th></tr></thead>
              <tbody>
                \${events.map(function(x){
                  return html\`<tr key=\${x.id} className="row" onClick=\${function(){setOpenId(x.id)}}>
                    <td><\${StatusPill} e=\${x} /></td>
                    <td><span className="mono" style=\${\{fontSize:12.5}}>\${x.type}</span></td>
                    <td><\${ProvTag} p=\${x.provider} /></td>
                    <td><span className="url">\${host(x.dest)}</span></td>
                    <td className="mono" style=\${\{textAlign:\'right\'}}>\${fmtMs(x.latency)}</td>
                    <td className="mono t-mute" style=\${\{fontSize:12}}>\${clock(x.ts)} <span className="t-dim">\\u00b7 \${ago(x.ts,now)}</span></td>
                  </tr>\`;
                })}
              </tbody>
            </table>
          </div>
        </div>\`:null}

        \${tab===\'endpoints\'?html\`<div className="card">
          <div className="card-h"><h2>Active Proxy Endpoints (\${endpoints.length})</h2></div>
          <div className="tscroll">
            <table className="tbl">
              <thead><tr><th>Name</th><th>Proxy Inbound URL</th><th>Forward Destination</th><th>Status</th></tr></thead>
              <tbody>
                \${endpoints.map(function(ep){
                  return html\`<tr key=\${ep.id}>
                    <td><strong>\${ep.name}</strong></td>
                    <td className="mono t-acc">https://jumcart-gateway.vercel.app/api/p/\${ep.proxy}</td>
                    <td className="mono t-mute">\${ep.dest}</td>
                    <td><span className="pill ok">Active</span></td>
                  </tr>\`;
                })}
              </tbody>
            </table>
          </div>
        </div>\`:null}

        \${tab===\'healing\'?html\`<div className="grid gap-4">
          \${[\'schema\',\'timeout\',\'locked\',\'secret\'].map(function(c){
            var d=DIAG[c],st=diags[c],open=events.filter(function(e){return e.cls===c&&e.status===\'failed\'});
            return html\`<section key=\${c} className="card">
              <div className="card-h">
                <div className="flex items-center gap-3">
                  <div style=\${\{fontWeight:650,fontSize:15}}>\${d.title}</div>
                  <div className="mono t-dim" style=\${\{fontSize:11.5}}>\${d.scope}</div>
                </div>
                <span className=\${\'pill \'+(st.status===\'applied\'?\'ok\':\'bad\')}>\${st.status===\'applied\'?\'Rule Live\':open.length+\' failed\'}</span>
              </div>
              <div className="card-b grid gap-3">
                <div className="callout"><p style=\${\{margin:0}}>\${d.diagnosis(open.length||3)}</p></div>
                <pre className="code">\${d.patch.map(function(l,i){return html\`<span key=\${i} className=\${\'dl \'+l.t}>\${l.s}</span>\`})}</pre>
                <div>
                  \${st.status===\'applied\'
                    ?html\`<span className="t-ok mono"><\${Icon} name="Check" size=\${14} /> Rule is active on the edge router.</span>\`
                    :html\`<button className="btn btn-ok" onClick=\${function(){approve(c)}}><\${Icon} name="Check" />Approve & Replay (\${open.length})</button>\`}
                </div>
              </div>
            </section>\`;
          })}
        </div>\`:null}

        \${tab===\'replay\'?html\`<div className="card">
          <div className="card-h"><h2>Replay Engine Console</h2></div>
          <div className="card-b">
            <div className="term">
              <div className="term-bar"><\${Icon} name="Terminal" size=\${14} /><span className="mono">jumcart replay</span></div>
              <div className="term-body">
                <div className="tl-dim">jumcart-cli 2.4.1 \\u00b7 edge replay engine ready.</div>
                <div className="tl-ok">✓ Haildesk proxy endpoint verified and connected.</div>
                <div className="tl-cmd">$ jumcart replay --ready</div>
                <span className="caret"></span>
              </div>
            </div>
          </div>
        </div>\`:null}

        \${tab===\'keys\'?html\`<div className="card">
          <div className="card-h"><h2>API Keys & Ingestion Secrets</h2></div>
          <div className="card-b space-y-3 mono" style=\${\{fontSize:13}}>
            <div>Active Signing Secret: <span className="t-acc">whsec_live_994a8f9021e84c9823ae77</span></div>
            <div>PostgreSQL Storage: <span className="t-ok">Connected to Supabase Realtime</span></div>
          </div>
        </div>\`:null}
      </div>
    </main>

    <footer className="wrap footer">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>© 2026 JumcartFlow. All rights reserved.</span>
        <span className="mono">Operated by JumcartFlow</span>
      </div>
    </footer>

    \${openEv?html\`<div>
      <div className="overlay" onClick=\${function(){setOpenId(null)}}></div>
      <aside className="drawer">
        <div style=\${\{padding:\'14px 18px\',borderBottom:\'1px solid var(--line)\',display:\'flex\',alignItems:\'center\',justifyContent:\'space-between\'}}>
          <span className="mono t-mute">\${openEv.id}</span>
          <button className="btn btn-ghost btn-sm" onClick=\${function(){setOpenId(null)}}><\${Icon} name="X" /></button>
        </div>
        <div className="drawer-body">
          <h3 className="mono" style=\${\{fontSize:18,margin:0}}>\${openEv.type}</h3>
          <div className="sec"><h3>Raw Payload Body</h3><pre className="code">\${JSON.stringify(openEv.body,null,2)}</pre></div>
          <div className="sec"><h3>Destination Response</h3><pre className="code">\${JSON.stringify(openEv.resp,null,2)}</pre></div>
        </div>
      </aside>
    </div>\`:null}

    <div className="toasts">
      \${toasts.map(function(t){
        return html\`<div key=\${t.id} className="toast"><\${Icon} name=\${t.kind===\'ok\'?\'CheckCircle2\':\'Info\'} size=\${16} className=\${t.kind===\'ok\'?\'t-ok\':\'t-acc\'} /><span>\${t.msg}</span></div>\`;
      })}
    </div>
  </div>\`;
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
})();
</script>
</body>
</html>`;

  return (
    <iframe
      srcDoc={htmlContent}
      style={{
        width: '100vw',
        height: '100vh',
        border: 'none',
        display: 'block',
        margin: 0,
        padding: 0,
        backgroundColor: '#090b0f'
      }}
      title="JumcartFlow"
    />
  );
}
