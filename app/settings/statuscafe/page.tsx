import { faCoffee, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { auth } from "@/auth";
import { getUserDoc } from "@/utils/db";
import LoginForm from "./login.form";

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
      <h1 className="text-3xl font-semibold mt-4"><FontAwesomeIcon icon={faCoffee} /> Add Status.Café</h1>
      <p>To set up Status.Café, we need your account credentials.</p>
      <p>This is because of how they handle certain authentication things (technical explanation on GitHub).</p>
      <LoginForm />
    </div>
  );
}