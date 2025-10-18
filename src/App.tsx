import { useEffect, useState } from "react";
import ProFlipCard from "./components/ProFlipCard/ProFlipCard";
import "./index.css";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="container">
      <button
        className="theme-toggle"
        onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        aria-label="Toggle color theme"
        type="button"
      >
        {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
      </button>

      <ProFlipCard
        width={480}
        height={620}
        name="Anne Leanos"
        title="Broker / REALTOR® — BHHS Carolina Premier Properties"
        location="Wilmington, NC"
        email="anneleanos@bhhscpp.com"
        phone=""
        website="https://anneleanos.bhhscpp.com/"
        serviceAffiliation="Veteran, Service Member, Military Spouse"
        headshotUrl="/images/AnneLeanos.jpg"
        logoSmallUrl="/images/EXP.png"  /* replace with BHHS logo if available */
        affiliationBadgeUrl="/images/MW Badge_Military Veteran.png"
        sponsorLogoUrl="/images/trident.png"  /* put Trident Home Loans logo at public/images/trident.png */
        about={`Anne is not your typical Broker/REALTOR®. A U.S. Naval Academy alum and Navy Reserve Captain with prior sales leadership at Caterpillar and Pepsi. Investor with rentals across TX, NC, TN, and KS. Community mentor at UNCW. Six years active duty and 20 in the reserves. Go Navy!`}
        social={{
          facebook: "https://www.facebook.com/LIVINGNWILMINGTONNC",
          instagram: "https://www.instagram.com/anne_leanos_livingnwilmington/",
          linkedin: "https://www.linkedin.com/in/anneleanos",
        }}
        connectButtonText="Connect with Anne"
        connectToEmail="MustWants@MustWants.com"
      />
    </div>
  );
}


