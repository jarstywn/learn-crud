import { redirect, type ActionFunctionArgs } from "react-router";
import { createClient } from "~/lib/supabase.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  const { supabase } = createClient(request);

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id as string);

  return redirect("/notes");
}
