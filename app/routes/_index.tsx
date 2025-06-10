import type { LoaderFunctionArgs } from "react-router";
import { createClient } from "~/lib/supabase.server";

export function meta() {
  return [{ title: "Hello world!" }];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = createClient(request);

  const { data } = await supabase.from("notes").select();
  console.log(data);
}

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1>Hello world!</h1>
        <button className="btn btn-outline btn-sm">hi!</button>
      </div>
    </main>
  );
}
