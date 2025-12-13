import { auth } from "@/auth";
import { faCommentDots, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Home from "./home";
import { signIn } from "next-auth/react";

export default async function Page() {
  const session = await auth();
  return (
    <main className="flex flex-col p-8 md:p-20 min-h-screen items-center">
      <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faCommentDots} /> Universal Status</h1>
      <h2 className="text-lg italic">Set your status on many platforms at once</h2>
      {session && <Home />}
      {!session && <Landing />}
    </main>
  );
}

function Landing() {
  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <form
        action={async () => {
          "use server"
          await signIn();
        }}
      >
        <button type="submit" className="bg-violet-300 text-black rounded-xl text-lg p-1.5 border-2 border-slate-500 dark:border-slate-800 hover:text-sky-500"><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
      </form>
      <h2 className="text-xl font-semibold">What is Universal Status?</h2>
      <p>Universal Status allows you to change your status on many platforms, all in one place.</p>
      <p>Just</p>
    </div>
  );
}