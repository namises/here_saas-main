import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import { LuStickyNote, LuTrash2, LuPlus } from "react-icons/lu";
import { relativeTime } from "src/utils/ui";

// NOTE: Personal notes are stored locally (per user, per browser) for now.
// Server-side persistence is a planned enhancement — see HANDOFF.md Phase 5.
const keyFor = (id) => `notes:${id || "anon"}`;

const Notes = () => {
  const user = useSelector((s) => s.user);
  const storageKey = useMemo(() => keyFor(user?._id), [user?._id]);
  const [notes, setNotes] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    try {
      setNotes(JSON.parse(localStorage.getItem(storageKey) || "[]"));
    } catch {
      setNotes([]);
    }
  }, [storageKey]);

  const persist = (next) => {
    setNotes(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const add = () => {
    if (!draft.trim()) return;
    persist([{ id: Date.now(), text: draft.trim(), ts: Date.now() }, ...notes]);
    setDraft("");
  };

  const remove = (id) => persist(notes.filter((n) => n.id !== id));

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notes</h1>
        <p className="text-sm text-gray-400">Quick personal notes (saved on this device).</p>
      </div>

      <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm dark:bg-gray-800">
        <Textarea rows={3} placeholder="Write a note..." value={draft} onChange={(e) => setDraft(e.target.value)} />
        <div className="mt-3 flex justify-end">
          <Button color="blue" onClick={add} disabled={!draft.trim()}>
            <LuPlus className="mr-2" /> Add note
          </Button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-gray-300 dark:bg-gray-800">
          <LuStickyNote size="2rem" />
          <p className="text-sm">No notes yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {notes.map((n) => (
            <div key={n.id} className="group relative rounded-2xl bg-yellow-50 p-4 shadow-sm dark:bg-yellow-900/20">
              <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-200">{n.text}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-gray-400">{relativeTime(Math.floor(n.ts / 1000))}</span>
                <button onClick={() => remove(n.id)} className="text-gray-300 transition hover:text-rose-500" aria-label="Delete note">
                  <LuTrash2 size="1rem" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
