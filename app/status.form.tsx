"use client";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StatusForm() {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetch("/api/status", { method: "POST", body: JSON.stringify({ status: status }) })
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
        router.refresh();
      });
  }
  return (
    <form className="flex flex-col gap-2 mt-4" onSubmit={handleSubmit}>
      <label className="text-sm font-semibold text-center">New Status</label>
      <div className="flex gap-2">
        <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} className="bg-slate-300 dark:bg-slate-700 rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800" />
        <button type="submit" className="bg-slate-300 dark:bg-slate-700 rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800"><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
    </form>
  )
}