import { Status } from "@/universalstatus";

export function getFakeStatus(): Status {
  return { status: "Coding Universal Status :3", emoji: "🦈", setAt: new Date() };
}

// testing methods for before i add the database
export function getFakePreviousStatuses() {
  const entries: Status[] = [];
  entries.push({ status: "Example status 1", emoji: "🌈", setAt: new Date() });
  entries.push({ status: "Example status 2", emoji: "☕️", setAt: new Date() });
  entries.push({ status: "Example status 3", emoji: "🌈", setAt: new Date() });
  entries.push({ status: "Example status 4", emoji: "☄️", setAt: new Date() });
  entries.push({ status: "Example status 5", emoji: "🏔️", setAt: new Date() });
  entries.push({ status: "Example status 6", emoji: "🧐", setAt: new Date() });
  return entries;
}