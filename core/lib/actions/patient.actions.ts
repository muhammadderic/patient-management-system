"use server";

import { ID, Query } from "node-appwrite";

import { users } from "../appwrite.config";
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
