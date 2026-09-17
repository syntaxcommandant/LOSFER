"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Report = {
  id: number;
  user_id: number;
  item_type: "LOST" | "FOUND" | "lost" | "found";
  title: string;
  description: string;
  category: string;
  color: string;
  location: string;
  timestamp: string;
  image_url?: string | null;
};

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get<Report[]>(
          "http://127.0.0.1:8000/my-reports"
        );
        setReports(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load your reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isLost = (type: Report["item_type"]) =>
    type.toString().toLowerCase() === "lost";

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            LOSFER
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-slate-600 transition hover:text-slate-900"
            >
              Home
            </Link>

            <Link
              href="/browse"
              className="text-slate-600 transition hover:text-slate-900"
            >
              Browse
            </Link>

            <Link
              href="/report"
              className="rounded-lg bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
            >
              Report Item
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Dashboard
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            My Reports
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            View all the lost and found items you have reported on LOSFER.
          </p>
        </div>

        {loading && (
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
              <p className="text-slate-600">Loading your reports...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">Something went wrong</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              📋
            </div>

            <h2 className="text-2xl font-semibold text-slate-900">
              No reports yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-600">
              You haven't submitted any lost or found item reports yet.
            </p>

            <Link
              href="/report"
              className="mt-6 inline-block rounded-lg bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
            >
              Report an Item
            </Link>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  {reports.length}
                </span>{" "}
                {reports.length === 1 ? "report" : "reports"} submitted
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <article
                  key={report.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative flex h-52 items-center justify-center overflow-hidden bg-slate-100">
                    {report.image_url ? (
                      <img
                        src={`http://127.0.0.1:8000/${report.image_url}`}
                        alt={report.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <div className="mb-2 text-4xl">📷</div>
                        <p className="text-sm">No image available</p>
                      </div>
                    )}

                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                        isLost(report.item_type)
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isLost(report.item_type) ? "Lost" : "Found"}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold text-slate-900">
                        {report.title}
                      </h2>

                      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        #{report.id}
                      </span>
                    </div>

                    <p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">
                      {report.description}
                    </p>

                    <div className="space-y-3 border-t border-slate-100 pt-4 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Category</span>
                        <span className="font-medium text-slate-800">
                          {report.category}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Color</span>
                        <span className="font-medium text-slate-800">
                          {report.color}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Location</span>
                        <span className="text-right font-medium text-slate-800">
                          {report.location}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-slate-500">Reported</span>
                        <span className="font-medium text-slate-800">
                          {formatDate(report.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}