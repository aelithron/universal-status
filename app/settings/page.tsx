import { faGear, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { UserProfile } from "../page";
import { auth } from "@/auth";
import { getUserDoc } from "@/utils/db";
import { faGithub, faSlack } from "@fortawesome/free-brands-svg-icons";
import { GitHubAuthorizeButton, GitHubRemoveButton, SlackAuthorizeButton, SlackRemoveButton } from "./settingsUI.module";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await auth();
  let email = "";
  if (session && session.user && session.user.email) {
    email = session.user.email;
  } else {
    alert("Error finding your session, make sure you're logged in!");
  }
  const userDoc = await getUserDoc(email);
  if (!userDoc) return (
    <div className="flex flex-col min-h-screen p-8 md:p-20">
      <h1 className="text-3xl font-semibold">Couldn&apos;t find your data!</h1>
      <p>You don&apos;t seem to have data in our database!</p>
      <p>Try going to the home page to fix this.</p>
      <Link href={"/"} className="bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen p-8 md:p-20 items-center">
      <Link href={"/"} className="bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
      <h1 className="text-3xl font-semibold mt-4"><FontAwesomeIcon icon={faGear} /> Settings</h1>
      <UserProfile session={session} showGear={false} />
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-8 items-center bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1">
          <h3 className="text-xl"><FontAwesomeIcon icon={faSlack} /> Slack</h3>
          <div className="flex items-center gap-3">
            <SlackAuthorizeButton clientID={process.env.AUTH_SLACK_ID} authURL={process.env.AUTH_URL} isAuthorized={userDoc.slackToken ? true : false} />
            {userDoc.slackToken && <SlackRemoveButton />}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-8 items-center bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-xl p-1">
          <h3 className="text-xl"><FontAwesomeIcon icon={faGithub} /> GitHub</h3>
          <div className="flex items-center gap-3">
            <GitHubAuthorizeButton clientID={process.env.GITHUB_ID} authURL={process.env.AUTH_URL} isAuthorized={userDoc.githubToken ? true : false} />
            {userDoc.githubToken && <GitHubRemoveButton />}
          </div>
        </div>
      </div>
      <p className="text-slate-500 mt-2"><a href="https://github.com/aelithron/universal-status" className="underline hover:text-sky-500">Universal Status</a> version {process.env.IMAGE_TAG || "unknown"}</p>
    </div>
  );
}