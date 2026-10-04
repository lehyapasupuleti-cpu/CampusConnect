import {useState,useEffect} from "react";
const CATS=["All","Technical","Cultural","Sports","Workshop","Hackathon","Seminar","Club"];
const SEED=[
{id:1,title:"Annual Tech Fest 2026",cat:"Technical",date:"2026-11-20",venue:"Main Auditorium",seats:300,reg:212,desc:"Two days of tech talks, demos and contests."},
{id:2,title:"Code Storm Hackathon",cat:"Hackathon",date:"2026-11-14",venue:"CSE Lab Block",seats:120,reg:96,desc:"24-hour hackathon. Build something useful."},
{id:3,title:"Rhythm Night",cat:"Cultural",date:"2026-12-02",venue:"Open Air Theatre",seats:500,reg:140,desc:"Music, dance and drama performances."},
{id:4,title:"Inter-Dept Cricket Cup",cat:"Sports",date:"2026-11-25",venue:"College Ground",seats:200,reg:88,desc:"Knockout cricket tournament."},
{id:5,title:"React Workshop",cat:"Workshop",date:"2026-11-10",venue:"Seminar Hall 2",seats:80,reg:60,desc:"Hands-on React from scratch."},
{id:6,title:"AI in Careers Seminar",cat:"Seminar",date:"2026-10-28",venue:"Mini Hall",seats:150,reg:70,desc:"Industry experts talk about AI careers."}];
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const days=d=>Math.max(0,Math.ceil((new Date(d)-new Date())/864e5));
function QR({seed}){let h=0;for(const c of seed)h=(h*31+c.charCodeAt(0))>>>0;const n=21,r=[];
for(let y=0;y<n;y++)for(let x=0;x<n;x++){let on;const f=(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);
if(f){const lx=x%(n-7>x?7:n-7+0)-(x>=n-7?0:0),ax=x>=n-7?x-(n-7):x,ay=y>=n-7?y-(n-7):y;on=Math.max(Math.abs(ax-3),Math.abs(ay-3))!==2}
else{h=(h*1103515245+12345)>>>0;on=(h>>16)&1}
if(on)r.push(<rect key={x+"-"+y} x={x} y={y} width="1" height="1" fill="#14163a"/>)}
return <svg width="150" height="150" viewBox={`0 0 ${n} ${n}`}>{r}</svg>}
export default function App(){
const [events,setEvents]=useState(()=>ld("cc_events",SEED));
const [regs,setRegs]=useState(()=>ld("cc_regs",[]));
const [favs,setFavs]=useState(()=>ld("cc_favs",[]));
const [dark,setDark]=useState(()=>ld("cc_dark",false));
const [page,setPage]=useState("home");const [cat,setCat]=useState("All");const [q,setQ]=useState("");
const [sel,setSel]=useState(null);const [pass,setPass]=useState(null);const [toast,setToast]=useState("");
const [nf,setNf]=useState({title:"",cat:"Technical",date:"",venue:"",seats:100});
const [f,setF]=useState({name:"",roll:"",dept:"",year:"1",email:"",phone:""});
useEffect(()=>{try{localStorage.setItem("cc_events",JSON.stringify(events));localStorage.setItem("cc_regs",JSON.stringify(regs));localStorage.setItem("cc_favs",JSON.stringify(favs));localStorage.setItem("cc_dark",JSON.stringify(dark))}catch(e){}},[events,regs,favs,dark]);
const say=m=>{setToast(m);setTimeout(()=>setToast(""),2200)};
const isReg=id=>regs.some(r=>r.eventId===id);
const list=events.filter(e=>(cat==="All"||e.cat===cat)&&e.title.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>a.date.localeCompare(b.date));
const tf=id=>setFavs(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id]);
const open=e=>{setSel(e);setPage("details")};
const submit=ev=>{ev.preventDefault();const r={...f,eventId:sel.id,at:Date.now()};setRegs([...regs,r]);setEvents(events.map(e=>e.id===sel.id?{...e,reg:e.reg+1}:e));setPass(r);say("Registration successful 🎉");setPage("pass")};
const addEvent=ev=>{ev.preventDefault();setEvents([...events,{...nf,id:Date.now(),seats:+nf.seats,reg:0,desc:"New campus event."}]);setNf({title:"",cat:"Technical",date:"",venue:"",seats:100});say("Event created")};
const Card=({e})=><div className="card"><div className="row"><span className="tag">{e.cat.toUpperCase()}</span><button className="g" onClick={()=>tf(e.id)}>{favs.includes(e.id)?"❤️":"🤍"}</button></div>
<h3 style={{margin:"6px 0"}}>{e.title}</h3><div className="mu">📅 {e.date} · ⏳ {days(e.date)} days left</div><div className="mu">📍 {e.venue}</div>
<div className="mu" style={{margin:"8px 0 4px"}}>👥 {e.seats-e.reg} seats left</div><div className="bar"><i style={{width:Math.min(100,e.reg/e.seats*100)+"%"}}/></div>
<div className="row" style={{marginTop:10}}><button className="g" onClick={()=>open(e)}>Details</button>{isReg(e.id)?<span className="tag">Registered ✓</span>:<button className="b" onClick={()=>open(e)}>Register</button>}</div></div>;
const up=events.filter(e=>days(e.date)>0||e.date>=new Date().toISOString().slice(0,10)).length;
const my=regs.map(r=>({r,e:events.find(e=>e.id===r.eventId)})).filter(x=>x.e);
return <div className={"app "+(dark?"dark":"")}>
{toast&&<div className="toast">{toast}</div>}
<div className="top"><span className="logo">🎓 CampusConnect</span><button className="g" onClick={()=>setDark(!dark)}>{dark?"☀️":"🌙"}</button></div>
<div className="wrap">
{page==="home"&&<><div className="card hero"><div className="mu" style={{color:"#cfe"}}>Audisankara College of Engineering & Technology</div><h2 style={{margin:"6px 0"}}>Discover. Register. Celebrate.</h2><p>Featured: {list[0]?.title}</p><button className="b" style={{background:"#fff",color:"#4c1d95"}} onClick={()=>setPage("events")}>Browse events</button></div>
<h3>Upcoming events</h3><div className="grid">{[...events].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3).map(e=><Card key={e.id} e={e}/>)}</div></>}
{page==="events"&&<><input placeholder="🔍 Search events" value={q} onChange={e=>setQ(e.target.value)}/><div className="chips">{CATS.map(c=><button key={c} className={"chip "+(cat===c?"on":"")} onClick={()=>setCat(c)}>{c}</button>)}</div>
<div className="grid">{list.map(e=><Card key={e.id} e={e}/>)}</div>{!list.length&&<p className="mu">No events found.</p>}</>}
{page==="details"&&sel&&<div className="card"><button className="g" onClick={()=>setPage("events")}>← Back</button><h2>{sel.title}</h2><p className="mu">{sel.desc}</p><p>📅 {sel.date} · 📍 {sel.venue} · 👥 {sel.seats-sel.reg} seats left</p>
{isReg(sel.id)?<p className="tag">You are registered ✓</p>:sel.reg>=sel.seats?<p>Event is full</p>:<form onSubmit={submit}><h3>Register</h3>
<input required placeholder="Student name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/><input required placeholder="Roll number" value={f.roll} onChange={e=>setF({...f,roll:e.target.value})}/>
<input required placeholder="Department" value={f.dept} onChange={e=>setF({...f,dept:e.target.value})}/><select value={f.year} onChange={e=>setF({...f,year:e.target.value})}>{[1,2,3,4].map(y=><option key={y} value={y}>Year {y}</option>)}</select>
<input required type="email" placeholder="Email" value={f.email} onChange={e=>setF({...f,email:e.target.value})}/><input required pattern="[0-9]{10}" placeholder="Phone (10 digits)" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>
<button className="b" style={{width:"100%",marginTop:8}}>Register</button></form>}</div>}
{page==="pass"&&pass&&<div className="card pass"><b>CAMPUSCONNECT</b><h3>{events.find(e=>e.id===pass.eventId)?.title}</h3><QR seed={pass.roll+pass.eventId}/><p>Student: {pass.name}<br/>Dept: {pass.dept} · Roll No: {pass.roll}</p><b>Registered ✓</b></div>}
{page==="my"&&<><h3>My Events</h3>{!my.length&&<p className="mu">No registrations yet.</p>}{my.map(({r,e})=><div className="card" key={e.id}><div className="row"><b>{e.title}</b><span className="tag">{days(e.date)>0?"Upcoming":"Completed"}</span></div><div className="mu">{e.date} · {e.venue} · Confirmed</div><button className="g" style={{marginTop:8}} onClick={()=>{setPass(r);setPage("pass")}}>🎟️ View pass</button></div>)}
<h3>Favorites</h3><div className="grid">{events.filter(e=>favs.includes(e.id)).map(e=><Card key={e.id} e={e}/>)}</div></>}
{page==="org"&&<><h3>Organizer Dashboard</h3><div className="stats"><div className="card stat"><b>{events.length}</b>Total events</div><div className="card stat"><b>{events.reduce((s,e)=>s+e.reg,0)}</b>Registered students</div><div className="card stat"><b>{up}</b>Upcoming</div><div className="card stat"><b>{events.length-up}</b>Completed</div></div>
<div className="card"><b>Registrations by event</b>{events.map(e=><div key={e.id} style={{margin:"10px 0"}}><div className="row mu"><span>{e.title}</span><span>{e.reg}/{e.seats}</span></div><div className="bar"><i style={{width:Math.min(100,e.reg/e.seats*100)+"%"}}/></div></div>)}</div>
<form className="card" onSubmit={addEvent}><b>Create event</b><input required placeholder="Title" value={nf.title} onChange={e=>setNf({...nf,title:e.target.value})}/><select value={nf.cat} onChange={e=>setNf({...nf,cat:e.target.value})}>{CATS.slice(1).map(c=><option key={c}>{c}</option>)}</select>
<input required type="date" value={nf.date} onChange={e=>setNf({...nf,date:e.target.value})}/><input required placeholder="Venue" value={nf.venue} onChange={e=>setNf({...nf,venue:e.target.value})}/><input type="number" min="1" value={nf.seats} onChange={e=>setNf({...nf,seats:e.target.value})}/><button className="b">Add event</button></form>
{events.map(e=><div className="card row" key={e.id}><span>{e.title}</span><button className="g" onClick={()=>{setEvents(events.filter(x=>x.id!==e.id));say("Event deleted")}}>🗑️</button></div>)}</>}
</div>
<div className="nav">{[["home","🏠","Home"],["events","📅","Events"],["my","❤️","My Events"],["org","👨‍💼","Organizer"]].map(([k,i,l])=><button key={k} className={page===k?"on":""} onClick={()=>setPage(k)}>{i}<br/>{l}</button>)}</div>
</div>}
