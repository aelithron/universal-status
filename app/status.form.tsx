"use client";
import { Platform, PlatformError } from "@/universalstatus";
import getSelectablePlatforms from "@/utils/platforms";
import { faArrowRight, faBorderAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Emoji } from "emoji-type";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";

export default function StatusForm() {
  const router = useRouter();
  const allPlatforms = getSelectablePlatforms();
  const [status, setStatus] = useState<string>("");
  const [emoji, setEmoji] = useState<Emoji>("🙂");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const [platforms, setPlatforms] = useState<Platform[]>(allPlatforms);
  const [platformsOpen, setPlatformsOpen] = useState<boolean>(false);

  function selectEmoji(e: EmojiClickData) {
    setEmoji(e.emoji as Emoji);
    setEmojiPickerOpen(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!status || status.length < 1) {
      alert("Enter a status...");
      return;
    }
    fetch("/api/status", { method: "POST", body: JSON.stringify({ status: status, emoji: emoji, platforms: platforms }) })
      .then((res) => {
        if (!res) return null;
        let jsonRes = null;
        try {
          jsonRes = res.json();
        } catch {
          return null;
        }
        return jsonRes;
      })
      .then((res) => {
        if (!res || res.error) {
          alert(`Error setting status: ${res.message} (${res.error || "Unknown Error"})`);
          return;
        }
        alert("Successfully set status!");
        if (res.platform_errors) {
          for (const error of res.platform_errors as PlatformError[]) {
            alert(`Platform Error (${error.platform}): ${error.message}`);
          }
        }
        setStatus("");
        setEmoji("🙂");
        setEmojiPickerOpen(false);
        router.refresh();
      });
  }
  // i have to repeat these styles so much that i put them here
  const fieldStyles = "bg-slate-300 dark:bg-slate-700 rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800";
  return (
    <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
      <label className="text-sm font-semibold text-center">New Status</label>
      <div className="flex gap-2">
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldStyles} />
        <button type="button" className={`${fieldStyles} hover:text-sky-500`} onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>{emoji}</button>
        <button type="button" className={`${fieldStyles} hover:text-sky-500`} onClick={() => setPlatformsOpen(!platformsOpen)}><FontAwesomeIcon icon={faBorderAll} /></button>
        <button type="submit" className={`${fieldStyles} hover:text-sky-500`}><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
      {emojiPickerOpen && <div className="flex items-center absolute mt-18"><EmojiPicker onEmojiClick={(e) => selectEmoji(e)} theme={Theme.AUTO} /></div>}
      {platformsOpen && <div className="flex items-center absolute mt-18 md:ml-64"><PlatformSelector platforms={platforms} setPlatforms={setPlatforms} allPlatforms={allPlatforms} /></div>}
    </form>
  )
}

function PlatformSelector({ platforms, setPlatforms, allPlatforms }: { platforms: Platform[], setPlatforms: Dispatch<SetStateAction<Platform[]>>, allPlatforms: Platform[] }) {
  function handleChange(platform: Platform) {
    if (!platforms.includes(platform)) {
      const platformTemp: Platform[] = [];
      for (const platformItem of platforms) platformTemp.push(platformItem);
      platformTemp.push(platform);
      setPlatforms(platformTemp);
      return;
    } else {
      setPlatforms(platforms.filter((platformFilter) => platformFilter !== platform));
      return;
    }
  }
  return (
    <div className="flex flex-col bg-slate-300 dark:bg-slate-700 rounded-xl border-2 border-slate-500 dark:border-slate-800 p-4">
      <h3 className="font-semibold text-lg">Platforms</h3>
      {allPlatforms.map((platform) => <label key={platform}>
        <input type="checkbox" className="mr-2" onChange={() => handleChange(platform)} defaultChecked={platforms.includes(platform)} />
        {platform}
      </label>)}
    </div>
  )
}