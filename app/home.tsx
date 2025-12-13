import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusForm, { StatusTime } from "./status.form";
import { faGear, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { createUserDoc, getUserDoc } from "@/utils/db";
import Link from "next/link";
import { Session } from "next-auth";
import { Platform, UserDoc } from "@/universalstatus";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();
  let email = "";
  if (session && session.user && session.user.email) {
    email = session.user.email;
  } else {
    alert("Error finding your session, make sure you're logged in!");
  }
  let userDoc = await getUserDoc(email);
  if (!userDoc && email && email.length >= 1) {
    userDoc = await createUserDoc(email);
    if (!userDoc) alert("Couldn't add you to the database, there was an error!");
  }
  return (
    <div>
      <StatusForm enabledPlatforms={getEnabledPlatforms(userDoc!)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-lg p-2">
        <div className="flex flex-col items-center place-content-center">
          <h1 className="font-semibold text-xl">Current status:</h1>
          <p className="text-lg">{userDoc!.status.emoji} {userDoc!.status.status}</p>
          <StatusTime setAt={userDoc!.status.setAt} />
        </div>
        <div>
          <h1 className="font-semibold text-xl">Previous statuses:</h1>
          {userDoc!.previousStatuses.slice(-5).toReversed().map((statusEntry, index) => <div key={index} className="flex justify-between gap-2">
            <p>{statusEntry.emoji} {statusEntry.status}</p>
            <StatusTime setAt={statusEntry.setAt} />
          </div>)}
          {userDoc!.previousStatuses.length < 1 && <h3 className="text-lg">You don&apos;t have any previous statuses yet!</h3>}
        </div>
      </div>
      <div className="flex justify-center"><UserProfile session={session} showGear={true} /></div>
    </div>
  );
}

export function UserProfile({ session, showGear }: { session: Session | null, showGear: boolean }) {
  return (
    <div className="flex bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-lg gap-2 mt-4 w-fit">
      {session?.user && <div className="flex gap-3 p-2 px-4 rounded-lg my-2 items-center">
        {session.user.image ?
          <Image src={session.user.image} alt="The user's profile picture." width={60} height={60} className="rounded-full" /> :
          <div className="w-15 h-15 bg-violet-300 rounded-full" />
        }
        <div>
          <p className="text-lg font-semibold">{session.user.name}</p>
          <form
            action={async () => {
              "use server"
              await signOut();
            }}
          >
            <button type="submit" className="bg-violet-300 text-black rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800 hover:text-sky-500"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
          </form>
        </div>
      </div>}
      {!session || !session.user && <div className="flex flex-col gap-2 p-2 px-4 text-center">
        <h1>You aren&apos;t logged in yet!</h1>
        <form
          action={async () => {
            "use server"
            await signIn();
          }}
        >
          <button type="submit" className="bg-violet-300 text-black rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800 hover:text-sky-500"><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
        </form>
      </div>}
      {showGear && <Link href={"/settings"} className="flex w-fit h-fit p-2 hover:text-sky-500 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-full"><FontAwesomeIcon icon={faGear} /></Link>}
    </div>
  );
}

function getEnabledPlatforms(userDoc: UserDoc): Platform[] {
  const enabledPlatforms: Platform[] = [];
  if (userDoc.githubToken) enabledPlatforms.push("github");
  if (userDoc.statusCafeCookie) enabledPlatforms.push("status.cafe");
  if (userDoc.slackToken) enabledPlatforms.push("slack");
  return enabledPlatforms;
}