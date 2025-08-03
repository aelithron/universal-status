import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusForm from "./status.form";
import { faCommentDots, faSignIn, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { getFakePreviousStatuses, getFakeStatus } from "@/utils/fakeData";
import Image from "next/image";
import { auth, signOut } from "@/auth";
import { signIn } from "next-auth/react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const currentStatus = getFakeStatus();
  const previousStatuses = getFakePreviousStatuses();
  const session = await auth();
  return (
    <main className="flex flex-col p-8 md:p-20 min-h-screen items-center">
      <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faCommentDots} /> Universal Status</h1>
      <h2 className="text-lg italic">Set your status on many platforms at once</h2>
      <StatusForm />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-lg p-2">
        <div className="flex flex-col items-center place-content-center">
          <h1 className="font-semibold text-xl">Current status:</h1>
          <p className="text-lg">{currentStatus.emoji} {currentStatus.status}</p>
          <p className="text-slate-500">{formatTime(currentStatus.setAt)}</p>
        </div>
        <div className="">
          <h1 className="font-semibold text-xl">Previous statuses:</h1>
          {previousStatuses.slice(-5).toReversed().map((statusEntry, index) => <div key={index} className="flex justify-between gap-2">
            <p>{statusEntry.emoji} {statusEntry.status}</p>
            <p className="text-slate-500">{formatTime(statusEntry.setAt)}</p>
          </div>)}
        </div>
      </div>
      <div className="flex bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800 rounded-lg gap-2 mt-4">
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
                await signOut()
              }}
            >
              <button type="submit" className="bg-violet-300 text-black rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800"><FontAwesomeIcon icon={faSignOut} /> Sign Out</button>
            </form>
          </div>
        </div>}
        {!session || !session.user && <div className="flex flex-col gap-2 p-2 px-4 text-center">
          <h1>You aren&apos;t logged in yet!</h1>
          <form
            action={async () => {
              "use server"
              await signIn()
            }}
          >
            <button type="submit" className="bg-violet-300 text-black rounded-xl p-1 border-2 border-slate-500 dark:border-slate-800"><FontAwesomeIcon icon={faSignIn} /> Sign In</button>
          </form>
        </div>}
      </div>
    </main>
  );
}
function formatTime(setAt: Date) {
  const formattedTime = new Date(setAt).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return formattedTime;
};