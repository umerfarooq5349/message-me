import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Alert from "./alert";
import { Message } from "@/models/Message";
// import axios from "axios";
import { useToast } from "@/hooks/use-toast";

type MessageCardProps = {
  message: Message;
  onMessageDelete?: (messageId: string) => void;
  onMessageUpdate?: (messageId: string) => void;
};

export function MessageCard({
  message,
  onMessageDelete,
  onMessageUpdate,
}: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteBtn = async () => {
    // const response = await axios.delete(`/api/deleteMessage/${message._id}`);
    toast({ title: "Delete btn pressed" });
    onMessageDelete?.(message._id);
  };

  const handleUpdateBtn = async () => {
    // const response = await axios.put(`/api/updateMessage/${message._id}`);
    toast({ title: "update message" });
    onMessageUpdate?.(message._id);
  };

  return (
    <Card className="w-[350px] bg-white rounded-lg shadow-lg p-6">
      {/* <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="absolute bg-[#387478] rounded-full h-64 w-64 -top-20 -left-20 blur-3xl" />
        <div className="absolute bg-[#3B1E54] rounded-full h-64 w-64 bottom-10 right-10 blur-3xl" />
      </div> */}
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-800">
          {message.content}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-500">
          {new Date(message.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Alert
          description="Are you sure you want to delete this message?"
          title="Delete Message"
          triggerText="Delete"
          onConfirm={handleDeleteBtn}
        />
        <Button
          className="bg-[#3B1E54] text-[#f2c07a] hover:shadow-lg hover:text-white hover:bg-[#3B1E54] transition duration-300 w-full"
          onClick={handleUpdateBtn}
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
