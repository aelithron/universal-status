"use client"
import { faArrowRightToBracket, faMinusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function SlackAuthorizeButton({ clientID, isAuthorized }: { clientID: string | undefined, isAuthorized: boolean }) {
  const [origin, setOrigin] = useState<string>("");
  useEffect(() => {
    setOrigin(window.location.origin);
  }, [])
  return (
    <a href={`https://slack.com/oauth/v2/authorize?scope=&user_scope=users.profile%3Awrite&redirect_uri=${origin}/api/provider/slack&client_id=${clientID}`} className="hover:text-sky-500 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1">
      <FontAwesomeIcon icon={faArrowRightToBracket} /> {isAuthorized ? "Reauthorize" : "Authorize"}
    </a>
  )
}
export function SlackRemoveButton() {
  const router = useRouter();
  function removeSlackToken() {
    fetch(`/api/provider/slack`, { method: "DELETE" })
      .then((res) => {
        if (!res) return null;
        try {
          const json = res.json();
          return json;
        } catch {
          return null;
        }
      })
      .then((res) => {
        if (!res) {
          alert(`Error removing your token!`);
          return;
        }
        router.refresh();
      })
  }
  return <button onClick={() => removeSlackToken()} className="bg-red-500 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1 hover:text-sky-500"><FontAwesomeIcon icon={faMinusCircle} /> Remove</button>
}