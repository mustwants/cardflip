import { useEffect, useState } from "react";
import ProFlipCard from "./components/ProFlipCard/ProFlipCard";
import "./index.css";

export default function App(){
  const [theme,setTheme]=useState<"dark"|"light">("dark");
  useEffect(()=>{document.documentElement.setAttribute("data-theme",theme)},[theme]);

  return (
    <div className="container">
      <button className="theme-toggle" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>
        {theme==="dark"?"Light mode":"Dark mode"}
      </button>

      <ProFlipCard
        name="Anne Leanos"
        title="Broker / REALTOR® — BHHS Carolina Premier Properties"
        location="Wilmington, NC"
        website="https://anneleanos.bhhscpp.com/"
        email="anneleanos@bhhscpp.com"
        headshotUrl="/images/AnneLeanos.jpg"
        smallLogoUrl="/images/EXP.png"
        tokens={[
          { src: "/images/MW Badge_Military Spouse.png", alt: "Military Spouse" },
          { src: "/images/MW Badge_Military Veteran.png", alt: "Military Veteran" },
        ]}
        serviceAffiliation="Veteran, Service Member, Military Spouse"
        about={`Anne is not your typical Broker/REALTOR®. A U.S. Naval Academy alum who serves as a Captain in the reserves…`}
        social={{
          facebook: "https://www.facebook.com/LIVINGNWILMINGTONNC",
          instagram: "https://www.instagram.com/anne_leanos_livingnwilmington/",
          linkedin: "https://www.linkedin.com/in/anneleanos",
          x: "https://www.mustwants.com/@AnneLeanos",
          bluesky: "", pinterest: "", youtube: ""
        }}
        sponsorLogoUrl="/images/trident.png"
        sponsorHref="https://www.tridenthomeloans.com/"
      />
    </div>
  );
}



