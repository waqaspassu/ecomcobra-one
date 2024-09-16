"use client";

import React, { useRef } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";

const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

function splitArray<T>(arr:Array<T>, arrNumber: number) {
  let result: Array<Array<T>> = [];

  for (let i = 0; i < arr.length; i++) {
    let index = i % arrNumber;
    console.log("index", index);
    if (!result[index]) {
      result[index] = [];
    }

    result[index].push(arr[i])
  }
  return result
}
const ReviewGrid = () => {
  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1]
  const containerRefs = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRefs, {
    once: true,
    amount: 0.4,
  });

  console.log(columns, "test");
  return (
    <div
      ref={containerRefs}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      kjlf
    </div>
  );
};
const Reviews = () => {
  return (
    <MaxWidthWrapper className="relative max-w-5xl">
      <img
        aria-hidden="true"
        src="/what-people-are-buying.png"
        className="absolute select-none hidden xl:block -left-32 top-1/3 "
      />

      <ReviewGrid />
    </MaxWidthWrapper>
  );
};

export default Reviews;
