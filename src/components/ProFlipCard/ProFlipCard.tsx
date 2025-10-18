//PATH src/components/ProFlipCard/ProFlipCard.tsx

import { useId, useState } from "react";
import "./ProFlipCard.css";

type SocialLinks = {
  linkedin?: string; facebook?: string; instagram?: string;
  twitter?: string; youtube?: string; tiktok?: string;
};

type ProFlipCardProps = {
  width?: number; height?: number;
  name: string; title?: string; location?: string;
  email?: string; website?: string; phone?: string;
  serviceAffiliation?: string; about?: string;
  headshotUrl: string; logoSmallUrl?: string; affiliationBadgeUrl?: string;
  social?: SocialLinks;
  sponsorLogoUrl?: string;
  tokenBadges?: Array<{ src: string; alt: string }>;
  connectButtonText?: string; connectToEmail?: string;
};

export default function ProFlipCard({
  width = 460, height = 600,
  name, title, location,
  email, website, phone,
  serviceAffiliation, about,
  headshotUrl, logoSmallUrl, affiliationBadgeUrl,
  social = {},
  sponsorLogoUrl,
  tokenBadges = [],
  connectButtonText = "Connect with Anne",
  connectToEmail = "MustWants@MustWants.com",
}: ProFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);
  const cardId = useId();

  return (
    <div className="pcard-stage" style={{ width, height }}>
      <div className={`pcard ${flipped ? "is-flipped" : ""}`} aria-live="polite" aria-describedby={`${cardId}-desc`}>

        {/* FRONT */}
        <section className="pcard-face pcard-front" role="group" aria-label="Front of card">
          <div className="pcard-top">
            <div className="pcard-avatar-wrap">
              <img className="pcard-avatar" src={headshotUrl} alt={`${name} headshot`} />
              {affiliationBadgeUrl && <img className="pcard-affiliation" src={affiliationBadgeUrl} alt="Military affiliation badge" />}
            </div>

            <div className="pcard-id">
              <h2 className="pcard-name">{name}</h2>

              {tokenBadges.length > 0 && (
                <div className="pcard-tokens" aria-label="Military affiliation tokens">
                  {tokenBadges.map((t, i) => (
                    <img key={i} src={t.src} alt={t.alt} className="pcard-token" />
                  ))}
                </div>
              )}

              {title && <p className="pcard-title">{title}</p>}
              {location && <p className="pcard-loc">{location}</p>}
            </div>

            {logoSmallUrl && <img className="pcard-logo" src={logoSmallUrl} alt="Organization logo" />}
          </div>

          <div className="pcard-front-body">
            {serviceAffiliation && (
              <div className="pcard-badges" aria-label="Service affiliation">
                {serviceAffiliation.split(",").map(s => <span key={s.trim()} className="pcard-badge">{s.trim()}</span>)}
              </div>
            )}

            <ul className="pcard-kv">
              {phone && (<li><span>Phone</span><a href={`tel:${phone.replace(/\s+/g,"")}`}>{phone}</a></li>)}
              {email && (<li><span>Email</span><a href={`mailto:${email}`}>{email}</a></li>)}
              {website && (<li><span>Website</span><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></li>)}
            </ul>

            <div className="pcard-cta-row">
              <button className="pcard-btn" type="button" onClick={() => setOpen(true)}>{connectButtonText}</button>
              {website && <a className="pcard-btn" href={website} target="_blank" rel="noopener noreferrer">Website</a>}
              {email && <a className="pcard-btn" href={`mailto:${email}`}>Email</a>}
            </div>
          </div>

          <FlipFab flipped={flipped} onClick={() => setFlipped(v => !v)} />
        </section>

        {/* BACK */}
        <section className="pcard-face pcard-back" role="group" aria-label="Back of card">
          <header className="pcard-back-head">
            <h3 className="pcard-back-title">About {name.split(" ")[0]} — Continued</h3>
          </header>

          <div className="pcard-about" tabIndex={0} aria-label="About content (scrollable)">
            {about ? <p>{about}</p> : <p>No bio provided.</p>}
          </div>

          <div className="pcard-links">
            {email && <a className="pcard-link" href={`mailto:${email}`}>{icon("mail")} Email</a>}
            {website && <a className="pcard-link" href={website} target="_blank" rel="noopener noreferrer">{icon("link")} Web</a>}
            {social.facebook && <a className="pcard-link" href={social.facebook} target="_blank" rel="noopener noreferrer">{icon("facebook")} Facebook</a>}
            {social.instagram && <a className="pcard-link" href={social.instagram} target="_blank" rel="noopener noreferrer">{icon("instagram")} Instagram</a>}
            {social.linkedin && <a className="pcard-link" href={social.linkedin} target="_blank" rel="noopener noreferrer">{icon("linkedin")} LinkedIn</a>}
            {social.twitter && <a className="pcard-link" href={social.twitter} target="_blank" rel="noopener noreferrer">{icon("twitter")} X/Twitter</a>}
            {social.youtube && <a className="pcard-link" href={social.youtube} target="_blank" rel="noopener noreferrer">{icon("youtube")} YouTube</a>}
            {social.tiktok && <a className="pcard-link" href={social.tiktok} target="_blank" rel="noopener noreferrer">{icon("tiktok")} TikTok</a>}
          </div>

          <div className="pcard-sponsor">
            <div style={{fontSize:12,opacity:.9}}>Sponsored by:</div>
            {sponsorLogoUrl && <img src={sponsorLogoUrl} alt="Trident Home Loans" />}
          </div>

          <FlipFab flipped={flipped} onClick={() => setFlipped(v => !v)} />
        </section>
      </div>

      {open && <ConnectModal toEmail={connectToEmail} personName={name} onClose={() => setOpen(false)} />}

      <p id={`${cardId}-desc`} className="sr-only">Click the bottom-right circular button to flip the card. Press Space or Enter when focused.</p>
    </div>
  );
}

