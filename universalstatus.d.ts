import { Emoji } from "emoji-type";
import { ObjectId } from "mongodb";

export type Status = {
  status: string;
  emoji: Emoji;
  setAt: Date;
}
export type UserDoc = {
  _id: ObjectId;
  user: string;
  status: Status;
  previousStatuses: Status[];
  slackToken: string | null;
  githubToken: string | null;
  statusCafeCookie: string | null;
}
export type Platform = "status.cafe" | "slack" | "discord" | "github";
export type PlatformError = {
  platform: Platform;
  message: string;
}