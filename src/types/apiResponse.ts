import { Message } from "@/models/Message";

export interface ApiResponse {
  status: boolean;
  message: string;
  data?: {
    isAcceptingMessages?: boolean;
    messages?: [Message];
  };
}
