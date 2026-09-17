"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ClaimPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const itemId = searchParams.get("item_id");

  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const verifyAnswer = async (e: FormEvent) => {
    e.preventDefault();

    if (!itemId) {
      setError("Item information is missing.");
      return;
    }

    if (!answer.trim()) {
      setError("Please enter your verification answer.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const formData = new FormData();
      formData.append("submitted_answer", answer);

      const response = await axios.post(
        `http://127.0.0.1:8000/verify-item/${itemId}`,
        formData
      );

      setMatchScore(response.data.match_score ?? null);

      if (response.data.verified) {
        setVerified(true);
        setMessage("Verification successful. You can now submit your claim.");
      } else {
        setVerified(false);
        setMessage(
          response.data.message ||
            "The answer could not be verified. Please try again."
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to verify your answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitClaim = async () => {
    if (!itemId || !verified) {
      return;
    }

    try {
      setClaimLoading(true);
      setError("");
      setMessage("");

      await axios.post("http://127.0.0.1:8000/claim", {
        item_id: Number(itemId),
        verification_answer: answer,
      });

      setMessage(
        "Your claim has been submitted successfully. It is now pending review."
      );
    } catch (err) {
      console.error(err);
      setError("Unable to submit your claim. Please try again.");
    } finally {
      setClaimLoading(false);
    }
  };

  if (!itemId) {
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

        <section className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 text-5xl">⚠️</div>

            <h1 className="text-2xl font-bold text-gray-900">
              Item information missing
            </h1>

            <p className="mt-2 text-gray-600">
              We could not determine which item you want to claim.
            </p>

            <button
              onClick={() => router.push("/browse")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Found Items
            </button>
          </div>
        </section>
      </main>
    );
  }

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

      <section className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">🔐</div>

          <h1 className="text-3xl font-bold text-gray-900">
            Claim This Item
          </h1>

          <p className="mt-2 text-gray-600">
            Verify your ownership before submitting a claim.
          </p>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-sm">
          <div className="mb-6 rounded-lg bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Item ID:</span> {itemId}
            </p>
          </div>

          <form onSubmit={verifyAnswer}>
            <label
              htmlFor="verification-answer"
              className="mb-2 block text-sm font-semibold text-gray-800"
            >
              Ownership Verification Answer
            </label>

            <p className="mb-4 text-sm text-gray-500">
              Enter the answer to the secret question you provided when
              reporting this item.
            </p>

            <textarea
              id="verification-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer"
              rows={4}
              disabled={verified || loading}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />

            {!verified && (
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Ownership"}
              </button>
            )}
          </form>

          {matchScore !== null && !verified && (
            <div className="mt-5 rounded-lg bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Verification match score:{" "}
                <span className="font-semibold">{matchScore}%</span>
              </p>
            </div>
          )}

          {message && (
            <div
              className={`mt-5 rounded-lg p-4 ${
                verified
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-800"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {verified && (
            <div className="mt-6 border-t pt-6">
              <div className="mb-5 rounded-lg bg-green-50 p-4">
                <p className="font-semibold text-green-700">
                  ✓ Ownership verified
                </p>

                <p className="mt-1 text-sm text-green-600">
                  Your answer has been successfully verified.
                </p>
              </div>

              <button
                type="button"
                onClick={submitClaim}
                disabled={claimLoading}
                className="w-full rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {claimLoading ? "Submitting Claim..." : "Submit Claim"}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="mt-4 w-full rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </section>
    </main>
  );
}