import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { ellipse, triangle } from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

// Default styles
import "./App.scss";

import MyShows from "./pages/MyShows";
import ShowDetails from "./components/ShowDetail";
import AllTvShows from "./pages/AllTvShows";
import { ShowsProvider } from "./Context/ShowsContext";

setupIonicReact();

const App: React.FC = () => (
  <ShowsProvider>
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/shows">
              <AllTvShows />
            </Route>
            <Route exact path="/shows/:id/episodes">
              <ShowDetails />
            </Route>
            <Route exact path="/myshows">
              <MyShows />
            </Route>
            <Route exact path="/">
              <Redirect to="/shows" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="shows" href="/shows">
              <IonIcon aria-hidden="true" icon={triangle} />
              <IonLabel>All Shows</IonLabel>
            </IonTabButton>
            <IonTabButton tab="myshows" href="/myshows">
              <IonIcon aria-hidden="true" icon={ellipse} />
              <IonLabel>My Shows</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </ShowsProvider>
);

export default App;
