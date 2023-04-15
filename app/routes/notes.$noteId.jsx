import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";

import styles from "~/styles/note-details.css";

export default function NoteDetailsPage() {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
    </main>
  );
}

export async function loader({ params }) {
  const notes = await getStoredNotes();
  const selectNote = notes.find((note) => note.id === params.noteId);

  if (!selectNote) {
    throw json(
      { message: "Could not find note for id " + params.noteId },
      { status: 404 }
    );
  }
  return selectNote;
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

// export function ErrorBoundary(error) {
//   const routeError = useRouteError();
//   if (isRouteErrorResponse(routeError)) {
//     const message = routeError.data?.message || "Data not found.";
//     return (
//       <main>
//         <p className="info-message">{message}</p>
//       </main>
//     );
//   }
// }
