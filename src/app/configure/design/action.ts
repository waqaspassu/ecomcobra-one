"use server";

import { db } from "@/db";
import {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  PhoneModal,
} from "@prisma/client";

export type SaveConfigArgsType = {
  color: CaseColor;
  finish: CaseFinish;
  material: CaseMaterial;
  model: PhoneModal;
  configId: string;
};

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgsType) {
  await db.configuration.update({
    where: {
      id: configId,
    },
    data: {
      color,
      finish,
      material,
      model,
    },
  });
}
