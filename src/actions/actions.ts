"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { petFormSchema, petIdSchema } from "@/lib/validations";

import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";

// --- user actions ---
export async function logIn(formData: FormData) {
  await signIn("credentials", formData);

  redirect("/app/dashboard");
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}
export async function signUp(formData: FormData) {
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      hashedPassword,
    },
  });

  await signIn("credentials", formData);
}

// --- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data.",
    };
  }

  try {
    await prisma.pet.create({
      data: {
        ...validatedPet.data,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId: unknown, petData: unknown) {
  try {
    await sleep(1000);

    const validatedPetId = petIdSchema.safeParse(petId);
    const validatedPet = petFormSchema.safeParse(petData);

    if (!validatedPetId.success || !validatedPet.success) {
      return {
        message: "Invalid pet data.",
      };
    }

    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  await sleep(1000);

  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id",
    };
  }

  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}
