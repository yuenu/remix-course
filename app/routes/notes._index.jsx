import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  Link,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export default function Index() {
  const notes = useLoaderData();
  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    console.log("go1");
    throw json(
      { message: "Could not find any notes." },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  return notes;
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title - must be at least 5 characters long." };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  await new Promise((resolve) => setTimeout(() => resolve(), 1000));
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function ErrorBoundary(error) {
  const routeError = useRouteError();
  if (isRouteErrorResponse(routeError)) {
    const message = routeError.data?.message || "Data not found.";
    return (
      <main>
        <NewNote />
        <p className="info-message">{message}</p>
      </main>
    );
  }
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error?.message}</p>
      <p>
        Back to <Link to="/">Safety</Link>!
      </p>
    </main>
  );
}
