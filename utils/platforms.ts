import { Platform } from "@/universalstatus";
import { Emoji } from "emoji-type";

export default function getSelectablePlatforms(): Platform[] {
  return ["discord", "slack", "status.cafe"];
}

export async function updateSlack(user: string, status: string, emoji: Emoji): Promise<{ message: string, error: boolean }> {
  const userToken = "placeholder"; // Update to database user token
  try {
    const result = await fetch(`https://www.slack.com/api/users.profile.set`, { method: "POST", headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${userToken}`
    }, body: JSON.stringify({ profile: {
      status_text: status,
      status_emoji: emoji,
      status_expiration: 0
    }})});
    const jsonResult = await result.json();
    if (result.ok && jsonResult.ok) {
      return { message: "Status updated successfully!", error: false };
    } else {
      return { message: `Error from the Slack API: ${jsonResult.error}`, error: true };
    }
  } catch (e) {
    console.warn(`Unknown error in pushing status to Slack for user "${user}"!\n${e}`);
    return { message: `Unknown error, contact the site administrator and tell them to check the console!`, error: true };
  }
}