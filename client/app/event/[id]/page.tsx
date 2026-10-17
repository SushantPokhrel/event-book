"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";

type EventItem = {
  title: string;
  description: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  totalSeats: number;
};

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetch(`${API_URL}/events/${id}`);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message ?? "Event not found.");
        }
        setEvent(result.event);
        setAvailableSeats(result.availableSeats);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load event.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvent();
  }, [id]);

  async function handleBooking() {
    if (!user) {
      router.replace("/auth");
      return;
    }

    setIsBooking(true);
    setBookingMessage("");

    try {
      const response = await fetch(`${API_URL}/booking/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to book this event.");
      }

      setAvailableSeats(result.seatsLeft);
      setBookingMessage(result.message);
    } catch (bookingError) {
      setBookingMessage(
        bookingError instanceof Error
          ? bookingError.message
          : "Unable to book this event.",
      );
    } finally {
      setIsBooking(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] text-[#53605c]">
        <p role="status">Loading event...</p>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-16 text-[#18211f] sm:px-10">
        <div className="mx-auto max-w-275">
          <p className="text-sm text-[#ef694d]">
            {error || "Event not found."}
          </p>
          <Link className="mt-6 inline-block font-bold" href="/">
            Back to events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12 text-[#18211f] sm:px-10 sm:py-20">
      <div className="mx-auto max-w-275">
        <Link className="text-sm text-[#53605c] hover:text-[#ef694d]" href="/">
          ← Back to events
        </Link>
        <div className="mt-12 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#ef694d]">
            Event details
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[.95] sm:text-7xl">
            {event.title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[#53605c]">
            {event.description}
          </p>
        </div>

        <div className="mt-12 grid gap-px border-y border-[#d5d5cb] py-1 sm:grid-cols-4">
          <div className="py-5 sm:pr-5">
            <p className="text-xs font-bold uppercase tracking-[1px] text-[#ef694d]">
              When
            </p>
            <p className="mt-2 text-lg">
              {new Date(event.eventDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-[#53605c]">{event.eventTime}</p>
          </div>
          <div className="border-t border-[#d5d5cb] py-5 sm:border-l sm:border-t-0 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[1px] text-[#ef694d]">
              Where
            </p>
            <p className="mt-2 text-lg">{event.venue}</p>
          </div>
          <div className="border-t border-[#d5d5cb] py-5 sm:border-l sm:border-t-0 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[1px] text-[#ef694d]">
              Total seats
            </p>
            <p className="mt-2 text-lg">{event.totalSeats} seats</p>
          </div>
          <div className="border-t border-[#d5d5cb] py-5 sm:border-l sm:border-t-0 sm:px-5">
            <p className="text-xs font-bold uppercase tracking-[1px] text-[#ef694d]">
              Available seats
            </p>
            <p className="mt-2 text-lg">{availableSeats} seats</p>
          </div>
        </div>

        <button
          className="mt-10 rounded-[2px] bg-[#18211f] px-6 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#ef694d] disabled:cursor-wait disabled:opacity-60"
          type="button"
          onClick={handleBooking}
          disabled={isBooking}
        >
          {isBooking ? "Booking..." : "Book a seat"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
        {bookingMessage && (
          <p className="mt-4 text-sm text-[#53605c]" role="status">
            {bookingMessage}
          </p>
        )}
      </div>
    </main>
  );
}
