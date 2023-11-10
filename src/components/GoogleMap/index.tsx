"use client";
import React, { useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase";

declare global {
  interface Window {
    initMap: () => void;
  }
}

function GoogleMap() {
  const handleSubmit = async (lng: number, lat: number) => {
    try {
      const docRef = await collection(db, "map_markers");
      await addDoc(docRef, {
        Location: { lng, lat },
        timestamp: +new Date(),
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPKEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      initMap();
    });

    function initMap(): void {
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let labelIndex = 0;

      const bangalore = { lat: 12.97, lng: 77.59 };
      const map = new window.google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          zoom: 12,
          center: bangalore,
        }
      );

      // This event listener calls addMarker() when the map is clicked.
      window.google.maps.event.addListener(map, "click", (event: any) => {
        addMarker(event.latLng, map);
        handleSubmit(event.latLng.lat(), event.latLng.lng());
      });

      // Add a marker at the center of the map.
      addMarker(bangalore, map);

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
  }, []);

  return <div className="h-screen w-screen" id="map"></div>;
}

export default GoogleMap;