function FlipFab({ flipped, onClick }: { flipped: boolean; onClick: () => void }) {
  return (
    <button type="button" className="pcard-fab" aria-pressed={flipped} aria-label={flipped ? "Show front" : "Show back"} onClick={onClick}>
      <svg className={`pcard-fab-icon ${flipped ? "rot" : ""}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v2.8c3.3 0 6 2.7 6 6h-2.5l3.5 4 3.5-4H20c0-4.4-3.6-8-8-8zM6 10l-3.5 4H6c0 4.4 3.6 8 8 8v-2.8c-3.3 0-6-2.7-6-6h2.5L6 10z" fill="currentColor"/>
      </svg>
    </button>
  );
}

function ConnectModal({ toEmail, personName, onClose }:{toEmail:string;personName:string;onClose:()=>void}) {
  const [first,setFirst]=useState(""); const [last,setLast]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
  const submit=()=>{const subject=encodeURIComponent(`Connect with ${personName}`);const body=encodeURIComponent(`Please connect me with ${personName}.\n\nFirst Name: ${first}\nLast Name: ${last}\nEmail: ${email}\nPhone: ${phone}\n\nSource: ${location.href}`);window.location.href=`mailto:${toEmail}?subject=${subject}&body=${body}`;onClose()};
  const disabled=!(first&&last&&email);
  return(<div className="mw-modal" role="dialog" aria-modal="true" aria-label="Connect form">
    <div className="mw-modal-card">
      <h3>Connect with {personName}</h3>
      <div className="mw-form">
        <label>First Name<input value={first} onChange={e=>setFirst(e.target.value)} placeholder="First name"/></label>
        <label>Last Name<input value={last} onChange={e=>setLast(e.target.value)} placeholder="Last name"/></label>
        <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/></label>
        <label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 555 5555"/></label>
      </div>
      <div className="mw-actions">
        <button className="pcard-btn" onClick={onClose} type="button">Cancel</button>
        <button className="pcard-btn" onClick={submit} type="button" disabled={disabled}>Send</button>
      </div>
    </div>
    <button className="mw-overlay" aria-label="Close" onClick={onClose}/>
  </div>);
}

function icon(name:string){
  const p=(d:string)=><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={d}/></svg>;
  switch(name){
    case "mail": return p("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z");
    case "link": return p("M3.9 12a5 5 0 0 1 5-5h3v2h-3a3 3 0 1 0 0 6h3v2h-3a5 5 0 0 1-5-5Zm7-1h2v2h-2v-2Zm3.1-4h3a5 5 0 0 1 0 10h-3v-2h3a3 3 0 1 0 0-6h-3V7Z");
    case "facebook": return p("M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.2c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12Z");
    case "instagram": return p("M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z");
    case "linkedin": return p("M6.9 21H3V8h3.9v13ZM5 6.3A2.3 2.3 0 1 1 5 1.7 2.3 2.3 0 0 1 5 6.3ZM22 21h-3.8v-6.3c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21h-3.8V8H14v1.8c.5-.7 1.4-1.8 3.4-1.8 2.5 0 4.6 1.6 4.6 5.2V21Z");
    case "twitter": return p("M22 5.8c-.7.3-1.4.5-2.2.6.8-.5 1.3-1.2 1.6-2.1-.7.4-1.5.8-2.4 1A3.8 3.8 0 0 0 12 7.7c0 .3 0 .6.1.9A10.8 10.8 0 0 1 3 4.8a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.6 3.2 4-.3.1-.7.2-1 .2s-.5 0-.8-.1a3.8 3.8 0 0 0 3.5 2.6A7.6 7.6 0 0 1 2 19.5a10.7 10.7 0 0 0 5.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.7-.5 1.3-1.2 1.8-2.1Z");
    case "youtube": return p("M10 16.5v-9l6 4.5-6 4.5ZM23.5 7s-.2-1.3-.8-1.9c-.8-.8-1.7-.8-2.1-.8C17.6 4 12 4 12 4h0s-5.6 0-8.6.3c-.4 0-1.3 0-2.1.8C.7 5.7.5 7 .5 7S.3 8.6.3 10.1v1.8C.3 13.4.5 15 .5 15s.2 1.3.8 1.9c.8.8 1.9.8 2.4.9C5.6 18 12 18 12 18s5.6 0 8.6-.3c.5 0 1.6 0 2.4-.9.6-.6.8-1.9.8-1.9s.2-1.6.2-3.1v-1.8c0-1.5-.2-3-.2-3Z");
    case "tiktok": return p("M21 8.1a7 7 0 0 1-4.5-1.6v6.8a5.3 5.3 0 1 1-4.6-5.3v2.7a2.7 2.7 0 1 0 1.8 2.6V2h2.8a7 7 0 0 0 4.5 4.1v2Z");
    default: return null;
  }
}




