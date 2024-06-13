"use client";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";

const PlatformSelection = () => {
  return (
    <Tab.Group>
      <Tab.List
        as="div"
        style={{
          width: "max-content",
        }}
      >
        <Tab as={Fragment}>
          {({ selected }) => (
            /* Use the `selected` state to conditionally style the selected tab. */
            <button
              className={
                selected
                  ? "bg-black text-white p-2 uppercase text-md font-bold"
                  : "bg-white text-black text-xl font-bold"
              }
            >
              STEAM
            </button>
          )}
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
};

export default PlatformSelection;
