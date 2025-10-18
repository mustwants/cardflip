//PATH src/components/ProFlipCard/ProFlipCard.tsx
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import "./ProFlipCard.css";

type Social = {
  facebook?: string; instagram?: string; linkedin?: string; x?: string;
  bluesky?: string; pinterest?: string; youtube?: string;
};
type Token = { src: string; alt: string };
type GrabCorner = "top-left" | "top-right" | "bottom-right" | "bottom-left";

type Props = {
  name: string; title?: string; location?: string; website?: string; email?: string; phone?: string;
  about: string; headshotUrl: string; smallLogoUrl?: string;
  tokens?: Token[]; social?: Social;
  sponsorLogoUrl?: string; sponsorHref?: string; connectToEmail?: string;

  grabCorner?: GrabCorner;
  curlIntensity?: number; durationMs?: number; perspectivePx?: number; overshootDeg?: number; shadowPeak?: number;
  slices?: number; liftZPx?: number; diagonalTwistDeg?: number;
};

export default function ProFlipCard(p: Props) {
  const {
    name, title, location, website, email, phone, about, headshotUrl, smallLogoUrl,
    tokens = [], social = {}, sponsorLogoUrl, sponsorHref, connectToEmail = "MustWants@MustWants.com",
    grabCorner = "bottom-right", curlIntensity = .9, durationMs = 580, perspectivePx = 1200,
    overshootDeg = 6, shadowPeak = 1.15, slices = 12, liftZPx = 30, diagonalTwistDeg = 8
  } = p;

  const [showBack, setShowBack] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const frontRef = useRef<HTMLElement | null>(null);
  const backRef = useRef<HTMLElement | null>(null);
  const meshInnerRefs = useRef<HTMLDivElement[]>([]);
  meshInnerRefs.current = [];

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const fromProgRef = useRef<number>(0);
  const toProgRef = useRef<number>(0);
  const progRef = useRef<number>(0);

  const id = useId();
  const arcId = `${id}-arc`;
  const clipId = `${id}-clip`;

  const reduced =
    typeof window !== "undefined" &&
    "matchMedia" in window &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [aboutFront, aboutBack] = useMemo(() => {
    const limit = 420, a = about.trim();
    if (a.length <= limit) return [a, ""];
    const cut = a.lastIndexOf(". ", limit) + 1 || limit;
    return [a.slice(0, cut).trim(), a.slice(cut).trim()];
  }, [about]);

  const N = Math.max(10, Math.min(14, Math.round(slices)));
  const cells = useMemo(() => Array.from({ length: N * N }, (_, k) => ({ i: k % N, j: Math.floor(k / N) })), [N]);

  const start = useMemo<[number, number]>(() => (
    grabCorner === "top-left" ? [0, 0] :
    grabCorner === "top-right" ? [1, 0] :
    grabCorner === "bottom-right" ? [1, 1] :
    [0, 1]
  ), [grabCorner]);

  const end = useMemo<[number, number]>(() => (
    grabCorner === "top-left" ? [1, 1] :
    grabCorner === "top-right" ? [0, 1] :
    grabCorner === "bottom-right" ? [0, 0] :
    [1, 0]
  ), [grabCorner]);

  const { dir, nrm } = useMemo(() => {
    const len = Math.hypot(end[0] - start[0], end[1] - start[1]) || 1;
    const d: [number, number] = [(end[0] - start[0]) / len, (end[1] - start[1]) / len];
    const n: [number, number] = [-d[1], d[0]];
    return { dir: d, nrm: n };
  }, [start, end]);

  const ease = useCallback((t: number) => { const u = 1 - t; return 3 * .2 * u * u * t + 3 * .7 * u * t * t + .2 * t * t * t; }, []);
  const clamp01 = useCallback((v: number) => Math.max(0, Math.min(1, v)), []);

  const writeFrame = useCallback((prog: number) => {
    progRef.current = prog;

    const envBell = Math.sin(Math.PI * prog);
    const envPhaseB = Math.max(0, Math.min(1, (prog - 0.2) / 0.5));
    const twist = diagonalTwistDeg * envPhaseB;
    const liftZ = liftZPx * envBell;

    const rotY = prog * 180;
    if (cardRef.current) {
      cardRef.current.style.transform =
        `translateZ(${liftZ.toFixed(2)}px) rotateX(${twist.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      const right = grabCorner.includes("right");
      const bottom = grabCorner.includes("bottom");
      const shadowBiasX = (right ? 1 : -1) * 6 * envBell;
      const shadowBiasY = (bottom ? 1 : -1) * 6 * envBell;
      const shadowScale = 1 + (shadowPeak - 1) * envBell;
      cardRef.current.style.filter =
        `drop-shadow(${shadowBiasX}px ${24 + shadowBiasY}px ${40 / shadowScale}px rgba(0,0,0,.5))`;
      const isEdge = prog > 0.45 && prog < 0.55;
      cardRef.current.dataset.edge = isEdge ? "true" : "false";
      cardRef.current.dataset.face = prog < 0.5 ? "front" : "back";
    }

    /* curl mesh */
    const sigma = 0.18;
    const ampBase = 18 * curlIntensity;
    const tzBase = 28 * curlIntensity;
    const rzBase = 3 * curlIntensity;

    const ridge: [number, number] = [start[0] + dir[0] * prog, start[1] + dir[1] * prog];
    const sign = prog < .5 ? 1 : -1;
    const rightSign = (grabCorner.includes("right") ? -1 : 1);

    for (let r = 0; r < meshInnerRefs.current.length; r++) {
      const el = meshInnerRefs.current[r];
      if (!el) continue;
      const i = r % N;
      const j = Math.floor(r / N);
      const u = (i + 0.5) / N, v = (j + 0.5) / N;

      const rel = [u - start[0], v - start[1]];
      const tAlong = clamp01(rel[0] * dir[0] + rel[1] * dir[1]);
      const relR = [u - ridge[0], v - ridge[1]];
      const distPerp = Math.abs(relR[0] * nrm[0] + relR[1] * nrm[1]);

      const gauss = Math.exp(-(distPerp * distPerp) / (2 * sigma * sigma)) * envBell;
      const leadBias = 0.6 + 0.4 * Math.cos(Math.PI * (tAlong - prog));
      const w = gauss * leadBias;

      const ry = (ampBase * w) * sign;
      const tz = (tzBase * w);
      const rz = (rzBase * w * rightSign);

      el.style.transform = `translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
    }

    if (frontRef.current && backRef.current) {
      if (prog < 0.5) {
        frontRef.current.style.pointerEvents = "auto";
        backRef.current.style.pointerEvents = "none";
      } else {
        frontRef.current.style.pointerEvents = "none";
        backRef.current.style.pointerEvents = "auto";
      }
    }
  }, [
    N, clamp01, curlIntensity, diagonalTwistDeg, dir, grabCorner,
    liftZPx, nrm, shadowPeak, start
  ]);

  const runAnimation = useCallback((to: number) => {
    if (reduced) {
      writeFrame(to);
      setAnimating(false);
      return;
    }
    setAnimating(true);
    toProgRef.current = to;
    fromProgRef.current = progRef.current;
    startTimeRef.current = performance.now();

    const dur = Math.max(200, Math.min(1200, durationMs));
    const step = (now: number) => {
      const t = clamp01((now - startTimeRef.current) / dur);
      const e = ease(t);
      const overshoot = (overshootDeg / 180) * Math.sin(Math.PI * e) * (to > fromProgRef.current ? 1 : -1);
      let v = fromProgRef.current + (to - fromProgRef.current) * (e + overshoot);
      v = Math.max(0, Math.min(1, v));
      writeFrame(v);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        writeFrame(to);
        setAnimating(false);
      }
    };
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);
  }, [clamp01, durationMs, ease, overshootDeg, reduced, writeFrame]);

  useEffect(() => {
    runAnimation(showBack ? 1 : 0);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [showBack, runAnimation]);

  useEffect(() => { writeFrame(0); }, [writeFrame]);

  const soc = [
    { k: "facebook", href: social.facebook, l: "Facebook", svg: icon("facebook") },
    { k: "instagram", href: social.instagram, l: "Instagram", svg: icon("instagram") },
    { k: "linkedin", href: social.linkedin, l: "LinkedIn", svg: icon("linkedin") },
    { k: "x", href: social.x, l: "X", svg: icon("x") },
    { k: "bluesky", href: social.bluesky, l: "Bluesky", svg: icon("bluesky") },
    { k: "pinterest", href: social.pinterest, l: "Pinterest", svg: icon("pinterest") },
    { k: "youtube", href: social.youtube, l: "YouTube", svg: icon("youtube") },
  ];

  return (
    <div className="pcard-stage" style={{ perspective: `${perspectivePx}px` }}>
      <div ref={cardRef} className={`pcard ${animating ? "is-animating" : ""}`} aria-label="Profile card">
        {/* FRONT */}
        <section ref={frontRef} className="pcard-face pcard-front" aria-label="Front">
          <div className="pcard-opaque" aria-hidden="true"></div>

          <div className="pcard-banner-top">
            <div className="pcard-banner-tokens">
              {tokens.map((t, i) => (<img key={i} className="pcard-token" src={t.src} alt={t.alt} />))}
            </div>
          </div>
          <div className="pcard-ribbon"></div>
          <div className="pcard-banner"></div>

          <header className="pcard-top">
            <div className="pcard-avatar-wrap">
              <img className="pcard-avatar" src={headshotUrl} alt={`${name} headshot`} />
              {/* curved banner INSIDE the circle: 7→3 o’clock */}
              <svg className="pcard-avatar-arc" viewBox="0 0 106 106" aria-hidden="true">
                <defs>
                  <clipPath id={clipId}><circle cx="53" cy="53" r="50" /></clipPath>
                  <path id={arcId} d="M 22 86 A 41 41 0 0 0 98 53" />
                </defs>
                <g clipPath={`url(#${clipId})`}>
                  <use href={`#${arcId}`} className="arc-stroke" />
                  <text className="arc-text">
                    <textPath href={`#${arcId}`} startOffset="52%" textAnchor="middle" dominantBaseline="middle" dy="-0.5">
                      Real Estate Agent
                    </textPath>
                  </text>
                </g>
              </svg>
            </div>

            <div className="pcard-id">
              <h2 className="pcard-name">{name}</h2>
              {title && <p className="pcard-title">{title}</p>}
              {location && <p className="pcard-loc">{location}</p>}
              {website && <a className="pcard-website" href={website} target="_blank" rel="noopener noreferrer">{website}</a>}
              <div className="pcard-social">
                {soc.map(s => s.href
                  ? <a key={s.k} className="pcard-soc" href={s.href!} target="_blank" rel="noopener noreferrer" aria-label={s.l}>{s.svg}</a>
                  : <span key={s.k} className="pcard-soc is-disabled" aria-hidden="true">{s.svg}</span>)}
              </div>
            </div>
            {smallLogoUrl && <img className="pcard-logo" src={smallLogoUrl} alt="Brokerage logo" />}
          </header>

          <div className="pcard-body">
            <div className="pcard-cta-row">
              {email && <a className="pcard-btn" href={`mailto:${email}`}>Email</a>}
              {website && <a className="pcard-btn" href={website} target="_blank" rel="noopener noreferrer">Website</a>}
              {phone && <a className="pcard-btn" href={`tel:${phone.replace(/\s+/g, "")}`}>Call</a>}
            </div>

            <div className="pcard-about">
              <h4>About</h4>
              <p>{aboutFront}</p>
              {aboutBack && <p className="pcard-continued">Continued on back…</p>}
            </div>
          </div>

          <div className="pcard-footer">
            <button className="pcard-btn" onClick={() => setIsModalOpen(true)}>Connect with {name.split(" ")[0]}</button>
            <button
              className="pcard-btn flip-btn"
              aria-pressed={showBack}
              data-selected={showBack}
              onClick={() => { if (!animating) setShowBack(!showBack); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!animating) setShowBack(!showBack); } }}
              disabled={animating}
            >{showBack ? "Flip Back" : "Flip"}</button>
          </div>

          <div className="pcard-mesh" aria-hidden="true">
            {cells.map(({ i, j }, idx) => (
              <div key={`${i}-${j}`} className="pcard-cell">
                <div className="pcard-cell-inner" ref={(el) => { if (el) meshInnerRefs.current[idx] = el; }} />
              </div>
            ))}
          </div>
        </section>

        {/* BACK */}
        <section ref={backRef} className="pcard-face pcard-back" aria-label="Back">
          <div className="pcard-opaque" aria-hidden="true"></div>

          <div className="pcard-banner-top"></div>
          <div className="pcard-ribbon"></div>
          <div className="pcard-banner"></div>

          <div className="pcard-back-head">
            <h3 className="pcard-back-name">{name}</h3>
            {title && <p className="pcard-back-title">{title}</p>}
          </div>

          <div className="pcard-body">
            <div className="pcard-about pcard-about-back">
              {aboutBack ? <p>{aboutBack}</p> : <p>No additional information.</p>}
            </div>
          </div>

          <div className="pcard-sponsor">
            <span>Sponsored/Affiliated w/</span>
            {sponsorHref
              ? <a className="pcard-btn small" href={sponsorHref} target="_blank" rel="noopener noreferrer">
                  {sponsorLogoUrl ? <img src={sponsorLogoUrl} alt="Sponsor" /> : "Visit"}
                </a>
              : sponsorLogoUrl ? <img src={sponsorLogoUrl} alt="Sponsor" /> : null}
          </div>

          <div className="pcard-footer">
            <button className="pcard-btn" onClick={() => setIsModalOpen(true)}>Connect with {name.split(" ")[0]}</button>
            <button
              className="pcard-btn flip-btn"
              aria-pressed={showBack}
              data-selected={showBack}
              onClick={() => { if (!animating) setShowBack(!showBack); }}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!animating) setShowBack(!showBack); } }}
              disabled={animating}
            >{showBack ? "Flip Back" : "Flip"}</button>
          </div>

          <div className="pcard-mesh" aria-hidden="true">
            {cells.map(({ i, j }, idx) => (
              <div key={`b-${i}-${j}`} className="pcard-cell">
                <div className="pcard-cell-inner" ref={(el) => { if (el) meshInnerRefs.current[N * N + idx] = el; }} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {isModalOpen && <ConnectModal toEmail={connectToEmail} personName={name} onClose={() => setIsModalOpen(false)} />}
      <p id={`${id}-help`} className="sr-only">Flip toggles back/front. Back is opaque and clickable. Reduced-motion swaps instantly.</p>
    </div>
  );
}

function ConnectModal({ toEmail, personName, onClose }: { toEmail: string; personName: string; onClose: () => void }) {
  const [first, setFirst] = useState(""); const [last, setLast] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState("");
  const send = () => {
    const subject = encodeURIComponent(`Connect with ${personName}`);
    const body = encodeURIComponent(`Please connect me with ${personName}.\n\nFirst Name: ${first}\nLast Name: ${last}\nEmail: ${email}\nPhone: ${phone}\n\nSource: ${location.href}`);
    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;
    onClose();
  };
  return (
    <div className="mw-modal" role="dialog" aria-modal="true">
      <div className="mw-overlay" onClick={onClose} />
      <div className="mw-modal-card">
        <h3>Connect with {personName}</h3>
        <div className="mw-form">
          <label>First Name<input value={first} onChange={e => setFirst(e.target.value)} /></label>
          <label>Last Name <input value={last} onChange={e => setLast(e.target.value)} /></label>
          <label>Email     <input value={email} onChange={e => setEmail(e.target.value)} type="email" /></label>
          <label>Phone     <input value={phone} onChange={e => setPhone(e.target.value)} /></label>
        </div>
        <div className="mw-actions">
          <button className="pcard-btn small" onClick={onClose} type="button">Cancel</button>
          <button className="pcard-btn small" onClick={send} type="button" disabled={!(first && last && email)}>Send</button>
        </div>
      </div>
    </div>
  );
}

function icon(name: string) {
  const P = (d: string) => <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d={d} /></svg>;
  switch (name) {
    case "facebook": return P("M22 12a10 10 0 1 0-11.6 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 2 .1v2.3h-1.2c-1 0-1.3.6-1.3 1.2V12h2.5l-.4 3h-2.1v7A10 10 0 0 0 22 12Z");
    case "instagram": return P("M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z");
    case "linkedin": return P("M6.9 21H3V8h3.9v13ZM5 6.3A2.3 2.3 0 1 1 5 1.7 2.3 2.3 0 0 1 5 6.3ZM22 21h-3.8v-6.3c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.6-.1.9V21Z");
    case "x": return P("M17.5 3H21l-8.3 9.5L21.7 21h-6L11 14.8 6 21H3l8.9-10.2L3.6 3h6l4.1 5.9L17.5 3Z");
    case "bluesky": return P("M12 9.5c2.9-4.3 7.6-6.3 8.9-4.9 1.3 1.3-.7 6-4.9 8.9 4.3 2.9 6.3 7.6 4.9 8.9s-6-1-8.9-5c-2.9 4-7.6 6.3-8.9 5C1.8 21 3.8 16.3 8 13.4 3.8 10.5 1.8 5.8 3.1 4.6 4.4 3.2 9.1 5.2 12 9.5Z");
    case "pinterest": return P("M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 .1-2.8l1.3-5.6s-.3-.7-.3-1.8c0-1.7 1-2.9 2.2-2.9 1 0 1.4.7 1.4 1.5 0 .9-.5 2.2-.7 3.4-.2 1 .5 1.8 1.4 1.8 1.7 0 3-1.8 3-4.3 0-2.2-1.6-3.8-3.9-3.8-2.6 0-4.1 2-4.1 4.2 0 .8.3 1.6.7 2l .2.2-.1.3-.4 1.4c-.1.3-.3.4-.6.3-1.7-.7-2.5-2.5-2.5-4.6 0-3.4 2.9-7.1 8.6-7.1 4.6 0 7.6 3.3 7.6 6.8 0 4.7-2.6 8.2-6.5 8.2-1.3 0-2.6-.7-3.1-1.5l-.8 3c-.3 1.1-1 2.4-1.5 3.2A10 10 0 1 0 12 2Z");
    case "youtube": return P("M10 16.5v-9l6 4.5-6 4.5ZM23.5 7s-.2-1.3-.8-1.9c-.8-.8-1.7-.8-2.1-.8C17.6 4 12 4 12 4s-5.6 0-8.6 .3c-.4 0-1.3 0-2.1 .8C.7 5.7 .5 7 .5 7s-.2 1.6-.2 3.1v1.8c0 1.5-.2 3-.2 3Z");
    default: return null;
  }
}

