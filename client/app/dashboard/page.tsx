"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import RouteGuard from "@/components/RouteGuard";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/api";

type Booking = {
  eventId: string;
  status: "CONFIRMED" | "CANCELLED";
  event: {
    title: string;
    description: string;
    eventDate: string;
    eventTime: string;
    venue: string;
  };
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/booking`, {
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message ?? "Unable to load bookings.");
        }
        setBookings(result.bookings ?? []);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load bookings.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadBookings();
  }, []);

  async function cancelBooking(eventId: string) {
    if (!window.confirm("Cancel this booking?")) return;

    setCancellingId(eventId);
    setError("");
    try {
      const response = await fetch(`${API_URL}/booking/${eventId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message ?? "Unable to cancel booking.");
      }

      setBookings((current) =>
        current.filter((booking) => booking.eventId !== eventId),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to cancel booking.",
      );
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <RouteGuard redirectAdminTo="/dashboard/admin">
      <div className="min-h-screen bg-[#f7f5ef] text-[#18211f] lg:flex">
        <aside className="border-b border-[#d5d5cb] bg-[#18211f] px-5 py-6 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:px-7 lg:py-10">
          <div>
            <div>
              <p className="font-serif text-2xl italic">eventBook</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[1.5px] text-[#f6cb57]">
                Your space
              </p>
            </div>
            <nav className="mt-6 flex flex-wrap gap-2 text-xs lg:grid lg:gap-3">
              <Link
                className="border border-[#f6cb57] px-3 py-2 text-[#f6cb57] lg:border-0 lg:px-0 lg:py-0"
                href="/dashboard"
                aria-current="page"
              >
                My bookings
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </aside>
        <main className="min-w-0 flex-1 px-6 py-10 sm:px-10 sm:py-14">
          <div className="mx-auto max-w-275">
            <p className="text-xs font-bold uppercase tracking-[1.5px] text-[#ef694d]">
              My bookings
            </p>
            <h1 className="mt-3 font-serif text-5xl font-normal sm:text-6xl">
              Your plans
            </h1>
            <p className="mt-4 text-[#53605c]">
              Events you have booked will appear here.
            </p>
            <section className="mt-10">
              {isLoading ? (
                <p className="text-sm text-[#53605c]" role="status">
                  Loading your bookings...
                </p>
              ) : error ? (
                <p className="text-sm text-[#ef694d]" role="alert">
                  {error}
                </p>
              ) : bookings.length === 0 ? (
                <p className="text-sm text-[#53605c]">
                  You have not booked any events yet.
                </p>
              ) : (
                <div className="grid gap-4">
                  {bookings.map((booking) => (
                    <article
                      className="border border-[#d5d5cb] bg-white/45 p-5 transition hover:-translate-y-0.5 hover:border-[#ef694d] hover:bg-white/70"
                      key={booking.eventId}
                    >
                      <Link href={`/event/${booking.eventId}`}>
                        <h2 className="font-serif text-2xl">
                          {booking.event.title}
                        </h2>
                        <p className="mt-3 text-sm text-[#53605c]">
                          {new Date(
                            booking.event.eventDate,
                          ).toLocaleDateString()}{" "}
                          · {booking.event.eventTime}
                        </p>
                        <p className="mt-1 text-sm text-[#53605c]">
                          {booking.event.venue}
                        </p>
                      </Link>
                      <button
                        className="mt-5 border border-[#ef694d] px-4 py-2 text-xs font-bold text-[#ef694d] disabled:opacity-60"
                        type="button"
                        onClick={() => cancelBooking(booking.eventId)}
                        disabled={cancellingId === booking.eventId}
                      >
                        {cancellingId === booking.eventId
                          ? "Cancelling..."
                          : "Cancel booking"}
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </RouteGuard>
  );
}
