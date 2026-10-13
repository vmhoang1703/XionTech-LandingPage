import { notFound } from "next/navigation";

// An unknown path under a locale ends here, so it gets that locale's Not found page
// (the global one cannot know the locale).
export default function CatchAll(): never {
  notFound();
}
