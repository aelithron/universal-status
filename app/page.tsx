import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StatusForm from "./status.form";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="flex flex-col p-8 md:p-20 min-h-screen items-center">
      <h1 className="text-3xl font-semibold"><FontAwesomeIcon icon={faCommentDots} /> Universal Status</h1>
      <h2 className="text-lg italic">Set your status on all platforms at once</h2>
      <StatusForm />
    </main>
  );
}
