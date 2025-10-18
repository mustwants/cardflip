//PATH src/components/ProFlipCard/ProFlipCard.tsx
import { useEffect, useId, useMemo, useRef, useState } from "react";
import "./ProFlipCard.css";

type Social = { facebook?:string; instagram?:string; linkedin?:string; x?:string; bluesky?:string; pinterest?:string; youtube?:string; };
type Token  = { src:string; alt:string };
type GrabCorner = "top-left" | "top-right" | "bottom-right" | "bottom-left";

type Props = {
  name:string; title?:string; location?:string; website?:string; email?:string; phone?:string;
  about:string; headshotUrl:string; smallLogoUrl?:string;
  tokens?:Token[]; social?:Social;
  sponsorLogoUrl?:string; sponsorHref?:string; connectToEmail?:string;

  grabCorner?: GrabCorner;
  curlIntensity?: number;
  durationMs?: number;
  perspectivePx?: number;
  overshootDeg?: number;
  shadowPeak?: number;
  slices?: number;
  liftZPx?: number;
  diagonalTwistDeg?: number;
};

export default function ProFlipCard(p:Props){
  const {
    name,title,location,website,email,phone,about,headshotUrl,smallLogoUrl,
    tokens=[],social={},sponsorLogoUrl,sponsorHref,connectToEmail="MustWants@MustWants.com",
    grabCorner="bottom-right", curlIntensity=.9, durationMs=580, perspectivePx=1200, overshootDeg=6, shadowPeak=1.15, slices=12, liftZPx=30, diagonalTwistDeg=8
  } = p;

  const [showBack,setShowBack]=useState(false);
  const [animating,setAnimating]=useState(false);
  const [prog,setProg]=useState(0);
  const progRef=useRef(0);
  const rafRef=useRef<number|null>(null);
  const [isModalOpen,setIsModalOpen]=useState(false);
  const id=useId();
  const arcId=`${id}-arc`;

  const reduced = typeof window!=="undefined" && "matchMedia" in window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(()=>{ progRef.current=prog; },[prog]);

  useEffect(()=>{
    if(reduced){ setProg(showBack?1:0); setAnimating(false); return; }
    setAnimating(true);
    const target=showBack?1:0;
    const start=performance.now();
    const init=progRef.current;
    const dur=Math.max(1,durationMs);
    const ease=(t:number)=>{ const u=1-t; return 3*.2*u*u*t + 3*.7*u*t*t + .2*t*t*t; };
    const step=(now:number)=>{
      const t=Math.min(1,(now-start)/dur);
      const e=ease(t);
      const settle=e + (overshootDeg/180)*Math.sin(Math.PI*e)*(target>init?1:-1);
      const v=init + (target-init)*Math.max(0,Math.min(1,settle));
      setProg(v);
      if(t<1){ rafRef.current=requestAnimationFrame(step); } else { setAnimating(false); }
    };
    if(rafRef.current!==null) cancelAnimationFrame(rafRef.current);
    rafRef.current=requestAnimationFrame(step);
    return ()=>{ if(rafRef.current!==null) cancelAnimationFrame(rafRef.current); };
  },[showBack,durationMs,overshootDeg,reduced]);

  const [aboutFront,aboutBack]=useMemo(()=>{
    const limit=420, a=about.trim();
    if(a.length<=limit) return [a,""];
    const cut=a.lastIndexOf(". ",limit)+1 || limit;
    return [a.slice(0,cut).trim(), a.slice(cut).trim()];
  },[about]);

  const N=Math.max(10,Math.min(14,Math.round(slices)));
  const cells=useMemo(()=>Array.from({length:N*N},(_,k)=>({i:k%N,j:Math.floor(k/N)})),[N]);

  const start = grabCorner==="top-left"    ? [0,0]
              : grabCorner==="top-right"   ? [1,0]
              : grabCorner==="bottom-right"? [1,1]
              :                              [0,1];
  const end   = grabCorner==="top-left"    ? [1,1]
              : grabCorner==="top-right"   ? [0,1]
              : grabCorner==="bottom-right"? [0,0]
              :                              [1,0];
  const len = Math.hypot(end[0]-start[0], end[1]-start[1]) || 1;
  const dir = [(end[0]-start[0])/len, (end[1]-start[1])/len];
  const nrm = [-dir[1], dir[0]];

  const envBell=Math.sin(Math.PI*prog);
  const envPhaseB=Math.max(0,Math.min(1,(prog-0.2)/0.5));
  const twist=diagonalTwistDeg*envPhaseB;
  const liftZ=liftZPx*envBell;

  const sigma=0.18;
  const ampBase=18*curlIntensity;
  const tzBase=28*curlIntensity;
  const rzBase=3*curlIntensity;

  const curlFor=(i:number,j:number)=>{
    const u=(i+0.5)/N, v=(j+0.5)/N;
    const rel=[u-start[0], v-start[1]];
    const tAlong=Math.min(1,Math.max(0,rel[0]*dir[0]+rel[1]*dir[1]));
    const ridge=[start[0]+dir[0]*prog, start[1]+dir[1]*prog];
    const relR=[u-ridge[0], v-ridge[1]];
    const distPerp=Math.abs(relR[0]*nrm[0]+relR[1]*nrm[1]);
    const gauss=Math.exp(-(distPerp*distPerp)/(2*sigma*sigma))*envBell;
    const leadBias=0.6+0.4*Math.cos(Math.PI*(tAlong-prog));
    const w=gauss*leadBias;
    const sign=prog<.5?1:-1;
    const ry=(ampBase*w)*sign;
    const tz=tzBase*w;
    const rz=rzBase*w*(grabCorner.includes("right")?-1:1);
    return `translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
  };

  const shadowBiasX=(grabCorner.includes("right")?1:-1)*6*envBell;
  const shadowBiasY=(grabCorner.includes("bottom")?1:-1)*6*envBell;
  const shadowScale=1+(shadowPeak-1)*envBell;

  const flip=()=>{ if(!animating) setShowBack(v=>!v); };
  const onKey=(e:React.KeyboardEvent)=>{ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); flip(); } };

  const cardRotateY = reduced ? (showBack?180:0) : prog*180;
  const cardRotateX = reduced ? 0 : twist;
  const cardTranslateZ = reduced ? 0 : liftZ;

  const soc = [
    {k:"facebook",href:social.facebook,l:"Facebook",svg:icon("facebook")},
    {k:"instagram",href:social.instagram,l:"Instagram",svg:icon("instagram")},
    {k:"linkedin",href:social.linkedin,l:"LinkedIn",svg:icon("linkedin")},
    {k:"x",href:social.x,l:"X",svg:icon("x")},
    {k:"bluesky",href:social.bluesky,l:"Bluesky",svg:icon("bluesky")},
    {k:"pinterest",href:social.pinterest,l:"Pinterest",svg:icon("pinterest")},
    {k:"youtube",href:social.youtube,l:"YouTube",svg:icon("youtube")},
  ];

  const isEdge = prog>0.45 && prog<0.55;

  return (
    <div className="pcard-stage" style={{perspective:`${perspectivePx}px`}}>
      <div
        className={`pcard ${prog>0.5?"is-flipped":""} ${animating?"is-animating":""}`}
        data-face={showBack ? "back" : "front"}
        data-edge={isEdge ? "true" : "false"}
        style={{
          transform:`translateZ(${cardTranslateZ}px) rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg)`,
          filter:`drop-shadow(${shadowBiasX}px ${24+shadowBiasY}px ${40/shadowScale}px rgba(0,0,0,.5))`,
        }}
        aria-describedby={`${id}-help`}
      >
        {/* FRONT */}
        <section className="pcard-face pcard-front" aria-label="Front">
          <div className="pcard-banner-top">
            <div className="pcard-banner-tokens">
              {tokens.map((t,i)=>(<img key={i} className="pcard-token" src={t.src} alt={t.alt}/>))}
            </div>
          </div>
          <div className="pcard-ribbon"></div>
          <div className="pcard-banner"></div>

          <header className="pcard-top pcard-top--below">
            <div className="pcard-avatar-wrap">
              <img className="pcard-avatar" src={headshotUrl} alt={`${name} headshot`} />
              {/* Curved banner hugging the avatar circle */}
              <svg className="pcard-avatar-arc" viewBox="0 0 106 106" aria-hidden="true">
                <defs>
                  {/* Bottom arc from right→left near the rim */}
                  <path id={arcId} d="M 86 86 A 46 46 0 0 1 20 86" />
                </defs>
                {/* Ribbon stroke behind the text */}
                <use href={`#${arcId}`} className="arc-stroke" />
                <text className="arc-text">
                  <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">
                    Real Estate Agent
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="pcard-id">
              <h2 className="pcard-name">{name}</h2>
              {title && <p className="pcard-title">{title}</p>}
              {location && <p className="pcard-loc">{location}</p>}
              {website && <a className="pcard-website" href={website} target="_blank" rel="noopener noreferrer">{website}</a>}
              <div className="pcard-social">
                {soc.map(s=>s.href
                  ? <a key={s.k} className="pcard-soc" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.l}>{s.svg}</a>
                  : <span key={s.k} className="pcard-soc is-disabled" aria-hidden="true">{s.svg}</span>)}
              </div>
            </div>
            {smallLogoUrl && <img className="pcard-logo" src={smallLogoUrl} alt="Brokerage logo" />}
          </header>

          <div className="pcard-body">
            <div className="pcard-cta-row">
              {email   && <a className="pcard-btn" href={`mailto:${email}`}>Email</a>}
              {website && <a className="pcard-btn" href={website} target="_blank" rel="noopener noreferrer">Website</a>}
              {phone   && <a className="pcard-btn" href={`tel:${phone.replace(/\s+/g,"")}`}>Call</a>}
            </div>

            <div className="pcard-about">
              <h4>About</h4>
              <p>{aboutFront}</p>
              {aboutBack && <p className="pcard-continued">Continued on back…</p>}
            </div>
          </div>

          <div className="pcard-footer">
            <button className="pcard-btn" onClick={()=>setIsModalOpen(true)}>Connect with {name.split(" ")[0]}</button>
            <button
              className="pcard-btn flip-btn"
              aria-pressed={showBack}
              data-selected={showBack}
              onClick={flip}
              onKeyDown={onKey}
              disabled={animating}
            >{showBack ? "Flip Back" : "Flip"}</button>
          </div>

          <div className="pcard-mesh" aria-hidden="true">
            {cells.map(({i,j})=>(
              <div key={`${i}-${j}`} className="pcard-cell"><div className="pcard-cell-inner" style={{transform:curlFor(i,j)}}/></div>
            ))}
          </div>
        </section>

        {/* BACK */}
        <section className="pcard-face pcard-back" aria-label="Back">
          <div className="pcard-banner-top"></div>
          <div className="pcard-ribbon"></div>
          <div className="pcard-banner"></div>

          <h3 className="pcard-back-name">{name}</h3>
          {title && <p className="pcard-back-title">{title}</p>}

          <div className="pcard-about pcard-about-back">
            {aboutBack ? <p>{aboutBack}</p> : <p>No additional information.</p>}
          </div>

          <div className="pcard-sponsor">
            <span>Recommended by:</span>
            {sponsorHref
              ? <a className="pcard-btn small" href={sponsorHref} target="_blank" rel="noopener noreferrer">
                  {sponsorLogoUrl ? <img src={sponsorLogoUrl} alt="Sponsor"/> : "Visit"}
                </a>
              : sponsorLogoUrl ? <img src={sponsorLogoUrl} alt="Sponsor"/> : null}
          </div>

          <div className="pcard-footer">
            <button className="pcard-btn" onClick={()=>setIsModalOpen(true)}>Connect with {name.split(" ")[0]}</button>
            <button
              className="pcard-btn flip-btn"
              aria-pressed={showBack}
              data-selected={showBack}
              onClick={flip}
              onKeyDown={onKey}
              disabled={animating}
            >{showBack ? "Flip Back" : "Flip"}</button>
          </div>

          <div className="pcard-mesh" aria-hidden="true">
            {cells.map(({i,j})=>(
              <div key={`${i}-${j}`} className="pcard-cell"><div className="pcard-cell-inner" style={{transform:curlFor(i,j)}}/></div>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && <ConnectModal toEmail={connectToEmail} personName={name} onClose={()=>setIsModalOpen(false)} />}
      <p id={`${id}-help`} className="sr-only">Flip toggles with one tap. Back is opaque and interactive. Enter/Space supported. Reduced-motion swaps instantly.</p>
    </div>
  );
}

