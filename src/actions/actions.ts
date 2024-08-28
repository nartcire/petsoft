"use server";

import { Pet } from "@prisma/client";
import { PetEssentials } from "@/lib/types";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";

export async function addPet(pet: PetEssentials) {
  await sleep(1000);

  try {
    await prisma.pet.create({
      data: pet,
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: Pet["id"], petData: PetEssentials) {
  try {
    await sleep(1000);

    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: petData,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: Pet["id"]) {
  await sleep(1000);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}
