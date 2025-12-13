"use client";
import { Platform, PlatformError } from "@/universalstatus";
import getSelectablePlatforms from "@/utils/selectablePlatforms";
import { faArrowRight, faBorderAll, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Emoji } from "emoji-type";
import { useRouter } from "next/navigation";
import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from "react";

export default function StatusForm({ enabledPlatforms }: { enabledPlatforms: Platform[] }) {
  const router = useRouter();
  const allPlatforms = getSelectablePlatforms();
  const [status, setStatus] = useState<string>("");
  type DialogTypes = "emoji" | "platforms" | "expiry";
  const [openDialog, setOpenDialog] = useState<DialogTypes | null>(null);
  const [emoji, setEmoji] = useState<Emoji>("🙂");
  const [platforms, setPlatforms] = useState<Platform[]>(enabledPlatforms);
  const [expiry, setExpiry] = useState<Date | null>(null);

  function selectEmoji(e: EmojiClickData) {
    setEmoji(e.emoji as Emoji);
    setOpenDialog(null)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!status || status.length < 1) {
      alert("Enter a status...");
      return;
    }
    fetch("/api/status", { method: "POST", body: JSON.stringify({ status, emoji, platforms, expiry }) })
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
        if (res.platformErrors) for (const error of res.platformErrors as PlatformError[]) alert(`Platform Error (${error.platform}): ${error.message}`);
        setStatus("");
        setEmoji("🙂");
        setOpenDialog(null);
        router.refresh();
      });
  }
  // i have to repeat these styles so much that i put them here
  const fieldStyles = "bg-slate-300 dark:bg-slate-700 rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800";
  function changeDialog(dialog: DialogTypes) {
    if (openDialog === dialog) {
      setOpenDialog(null);
      return;
    }
    setOpenDialog(dialog);
  }
  return (
    <form className="flex flex-col gap-1 mt-4" onSubmit={handleSubmit}>
      <label className="text-sm font-semibold text-center">New Status</label>
      <div className="flex flex-col items-center gap-2">
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} className={fieldStyles} placeholder="Enter a status..." />
        <div className="flex gap-2">
          <button type="button" className={`${fieldStyles} hover:text-sky-500`} onClick={() => changeDialog("emoji")}>{emoji}</button>
          <button type="button" className={`${fieldStyles} hover:text-sky-500`} onClick={() => changeDialog("platforms")}><FontAwesomeIcon icon={faBorderAll} /></button>
          <button type="button" className={`${fieldStyles} hover:text-sky-500`} onClick={() => changeDialog("expiry")}><FontAwesomeIcon icon={faClock} /></button>
          <button type="submit" className={`${fieldStyles} hover:text-sky-500`}><FontAwesomeIcon icon={faArrowRight} /></button>
        </div>
      </div>
      {openDialog === "emoji" && <div className="flex items-center absolute mt-27"><EmojiPicker onEmojiClick={(e) => selectEmoji(e)} theme={Theme.AUTO} /></div>}
      {openDialog === "platforms" && <div className="flex items-center absolute mt-27"><PlatformSelector platforms={platforms} setPlatforms={setPlatforms} allPlatforms={allPlatforms} /></div>}
      {openDialog === "expiry" && <div className="flex items-center absolute mt-27"><ExpirySelector expiry={expiry} setExpiry={setExpiry} /></div>}
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

function ExpirySelector({ expiry, setExpiry }: { expiry: Date | null, setExpiry: Dispatch<SetStateAction<Date | null>> }) {
  function getFormattedTime(baseDate?: Date | null): string {
    if (baseDate === null) return "";
    let date = new Date();
    if (baseDate !== undefined) date = baseDate;
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
  }
  const formattedExpiry = useMemo(() => getFormattedTime(expiry), [expiry]);
  const minTime = useMemo(() => getFormattedTime(), []);
  return (
    <div className="flex flex-col bg-slate-300 dark:bg-slate-700 rounded-xl border-2 border-slate-500 dark:border-slate-800 p-4 gap-2">
      <h1 className="font-semibold text-lg">Expiry</h1>
      <p>(empty date means it won&apos;t expire)</p>
      <input type="datetime-local" className="border-2 border-slate-300 dark:border-slate-800 p-1 rounded-lg" value={formattedExpiry} min={minTime} onChange={(e) => setExpiry(e.target.value ? new Date(e.target.value) : null)} />
    </div>
  );
}

export function StatusTime({ setAt }: { setAt: Date }) {
  const formattedTime = new Date(setAt).toLocaleString(undefined, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return <p className="text-slate-500">{formattedTime}</p>
}