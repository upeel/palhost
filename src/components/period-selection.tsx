"use client";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";

const PeriodSelection = () => {
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
              className={`${
                selected ? "bg-orange-500" : "bg-black"
              } text-white p-2 uppercase font-bold text-md relative`}
            >
              Monthly
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            /* Use the `selected` state to conditionally style the selected tab. */
            <button
              className={`${
                selected ? "bg-orange-500" : "bg-black"
              } text-white p-2 uppercase font-bold text-md relative`}
            >
              Quarterly
              <span
                className={`absolute ${
                  selected ? "bg-white text-black" : "bg-orange-500 text-white"
                }  text-xs p-1`}
                style={{
                  top: "-16px",
                  left: 0,
                  transform: "translateX(50%)",
                }}
              >
                50% OFF
              </span>
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            /* Use the `selected` state to conditionally style the selected tab. */
            <button
              className={`${
                selected ? "bg-orange-500" : "bg-black"
              } text-white p-2 uppercase font-bold text-md relative`}
            >
              Semi-Anually
              <span
                className={`absolute ${
                  selected ? "bg-white text-black" : "bg-orange-500 text-white"
                }  text-xs p-1`}
                style={{
                  top: "-16px",
                  left: 0,
                  transform: "translateX(70%)",
                }}
              >
                50% OFF
              </span>
            </button>
          )}
        </Tab>
        <Tab as={Fragment}>
          {({ selected }) => (
            /* Use the `selected` state to conditionally style the selected tab. */
            <button
              className={`${
                selected ? "bg-orange-500" : "bg-black"
              } text-white p-2 uppercase font-bold text-md relative`}
            >
              Anually
              <span
                className={`absolute ${
                  selected ? "bg-white text-black" : "bg-orange-500 text-white"
                }  text-xs p-1`}
                style={{
                  top: "-16px",
                  left: 0,
                  transform: "translateX(25%)",
                }}
              >
                50% OFF
              </span>
            </button>
          )}
        </Tab>
      </Tab.List>
    </Tab.Group>
  );
};

export default PeriodSelection;
