"use server";

import { createData, deleteData, getData, updateData } from "@/db/queries/data-queries";
import { InsertData, SelectData } from "@/db/schema/data-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function createDataAction(data: InsertData[]): Promise<ActionState<SelectData>> {
  try {
    const newData = await createData(data);
    revalidatePath("/");
    return {
      isSuccess: true,
      message: "Data created successfully",
      data: newData
    };
  } catch (error) {
    console.error("Error creating data:", error);
    return { isSuccess: false, message: "Failed to create data" };
  }
}

export async function getDataAction(): Promise<ActionState<SelectData[]>> {
  try {
    const data = await getData();
    return {
      isSuccess: true,
      message: "Data retrieved successfully",
      data: data
    };
  } catch (error) {
    console.error("Error getting data:", error);
    return { isSuccess: false, message: "Failed to get data" };
  }
}

export async function updateDataAction(id: number, data: Partial<InsertData>): Promise<ActionState<SelectData>> {
  try {
    const updatedData = await updateData(id, data);
    revalidatePath("/");
    return {
      isSuccess: true,
      message: "Data updated successfully",
      data: updatedData
    };
  } catch (error) {
    console.error("Error updating data:", error);
    return { isSuccess: false, message: "Failed to update data" };
  }
}

export async function deleteDataAction(id: number): Promise<ActionState<SelectData>> {
  try {
    await deleteData(id);
    revalidatePath("/");
    return { isSuccess: true, message: "Data deleted successfully" };
  } catch (error) {
    console.error("Error deleting data:", error);
    return { isSuccess: false, message: "Failed to delete data" };
  }
}
