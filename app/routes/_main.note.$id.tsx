import { ArrowLeftCircle, PenBox, Save, TimerIcon, Trash } from "lucide-react";
import { DateTime } from "luxon";
import { redirect, useFetcher, type ActionFunctionArgs } from "react-router";
import { Link, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { createClient } from "~/lib/supabase.server";

export function meta() {
  return [{ title: "Note" }];
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  const { supabase } = createClient(request);

  await supabase
    .from("notes")
    .delete()
    .eq("id", id as string);

  return redirect("/notes");
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  const { supabase } = createClient(request);

  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id as string)
    .single();
  return note;
}

export default function NotePage() {
  const note = useLoaderData<typeof loader>();
  const { Form, state } = useFetcher();
  return (
    <main>
      <section>
        <Link
          to="/notes"
          className="flex items-center gap-1 text-white/30 hover:text-white/70"
        >
          <ArrowLeftCircle />
          <span>Home</span>
        </Link>
      </section>
      <section className="space-y-3 py-10">
        <h1 className="font-semibold text-xl text-white">{note?.title}</h1>
        {note?.image ? (
          <img className="w-6/12" src={note.image} alt={note.title} />
        ) : null}
        <p className="text-white/85 whitespace-pre-line">{note?.content}</p>
      </section>
      <section className="flex items-center justify-between ">
        <div className="flex items-center gap-1">
          <Link to={`/edit/${note?.id}`} className="btn btn-sm btn-ghost">
            <PenBox /> Edit
          </Link>
          <button className="btn btn-sm btn-ghost">
            <Save />
            Archive
          </button>
          <Form action={`/delete/${note?.id}`} method="POST">
            <button
              type="submit"
              disabled={state === "submitting"}
              className="btn btn-sm btn-ghost"
            >
              <Trash />
              {state === "submitting" ? (
                <span className="loading loading-sm" />
              ) : (
                "Delete"
              )}
            </button>
          </Form>
        </div>
        <div className="text-sm text-white/20 flex items-center justify-end gap-1">
          <TimerIcon size={15} />
          <span>
            {DateTime.fromISO(note?.created_at as string).toRelative()}
          </span>
        </div>
      </section>
    </main>
  );
}
