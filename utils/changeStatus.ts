import { Platform, PlatformError, UserDoc } from "@/universalstatus";
import { Emoji } from "emoji-type";
import { updateGithub, updateSlack, updateStatusCafe } from "./platforms";
import client from "./db";

export async function changeStatus(userDoc: UserDoc, platforms: Platform[], status: string, emoji: Emoji): Promise<PlatformError[]> {
  const setAt = new Date();
  const oldStatuses = userDoc.previousStatuses;
    oldStatuses.push(userDoc.status);
    await client.db(process.env.MONGODB_DB).collection<UserDoc>("statuses").updateOne({ user: userDoc.user }, {
      $set: {
        status: { status, emoji, setAt },
        previousStatuses: oldStatuses
      },
    });
    console.log(`User ${userDoc.user} - ${emoji} ${status} (at ${setAt.toTimeString()})`);
  
    const platformErrors: PlatformError[] = [];
    if (platforms.includes("github") && userDoc.githubToken) {
      const githubUpdate = await updateGithub(userDoc.user, status, emoji);
      if (githubUpdate.error) platformErrors.push({ platform: "github", message: githubUpdate.message });
    }
    if (platforms.includes("status.cafe") && userDoc.statusCafeCookie && userDoc.statusCafeCSRF) {
      const statusCafeUpdate = await updateStatusCafe(userDoc.user, status, emoji);
      if (statusCafeUpdate.error) platformErrors.push({ platform: "status.cafe", message: statusCafeUpdate.message });
    }
    if (platforms.includes("slack") && userDoc.slackToken) {
      const slackUpdate = await updateSlack(userDoc.user, status, emoji);
      if (slackUpdate.error) platformErrors.push({ platform: "slack", message: slackUpdate.message });
    }
    return platformErrors;
}