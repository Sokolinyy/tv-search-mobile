import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonNav,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Search from "./Search/Search";
import { star } from "ionicons/icons";
import styles from "./ShowDetail.module.scss";
import EpisodesInfo from "./EpisodesInfo";
import { Preferences } from "@capacitor/preferences";
import { ShowContext } from "../Context/ShowsContext";

export interface Show {
  id: number;
  image: {
    medium: string;
    original: string;
  };
  name: string;
  rating: {
    average: number;
  };
  runtime: number;
  summary: string;
  number: number;
  airdate: number;
  status: string;
  genres: [];
  nextAirdate: string;
}

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Let's say you have a state variable for your data
  const [showData, setShowData] = useState<Show | null>(null);
  const { saveShow } = useContext(ShowContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.tvmaze.com/shows/${id}`);
        const data = response.data;
        setShowData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [id]);

  if (showData === null) {
    return <IonPage>Loading...</IonPage>;
  }

  const addShow = () => {
    saveShow(showData);
  };
  return (
    <>
      <IonPage>
        <IonHeader>
          <Search />
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/shows" />
            </IonButtons>
            <IonTitle class="ion-text-center">{showData.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonImg src={showData.image.medium} />
          <IonRow className="ion-align-items-center">
            <IonCol className="ion-text-center">
              <p>
                <IonIcon icon={star} style={{ paddingRight: 5 }} />
                {showData.rating.average
                  ? showData.rating.average
                  : "Undefined"}
              </p>
            </IonCol>
            <IonCol className="ion-text-center">{`${showData.runtime} min`}</IonCol>
            <IonCol className="ion-text-center">{showData.status}</IonCol>
          </IonRow>
          <p className={`ion-text-center ${styles.genre}`}>
            {showData.genres.join(", ")}
          </p>
          <IonButton
            style={{ display: "block", margin: "auto" }}
            onClick={addShow}
          >
            Add to My shows
          </IonButton>
          <p
            dangerouslySetInnerHTML={{
              __html: showData.summary,
            }}
          />
          <EpisodesInfo />
        </IonContent>
      </IonPage>
    </>
  );
};

export default ShowDetails;
