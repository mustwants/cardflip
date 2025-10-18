//PATH src/components/ProFlipCard/ProFlipCard.tsx

import React, { useId, useState } from "react";
import "./ProFlipCard.css";

export type SocialLinks = {
  linkedin?: string; facebook?: string; instagram?: string;
  twitter?: string; youtube?: string; tiktok?: string;
};

type ProFlipCardProps = {
  width?: number; height?: number;
  name: string; title?: string; email?: string; website?: string; phone?: string;
  about?: string; headshotUrl: string; logoSmallUrl?: string; affiliationBadgeUrl?: string;
  social?: SocialLinks;
};

export default function ProFlipCard({
  width = 420, height = 560, name, title, email, website, phone, about,
  headshotUrl, logoSmallUrl, affiliationBadgeUrl, social = {},
}: ProFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const cardId = useId();

  return (
    <div className="pcard-stage" style={{ width, height }}>
      <div className={`pcard ${flipped ? "is-flipped" : ""}`} aria-live="polite" aria-describedby={`${cardId}-desc`}>
        {/* FRONT */}
        <section className="pcard-face pcard-front" role="group" aria-label="Front of card">
          <div className="pcard-top">
            <div className="pcard-avatar-wrap">
              <img className="pcard-avatar" src={headshotUrl} alt={`${name} headshot`} />
              {affiliationBadgeUrl && (
                <img className="pcard-affiliation" src={affiliationBadgeUrl} alt="Military affiliation badge" />
              )}
            </div>
            <div className="pcard-id">
              <h2 className="pcard-name">{name}</h2>
              {title && <p className="pcard-title">{title}</p>}
            </div>
            {logoSmallUrl && <img className="pcard-logo" src={logoSmallUrl} alt="Organization logo" />}
          </div>

          <div className="pcard-front-body">
            <ul className="pcard-kv">
              {phone && (<li><span>Phone</span><a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a></li>)}
              {email && (<li><span>Email</span><a href={`mailto:${email}`}>{email}</a></li>)}
              {website && (<li><span>Website</span><a href={website} target="_blank" rel="noopener noreferrer">{website}</a></li>)}
            </ul>

            <div className="pcard-cta-row">
              {email && <a className="pcard-btn" href={`mailto:${email}`}>Email</a>}
              {website && <a className="pcard-btn" href={website} target="_blank" rel="noopener noreferrer">Website</a>}
              {phone && <a className="pcard-btn" href={`tel:${phone.replace(/\s+/g, "")}`}>Call</a>}
            </div>
          </div>

          <FlipFab flipped={flipped} onClick={() => setFlipped(true)} />
        </section>

        {/* BACK */}
        <section className="pcard-face pcard-back" role="group" aria-label="Back of card">
          <header className="pcard-back-head"><h3 className="pcard-back-title">About {name.split(" ")[0]}</h3></header>
          <div className="pcard-about" tabIndex={0} aria-label="About content (scrollable)">
            {about ? <p>{about}</p> : <p>No bio provided.</p>}
          </div>
          <div className="pcard-links">
            {email && <a className="pcard-link" href={`mailto:${email}`}>Email</a>}
            {website && <a className="pcard-link" href={website} target="_blank" rel="noopener noreferrer}>Web</a>}
            {social.linkedin && <a className="pcard-link" href={social.linkedin} target="_blank" rel="noopener noreferrer}>LinkedIn</a>}
            {social.facebook && <a className="pcard-link" href={social.facebook} target="_blank" rel="noopener noreferrer}>Facebook</a>}
            {social.instagram && <a className="pcard-link" href={social.instagram} target="_blank" rel="noopener noreferrer}>Instagram</a>}
            {social.twitter && <a className="pcard-link" href={social.twitter} target="_blank" rel="noopener noreferrer}>X/Twitter</a>}
            {social.youtube && <a className="pcard-link" href={social.youtube} target="_blank" rel="noopener noreferrer}>YouTube</a>}
            {social.tiktok && <a className="pcard-link" href={social.tiktok} target="_blank" rel="noopener noreferrer}>TikTok</a>}
          </div>
          <FlipFab flipped={flipped} onClick={() => setFlipped(false)} />
        </section>
      </div>
      <p id={`${cardId}-desc`} className="sr-only">Click the bottom-right circular button to flip the card. Press Space or Enter when focused.</p>
    </div>
  );
}

function FlipFab({ flipped, onClick }: { flipped: boolean; onClick: () => void }) {
  return (
    <button
      type="button" className="pcard-fab" aria-pressed={flipped}
      aria-label={flipped ? "Show front" : "Show back"} onClick={onClick}
      onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); onClick(); } }}
    >
      <svg className={`pcard-fab-icon ${flipped ? "rot" : ""}`} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v2.8c3.3 0 6 2.7 6 6h-2.5l3.5 4 3.5-4H20c0-4.4-3.6-8-8-8zM6 10l-3.5 4H6c0 4.4 3.6 8 8 8v-2.8c-3.3 0-6-2.7-6-6h2.5L6 10z" fill="currentColor"/>
      </svg>
    </button>
  );
}

