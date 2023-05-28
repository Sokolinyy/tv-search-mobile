import {
  IonCard,
  IonContent,
  IonItem,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import "./search.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import _ from "lodash";

interface SearchResult {
  show: {
    name: string;
    image: {
      medium: string;
    };
    id: number;
  };
}

function Search() {
  const [shows, setShows] = useState<SearchResult[]>([]);
  const [input, setInput] = useState("");

  const fetchData = _.debounce(async (searchTerm) => {
    try {
      const response = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${searchTerm}`
      );
      const data = response.data;
      console.log(data);
      if (data !== undefined) {
        setShows(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, 500); // Set delay of 500ms

  const handleSearch = (event: CustomEvent) => {
    const value = event.detail.value;
    setInput(value);
    fetchData(value);
  };

  return (
    <>
      <IonSearchbar
        value={input}
        placeholder="Search for shows..."
        className="ion-no-padding"
        onIonInput={handleSearch}
        debounce={500}
      ></IonSearchbar>
      <IonList className="ion-no-padding">
        {shows.map((searchResult: SearchResult, index: number) => (
          <div key={index}>
            <IonItem routerLink={`/shows/${searchResult.show.id}/episodes`}>
              {searchResult.show.image && (
                <img
                  src={searchResult.show.image.medium}
                  alt=""
                  className="small-image"
                  style={{ width: 30, height: 40 }}
                />
              )}
              <p className="ion-margin-start">{searchResult.show.name}</p>
            </IonItem>
          </div>
        ))}
      </IonList>
    </>
  );
}
export default Search;
