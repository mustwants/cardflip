import { useEffect, useState } from "react";
import "./App.css";
import ProFlipCard from "./components/ProFlipCard/ProFlipCard";

const ABOUT = `Anne is not your typical Broker/REALTOR®. A U.S. Naval Academy alum who serves as a Captain in the reserves – her journey through sales leadership roles at Caterpillar and Pepsi has finely honed her skills in advocating for clients. Anne's dedication to excellence and unwavering work ethic shine through in every transaction. She is not just an agent; she's an investor herself, with a rental portfolio across TX, NC, TN and KS. Anne enjoys family time, the beach, and traveling. She supports our community as a mentor at UNCW's Business School. Carolina roots ground her approach to client hospitality - with boundless enthusiasm, genuine joy, and high attention to detail, she exceeds needs. Count on her as your dependable partner and sympathetic ear; tirelessly working for your Real Estate goals, day, or night. Anne's results speak volumes about her dedication and expertise - her authentic approach and genuine care for her clients truly set her apart. Six-years of active-duty & 20 in the reserves. Go Navy!`;

function ThemeToggle(){
  const [theme,setTheme] = useState<"light"|"dark">("dark");
  useEffect(()=>{ document.documentElement.setAttribute("data-theme", theme); },[theme]);
  return (
    <button
      className="theme-toggle"
      aria-pressed={theme==="light"}
      onClick={()=>setTheme(t=>t==="light"?"dark":"light")}
      title={theme==="light"?"Switch to dark":"Switch to light"}
    >
      {theme==="light" ? "Dark" : "Light"}
    </button>
  );
}

export default function App(){
  return (
    <div className="app">
      <ThemeToggle />
      <ProFlipCard
        name="Anne Leanos"
        title="Broker / REALTOR®"
        location="Wilmington, NC"
        website="https://anneleanos.bhhscpp.com/"
        email="MustWants@MustWants.com"
        phone="+1 (555) 555-1212"
        about={ABOUT}
        headshotUrl="/images/AnneLeanos.jpg"
        smallLogoUrl="/images/EXP.png"
        tokens={[
          { src: "/images/MW Badge_Military Spouse.png",   alt: "Military Spouse" },
          { src: "/images/MW Badge_Military Veteran.png",  alt: "Veteran" },
          { src: "/images/MW Badge_Military Affiliation.png", alt: "Service Member" },
        ]}
        social={{
          facebook:  "https://www.facebook.com/LIVINGNWILMINGTONNC",
          instagram: "https://www.instagram.com/anne_leanos_livingnwilmington/",
          linkedin:  "https://www.linkedin.com/in/anneleanos",
          x:         "https://twitter.com/"
        }}
        sponsorLogoUrl="/images/trident.png"
        sponsorHref="https://www.tridenthomeloans.com/"
        /* motion params per spec */
        grabCorner="bottom-right"
        curlIntensity={0.9}
        durationMs={580}
        perspectivePx={1200}
        overshootDeg={6}
        shadowPeak={1.15}
        slices={12}
        liftZPx={30}
        diagonalTwistDeg={8}
      />
    </div>
  );
}



