import ProFlipCard from "./components/ProFlipCard/ProFlipCard";

export default function App() {
  return (
    <div style={{ minHeight: "100svh", display: "grid", placeItems: "center", padding: 24 }}>
      <ProFlipCard
        width={460}
        height={600}
        name="Anne Leanos"
        title="Broker / REALTOR® — BHHS Carolina Premier Properties"
        location="Wilmington, NC"
        email="anneleanos@bhhscpp.com"
        phone=""
        website="https://anneleanos.bhhscpp.com/"
        serviceAffiliation="Veteran, Service Member, Military Spouse"
        headshotUrl="/images/AnneLeanos.jpg"
        logoSmallUrl="/images/EXP.png"
        affiliationBadgeUrl="/images/MW Badge_Military Veteran.png"
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


