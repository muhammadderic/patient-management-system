"use server";

import { ID, Query } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_TABLE_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create({
      userId: ID.unique(),
      email: user.email,
      phone: user.phone,
      name: user.name
    });

    return parseStringify(newuser);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      // The array of queries is now assigned specifically to the queries key inside a wrapping configuration object.
      const existingUser = await users.list({
        queries: [
          Query.equal("email", [user.email])
        ]
      });

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
}

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get({ userId });

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  $id,
  ...patient
}: RegisterUserParams) => {
  try {
    let file;
    if (identificationDocument) {
      // Get the blob and filename from FormData
      const blob = identificationDocument.get("blobFile") as Blob;
      const fileName = identificationDocument.get("fileName") as string;

      // Create InputFile from blob (new syntax)
      const inputFile = InputFile.fromBuffer(blob, fileName);

      // Create file in storage
      file = await storage.createFile(
        BUCKET_ID!, 
        ID.unique(), 
        inputFile,
      );
    }

    const newPatient = await databases.createDocument({
      databaseId: DATABASE_ID!,
      collectionId: PATIENT_TABLE_ID!,
      documentId: $id,
      data: {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    });

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async ($id: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_TABLE_ID!,
      [Query.equal("$id", [$id])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
}
