import { faGear, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="flex flex-col min-h-screen p-8 md:p-20 items-center">
      <Link href={"/"} className="bg-slate-300 dark:bg-slate-700 border-2 border-slate-500 dark:border-slate-800"><FontAwesomeIcon icon={faHome} /> Go Home</Link>
      <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faGear} /> Settings</h1>
    </div>
  )  
}