//PATH src/components/ProFlipCard/ProFlipCard.tsx

import { useId, useMemo, useState } from "react";
import "./ProFlipCard.css";

/** MustWants flip card with bottom-right corner flip and ribbon banner */
type Social = {
  facebook?: string; instagram?: string; linkedin?: string;
  x?: string; bluesky?: string; pinterest?: string; youtube?: string;
};

type Token = { src: string; alt: string };

type Props = {
  width?: number; height?: number;
  name: string; title?: string; location?: string; website?: string;
  email?: string; phone?: string;
  about: string;                                // full about text
  headshotUrl: string;                           // circular photo
  smallLogoUrl?: string;                         // brokerage logo
  tokens?: Token[];                              // small round tokens
  serviceAffiliation?: string;                   // comma list
  social?: Social;
  sponsorLogoUrl?: string;                       // back side
  sponsorHref?: string;                          // back side button URL
  connectToEmail?: string;                       // modal mailto
};

export default function ProFlipCard({
  width = 520, height = 660,
  name, title, location, website, email, phone,
  about,
  headshotUrl, smallLogoUrl, tokens = [],
  serviceAffiliation,
  social = {},
  sponsorLogoUrl, sponsorHref,
  connectToEmail = "MustWants@MustWants.com",
}: Props) {
  const id = useId();
  const [flipped, setFlipped] = useState(false);
  const [open, setOpen] = useState(false);

  // split long About: front ~ 420 chars, rest to back
  const [aboutFront, aboutBack] = useMemo(() => {
    const limit = 420;
    const a = about.trim();
    if (a.length <= limit) return [a, ""];
    const cut = a.lastIndexOf(". ", limit) + 1 || limit;
    return [a.slice(0, cut).trim(), a.slice(cut).trim()];
  }, [about]);

  const soc = useMemo(() => ([
    { key: "facebook",  href: social.facebook,  label: "Facebook",  icon: i("facebook") },
    { key: "instagram", href: social.instagram, label: "Instagram", icon: i("instagram") },
    { key: "linkedin",  href: social.linkedin,  label: "LinkedIn",  icon: i("linkedin") },
    { key: "x",         href: social.x,         label: "X",         icon: i("x") },
    { key: "bluesky",   href: social.bluesky,   label: "Bluesky",   icon: i("bluesky") },
    { key: "pinterest", href: social.pinterest, label: "Pinterest", icon: i("pinterest") },
    { key: "youtube",   href: social.youtube,   label: "YouTube",   icon: i("youtube") },
  ]), [social]);

  return (
    <div className="pcard-stage" style={{ width, height }}>
      <div className={`pcard ${flipped ? "is-flipped" : ""}`} aria-describedby={`${id}-help`}>
        {/* FRONT */}
        <section className="pcard-face pcard-front" aria-label="Front">
          {/* Ribbon + banner */}
          <div className="pcard-ribbon" />
          <div className="pcard-banner" />

          <header className="pcard-top">
            <div className="pcard-avatar-wrap">
              <img className="pcard-avatar" src={headshotUrl} alt={`${name} headshot`} />
              {/* corner token (large) optional */}
            </div>

            <div className="pcard-id">
              <div className="pcard-name-row">
                <h2 className="pcard-name">{name}</h2>
                <div className="pcard-token-row">
                  {tokens.map((t, idx) => (
                    <img key={idx} className="pcard-token" src={t.src} alt={t.alt} />
                  ))}
                </div>
              </div>
              {title && <p className="pcard-title">{title}</p>}
              {location && <p className="pcard-loc">{location}</p>}
              {website && (
                <a className="pcard-website" href={website} target="_blank" rel="noopener noreferrer">
                  {website}
                </a>
              )}
              <div className="pcard-social">
                {soc.map(s => s.href
                  ? <a key={s.key} className="pcard-soc" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>{s.icon}</a>
                  : <span key={s.key} className="pcard-soc is-disabled" aria-hidden="true">{s.icon}</span>
                )}
              </div>
            </div>

            {smallLogoUrl && <img className="pcard-logo" src={smallLogoUrl} alt="Brokerage logo" />}
          </header>

          <div className="pcard-body">
            {serviceAffiliation && (
              <div className="pcard-badges">
                {serviceAffiliation.split(",").map(s => (
                  <span key={s.trim()} className="pcard-badge">{s.trim()}</span>
                ))}
              </div>
            )}

            <div className="pcard-about">
              <h4>About</h4>
              <p>{aboutFront}</p>
              {aboutBack && <p className="pcard-continued">Continued on back…</p>}
            </div>

            <ul className="pcard-kv">
              {email && <li><span>Email</span><a href={`mailto:${email}`}>{email}</a></li>}
              {phone && <li><span>Phone</span><a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a></li>}
              {website && <li><span>Website</span><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></li>}
            </ul>

            <div className="pcard-cta">
              <button className="pcard-btn" type="button" onClick={() => setOpen(true)}>Connect with {name.split(" ")[0]}</button>
            </div>
          </div>

          <FlipFab flipped={flipped} onClick={() => setFlipped(v => !v)} />
          <div className="pcard-curl" aria-hidden="true" />
        </section>

        {/* BACK */}
        <section className="pcard-face pcard-back" aria-label="Back">
          <div className="pcard-back-head">
            <h3 className="pcard-back-name">{name}</h3>
            {title && <p className="pcard-back-title">{title}</p>}
          </div>

          <div className="pcard-about pcard-about-back">
            {aboutBack ? <p>{aboutBack}</p> : <p>No additional information.</p>}
          </div>

          <div className="pcard-sponsor">
            <span>Recommended by:</span>
            {sponsorHref ? (
              <a className="pcard-btn small" href={sponsorHref} target="_blank" rel="noopener noreferrer">
                {sponsorLogoUrl ? <img src={sponsorLogoUrl} alt="Sponsor" /> : "Visit"}
              </a>
            ) : sponsorLogoUrl ? <img src={sponsorLogoUrl} alt="Sponsor" /> : null}
          </div>

          <FlipFab flipped={flipped} onClick={() => setFlipped(v => !v)} />
          <div className="pcard-curl" aria-hidden="true" />
        </section>
      </div>

      {open && <ConnectModal toEmail={connectToEmail} personName={name} onClose={() => setOpen(false)} />}

      <p id={`${id}-help`} className="sr-only">Click the round button in the bottom-right to flip the card. Click again to flip back.</p>
    </div>
  );
}

