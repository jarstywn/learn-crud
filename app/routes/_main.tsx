import { isRouteErrorResponse, Outlet } from "react-router";
import type { Route } from "../+types/root";
import { ArrowLeftCircleIcon } from "lucide-react";
import { Link } from "react-router";

export default function MainLayout() {
  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto py-20">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.data;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-5xl">{message}</h1>
        <p>{details}</p>
        <Link to={"/notes"} className="btn btn-outline mt-4">
          <ArrowLeftCircleIcon /> Back to home
        </Link>
      </div>
      {stack && (
        <pre className="">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
