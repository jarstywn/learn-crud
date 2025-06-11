import { Link } from "react-router";

export function meta() {
  return [{ title: "Hello world!" }];
}

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-bold text-4xl">Hello world!</h1>
          <p>just a simple crud based app with notes implementation</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link to={"/notes"} className="btn btn-ghost btn-sm">
            Read your notes
          </Link>
          <Link to={"/create"} className="btn btn-outline btn-sm">
            Create note
          </Link>
        </div>
      </div>
    </main>
  );
}