/* FAB */
function FlipFab({ flipped, onClick }: { flipped: boolean; onClick: () => void }) {
  return (
    <button type="button" className="pcard-fab" aria-pressed={flipped} aria-label={flipped ? "Show front" : "Show back"} onClick={onClick}>
      <svg className={`pcard-fab-icon ${flipped ? "rot" : ""}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v2.8c3.3 0 6 2.7 6 6h-2.5l3.5 4 3.5-4H20c0-4.4-3.6-8-8-8zM6 10l-3.5 4H6c0 4.4 3.6 8 8 8v-2.8c-3.3 0-6-2.7-6-6h2.5L6 10z" fill="currentColor"/>
      </svg>
    </button>
  );
}

/* Modal centered */
function ConnectModal({ toEmail, personName, onClose }:{toEmail:string;personName:string;onClose:()=>void}) {
  const [first,setFirst]=useState(""); const [last,setLast]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState("");
  const submit=()=>{const subject=encodeURIComponent(`Connect with ${personName}`);const body=encodeURIComponent(`Please connect me with ${personName}.\n\nFirst Name: ${first}\nLast Name: ${last}\nEmail: ${email}\nPhone: ${phone}\n\nSource: ${location.href}`);window.location.href=`mailto:${toEmail}?subject=${subject}&body=${body}`;onClose()};
  const disabled=!(first&&last&&email);
  return (
    <div className="mw-modal" role="dialog" aria-modal="true" aria-label="Connect form">
      <div className="mw-modal-card">
        <h3>Connect with {personName}</h3>
        <div className="mw-form">
          <label>First Name<input value={first} onChange={e=>setFirst(e.target.value)} placeholder="First name"/></label>
          <label>Last Name<input value={last} onChange={e=>setLast(e.target.value)} placeholder="Last name"/></label>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" type="email"/></label>
          <label>Phone<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+1 555 555 5555"/></label>
        </div>
        <div className="mw-actions">
          <button className="pcard-btn small" onClick={onClose} type="button">Cancel</button>
          <button className="pcard-btn small" onClick={submit} type="button" disabled={disabled}>Send</button>
        </div>
      </div>
      <button className="mw-overlay" aria-label="Close" onClick={onClose}/>
    </div>
  );
}

/* Inline icons */
function i(name:string){
  const P=(d:string)=><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={d}/></svg>;
  switch(name){
    case "facebook": return P("M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.2c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12Z");
    case "instagram": return P("M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z");
    case "linkedin": return P("M6.9 21H3V8h3.9v13ZM5 6.3A2.3 2.3 0 1 1 5 1.7 2.3 2.3 0 0 1 5 6.3ZM22 21h-3.8v-6.3c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21h-3.8V8H14v1.8c.5-.7 1.4-1.8 3.4-1.8 2.5 0 4.6 1.6 4.6 5.2V21Z");
    case "x": return P("M17.5 3H21l-8.3 9.5L21.7 21h-6L11 14.8 6 21H3l8.9-10.2L3.6 3h6l4.1 5.9L17.5 3Z");
    case "bluesky": return P("M12 9.5c2.9-4.3 7.6-6.3 8.9-4.9 1.3 1.3-.7 6-4.9 8.9 4.3 2.9 6.3 7.6 4.9 8.9s-6-1-8.9-5c-2.9 4-7.6 6.3-8.9 5C1.8 21 3.8 16.3 8 13.4 3.8 10.5 1.8 5.8 3.1 4.6 4.4 3.2 9.1 5.2 12 9.5Z");
    case "pinterest": return P("M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 .1-2.8l1.3-5.6s-.3-.7-.3-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.4.7 1.4 1.5 0 .9-.5 2.2-.7 3.4-.2 1 .5 1.8 1.4 1.8 1.7 0 3-1.8 3-4.3 0-2.2-1.6-3.8-3.9-3.8-2.6 0-4.1 2-4.1 4.2 0 .8.3 1.6.7 2l.2.2-.1.3-.4 1.4c-.1.3-.3.4-.6.3-1.7-.7-2.5-2.5-2.5-4.6 0-3.4 2.9-7.1 8.6-7.1 4.6 0 7.6 3.3 7.6 6.8 0 4.7-2.6 8.2-6.5 8.2-1.3 0-2.6-.7-3.1-1.5l-.8 3c-.3 1.1-1 2.4-1.5 3.2A10 10 0 1 0 12 2Z");
    case "youtube": return P("M10 16.5v-9l6 4.5-6 4.5ZM23.5 7s-.2-1.3-.8-1.9c-.8-.8-1.7-.8-2.1-.8C17.6 4 12 4 12 4s-5.6 0-8.6.3c-.4 0-1.3 0-2.1.8C.7 5.7.5 7 .5 7s-.2 1.6-.2 3.1v1.8C.3 13.4.5 15 .5 15s.2 1.3.8 1.9c.8.8 1.9.8 2.4.9C5.6 18 12 18 12 18s5.6 0 8.6-.3c.5 0 1.6 0 2.4-.9.6-.6.8-1.9.8-1.9s.2-1.6.2-3.1v-1.8c0-1.5-.2-3-.2-3Z");
    default: return null;
  }
}




