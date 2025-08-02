import { Emoji } from "emoji-type"

export type Status = {
  status: string
  emoji: Emoji
  setAt: Date
}
export type UserDoc = {
  user: string
  status: Status
  previousStatuses: Status[]
}
export type Platform = "status.cafe" | "slack" | "discord";
export type PlatformError = {
  platform: Platform
  message: string
}