import { Camera, PenBox } from "lucide-react";
import type {
  LoaderFunctionArgs,
  MetaFunction,
  ActionFunctionArgs,
} from "react-router";
import { data, useLoaderData, useFetcher, redirect } from "react-router";
import { createClient } from "~/lib/supabase.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: data?.title }];
};

export async function action({ params, request }: ActionFunctionArgs) {
  const { supabase } = createClient(request);
  const { id } = params;
  const formData = await request.formData();

  const title = String(formData.get("title"));
  const content = String(formData.get("content"));

  await supabase
    .from("notes")
    .update({
      title,
      content,
    })
    .eq("id", id as string);
  return redirect(`/note/${id}`);
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);
  const { id } = params;

  const { error, data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id as string)
    .single();
  if (error && !note) throw data("Note not found!", { status: 404 });
  return note;
}

export default function EditPage() {
  const { state, Form } = useFetcher();
  const note = useLoaderData<typeof loader>();
  return (
    <main>
      <div className="flex items-center gap-1">
        <PenBox />
        <span className="font-bold text-lg">Edit</span>
      </div>
      <Form className="py-5" method="POST">
        <fieldset disabled={state === "submitting"} className="space-y-5">
          <input
            type="text"
            name="title"
            required
            defaultValue={note?.title}
            placeholder="your note title....."
            className="w-full py-2 px-4 outline-none border-b border-b-white/25"
          />

          <textarea
            name="content"
            required
            placeholder="write something....."
            defaultValue={note?.content}
            className="w-full h-48 resize-none p-4 outline-none border-b border-b-white/25"
          />
          <div className="flex items-center justify-between">
            <button type="button" className="btn btn-sm btn-ghost">
              <Camera />
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-outline flex items-center gap-1"
            >
              {state === "submitting" ? (
                <span className="loading loading-sm" />
              ) : null}
              Update
            </button>
          </div>
        </fieldset>
      </Form>
    </main>
  );
}
