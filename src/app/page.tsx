import { CaptureBand } from "@/components/contact/capture-band";

export default function Home() {
  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-32 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">XionTech</h1>
        <p className="text-muted max-w-md text-lg">
          [Placeholder] New website under construction. Sections will be added
          here.
        </p>
      </div>
      <CaptureBand kind="demo" />
    </>
  );
}
