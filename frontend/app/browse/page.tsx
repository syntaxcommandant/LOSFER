"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FoundItem {
  id: number;
  user_id: number;
  item_type: string;
  title: string;
  description: string;
  category: string;
  color: string;
  location: string;
  timestamp: string;
  image_url?: string;
}

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) {
    return "";
  }

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `http://127.0.0.1:8000/${imageUrl}`;
};

export default function BrowsePage() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async (selectedCategory = category) => {
    try {
      setLoading(true);
      setError("");

      const url = selectedCategory
        ? `http://127.0.0.1:8000/items?category=${encodeURIComponent(
            selectedCategory
          )}`
        : "http://127.0.0.1:8000/items";

      const response = await axios.get<FoundItem[]>(url);

      setItems(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load found items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(category);
  }, [category]);

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.title.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText) ||
      item.location.toLowerCase().includes(searchText) ||
      item.color.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-700">LOSFER</h1>

          <div className="flex gap-6 text-sm font-medium">
            <a
              href="/"
              className="text-gray-700 hover:text-blue-700"
            >
              Home
            </a>

            <a
              href="/report"
              className="text-gray-700 hover:text-blue-700"
            >
              Report
            </a>

            <a
              href="/browse"
              className="text-blue-700"
            >
              Browse
            </a>

            <a
              href="/my-reports"
              className="text-gray-700 hover:text-blue-700"
            >
              My Reports
            </a>

            <a
              href="/staff"
              className="text-gray-700 hover:text-blue-700"
            >
              Staff Dashboard
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900">
            Browse Found Items
          </h2>

          <p className="mt-2 text-gray-600">
            Find items that have been reported as found on campus.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, location or color..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Documents">Documents</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="button"
            onClick={() => fetchItems(category)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800">
              No Found Items
            </h3>

            <p className="mt-2 text-gray-500">
              No items match your current search or filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="h-56 bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      FOUND
                    </span>

                    <span className="text-sm text-gray-500">
                      #{item.id}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {item.description}
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Category:</span>{" "}
                      {item.category}
                    </p>

                    <p>
                      <span className="font-semibold">Color:</span>{" "}
                      {item.color}
                    </p>

                    <p>
                      <span className="font-semibold">Location:</span>{" "}
                      {item.location}
                    </p>

                    <p>
                      <span className="font-semibold">Reported:</span>{" "}
                      {new Date(item.timestamp).toLocaleDateString()}
                    </p>
                  </div>

                  <a
                    href={`/matches/${item.id}`}
                    className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-800"
                  >
                    View Matches →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}