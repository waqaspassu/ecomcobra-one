"use client";
import React, { useEffect, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NextImage from "next/image";
import { cn } from "@/lib/utils";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, Radio, RadioGroup } from "@headlessui/react";
import { color } from "framer-motion";
import { COLORS } from "@/validators/options-validator";
import { option } from "framer-motion/client";
import { Label } from "@/components/ui/label";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimentions: {
    width: number;
    height: number;
  };
}
const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimentions,
}: DesignConfiguratorProps) => {
  // const [options, setOptions] = useState<{
  //   color: (typeof COLORS)[number];
  // }>({
  //   color: COLORS[0],
  // });
  const [options, setOptions] = useState(COLORS[0]);

  console.log({ options }, { COLORS });

  return (
    <div className="relative mt-20 grid grid-cols-3 mb-20 pb-20">
      <div className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ">
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ratio={896 / 1832}
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="Phone Image"
              src="/phone-template.png"
              className="pointer-events-none z-50 select-none"
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]"></div>
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-${options.tw}`
            )}
          />
        </div>
        <Rnd
          default={{
            x: 150,
            y: 205,
            height: imageDimentions.height / 4,
            width: imageDimentions.width / 4,
          }}
          lockAspectRatio
          resizeHandleComponent={{
            bottomRight: <HandleComponent />,
            bottomLeft: <HandleComponent />,
            topRight: <HandleComponent />,
            topLeft: <HandleComponent />,
          }}
          className="absolute z-20 border-[3px] border-primary"
        >
          <div className="relative w-full h-full">
            <NextImage
              src={imageUrl}
              fill
              alt="your image"
              className="pointer-events-none"
            />
          </div>
        </Rnd>
      </div>
      <div className="h-[37.5ref] flex flex-col bg-white">
        <ScrollArea className="relative flex-1 overflow-auto">
          <div
            aria-hidden="true"
            className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none"
          />
          <div className="px-8 pb-12 pt-8">
            <h2 className="tracking-tight font-bold text-3xl">
              Customize your case
            </h2>
            <div className="w-full h-px bg-zinc-200 my-6" />
            <div className="relative mt-4 h-full flex flex-col justify-between">
              <RadioGroup value={options} onChange={setOptions}>
                <Label>Color: {options.label}</Label>
                <div className="mt-3 flex items-center">
                  {COLORS.map((color) => {
                    return (
                      <Field
                        key={color.label}
                        className="flex items-center gap-2 flex-col mx-2 mb-3"
                      >
                        <Radio
                          value={color}
                          className={({ active, checked }: any) =>
                            cn(
                              "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 active:ring-0 focus:right-0 active:outine-none focus:outline-none border-2 border-transparent",
                              { [`border-${color.tw}`]: true }
                            )
                          }
                        >
                          <span
                            className={cn(
                              `bg-${color.tw} `,
                              "h-8 w-8 rounded-full border border-black border-opacity-10"
                            )}
                          />
                        </Radio>
                        <div className="relative flex flex-col">
                          <Label className="relative">{color.value}</Label>
                        </div>
                      </Field>
                    );
                  })}
                </div>
              </RadioGroup>
              <div>
                <Label>Model</Label>
                <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">Open</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default DesignConfigurator;
