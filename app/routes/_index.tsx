export function meta() {
  return [{ title: "Hello world!" }];
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
