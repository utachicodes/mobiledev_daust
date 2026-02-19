import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <p className="text-[8rem] font-[900] text-brand-navy/10 leading-none select-none">404</p>
        <h1 className="text-2xl font-[800] text-brand-navy tracking-tight -mt-6 mb-3">Page not found</h1>
        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" className="rounded-full">
            Go Home
          </Button>
        </Link>
      </div>
    </main>
  );
}