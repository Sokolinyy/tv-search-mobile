import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Search from "../components/Search/Search";

const MyShows: React.FC = () => {
  return (
    <IonPage>
      <Search />
      <IonContent></IonContent>
    </IonPage>
  );
};

export default MyShows;
