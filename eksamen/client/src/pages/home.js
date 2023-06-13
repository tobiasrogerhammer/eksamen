import React from "react";
import styles from "../home.module.css";
import { NavLink } from "react-router-dom";

function Home() {
  return (
    <div className={styles.homeDiv}>
      <div className={styles.navbar}>
        <div className={styles.navItem}>
          <NavLink to="/home" className={styles.active}>
            Bølger&Skvalp
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <NavLink to="/signup" className={styles.active}>
            Logg inn
          </NavLink>
        </div>
      </div>
      <div className={styles.homePage}>
        <div className={styles.headline}>Velkommen til Bølger & Skvalp</div>
        <div className={styles.aboutUs}>
          <h2>Om Bølger & Skvalp</h2>
          <p>
            Båtforeningen "Bølger&Skvalp" ble grunnlagt i 1952 av en gruppe
            entusiastiske båteiere som ønsket å dele sin kjærlighet for sjøen og
            båtlivet. Foreningen ble etablert ved den vakre kystbyen Havnesty,
            som var kjent for sitt pittoreske landskap og sin rike maritime
            historie. Havnesty hadde lenge vært et samlingssted for sjøfolk,
            fiskere og båtentusiaster, og det var her ideen om Bølger&Skvalp
            først ble unnfanget. Grunnleggerne ønsket å skape et fellesskap som
            kunne bringe sammen mennesker med en felles lidenskap for båtlivet
            og dele erfaringer, kunnskap og eventyr. Foreningen fikk navnet
            "Bølger&Skvalp" for å symbolisere det dynamiske samspillet mellom
            båtene og sjøen. Bølger representerer den uforutsigbare og
            kraftfulle naturen til havet, mens skvalp står for den beroligende
            lyden av små bølger som slår mot båtens skrog. Bølger&Skvalp ble
            raskt kjent for sitt mangfoldige medlemskap og sine spennende
            arrangementer. Foreningen organiserte jevnlige båtutflukter og
            konkurranser, hvor medlemmene kunne vise frem sine ferdigheter som
            båtførere og samtidig nyte det vakre kystlandskapet. Det ble også
            arrangert sosiale sammenkomster, hvor medlemmene kunne utveksle
            historier, tips og triks, og danne varige vennskap. I dag, over 70
            år etter grunnleggelsen, har Bølger&Skvalp vokst til å bli en av de
            mest anerkjente båtforeningene i regionen. Medlemskapet har utvidet
            seg til å inkludere både erfarne båteiere og de som er nye i
            båtlivet. Foreningen er fortsatt dedikert til å skape et fellesskap
            av sjøelskere og bidra til å bevare og fremme sjømannskulturen og
            respekten for havet.
          </p>
          <p>
            Båthavnen: Bølger&Skvalp har sin egen idylliske båthavn som ligger
            langs kysten av Havnesty. Havnen er godt utstyrt med moderne
            fasiliteter som drivstoffstasjon, vannforsyning og strømuttak ved
            bryggene. Medlemmene kan trygt fortøye båtene sine og nyte den vakre
            utsikten over havet.{" "}
          </p>

          <p>
            Medlemskap: Bølger&Skvalp tilbyr ulike medlemskapsnivåer som passer
            til forskjellige behov. Medlemmene kan dra nytte av eksklusive
            fordeler som tilgang til medlemsarrangementer, rabatter på båtutstyr
            og tilgang til fellesfasiliteter som klubbhuset og verkstedet.
          </p>

          <p>
            Båtopplæring: Foreningen legger stor vekt på båtsikkerhet og tilbyr
            opplæring og sertifisering for medlemmene. Det arrangeres jevnlig
            kurs og workshops om navigasjon, sjømannskap og førstehjelp. Dette
            bidrar til å sikre at medlemmene har nødvendig kunnskap og
            ferdigheter for å nyte båtlivet på en trygg og ansvarlig måte.
          </p>

          <p>
            Arrangementer og aktiviteter: Bølger&Skvalp organiserer et bredt
            spekter av arrangementer og aktiviteter gjennom året. Dette
            inkluderer båtutflukter til vakre destinasjoner i nærområdet,
            fiskekonkurranser, sosiale sammenkomster og temakvelder. Medlemmene
            har mulighet til å delta i fellesskapet, utvide sin kunnskap og
            oppleve spennende eventyr på sjøen.
          </p>

          <p>
            Samarbeid med lokalsamfunnet: Bølger&Skvalp har et sterkt
            engasjement for å bidra til lokalsamfunnet og bevare den maritime
            arven i Havnesty. Foreningen deltar i miljøinitiativer som
            strandrydding, deltakelse i kystvakten og samarbeid med lokale
            organisasjoner for bevaring av marine økosystemer. Gjennom slike
            tiltak ønsker Bølger&Skvalp å være en positiv kraft i lokalsamfunnet
            og øke bevisstheten om viktigheten av å ta vare på havet.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
