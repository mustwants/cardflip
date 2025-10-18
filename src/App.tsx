import React from "react";
import ProFlipCard from "./components/ProFlipCard/ProFlipCard";

export default function App() {
  return (
    <div style={{
      minHeight: "100svh",
      display: "grid",
      placeItems: "center",
      background: "#0a0d12",
      padding: 24
    }}>
      <ProFlipCard
        width={420}
        height={560}
        name="Anne Leanos"
        title="REALTOR® | eXp Realty"
        email="anne@example.com"
        phone="+1 (904) 555-0182"
        website="https://example.com/anne"
        headshotUrl="/images/AnneLeanos.jpg"
        logoSmallUrl="/images/EXP.jpg"
        affiliationBadgeUrl="/images/MW_Badge_Military_Veteran.png"
        about={`Anne Leanos is a Military Spouse & Veteran advocate helping families PCS with clarity.
She specializes in St. Johns County neighborhoods, new construction, and VA loan strategy.
Client-first, data-driven, and MustWants-aligned for seamless moves.`}
        social={{
          linkedin: "https://www.linkedin.com/",
          facebook: "https://www.facebook.com/",
          instagram: "https://www.instagram.com/"
        }}
      />
    </div>
  );
}
