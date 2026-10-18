"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";

type EventItem = {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalSeats: number;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadEvents = async () => {
      const title = search.trim();

      try {
        setIsLoading(true);
        setError("");

        const query = title ? `?title=${encodeURIComponent(title)}` : "";
        const response = await fetch(`${API_URL}/events${query}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message ?? "Unable to load events.");
        }
        setEvents(result.events ?? []);
      } catch (error) {
        if (
         error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load events.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
    return () => controller.abort();
  }, [search]);

  const hasSearch = search.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-12 text-[#18211f] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#ef694d]">
            Discover
          </p>
          <h1 className="mt-3 font-serif text-5xl font-normal leading-none sm:text-7xl">
            Find an event
          </h1>
          <p className="mt-5 text-base leading-7 text-[#53605c]">
            Search upcoming events by title and find your next good thing.
          </p>
        </div>

        <label className="mt-10 block max-w-xl" htmlFor="event-search">
          <span className="sr-only">Search events by title</span>
          <input
            className="w-full border-b-2 border-[#18211f] bg-transparent px-0 py-4 text-lg outline-none placeholder:text-[#53605c]/70 focus:border-[#ef694d]"
            id="event-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by event title"
          />
        </label>

        {isLoading ? (
          <p className="mt-12 text-sm text-[#53605c]" role="status">
            Loading events...
          </p>
        ) : error ? (
          <p className="mt-12 text-sm text-[#ef694d]" role="alert">
            {error}
          </p>
        ) : events.length === 0 ? (
          <p className="mt-12 text-sm text-[#53605c]">
            {hasSearch
              ? "No events match that title."
              : "No events have been created yet."}
          </p>
        ) : (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                className="group flex min-h-56 flex-col border border-[#d5d5cb] bg-white/35 p-5 transition hover:-translate-y-1 hover:border-[#ef694d] hover:bg-white/70"
                key={event.id}
                href={`/event/${event.id}`}
              >
                <h2 className="font-serif text-2xl">{event.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#53605c]">
                  {event.description}
                </p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[1px] text-[#ef694d]">
                  {new Date(event.eventDate).toLocaleDateString()} ·{" "}
                  {event.eventTime}
                </p>
                <p className="mt-2 text-sm text-[#53605c]">
                  {event.venue} · {event.totalSeats} seats
                </p>
                <span className="mt-auto pt-6 text-xs font-bold uppercase tracking-[1px] text-[#18211f] transition group-hover:text-[#ef694d]">
                  View event <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
