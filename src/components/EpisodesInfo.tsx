import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styles from "./EpisodesInfo.module.scss";

interface Episode {
  name: string;
  season: number;
  number: number;
  airdate: string;
}

interface Season {
  number: number;
  episodes: Episode[];
}

const EpisodesInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    const fetchExtraData = async () => {
      try {
        const response = await axios.get(
          `https://api.tvmaze.com/shows/${id}/episodes`
        );
        const data: Episode[] = response.data;

        const seasons: Season[] = data.reduce((acc: Season[], episode) => {
          const existingSeason = acc.find(
            (season) => season.number === episode.season
          );
          if (existingSeason) {
            existingSeason.episodes.push(episode);
          } else {
            acc.push({ number: episode.season, episodes: [episode] });
          }
          return acc;
        }, []);

        setSeasons(seasons);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchExtraData();
  }, [id]);

  return (
    <IonAccordionGroup>
      {seasons.map((season) => (
        <IonAccordion value={season.number.toString()} key={season.number}>
          <IonItem slot="header" color="light">
            <IonLabel>Season {season.number}</IonLabel>
          </IonItem>
          <IonGrid slot="content">
            <IonRow className="ion-align-items-center">
              <IonCol className="ion-text-center">Name</IonCol>
              <IonCol className="ion-text-center">Number</IonCol>
              <IonCol className="ion-text-center">Date</IonCol>
            </IonRow>
            {season.episodes.map((episode, index) => (
              <IonRow
                className={`ion-align-items-center ${
                  index % 2 === 0 ? styles.rowColorLight : styles.rowColorDark
                }`}
                key={episode.number}
              >
                <IonCol
                  className="ion-text-center"
                  style={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {episode.name}
                </IonCol>
                <IonCol
                  className="ion-text-center"
                  style={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {episode.number}
                </IonCol>
                <IonCol
                  className="ion-text-center"
                  style={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {new Date(episode.airdate).toLocaleDateString("en-GB")}
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        </IonAccordion>
      ))}
    </IonAccordionGroup>
  );
};

export default EpisodesInfo;