function ConnectModal({toEmail,personName,onClose}:{toEmail:string;personName:string;onClose:()=>void}){
  const [first,setFirst]=useState(""); const [last,setLast]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
  const send=()=>{
    const subject=encodeURIComponent(`Connect with ${personName}`);
    const body=encodeURIComponent(`Please connect me with ${personName}.\n\nFirst Name: ${first}\nLast Name: ${last}\nEmail: ${email}\nPhone: ${phone}\n\nSource: ${location.href}`);
    window.location.href=`mailto:${toEmail}?subject=${subject}&body=${body}`;
    onClose();
  };
  return (
    <div className="mw-modal" role="dialog" aria-modal="true">
      <div className="mw-overlay" onClick={onClose} />
      <div className="mw-modal-card">
        <h3>Connect with {personName}</h3>
        <div className="mw-form">
          <label>First Name<input value={first} onChange={e=>setFirst(e.target.value)} /></label>
          <label>Last Name <input value={last} onChange={e=>setLast(e.target.value)} /></label>
          <label>Email     <input value={email} onChange={e=>setEmail(e.target.value)} type="email" /></label>
          <label>Phone     <input value={phone} onChange={e=>setPhone(e.target.value)} /></label>
        </div>
        <div className="mw-actions">
          <button className="pcard-btn small" onClick={onClose} type="button">Cancel</button>
          <button className="pcard-btn small" onClick={send} type="button" disabled={!(first&&last&&email)}>Send</button>
        </div>
      </div>
    </div>
  );
}

