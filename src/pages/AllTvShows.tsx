import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Search from "../components/Search/Search";

import axios from "axios";
import { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";
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

const AllTvShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [extraData, setExtraData] = useState<Show[]>([]);

  async function fetchData() {
    try {
      const response = await axios.get("https://api.tvmaze.com/shows");
      const data = response.data;
      if (data !== undefined) {
        setShows(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <IonPage>
        <Search />
        <IonContent>
          <IonGrid className="ion-align-items-center ion-justify-content-center ion-text-center">
            <IonRow>
              {shows && Array.isArray(shows)
                ? shows.map((show) => (
                    <IonCol size="12" size-md="6" key={show.id}>
                      <ShowCard show={show} />
                    </IonCol>
                  ))
                : null}
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AllTvShows;
