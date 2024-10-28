import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user";
import { verifySchema } from "@/schemas/verifySchema"; // Import your schema

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Parse and validate incoming JSON data
    const { verifyCode, userName } = await request.json();

    // Use the verifySchema to validate the input
    const validationResult = verifySchema.safeParse({ verifyCode });

    // Check if validation failed
    if (!validationResult.success) {
      return Response.json(
        {
          status: false,
          error: "Must be 6 digit code",
          details: validationResult,
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ userName, isVerified: false });

    if (!user) {
      return Response.json(
        {
          status: true,
          message: "User not found.",
        },
        { status: 401 }
      );
    }

    const currentDate = new Date();
    const currentTimeInMilliseconds = currentDate.getTime();
    const expiryTimeInMilliseconds = user.verifyCodeExpiry.getTime();

    const isCodeValid = verifyCode === user.verifyCode;
    const isCodeExpired = currentTimeInMilliseconds >= expiryTimeInMilliseconds;

    if (isCodeValid && !isCodeExpired) {
      // Update the user to set isVerified to true
      await UserModel.findByIdAndUpdate(
        user._id,
        { isVerified: true },
        { new: true }
      );
    } // If validation succeeds
    return Response.json(
      {
        status: true,
        message: "User varified",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during validation:", error);
    return (
      Response.json({
        status: false,
        message: "Error during validation.",
        error,
      }),
      { status: 500 }
    );
  }
}
