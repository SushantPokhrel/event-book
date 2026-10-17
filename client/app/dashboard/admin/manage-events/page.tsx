"use client";

import { type FormEvent, useEffect, useState } from "react";

type EventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalSeats: number;
};

type EventForm = {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalSeats: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";

const emptyForm: EventForm = {
  title: "",
  description: "",
  eventDate: "",
  eventTime: "",
  venue: "",
  totalSeats: "",
};

function formFromEvent(event: EventItem): EventForm {
  return {
    title: event.title,
    description: event.description,
    eventDate: event.eventDate.slice(0, 10),
    eventTime: event.eventTime,
    venue: event.venue,
    totalSeats: String(event.totalSeats),
  };
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadEvents() {
    try {
      const response = await fetch(`${API_URL}/events`, {
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Unable to load events.");
      setEvents(result.events);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load events.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const load = async () => {
      await loadEvents();
    };

    void load();
  }, []);

  function updateField(field: keyof EventForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEditing(event: EventItem) {
    setEditingEvent(event);
    setForm(formFromEvent(event));
    setMessage("");
  }

  function stopEditing() {
    setEditingEvent(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingEvent) return;

    setIsSaving(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, totalSeats: Number(form.totalSeats) }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Unable to update event.");

      setEvents((current) =>
        current.map((item) =>
          item.id === result.event.id ? result.event : item,
        ),
      );
      stopEditing();
      setMessage("Event updated successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update event.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!window.confirm("Delete this event?")) return;

    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message ?? "Unable to delete event.");

      setEvents((current) => current.filter((item) => item.id !== id));
      if (editingEvent?.id === id) stopEditing();
      setMessage("Event deleted successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete event.",
      );
    }
  }

  return (
    <main className="px-5 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-275">
        <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#ef694d]">
          Admin / events
        </p>
        <h1 className="mt-3 font-serif text-5xl font-normal sm:text-6xl">
          Manage events
        </h1>
        {message && (
          <p className="mt-5 text-sm text-[#53605c]" role="status">
            {message}
          </p>
        )}

        {editingEvent && (
          <form
            className="mt-8 grid gap-5 border border-[#d5d5cb] bg-white/35 p-5 sm:grid-cols-2 sm:p-8"
            onSubmit={handleSubmit}
          >
            <h2 className="font-serif text-3xl sm:col-span-2">Edit event</h2>
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 outline-none focus:border-[#ef694d]"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="Title"
              required
            />
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 outline-none focus:border-[#ef694d]"
              value={form.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              placeholder="Venue"
              required
            />
            <textarea
              className="min-h-28 border border-[#bfc5bd] bg-transparent p-3 outline-none focus:border-[#ef694d] sm:col-span-2"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Description"
              required
            />
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 outline-none focus:border-[#ef694d]"
              type="date"
              value={form.eventDate}
              onChange={(event) => updateField("eventDate", event.target.value)}
              required
            />
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 outline-none focus:border-[#ef694d]"
              type="time"
              value={form.eventTime}
              onChange={(event) => updateField("eventTime", event.target.value)}
              required
            />
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 outline-none focus:border-[#ef694d]"
              type="number"
              min="1"
              value={form.totalSeats}
              onChange={(event) =>
                updateField("totalSeats", event.target.value)
              }
              placeholder="Total seats"
              required
            />
            <div className="flex gap-3 sm:col-span-2">
              <button
                className="rounded-[2px] bg-[#18211f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ef694d] disabled:opacity-60"
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save changes"}
              </button>
              <button
                className="rounded-[2px] border border-[#18211f] px-5 py-3 text-sm font-bold transition hover:bg-[#18211f] hover:text-white"
                type="button"
                onClick={stopEditing}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-10">
          {isLoading ? (
            <p role="status" className="text-sm text-[#53605c]">
              Loading events...
            </p>
          ) : events.length === 0 ? (
            <p className="text-sm text-[#53605c]">No events created yet.</p>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <article
                  className="border border-[#d5d5cb] bg-white/45 p-5 transition hover:border-[#ef694d] sm:flex sm:items-center sm:justify-between sm:gap-6"
                  key={event.id}
                >
                  <div>
                    <h2 className="font-serif text-2xl">{event.title}</h2>
                    <p className="mt-2 text-sm text-[#53605c]">
                      {event.eventDate.slice(0, 10)} at {event.eventTime} ·{" "}
                      {event.venue}
                    </p>
                    <p className="mt-1 text-xs text-[#69736e]">
                      {event.totalSeats} total seats
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3 sm:mt-0">
                    <button
                      className="rounded-[2px] bg-[#18211f] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#ef694d]"
                      type="button"
                      onClick={() => startEditing(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-[2px] border border-[#ef694d] px-4 py-2 text-xs font-bold text-[#ef694d] transition hover:bg-[#ef694d] hover:text-white"
                      type="button"
                      onClick={() => deleteEvent(event.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