function icon(name:string){
  const P=(d:string)=><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={d}/></svg>;
  switch(name){
    case "facebook": return P("M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.2c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12Z");
    case "instagram": return P("M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z");
    case "linkedin":  return P("M6.9 21H3V8h3.9v13ZM5 6.3A2.3 2.3 0 1 1 5 1.7 2.3 2.3 0 0 1 5 6.3ZM22 21h-3.8v-6.3c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21h-3.8V8H14v1.8c.5-.7 1.4-1.8 3.4-1.8 2.5 0 4.6 1.6 4.6 5.2V21Z");
    case "x":         return P("M17.5 3H21l-8.3 9.5L21.7 21h-6L11 14.8 6 21H3l8.9-10.2L3.6 3h6l4.1 5.9L17.5 3Z");
    case "bluesky":   return P("M12 9.5c2.9-4.3 7.6-6.3 8.9-4.9 1.3 1.3-.7 6-4.9 8.9 4.3 2.9 6.3 7.6 4.9 8.9s-6-1-8.9-5c-2.9 4-7.6 6.3-8.9 5C1.8 21 3.8 16.3 8 13.4 3.8 10.5 1.8 5.8 3.1 4.6 4.4 3.2 9.1 5.2 12 9.5Z");
    case "pinterest": return P("M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 .1-2.8l1.3-5.6s-.3-.7-.3-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.4.7 1.4 1.5 0 .9-.5 2.2-.7 3.4-.2 1 .5 1.8 1.4 1.8 1.7 0 3-1.8 3-4.3 0-2.2-1.6-3.8-3.9-3.8-2.6 0-4.1 2-4.1 4.2 0 .8.3 1.6.7 2l .2.2-.1.3-.4 1.4c-.1.3-.3.4-.6.3-1.7-.7-2.5-2.5-2.5-4.6 0-3.4 2.9-7.1 8.6-7.1 4.6 0 7.6 3.3 7.6 6.8 0 4.7-2.6 8.2-6.5 8.2-1.3 0-2.6-.7-3.1-1.5l-.8 3c-.3 1.1-1 2.4-1.5 3.2A10 10 0 1 0 12 2Z");
    case "youtube":   return P("M10 16.5v-9l6 4.5-6 4.5ZM23.5 7s-.2-1.3-.8-1.9c-.8-.8-1.7-.8-2.1-.8C17.6 4 12 4 12 4s-5.6 0-8.6 .3c-.4 0-1.3 0-2.1 .8C.7 5.7 .5 7 .5 7s-.2 1.6-.2 3.1v1.8c0 1.5-.2 3-.2 3Z");
    default: return null;
  }
}


