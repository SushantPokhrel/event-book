"use client";

import { type FormEvent, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";

type EventForm = {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalSeats: string;
};

const emptyForm: EventForm = {
  title: "",
  description: "",
  eventDate: "",
  eventTime: "",
  venue: "",
  totalSeats: "",
};

export default function AdminDashboardPage() {
  const [form, setForm] = useState<EventForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateField(field: keyof EventForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSaving(true);

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, totalSeats: Number(form.totalSeats) }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to create event.");
      }

      setForm(emptyForm);
      setMessage("Event created successfully.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to create event.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="px-5 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-275">
        <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#ef694d]">
          New event
        </p>
        <h1 className="mt-3 font-serif text-5xl font-normal sm:text-6xl">
          Create an event
        </h1>
        <p className="mt-4 max-w-xl text-[#53605c]">
          Add the details your guests need before they make a plan.
        </p>

        <form
          className="mt-10 grid gap-5 border border-[#d5d5cb] bg-white/35 p-5 sm:grid-cols-2 sm:p-8"
          onSubmit={handleSubmit}
        >
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[1px] sm:col-span-2">
            Title
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-[#ef694d]"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[1px] sm:col-span-2">
            Description
            <textarea
              className="min-h-32 border border-[#bfc5bd] bg-transparent p-3 text-base font-normal normal-case tracking-normal outline-none focus:border-[#ef694d]"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              required
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[1px]">
            Date
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-[#ef694d]"
              type="date"
              value={form.eventDate}
              onChange={(event) => updateField("eventDate", event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[1px]">
            Time
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-[#ef694d]"
              type="time"
              value={form.eventTime}
              onChange={(event) => updateField("eventTime", event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[1px]">
            Venue
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-[#ef694d]"
              value={form.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              required
            />
          </label>
          <label className="grid gap-2 text-xs font-bold uppercase tracking-[1px]">
            Total seats
            <input
              className="border-b border-[#bfc5bd] bg-transparent px-0 py-3 text-base font-normal normal-case tracking-normal outline-none focus:border-[#ef694d]"
              type="number"
              min="1"
              value={form.totalSeats}
              onChange={(event) =>
                updateField("totalSeats", event.target.value)
              }
              required
            />
          </label>
          <div className="flex items-center gap-5 sm:col-span-2">
            <button
              className="rounded-[2px] bg-[#ef694d] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#18211f] disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Creating..." : "Create event"}
            </button>
            {message && (
              <p className="text-sm text-[#53605c]" role="status">
                {message}
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
