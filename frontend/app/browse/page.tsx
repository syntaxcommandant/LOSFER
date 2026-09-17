"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type FoundItem = {
  id: number;
  user_id: number;
  item_type: string;
  title: string;
  description: string;
  category: string;
  color: string;
  location: string;
  timestamp: string;
  image_url: string | null;
};

const categories = [
  "All",
  "Electronics",
  "Documents",
  "Accessories",
  "Books",
  "Clothing",
  "Bags",
  "Keys",
  "Other",
];

export default function BrowsePage() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchItems = async (selectedCategory: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get<FoundItem[]>(
        "http://127.0.0.1:8000/items",
        selectedCategory !== "All"
          ? {
              params: {
                category: selectedCategory,
              },
            }
          : undefined,
      );

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
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.color.toLowerCase().includes(query)
    );
  });

  const formatDate = (value: string) => {
    return new Date(value).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `http://127.0.0.1:8000/${imageUrl}`;
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              L
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">LOSFER</h1>
              <p className="text-xs text-slate-500">Campus Lost & Found</p>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/report"
              className="hidden rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:block"
            >
              Report an Item
            </a>

            <a
              href="/"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Home
            </a>
          </div>
        </div>
      </nav>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
                Found items
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Browse items reported on campus
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                Search through found items and compare their details with what
                you have lost.
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchItems(category)}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Refresh Items
            </button>
          </div>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by item, description, location or color..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                >
                  {categories.map((itemCategory) => (
                    <option key={itemCategory} value={itemCategory}>
                      {itemCategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading found items..."
                  : `${filteredItems.length} item${
                      filteredItems.length === 1 ? "" : "s"
                    } shown`}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm font-semibold text-teal-600 hover:text-teal-700"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white"
                >
                  <div className="h-56 bg-slate-200" />

                  <div className="space-y-4 p-6">
                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-4/5 rounded bg-slate-200" />
                    <div className="h-10 w-full rounded-xl bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🔎
              </div>

              <h3 className="mt-6 text-2xl font-bold">
                No matching found items
              </h3>

              <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
                Try another search term or choose a different category.
              </p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const imageUrl = getImageUrl(item.image_url);

                return (
                  <article
                    key={item.id}
                    className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <div className="text-5xl">📦</div>
                          <p className="mt-2 text-sm font-medium text-slate-400">
                            No photo available
                          </p>
                        </div>
                      )}

                      <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-teal-700 shadow-sm backdrop-blur">
                        Found
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                        #{item.id}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-950">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-400">
                            Category
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {item.category}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-xs font-medium text-slate-400">
                            Color
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            {item.color}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl bg-slate-50 p-3">
                        <p className="text-xs font-medium text-slate-400">
                          Found at
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {item.location}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500">
                          {formatDate(item.timestamp)}
                        </p>

                        <span className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                          Review details
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 LOSFER. University Lost & Found Platform.</p>
          <p>Built for a safer, smarter campus.</p>
        </div>
      </footer>
    </main>
  );
}