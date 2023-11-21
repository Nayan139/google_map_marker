"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { ArrowLeftOnRectangleIcon, TrashIcon } from "@heroicons/react/20/solid";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";

const Header = () => {
  //Hooks
  const { data: session } = useSession();

  // /**
  //  * This method is using for the clear all the marker from the database
  //  */
  const handleClearAllPin = async () => {
    try {
      // Get all documents in the collection
      const querySnapshot = await getDocs(
        query(
          collection(db, "users", session?.user?.email!, "map_markers"),
          orderBy("Location")
        )
      );

      // Delete each document
      querySnapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // If you also want to delete the collection after deleting all documents
      // you can use the following line:
      // await deleteDoc(collectionRef);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  return (
    <div className="h-[78px]">
      <div className="flex justify-between p-4">
        <div className="flex flex-col ">
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => handleClearAllPin()}
          >
            <TrashIcon className="h-6 w-6 " />
          </div>
          <div className="font-semibold text-xl max-sm:text-base">
            Clear all
          </div>
        </div>
        <div className="flex items-center font-bold text-3xl max-sm:text-base">
          Google Marker
        </div>
        <div className="flex flex-col ">
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6 " />
          </div>
          <div className="font-semibold text-xl max-sm:text-base">Logout</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
