"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [["How it works", "#how-it-works"]];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading } = useAuth();

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="relative z-10 mx-auto flex max-w-[1280px] items-center justify-between border-b border-[#d5d5cb] px-5 py-4 sm:px-8 sm:py-5">
      <Link
        className="flex items-center gap-2 font-extrabold tracking-[-1px]"
        href="/"
        aria-label="Gather home"
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-[2px] bg-[#ef694d] font-serif text-sm italic text-white md:h-12 md:w-12">
          event
        </span>
        <span className="text-lg">Book</span>
      </Link>

      <nav
        id="main-navigation"
        className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 top-[73px] w-full flex-col items-stretch gap-0 border-b border-[#d5d5cb] bg-[#f7f5ef] px-5 pb-6 pt-3 text-[13px] shadow-lg shadow-[#18211f]/5 sm:static sm:flex sm:w-auto sm:flex-row sm:items-center sm:gap-7 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none`}
        aria-label="Main navigation"
      >
        {navItems.map(([label, href]) => (
          <a
            className="py-[13px] transition-colors hover:text-[#ef694d] sm:py-0"
            href={href}
            key={label}
            onClick={closeMenu}
          >
            {label}
          </a>
        ))}
        {!isLoading && (
          <Link
            className="inline-flex justify-center gap-4 rounded-[2px] bg-[#18211f] px-4 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#ef694d]"
            href={
              user?.role === "ADMIN"
                ? "/dashboard/admin"
                : user
                  ? "/dashboard"
                  : "/auth"
            }
            onClick={closeMenu}
          >
            {user ? "Dashboard" : "Get started"}{" "}
            <span aria-hidden="true">↗</span>
          </Link>
        )}
      </nav>

      <button
        className="cursor-pointer border-0 bg-transparent p-2 pl-3 sm:hidden"
        type="button"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        onClick={() => setIsMenuOpen((open) => !open)}
      >
        <span className="sr-only">{isMenuOpen ? "Close" : "Open"} menu</span>
        <span className="my-[5px] block h-0.5 w-[25px] bg-[#18211f]" />
        <span className="my-[5px] block h-0.5 w-[25px] bg-[#18211f]" />
      </button>
    </header>
  );
}
