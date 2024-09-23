import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { HTMLAttributes } from "react";
import { object } from "zod";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
}
const Phone = ({ className, imgSrc, dark, ...props }: PhoneProps) => {
  return (
    <div
      className={cn(
        "relative pointer-events-none z-50 overflow-hidden",
        className
      )}
      {...props}
    >
      <img
        src={
          dark
            ? "/phone-template-dark-edges.png"
            : "/phone-template-white-edges.png"
        }
        className="pointer-events-none z-50 select-none"
        alt="Phone Image"
      />
      <div className="absolute -z-10 inset-0">
        <img
          className="object-cover min-w-full min-h-full"
          src={imgSrc}
          alt="Overlaying Phone image"
        />
      
      </div>
    </div>
  );
};

export default Phone;
