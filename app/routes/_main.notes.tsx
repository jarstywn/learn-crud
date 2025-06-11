import { BookOpenIcon, TimerIcon } from "lucide-react";
import { DateTime } from "luxon";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { createClient } from "~/lib/supabase.server";

export function meta() {
  return [{ title: "Notes" }];
}
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  return notes;
}
export default function NotesPage() {
  const notes = useLoaderData<typeof loader>();
  return (
    <main>
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-1 ">
          <BookOpenIcon />
          <span className="text-lg font-bold">Notes</span>
        </div>
        <Link to="/create" className="btn btn-outline btn-sm">
          Create
        </Link>
      </section>
      <section className="py-5 space-y-5">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <Link
              to={`/note/${note.id}`}
              key={note.id}
              className="w-full p-5 h-50 border border-white/30 flex flex-col justify-between"
            >
              <section>
                <h3 className="line-clamp-1 whitespace-pre-line text-white font-semibold">
                  {note.title}
                </h3>
                <div className="grid grid-cols-5 items-start">
                  <div className="col-span-4 ">
                    <span className="line-clamp-3 whitespace-pre-line text-white/70">
                      {note.content}
                    </span>
                  </div>
                  {note.image ? (
                    <div className="w-full h-full">
                      <img
                        className="w-full h-full object-cover"
                        src={note.image}
                        alt={note.title}
                      />
                    </div>
                  ) : null}
                </div>
              </section>
              <section className="text-sm text-white/20 flex items-center justify-end gap-1">
                <TimerIcon size={15} />
                <span>{DateTime.fromISO(note.created_at).toRelative()}</span>
              </section>
            </Link>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="font-bold text-2xl">You don't have any notes yet </p>
          </div>
        )}
      </section>
    </main>
  );
}
