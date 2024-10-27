import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user";
import { userNameValidation } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";
import { z } from "zod";

const userNameCheckQuerySchema = z.object({ userName: userNameValidation });

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const userNameQueryParams = { userName: searchParams.get("userName") };

    const result = userNameCheckQuerySchema.safeParse(userNameQueryParams);

    console.log(result);

    if (!result.success) {
      throw new Error("" + result);
      //   return Response.json({ result });
    }

    return Response.json({ result });

    // const existingUserName = await UserModel.findOne({
    //   userName: userNameQueryParams,
    // });
  } catch (error) {
    throw new Error(`Error fetching user names` + error);
  }
}
