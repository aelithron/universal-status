"use client"
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || username === "") {
      alert("Please enter your username...");
      return;
    }
    if (!password || password === "") {
      alert("Please enter your password...");
      return;
    }
    fetch("https://status.cafe/check-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: username,
          password
        }).toString()
      })
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1 items-center mt-4">
      <label htmlFor="username">Username</label>
      <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-slate-500 border-2 dark:border-slate-700 border-slate-300 p-1 rounded-xl" />
      <label htmlFor="password">Password</label>
      <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="bg-slate-500 border-2 dark:border-slate-700 border-slate-300 p-1 rounded-xl" />
      <button type="submit" className="bg-violet-500 border-2 dark:border-violet-700 border-violet-300 p-1 rounded-xl mt-4"><FontAwesomeIcon icon={faSignIn} /> Authorize</button>
    </form>
  )
}