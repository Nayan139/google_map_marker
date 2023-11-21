"use client";
import React, { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useSession } from "next-auth/react";

declare global {
  interface Window {
    initMap: () => void;
  }
}

function GoogleMap() {
  //hooks
  const { data: session } = useSession();

  //state
  const [markerData, setMarkerData] = useState<{ lat: number; lng: number }[]>([
    { lat: 12.97, lng: 77.59 },
  ]);

  /**
   * This method is used for the save data
   */
  const handleSubmit = async (lat: number, lng: number) => {
    try {
      const docRef = await collection(
        db,
        "users",
        session?.user?.email!,
        "map_markers"
      );
      await addDoc(docRef, {
        Location: { lng, lat },
        timestamp: +new Date(),
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  /**
   * This method is used for the fetching the data from the firestore
   */
  const fetchMapMarker = async () => {
    try {
      //Get the data from the firestore
      const querySnapshot = await getDocs(
        query(
          collection(db, "users", session?.user?.email!, "map_markers"),
          orderBy("Location")
        )
      );
      const pinnedData: { lat: number; lng: number }[] = [
        ...querySnapshot.docs.map((doc) => doc?.data()?.Location),
      ];
      //Set data into the local state
      setMarkerData(() =>
        pinnedData.length
          ? [{ lat: 12.97, lng: 77.59 }, ...pinnedData]
          : [{ lat: 12.97, lng: 77.59 }]
      );
    } catch (error) {
      console.error("error :>> ", error);
    }
  };

  /**
   * This effect will call the the fetchMapMarker method while session has data
   */
  useEffect(() => {
    // fetchMapMarker();

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPKEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      // if (session?.user?.email) fetchMapMarker();
      initMap();
    });

    function initMap(): void {
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;

      const bangalore = markerData;

      // Create a new map.
      const map = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 12,
          center: bangalore[0], // Set the center of the map to the first location.
        }
      );

      // Add markers for each location in the bangalore array.
      bangalore.forEach((data) => {
        addMarker(data, map);
      });

      // This event listener calls addMarker() when the map is clicked.
      window.google.maps.event.addListener(map, "click", (event: any) => {
        addMarker(event.latLng, map);
        handleSubmit(event.latLng.lat(), event.latLng.lng());
      });

      // Adds a marker to the map.
      function addMarker(
        location: google.maps.LatLngLiteral,
        map: google.maps.Map
      ) {
        new window.google.maps.Marker({
          position: location,
          label: labels[labelIndex++ % labels.length],
          map: map,
        });
      }
    }

    window.initMap = initMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerData]);

  useEffect(() => {
    if (session?.user?.email) fetchMapMarker();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  return <div className="h-[calc(100vh-78px)] w-screen" id="map"></div>;
}

export default GoogleMap;
