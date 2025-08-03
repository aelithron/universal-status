"use client"
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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