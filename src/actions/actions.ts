"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import { authSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { checkAuth, getPetById } from "@/lib/server-utils";

import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sleep } from "@/lib/utils";

// --- user actions ---
export async function logIn(prevState: unknown, formData: unknown) {
  await sleep(1000);

  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data.",
    };
  }

  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return {
            message: "Invalid credentials.",
          };
        }
        default: {
          return {
            message: "Error. Could not sign in.",
          };
        }
      }
    }

    throw error; // nextjs redirect throws error, so we need to rethrow it
  }
}

export async function logOut() {
  await signOut({ redirectTo: "/" });
}
export async function signUp(prevState: unknown, formData: unknown) {
  await sleep(1000);

  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "Invalid form data",
    };
  }

  // convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries());

  // validate form data
  const validatedFormData = authSchema.safeParse(formDataEntries);
  if (!validatedFormData.success) {
    return {
      message: "Invalid form data.",
    };
  }

  const hashedPassword = await bcrypt.hash(validatedFormData.data.password, 10);

  // Try catch block so that application doesn't crash when user tries to sign up with
  // exisiting email in the database
  try {
    await prisma.user.create({
      data: {
        email: validatedFormData.data.email,
        hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          message: "Email already exists.",
        };
      }
    }

    return {
      message: "Could not create user.",
    };
  }

  await signIn("credentials", formData);
}

// --- pet actions ---
export async function addPet(pet: unknown) {
  await sleep(1000);

  const session = await checkAuth();

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

    // authentication check
    const session = await checkAuth();

    // validation
    const validatedPetId = petIdSchema.safeParse(petId);
    const validatedPet = petFormSchema.safeParse(petData);

    if (!validatedPetId.success || !validatedPet.success) {
      return {
        message: "Invalid pet data.",
      };
    }

    // authorization check
    const pet = await getPetById(validatedPetId.data);
    if (!pet) {
      return {
        message: "Pet not found",
      };
    }
    if (pet.userId !== session.user.id) {
      return {
        message: "Not authorized",
      };
    }

    // database mutation
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

  // authentication check
  const session = await checkAuth();

  // validation
  const validatedPetId = petIdSchema.safeParse(petId);

  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id",
    };
  }

  // authorization check
  const pet = await getPetById(validatedPetId.data);
  if (!pet) {
    return { message: "Pet not found." };
  }
  if (pet.userId !== session.user.id) {
    return {
      message: "Not authorized.",
    };
  }

  // database manipulation
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
