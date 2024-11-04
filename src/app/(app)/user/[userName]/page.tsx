"use client";

import BikeAnimation from "@/components/bikeAnimiation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface SendMessageProps {
  params: Promise<{ userName: string }>;
}

const SendMessage: React.FC<SendMessageProps> = ({ params }) => {
  const userName = React.use(params).userName;

  const [sendingMessage, setSendingMessage] = useState(false);
  const [isSuggestingMessages, setIsSuggestingMessages] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  const { setValue } = form;

  const handleSubmit = async (content: z.infer<typeof messageSchema>) => {
    try {
      setSendingMessage(true);
      const newMessage = { ...content, userName };
      const response = await axios.post("/api/sendMessage", newMessage);
      toast({
        title: "Message sent",
        description: response.data.data.message,
      });
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data.message,
          className: "bg-red-400 text-white border-none",
        });
      } else {
        toast({ title: "Message send failed" });
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSuggestMessages = async () => {
    try {
      setIsSuggestingMessages(true);
      const response = await axios.get("/api/suggestions");

      const messages = response.data.data.text;
      const messagesArr = messages
        .split(/:\s*|\|\||\?/)
        .map((msg: string) => msg.trim())
        .filter((msg: string) => msg.length > 2)
        .slice(1, 6);

      setSuggestedMessages(messagesArr);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({ description: error.response?.data.message });
      } else {
        toast({ title: "Unable to suggest messages" });
      }
    } finally {
      setIsSuggestingMessages(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f9f9fb] to-[#e8e8f0] text-[#3B1E54] p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-4">
        Send Anonymous Message or Feedback
      </h2>
      <p className="text-center text-lg mb-6 text-[#6c6c80]">
        Share your thoughts or feedback anonymously with {userName}.
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 space-y-2"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#3B1E54]">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What's on your mind?"
                    className="border border-[#D4A373] bg-white text-[#3B1E54] rounded-lg w-full h-24 px-4 py-2 resize-none focus:ring-4 focus:ring-[#D4A373] transition duration-300"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="bg-[#3B1E54] text-[#D4A373] w-full font-bold hover:bg-[#D4A373] hover:text-[#3B1E54] transition duration-300"
            disabled={sendingMessage}
          >
            {sendingMessage ? (
              <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </Form>

      <Separator className="my-4 border border-[#D4A373]" />

      <div className="mt-4">
        <Button
          onClick={handleSuggestMessages}
          disabled={isSuggestingMessages}
          className="bg-[#3B1E54] w-full text-[#D4A373] hover:bg-[#D4A373] hover:text-[#3B1E54] transition duration-300"
        >
          {isSuggestingMessages ? (
            <LoaderPinwheel className="animate-spin h-5 w-5 mr-2" />
          ) : (
            "Suggest Messages"
          )}
        </Button>
      </div>

      <div className="mt-4 flex justify-center items-center">
        {isSuggestingMessages ? (
          <div className="flex justify-center items-center w-full h-full">
            <BikeAnimation
              text={"Let me think..."}
              textColor="text-[#3B1E54]"
              tireColor="#3B1E54"
              pedalColor="#ecb365"
              bodyColor="text-[#D4BEE4]"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-center">
            {suggestedMessages.map((suggestion, index) => (
              <Card
                key={index}
                onClick={() => setValue("content", suggestion)}
                className="border border-[#D4A373] p-4 bg-gradient-to-br from-[#3B1E54] to-[#387478] text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow hover:scale-105 transition-scale duration-200 ease-in-out cursor-pointer"
              >
                <CardHeader>
                  <div className="text-lg font-bold">{suggestion}</div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SendMessage;
