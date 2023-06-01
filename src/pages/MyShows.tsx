import React, { useEffect, useState } from "react";
import {
  IonAvatar,
  IonCol,
  IonContent,
  IonItem,
  IonPage,
  IonRow,
} from "@ionic/react";
import axios from "axios";
import { Preferences } from "@capacitor/preferences";
import Search from "../components/Search/Search";
import { trash } from "ionicons/icons";
import {
  LocalNotifications,
  ScheduleOptions,
} from "@capacitor/local-notifications";

interface Show {
  id: number;
  image: {
    medium: string;
    original: string;
  };
  name: string;
  rating: {
    average: number;
  };
  nextAirdate: string;
}

interface Episode {
  airdate: string;
}

const MyShows: React.FC = () => {
  const [myShows, setMyShows] = useState<Show[]>([]);

  const getShow = async () => {
    // Get the existing shows
    try {
      const { value } = await Preferences.get({ key: "myShows" });

      const shows: Show[] = value ? JSON.parse(value) : [];

      for (const show of shows) {
        const response = await axios.get(
          `https://api.tvmaze.com/shows/${show.id}/episodes`
        );
        const episodes: Episode[] = response.data;
        console.log(episodes);

        // Sort episode by date
        const sortedEpisodes = episodes.sort((a: Episode, b: Episode) => {
          const dateA = new Date(a.airdate);
          const dateB = new Date(b.airdate);
          return dateA.getTime() - dateB.getTime();
        });

        // Find nearest episode by date
        const currentDate = new Date();
        const nextEpisode = sortedEpisodes.find((episode: Episode) => {
          const episodeDate = new Date(episode.airdate);
          return episodeDate.getTime() > currentDate.getTime();
        });
        if (nextEpisode) {
          const formattedDate = new Date(
            nextEpisode.airdate
          ).toLocaleDateString("en-GB");
          show.nextAirdate = formattedDate;

          let notificationOneDateBefore = new Date(nextEpisode.airdate);
          notificationOneDateBefore.setDate(
            notificationOneDateBefore.getDate() - 1
          );

          let notificationDayRelease = new Date(nextEpisode.airdate);

          const notificationDate = new Date();
          notificationDate.setMilliseconds(
            notificationDate.getMilliseconds() + 100
          );

          if (show.nextAirdate != "Unknown") {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: "Напоминание о серии",
                  body: `Следующий эпизод сериала ${show.name} выйдет завтра!`,
                  id: show.id,
                  schedule: { at: notificationOneDateBefore }, // Use the new notification date
                },
              ],
            });
          }
        } else {
          show.nextAirdate = "Unknown";
        }
      }
      setMyShows(shows);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  if (myShows === null || myShows === undefined) {
    return <IonPage>Loading</IonPage>;
  }

  return (
    <IonPage>
      <Search />
      <IonContent>
        <div>
          {myShows.map((item) => {
            return (
              <IonItem
                key={item.id}
                className="ion-margin-top ion-margin-end"
                routerLink={`/shows/${item.id}/episodes`}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  padding: "10px",
                }}
              >
                <IonRow className="ion-justify-content-between ion-align-items-center">
                  <IonAvatar className="ion-margin-end">
                    <img src={item.image.medium} alt="Avatar of Show" />
                  </IonAvatar>
                  <IonCol className="ion-align-items-center">
                    <p style={{ fontSize: 20, margin: 0, marginTop: 20 }}>
                      {item.name}
                    </p>
                    <IonRow>
                      <p style={{ marginTop: 10 }}>
                        Next Episode: <strong>{item.nextAirdate}</strong>
                      </p>
                    </IonRow>
                  </IonCol>
                </IonRow>
              </IonItem>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyShows;
