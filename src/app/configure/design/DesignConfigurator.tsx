"use client";
import React, { useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import NextImage from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { Rnd } from "react-rnd";
import HandleComponent from "@/components/HandleComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, Radio, RadioGroup } from "@headlessui/react";
import { color } from "framer-motion";
import {
  COLORS,
  FINISHES,
  MATERIALS,
  MODELS,
} from "@/validators/options-validator";
import { option } from "framer-motion/client";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";
import { BASE_PRICE } from "@/config/products";
import { useUploadThing } from "@/lib/uploadthing";
import { fromJSON } from "postcss";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { saveConfig as _saveConfig, SaveConfigArgsType } from "./action";
import { useRouter } from "next/navigation";

interface DesignConfiguratorProps {
  configId: string;
  imageUrl: string;
  imageDimentions: {
    width: number;
    height: number;
  };
}

type ColorType = {
  label: string;
  value: string;
  tw: string;
};

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
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: saveConfig } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgsType) => {
      await Promise.all([SaveConfiguration(), _saveConfig(args)]);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error at our end. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push(`/configure/preview?id=${configId}`);
    },
  });
  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    model: (typeof MODELS.options)[number];
    material: (typeof MATERIALS.options)[number];
    finish: (typeof FINISHES.options)[number];
  }>({
    color: COLORS[0],
    model: MODELS.options[0],
    material: MATERIALS.options[0],
    finish: FINISHES.options[0],
  });

  const [renderedDimention, setRenderedDimention] = useState({
    width: imageDimentions.width / 4,
    height: imageDimentions.height / 4,
  });

  const [renderedPosition, setRenderedPosition] = useState({
    x: 150,
    y: 205,
  });

  const phoneCaseRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { startUpload } = useUploadThing("imageUploader");
  async function SaveConfiguration() {
    try {
      const {
        left: caseLeft,
        top: caseTop,
        width,
        height,
      } = phoneCaseRef.current!.getBoundingClientRect();

      const { left: containerLeft, top: containerTop } =
        containerRef.current!.getBoundingClientRect();

      const leftOffset = caseLeft - containerLeft;
      const topOffest = caseTop - containerTop;
      const actualX = renderedPosition.x - leftOffset;
      const actualY = renderedPosition.y - topOffest;

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      const userImage = new Image();
      userImage.crossOrigin = "anonymous";
      userImage.src = imageUrl;
      await new Promise((resolve) => (userImage.onload = resolve));

      ctx?.drawImage(
        userImage,
        actualX,
        actualY,
        renderedDimention.width,
        renderedDimention.height
      );

      const base64 = canvas.toDataURL();
      const base64Data = base64.split(",")[1];

      const blob = base64ToBlob(base64Data, "image/png");
      const file = new File([blob], "filename.png", {
        type: "image/png",
      });

      await startUpload([file], { configId });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description:
          "there was a problem saving your config, please try again.",
        variant: "destructive",
      });
    }
  }

  function base64ToBlob(base64: string, mimeType: string) {
    const byteCharactors = atob(base64);
    const bytesNumber = new Array(byteCharactors.length);

    for (let i = 0; i < byteCharactors.length; i++) {
      bytesNumber[i] = byteCharactors.charCodeAt(i);
    }

    const byteArray = new Uint8Array(bytesNumber);

    return new Blob([byteArray], { type: mimeType });
  }

  return (
    <div className="relative mt-20 grid grid-cols-3 mb-20 pb-20">
      <div
        ref={containerRef}
        className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 "
      >
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          <AspectRatio
            ref={phoneCaseRef}
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
              `bg-${options.color.tw}`
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
          onResizeStop={(_, __, ref, ___, { x, y }) => {
            setRenderedDimention({
              height: parseInt(ref.style.height.slice(2, -2)),
              width: parseInt(ref.style.width.slice(0, -22)),
            });

            setRenderedPosition({
              x,
              y,
            });
          }}
          onDragStop={(_, data) => {
            const { x, y } = data;
            setRenderedPosition({ x, y });
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
              <RadioGroup
                value={options.color}
                onChange={(val) => {
                  setOptions((prev) => ({
                    ...prev,
                    color: val,
                  }));
                }}
              >
                <Label>Color: {options.color.label}</Label>
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
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {options.model.label}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      {/* <DropdownMenuSeparator /> */}
                      {MODELS.options.map((item) => {
                        return (
                          <DropdownMenuItem
                            key={item.label}
                            className={cn(
                              "flex text-sm gap-1 items-center p-1.5 cursor-default hover:bg-zinc-100 ",
                              {
                                "bg-zinc-100":
                                  item.label === options.model.label,
                              }
                            )}
                            onClick={() => {
                              setOptions((prev) => ({ ...prev, model: item }));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                item.label === options.model.label
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.label}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {[MATERIALS, FINISHES].map(
                  ({ name, options: selectableOptions }) => {
                    return (
                      <RadioGroup
                        key={name}
                        value={options[name]}
                        onChange={(value) => {
                          console.log("val", value);
                          setOptions((prev) => {
                            return {
                              ...prev,
                              [name]: value,
                            };
                          });
                        }}
                      >
                        <Label>
                          {name.slice(0, 1).toUpperCase() + name.slice(1)}
                        </Label>
                        <div className="mt-3 space-y-4">
                          {selectableOptions.map((option) => {
                            console.log("fd ", option.label);
                            return (
                              <Field key={option.label}>
                                <Radio
                                  value={option}
                                  className={({ active, checked }: any) =>
                                    cn(
                                      "relative block cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zince-200 focus:outine-none ring-0 focus:ring-0 outline-none sm:flex sm:justify-between",
                                      {
                                        "border-primary": active || checked,
                                      }
                                    )
                                  }
                                >
                                  <span className="flex items-center"></span>
                                  <span className="flex flex-col text-sm"></span>
                                  <Label className="font-medium text-gray-900">
                                    {option.label}
                                  </Label>
                                  {option.description ? (
                                    <Label>
                                      <span className="text-gray-500 sm:block">
                                        {option.description}{" "}
                                      </span>
                                    </Label>
                                  ) : null}
                                  <Label className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:flex-right">
                                    <span className="font-medium text-gray-900">
                                      {formatPrice(option.price / 100)}
                                    </span>
                                  </Label>
                                </Radio>
                              </Field>
                            );
                          })}
                        </div>
                      </RadioGroup>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="w-full px-8 h-16 bg-white">
          <div className="h-px w-full bg-zinc-100" />
          <div className="w-full h-full flex justify-end items-center">
            <div className="w-full flex gap-6 items-center">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  (BASE_PRICE + options.finish.price + options.material.price) /
                    100
                )}
              </p>
              <Button
                size="sm"
                className="w-full"
                onClick={() =>
                  saveConfig({
                    configId,
                    color: options.color.value,
                    finish: options.finish.value,
                    material: options.material.value,
                    model: options.model.value,
                  })
                }
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
