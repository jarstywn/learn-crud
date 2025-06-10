import { Camera, PenIcon } from "lucide-react";
import { redirect, useFetcher } from "react-router";
import { type ActionFunctionArgs } from "react-router";
import { createClient } from "~/lib/supabase.server";

export function meta() {
  return [{ title: "Create" }];
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createClient(request);
  const formData = await request.formData();

  const title = String(formData.get("title"));
  const content = String(formData.get("content"));

  const { error } = await supabase.from("notes").insert({
    title,
    content,
  });
  //
  // if (!error) {
  //   console.log("success");
  // }
  //
  return redirect("/notes");
}

export default function CreatePage() {
  const { state, Form } = useFetcher();
  return (
    <main>
      <div className="flex items-center gap-1">
        <PenIcon />
        <span className="font-bold text-lg">Create</span>
      </div>
      <Form className="py-5" method="POST">
        <fieldset disabled={state === "submitting"} className="space-y-5">
          <input
            type="text"
            name="title"
            required
            placeholder="your note title....."
            className="w-full py-2 px-4 outline-none border-b border-b-white/25"
          />

          <textarea
            name="content"
            required
            placeholder="write something....."
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
              Submit
            </button>
          </div>
        </fieldset>
      </Form>
    </main>
  );
}
