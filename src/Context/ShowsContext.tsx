import React, { useState, createContext, FC } from "react";
import { Show } from "../components/ShowDetail";
import { Preferences } from "@capacitor/preferences";

type ShowContextType = {
  myShows: Show[];
  setMyShows: React.Dispatch<React.SetStateAction<Show[]>>;
  saveShow: (show: Show) => Promise<void>;
};

export const ShowContext = createContext<ShowContextType>({
  myShows: [],
  setMyShows: () => {
    [];
  },
  saveShow: async () => {},
});

export const ShowsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [myShows, setMyShows] = useState<Show[]>([]);

  const saveShow = async (show: Show) => {
    // Get the existing shows
    const { value } = await Preferences.get({ key: "myShows" });
    let existingShows: Show[] = [];
    if (value) {
      existingShows = JSON.parse(value);
    }

    // Check if the show is already saved
    if (!existingShows.some((existingShow) => existingShow.id === show.id)) {
      // Add the new show
      const newShows = [...existingShows, show];

      // Save the updated shows
      await Preferences.set({
        key: "myShows",
        value: JSON.stringify(newShows),
      });

      // Update the state
      setMyShows(newShows);
    }
  };

  return (
    <ShowContext.Provider value={{ myShows, setMyShows, saveShow }}>
      {children}
    </ShowContext.Provider>
  );
};
