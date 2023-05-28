import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";

interface Show {
  id: number;
  image: {
    medium: string;
    original: string;
  };
  externals: {
    imdb: string;
    thetvdb: number;
    tvrage: number;
  };
  genres: string[];
  name: string;
  rating: {
    average: number;
  };
  status: string;
  runtime: number;
  summary: string;
}

const ShowCard: React.FC<{ show: Show }> = ({ show }) => {
  return (
    <>
      <IonCard
        key={show.id}
        button
        routerLink={`/shows/${show.id}/episodes`}
        style={{ fontSize: 20 }}
      >
        {show.image && show.image.medium && (
          <>
            <IonImg src={show.image.medium} alt={show.name} />
            <IonCardHeader>
              <IonCardTitle>{show.name}</IonCardTitle>
              <IonRow className="ion-align-items-center">
                <IonCol>
                  <p>
                    <IonIcon icon={star} style={{ paddingRight: 5 }} />
                    {show.rating.average ? show.rating.average : "Undefined"}
                  </p>
                </IonCol>
                <IonCol>{`${show.runtime} min`}</IonCol>
                <IonCol>{show.status}</IonCol>
              </IonRow>
              <p>{show.genres.join(", ")}</p>
              <p
                className="ion-no-margin"
                dangerouslySetInnerHTML={{
                  __html:
                    show.summary.length > 150
                      ? show.summary.slice(0, 140) + "..."
                      : show.summary,
                }}
              />
            </IonCardHeader>
            <IonCardContent>
              {/* Other details can be included here */}
            </IonCardContent>
          </>
        )}
      </IonCard>
    </>
  );
};

export default ShowCard;
