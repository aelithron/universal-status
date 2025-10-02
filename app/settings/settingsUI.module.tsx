"use client"
import { faArrowRightToBracket, faMinusCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRouter } from "next/navigation";

export function SlackAuthorizeButton({ clientID, isAuthorized, authURL }: { clientID: string | undefined, authURL: string | undefined, isAuthorized: boolean }) {
  return (
    <a href={`https://slack.com/oauth/v2/authorize?user_scope=users.profile%3Awrite&redirect_uri=${authURL}/api/provider/slack&client_id=${clientID}`} className="hover:text-sky-500 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1">
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

export function GitHubAuthorizeButton({ clientID, isAuthorized, authURL }: { clientID: string | undefined, authURL: string | undefined, isAuthorized: boolean }) {
  return (
    <a href={`https://github.com/login/oauth/authorize?redirect_uri=${authURL}/api/provider/github&client_id=${clientID}&scope=user`} className="hover:text-sky-500 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1">
      <FontAwesomeIcon icon={faArrowRightToBracket} /> {isAuthorized ? "Reauthorize" : "Authorize"}
    </a>
  )
}
export function GitHubRemoveButton() {
  const router = useRouter();
  function removeGitHubToken() {
    fetch(`/api/provider/github`, { method: "DELETE" })
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
  return <button onClick={() => removeGitHubToken()} className="bg-red-500 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1 hover:text-sky-500"><FontAwesomeIcon icon={faMinusCircle} /> Remove</button>
}

export function StatusCafeAuthorizeButton({ isAuthorized }: { isAuthorized: boolean }) {
  return (
    <a href={`/settings/statuscafe`} className="hover:text-sky-500 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1">
      <FontAwesomeIcon icon={faArrowRightToBracket} /> {isAuthorized ? "Reauthorize" : "Authorize"}
    </a>
  )
}
export function StatusCafeRemoveButton() {
  const router = useRouter();
  function removeStatusCafeToken() {
    fetch(`/api/provider/statuscafe`, { method: "DELETE" })
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
  return <button onClick={() => removeStatusCafeToken()} className="bg-red-500 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1 hover:text-sky-500"><FontAwesomeIcon icon={faMinusCircle} /> Remove</button>
}