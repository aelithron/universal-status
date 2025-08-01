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
export type PlatformError = {
  platform: "status.cafe" | "slack" | "discord"
  message: string
}