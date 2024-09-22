"use client";

import React, { HTMLAttributes, useEffect, useRef, useState } from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { useInView } from "framer-motion";
import { div } from "framer-motion/client";
import { cn } from "@/lib/utils";
import Phone from "./Phone";

const PHONES = [
  "/testimonials/1.jpg",
  "/testimonials/2.jpg",
  "/testimonials/3.jpg",
  "/testimonials/4.jpg",
  "/testimonials/5.jpg",
  "/testimonials/6.jpg",
];

function splitArray<T>(arr: Array<T>, arrNumber: number) {
  let result: Array<Array<T>> = [];

  for (let i = 0; i < arr.length; i++) {
    let index = i % arrNumber;
    if (!result[index]) {
      result[index] = [];
    }

    result[index].push(arr[i]);
  }
  return result;
}

function ReviewColumn({
  reviews,
  className,
  reviewClassName,
  msPerPxl = 0,
}: {
  reviews: string[];
  className?: string;
  reviewClassName: (reviewIndex: number) => string;
  msPerPxl?: number;
}) {
  const columnRefs = useRef<HTMLDivElement | null>(null);
  const [columnHeight, setColumnHeight] = useState(0);

  const duration = `${columnHeight * msPerPxl}ms`;

  useEffect(() => {
    if (!columnRefs.current) return;
    const resizeObserver = new window.ResizeObserver(() => {
      setColumnHeight(columnRefs.current?.offsetHeight ?? 0);
    });
    resizeObserver.observe(columnRefs.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
  return (
    <div
      ref={columnRefs}
      className={cn("animate-marquee space-y-8 py-4", className)}
      style={
        {
          "--marquee-duration": duration,
        } as React.CSSProperties
      }
    >
      {reviews.concat(reviews).map((imgSrc, reviewIndex) => {
        return (
          <Review
            key={reviewIndex}
            imgSrc={imgSrc}
            className={reviewClassName?.(reviewIndex % reviews.length)}
          />
        );
      })}
    </div>
  );
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
}

function Review({ imgSrc, className, ...rest }: ReviewProps) {
  const POSSIBLE_ANIMATIONS_DELAYS = ["0s", "0.1s", "0.3s", "0.4s", "0.5s"];
  const animationDelay =
    POSSIBLE_ANIMATIONS_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATIONS_DELAYS.length)
    ];

  return (
    <div
      className={cn(
        "animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5",
        className
      )}
      style={{ animationDelay }}
      {...rest}
    >
      <Phone imgSrc={imgSrc} />
    </div>
  );
}
const ReviewGrid = () => {
  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(columns[2], 2);
  const containerRefs = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRefs, {
    once: true,
    amount: 0.4,
  });

  return (
    <div
      ref={containerRefs}
      className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView ? (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            msPerPxl={10}
            className="font-bold"
            reviewClassName={(index) => {
              return cn({
                "md:hidden": index >= column1.length + column3[0].length,
                "lg:hidden": index >= column1.length,
              });
            }}
          />
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            msPerPxl={15}
            className="font-bold"
            reviewClassName={(index) => {
              return cn({
                "md:hidden": index >= column1.length + column3[0].length,
                "lg:hidden": index >= column1.length,
              });
            }}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            msPerPxl={15}
            className="hidden md:block "
            reviewClassName={(reviewIndex) => {
              return reviewIndex >= column2.length ? "lg:hidden" : "";
            }}
          />
          <ReviewColumn
            reviews={column3.flat()}
            msPerPxl={10}
            className="hidden md:block "
            reviewClassName={(reviewIndex) => {
              return reviewIndex >= column2.length ? "lg:hidden" : "";
            }}
          />
        </>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"/>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"/>
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
