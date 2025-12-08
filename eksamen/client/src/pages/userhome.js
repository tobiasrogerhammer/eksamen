import React from "react";
import styles from "../home.module.css";
import { NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";

function UserHome() {
  const navbarItems = [
    { to: "/userhome", label: "Hjem" },
    { to: "/mypage", label: "Min side" },
    { to: "/signup", label: "Logg ut" },
  ];

  return (
    <div className={styles.homeDiv}>
      <Navbar items={navbarItems} />
      <div className={styles.homePage}>
        <div className={styles.headline}>
          <h1 className={styles.headlineTitle}>
            Velkommen til Bølger & Skvalp
          </h1>
          <div className={styles.heroDescription}>
            <p>
              Dette er en eksamensbesvarelse i VG2 for et fullstack-prosjekt.
              Prosjektet inkluderer brukerregistrering, innlogging,
              båtregistrering, møteplanlegging, chat-funksjonalitet,
              politihistorikk og admin-panel med forskjellige roller og
              funksjoner.
            </p>
          </div>
        </div>
        <div className={styles.aboutUs}>
          <h2 className={styles.aboutTitle}>Om Bølger & Skvalp</h2>

          <section className={styles.aboutSection}>
            <h3 className={styles.sectionHeading}>Vår historie</h3>
            <p>
              Båtforeningen "Bølger&Skvalp" ble grunnlagt i 1952 av en gruppe
              entusiastiske båteiere som ønsket å dele sin kjærlighet for sjøen
              og båtlivet. Foreningen ble etablert ved den vakre kystbyen
              Havnesty, som var kjent for sitt pittoreske landskap og sin rike
              maritime historie.
            </p>
            <p>
              Foreningen fikk navnet "Bølger&Skvalp" for å symbolisere det
              dynamiske samspillet mellom båtene og sjøen. Bølger representerer
              den uforutsigbare og kraftfulle naturen til havet, mens skvalp
              står for den beroligende lyden av små bølger som slår mot båtens
              skrog.
            </p>
            <p>
              I dag, over 70 år etter grunnleggelsen, har Bølger&Skvalp vokst
              til å bli en av de mest anerkjente båtforeningene i regionen.
              Medlemskapet har utvidet seg til å inkludere både erfarne båteiere
              og de som er nye i båtlivet.
            </p>
          </section>

          <section className={styles.aboutSection}>
            <h3 className={styles.sectionHeading}>Båthavnen</h3>
            <p>
              Bølger&Skvalp har sin egen idylliske båthavn som ligger langs
              kysten av Havnesty. Havnen er godt utstyrt med moderne fasiliteter
              som drivstoffstasjon, vannforsyning og strømuttak ved bryggene.
              Medlemmene kan trygt fortøye båtene sine og nyte den vakre
              utsikten over havet.
            </p>
          </section>

          <section className={styles.aboutSection}>
            <h3 className={styles.sectionHeading}>Medlemskap</h3>
            <p>
              Bølger&Skvalp tilbyr ulike medlemskapsnivåer som passer til
              forskjellige behov. Medlemmene kan dra nytte av eksklusive
              fordeler som tilgang til medlemsarrangementer, rabatter på
              båtutstyr og tilgang til fellesfasiliteter som klubbhuset og
              verkstedet.
            </p>
          </section>

          <section className={styles.aboutSection}>
            <h3 className={styles.sectionHeading}>Båtopplæring</h3>
            <p>
              Foreningen legger stor vekt på båtsikkerhet og tilbyr opplæring og
              sertifisering for medlemmene. Det arrangeres jevnlig kurs og
              workshops om navigasjon, sjømannskap og førstehjelp. Dette bidrar
              til å sikre at medlemmene har nødvendig kunnskap og ferdigheter
              for å nyte båtlivet på en trygg og ansvarlig måte.
            </p>
          </section>

          <section className={styles.aboutSection}>
            <h3 className={styles.sectionHeading}>
              Arrangementer og aktiviteter
            </h3>
            <p>
              Bølger&Skvalp organiserer et bredt spekter av arrangementer og
              aktiviteter gjennom året. Dette inkluderer båtutflukter til vakre
              destinasjoner i nærområdet, fiskekonkurranser, sosiale
              sammenkomster og temakvelder. Medlemmene har mulighet til å delta
              i fellesskapet, utvide sin kunnskap og oppleve spennende eventyr
              på sjøen.
            </p>
          </section>

          <section className={styles.aboutSection}>
            <h3 className={styles.sectionHeading}>
              Samarbeid med lokalsamfunnet
            </h3>
            <p>
              Bølger&Skvalp har et sterkt engasjement for å bidra til
              lokalsamfunnet og bevare den maritime arven i Havnesty. Foreningen
              deltar i miljøinitiativer som strandrydding, deltakelse i
              kystvakten og samarbeid med lokale organisasjoner for bevaring av
              marine økosystemer. Gjennom slike tiltak ønsker Bølger&Skvalp å
              være en positiv kraft i lokalsamfunnet og øke bevisstheten om
              viktigheten av å ta vare på havet.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
