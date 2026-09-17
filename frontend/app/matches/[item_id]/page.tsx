"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type CandidateItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  color: string;
  location: string;
  image_url?: string;
  item_type: string;
  timestamp: string;
};

type MatchResult = {
  match_id: number;
  candidate_item: CandidateItem;
  similarity_score: number;
  high_confidence_match: boolean;
};

export default function MatchResultsPage() {
  const params = useParams();
  const router = useRouter();

  const itemId = params.item_id;

  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!itemId) return;

    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get<MatchResult[]>(
          `http://127.0.0.1:8000/match/${itemId}`
        );

        setMatches(response.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load match results.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [itemId]);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "";

    return `http://127.0.0.1:8000/${imageUrl}`;
  };

  const getSimilarityPercentage = (score: number) => {
    return Math.min(100, Math.round(score * 10));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-blue-600"
          >
            LOSFER
          </button>

          <div className="flex gap-6 text-sm font-medium">
            <button
              onClick={() => router.push("/")}
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </button>

            <button
              onClick={() => router.push("/browse")}
              className="text-gray-700 hover:text-blue-600"
            >
              Browse Found Items
            </button>

            <button
              onClick={() => router.push("/my-reports")}
              className="text-gray-700 hover:text-blue-600"
            >
              My Reports
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Possible Matches
          </h1>

          <p className="mt-2 text-gray-600">
            We found items that may match your report.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="text-gray-600">
              Searching for possible matches...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-700">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <div className="mb-4 text-5xl">🔍</div>

            <h2 className="text-xl font-semibold text-gray-900">
              No matches found
            </h2>

            <p className="mt-2 text-gray-600">
              We could not find any possible matching items yet.
            </p>

            <button
              onClick={() => router.push("/my-reports")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Back to My Reports
            </button>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => {
              const item = match.candidate_item;
              const percentage = getSimilarityPercentage(
                match.similarity_score
              );

              return (
                <div
                  key={match.match_id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-56 bg-gray-200">
                    {item.image_url ? (
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.title}
                        className="h-full w-full object-cover blur-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No image available
                      </div>
                    )}

                    <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-600 shadow">
                      {percentage}% match
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.category}
                      </span>

                      {match.high_confidence_match && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          High Match
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900">
                      {item.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {item.description}
                    </p>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium text-gray-800">
                          Color:
                        </span>{" "}
                        {item.color}
                      </p>

                      <p>
                        <span className="font-medium text-gray-800">
                          Location:
                        </span>{" "}
                        {item.location}
                      </p>

                      <p>
                        <span className="font-medium text-gray-800">
                          Reported:
                        </span>{" "}
                        {new Date(item.timestamp).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/claim?item_id=${item.id}`)
                      }
                      className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Is This Yours?
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}