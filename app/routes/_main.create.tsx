import { Camera, PenIcon, X } from "lucide-react";
import { useRef, useState } from "react";
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
  const image = formData.get("image") as File;

  if (image.size > 0) {
    const { error: uploadError } = await supabase.storage
      .from("supabase")
      .upload(`notes/${image.name}`, image, { upsert: true });

    const {
      data: { publicUrl },
    } = supabase.storage.from("supabase").getPublicUrl(`/notes/${image.name}`);
    const { error } = await supabase.from("notes").insert({
      title,
      content,
      image: publicUrl,
    });

    return redirect("/notes");
  }

  const { error } = await supabase.from("notes").insert({
    title,
    content,
  });
  return redirect("/notes");
}

export default function CreatePage() {
  const { state, Form } = useFetcher();

  const [imagePick, setImagePick] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [id, setId] = useState(Date.now());

  function setImageHandler(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setImagePick(e.target.files[0]);
  }

  return (
    <main>
      <div className="flex items-center gap-1">
        <PenIcon />
        <span className="font-bold text-lg">Create</span>
      </div>
      <Form className="py-5" method="POST" encType="multipart/form-data">
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

          {imagePick ? (
            <div className="w-full rounded-md relative">
              <button
                onClick={() => {
                  setImagePick(null);
                  setId(Date.now());
                }}
                className="btn btn-square  btn-xs absolute right-2 top-2 btn-outline"
              >
                <X size={15} />
              </button>
              <img src={URL.createObjectURL(imagePick)} className="object-cover"/>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <input
              key={id}
              ref={inputFileRef}
              onChange={setImageHandler}
              type="file"
              hidden
              name="image"
              accept="image/*"
            />

            <button
              disabled={imagePick !== null}
              type="button"
              onClick={() => {
                inputFileRef.current?.click();
              }}
              className="btn btn-sm btn-ghost"
            >
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
