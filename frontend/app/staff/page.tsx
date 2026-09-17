"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Claim {
  id: number;
  item_id: number;
  claimant_id: number;
  verification_answer: string;
  status: string;
}

export default function StaffDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get<Claim[]>(
        "http://127.0.0.1:8000/staff/claims"
      );

      setClaims(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateClaim = async (
    claimId: number,
    action: "approve" | "reject"
  ) => {
    try {
      setError("");

      await axios.patch(
        `http://127.0.0.1:8000/staff/claims/${claimId}/${action}`
      );

      await fetchClaims();
    } catch (err) {
      console.error(err);
      setError("Unable to update the claim. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-700">
            LOSFER
          </h1>

          <div className="flex gap-6 text-sm font-medium">
            <a href="/" className="text-gray-700 hover:text-blue-700">
              Home
            </a>

            <a
              href="/browse"
              className="text-gray-700 hover:text-blue-700"
            >
              Browse
            </a>

            <a
              href="/my-reports"
              className="text-gray-700 hover:text-blue-700"
            >
              My Reports
            </a>

            <a href="/staff" className="text-blue-700">
              Staff Dashboard
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Staff Dashboard
          </h2>

          <p className="mt-2 text-gray-600">
            Review and manage pending ownership claims.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-600">
              Loading pending claims...
            </p>
          </div>
        ) : claims.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">
              No Pending Claims
            </h3>

            <p className="mt-2 text-gray-500">
              There are currently no claims waiting for review.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Claim ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Item ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Claimant ID
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Verification Answer
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        #{claim.id}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-blue-700">
                        #{claim.item_id}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        #{claim.claimant_id}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {claim.verification_answer}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                          {claim.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateClaim(claim.id, "approve")
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateClaim(claim.id, "reject")
                            }
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}