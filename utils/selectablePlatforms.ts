import { Platform } from "@/universalstatus";

export default function getSelectablePlatforms(): Platform[] {
  return ["slack", "github"]; // add "discord" and "status.cafe" when implemented :3
}