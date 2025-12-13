import { auth, signIn } from "@/auth";
import { faCoffee, faCommentDots, faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Home from "./home";
import { faGithub, faSlack } from "@fortawesome/free-brands-svg-icons";

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
    <div className="flex flex-col items-center gap-1 mt-2">
      <form
        action={async () => {
          "use server"
          await signIn();
        }}
      >
        <button type="submit" className="bg-violet-300 text-black rounded-xl text-lg p-1.5 border-2 border-slate-500 dark:border-slate-800 hover:text-sky-500"><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
      </form>
      <h2 className="text-xl font-semibold">What is Universal Status?</h2>
      <div className="items-start">
        <p>Universal Status allows you to change your status on many platforms, all in one place.</p>
        <p>It can manage your status and status history on its own, but it can also send your updates to other platforms.</p>
        <p>Currently, it supports:</p>
        <ul className="text-lg list-disc ml-4">
          <li><FontAwesomeIcon icon={faGithub} /> <a href="https://www.github.com" target="_blank" className="underline hover:text-sky-500">GitHub</a></li>
          <li><FontAwesomeIcon icon={faSlack} /> <a href="https://www.slack.com" target="_blank" className="underline hover:text-sky-500">Slack</a></li>
          <li><FontAwesomeIcon icon={faCoffee} /> <a href="https://status.cafe" target="_blank" className="underline hover:text-sky-500">Status.Cafe</a></li>
        </ul>
      </div>
    </div>
  );
}