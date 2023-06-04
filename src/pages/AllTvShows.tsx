import {
  IonCol,
  IonContent,
  IonGrid,
  IonPage,
  IonRow,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import Search from "../components/Search/Search";

import axios from "axios";
import { useEffect, useState } from "react";
import ShowCard from "../components/ShowCard";

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
  console.log("fetched");
  const [shows, setShows] = useState<Show[]>([]);
  const [disableInfiniteScroll, setDisableInfiniteScroll] =
    useState<boolean>(false);
  const [currentShowIndex, setCurrentShowIndex] = useState(0);
  const showsPerPage = 10;

  async function fetchData() {
    try {
      const response = await axios.get("https://api.tvmaze.com/shows");
      const data = await response.data;

      if (data) {
        // Extract the range of data
        const slicedData = data.slice(
          currentShowIndex,
          currentShowIndex + showsPerPage
        );

        // Update the list of shows
        setShows((prevShows) => [...prevShows, ...slicedData]);

        // Update the current show index
        setCurrentShowIndex((prevIndex) => prevIndex + showsPerPage);

        // If there's no more data, disable the infinite scroll
        if (slicedData.length < showsPerPage) {
          setDisableInfiniteScroll(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    setCurrentShowIndex(0); // reset index before first fetchData
    fetchData();
  }, []);

  return (
    <>
      <IonPage>
        <Search />
        <IonContent>
          <IonGrid className="ion-align-items-center ion-justify-content-center ion-text-center">
            <IonRow>
              {shows.map((show, index) => (
                <IonCol size="12" size-md="6" key={index}>
                  <ShowCard show={show} />
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
          <IonInfiniteScroll
            threshold="100px"
            disabled={disableInfiniteScroll}
            onIonInfinite={async (e: CustomEvent<void>) => {
              await fetchData();
              (e.target as HTMLIonInfiniteScrollElement).complete();
            }}
          >
            <IonInfiniteScrollContent loadingText="Loading more shows..."></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      </IonPage>
    </>
  );
};

export default AllTvShows;
