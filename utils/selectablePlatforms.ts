import { Platform } from "@/universalstatus";

export default function getSelectablePlatforms(): Platform[] {
  return ["github", "status.cafe", "slack"]; // add "discord" when implemented :3
}