"use client";
import { Platform } from "@/universalstatus";
import getSelectablePlatforms from "@/utils/platforms/platforms";
import { faArrowRight, faBorderAll } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Emoji } from "emoji-type";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!status || status.length < 1) {
      alert("Enter a status...");
      return;
    }
    fetch("/api/status", { method: "POST", body: JSON.stringify({ status: status, emoji: emoji }) })
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
          alert("Error setting status: " + (res.error || "Unknown Error"));
          return;
        }
        alert("Successfully set status!");
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
      {emojiPickerOpen && <div className="flex items-center absolute mt-18"><EmojiPicker onEmojiClick={(e) => selectEmoji(e)} /></div>}
    </form>
  )
}

function PlatformSelector({ platforms, setPlatforms, allPlatforms }: { platforms: Platform[], setPlatforms: Dispatch<SetStateAction<Platform[]>>, allPlatforms: Platform[] }) {
  function onClick() {
    
  }
  return (
    <form>

    </form>
  )
}