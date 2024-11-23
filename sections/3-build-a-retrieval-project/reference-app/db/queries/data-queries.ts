"use server";

import { db } from "@/db";
import { dataTable, InsertData, SelectData } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createData = async (data: InsertData[]) => {
  try {
    const [newData] = await db.insert(dataTable).values(data).returning();
    return newData;
  } catch (error) {
    console.error("Error creating data:", error);
    throw new Error("Failed to create data");
  }
};

export const getData = async (): Promise<SelectData[]> => {
  try {
    return db.query.data.findMany();
  } catch (error) {
    console.error("Error getting data:", error);
    throw new Error("Failed to get data");
  }
};

export const getDataById = async (id: number) => {
  try {
    const data = await db.query.data.findFirst({
      where: eq(dataTable.id, id)
    });
    if (!data) {
      throw new Error("Data not found");
    }
    return data;
  } catch (error) {
    console.error("Error getting data by ID:", error);
    throw new Error("Failed to get data");
  }
};

export const updateData = async (id: number, data: Partial<InsertData>) => {
  try {
    const [updatedData] = await db.update(dataTable).set(data).where(eq(dataTable.id, id)).returning();
    return updatedData;
  } catch (error) {
    console.error("Error updating data:", error);
    throw new Error("Failed to update data");
  }
};

export const deleteData = async (id: number) => {
  try {
    await db.delete(dataTable).where(eq(dataTable.id, id));
  } catch (error) {
    console.error("Error deleting data:", error);
    throw new Error("Failed to delete data");
  }
};
