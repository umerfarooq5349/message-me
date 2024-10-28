import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import { sendResponce } from "@/lib/sendResponce";
import { Message } from "@/models/Message";
import { UserModel } from "@/models/user";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const { content, createdAt } = await request.json();
    await dbConnect();

    if (!session || !session?.user) {
      return sendResponce(false, "User is not authenticated", 401);
    }
    const userId = session.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return sendResponce(false, "User not found", 404);
    } else if (!user.isAcceptingMessages) {
      return sendResponce(
        false,
        `Currentrly ${user.userName} is not accepting new messages`,
        403
      );
    }
    const newMessage = {
      content,
      createdAt: createdAt ? createdAt : new Date(),
    };

    user.messages.push(newMessage as Message);

    await user.save();

    return sendResponce(true, "Message sent successfully", 200, user);
  } catch (error) {
    return sendResponce(false, "Message sent unsuccessfull", 500, error);
  }
}
