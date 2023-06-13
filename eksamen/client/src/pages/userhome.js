import React from "react";
import styles from "../home.module.css";
import { NavLink } from "react-router-dom";

function UserHome() {
  return (
    <div className={styles.homeDiv}>
      <div className={styles.navbar}>
        <div className={styles.navItem}>
          <NavLink to="/home" className={styles.active}>
            Bølger&Skvalp
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <NavLink to="/mypage" className={styles.active}>
            Min side
          </NavLink>
        </div>
        <div className={styles.navItem}>
          <a href="/signup">Logout</a>
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
        </div>
      </div>
    </div>
  );
}

export default UserHome;
