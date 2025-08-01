export type Status = {
  status: string
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