"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

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

export default function Home() {
  const { user, isLoading } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const dashboardPath =
    user?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard";

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) return;
        const result = await response.json();
        setEvents(result.events ?? []);
      } catch {
        setEvents([]);
      } finally {
        setIsEventsLoading(false);
      }
    };

    void loadEvents();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#18211f]">
      <main id="top">
        <section className="mx-auto flex min-h-[68vh] max-w-[1280px] items-center px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-[680px]">
            <p className="mb-6 flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[1.5px]">
              <span className="h-2 w-2 rounded-full bg-[#ef694d]" /> Make plans
              worth keeping
            </p>
            <h1 className="font-serif text-[60px] font-normal leading-[.93] tracking-[-3px] sm:text-[clamp(64px,9vw,112px)]">
              Find your next
              <br />
              <em className="text-[#ef694d]">good thing.</em>
            </h1>
            <p className="my-8 max-w-[480px] text-base leading-[1.7] text-[#53605c] sm:text-lg">
              Gather brings events, people, and places together so making plans
              feels natural.
            </p>
            {!isLoading && (
              <Link
                className="inline-flex gap-4 rounded-[2px] bg-[#18211f] px-5 py-4 text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#ef694d]"
                href={user ? dashboardPath : "/auth"}
              >
                {user ? "Go to dashboard" : "Start gathering"}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            )}
          </div>
        </section>
        <section className="mx-auto max-w-[1280px] px-5 pb-20 sm:px-8">
          <div className="border-t border-[#d5d5cb] pt-8">
            <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#ef694d]">
              Coming up
            </p>
            <h2 className="mt-3 font-serif text-4xl font-normal">
              Events worth showing up for
            </h2>
          </div>
          {isEventsLoading ? (
            <p className="mt-8 text-sm text-[#53605c]">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="mt-8 text-sm text-[#53605c]">
              No events have been created yet.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  className="group flex min-h-56 flex-col border border-[#d5d5cb] bg-white/35 p-5 transition hover:-translate-y-1 hover:border-[#ef694d] hover:bg-white/70"
                  key={event.id}
                  href={`/event/${event.id}`}
                >
                  <h3 className="font-serif text-2xl">{event.title}</h3>
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
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1280px] justify-between border-t border-[#d5d5cb] px-5 py-6 text-[11px] sm:px-8">
        <span>gather © 2026</span>
        <span>Made for you to make plans.</span>
      </footer>
    </div>
  );
}
