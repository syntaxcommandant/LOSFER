"use client";

import { useRef, useState } from "react";
import axios from "axios";

const categories = [
  "Electronics",
  "Documents",
  "Accessories",
  "Books",
  "Clothing",
  "Bags",
  "Keys",
  "Other",
];

const colors = [
  "Black",
  "White",
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Brown",
  "Grey",
  "Other",
];

export default function ReportPage() {
  const [type, setType] = useState<"lost" | "found">("lost");
  const [photoName, setPhotoName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setMessage("");

    if (!title.trim()) {
      setMessage("Please enter the item title.");
      return;
    }

    if (!description.trim()) {
      setMessage("Please enter a description.");
      return;
    }

    if (!secretAnswer.trim()) {
      setMessage("Please enter a secret verification answer.");
      return;
    }

    if (!category) {
      setMessage("Please select a category.");
      return;
    }

    if (!color) {
      setMessage("Please select a color.");
      return;
    }

    if (!location.trim()) {
      setMessage("Please enter the location.");
      return;
    }

    if (!timestamp) {
      setMessage("Please select the date and time.");
      return;
    }

    if (type === "found" && !photo) {
      setMessage("Please upload a photo for a found item.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        type === "lost"
          ? "http://127.0.0.1:8000/report-lost"
          : "http://127.0.0.1:8000/report-found";

      const itemData = {
        title: title.trim(),
        description: description.trim(),
        secret_answer: secretAnswer.trim(),
        category,
        color,
        location: location.trim(),
        timestamp: new Date(timestamp).toISOString(),
      };

      const formData = new FormData();

      formData.append("item_in", JSON.stringify(itemData));

      if (photo) {
        formData.append("image", photo);
      }

      const response = await axios.post(endpoint, formData);

      setMessage(
        `${type === "lost" ? "Lost" : "Found"} report submitted successfully! Report ID: ${response.data.id}`,
      );

      setTitle("");
      setDescription("");
      setSecretAnswer("");
      setCategory("");
      setColor("");
      setLocation("");
      setTimestamp("");
      setPhoto(null);
      setPhotoName("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const detail = error.response?.data?.detail;

        let backendMessage = "Failed to submit the report.";

        if (Array.isArray(detail)) {
          backendMessage = detail
            .map((item) =>
              typeof item === "object" && item !== null && "msg" in item
                ? String(item.msg)
                : String(item),
            )
            .join(", ");
        } else if (typeof detail === "string") {
          backendMessage = detail;
        }

        setMessage(`Error: ${backendMessage}`);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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

          <a
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            ← Back to Home
          </a>
        </div>
      </nav>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
              Report an item
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
              Help reunite an item with its owner
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Provide a few details about the item. LOSFER will use this
              information to help identify possible matches.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-2">
              <button
                type="button"
                onClick={() => {
                  setType("lost");
                  setMessage("");
                }}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  type === "lost"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                I Lost Something
              </button>

              <button
                type="button"
                onClick={() => {
                  setType("found");
                  setMessage("");
                }}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  type === "found"
                    ? "bg-teal-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
              >
                I Found Something
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Item title
                </label>

                <input
                  type="text"
                  placeholder="e.g. Silver Casio Watch"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Description
                </label>

                <textarea
                  rows={5}
                  placeholder="Describe the item, including any unique marks or details..."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Secret verification answer
                </label>

                <input
                  type="text"
                  placeholder="Enter a detail only the real owner should know"
                  value={secretAnswer}
                  onChange={(event) => setSecretAnswer(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This answer will be used later to help verify ownership.
                  Avoid entering information that is publicly visible.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">
                    Color
                  </label>

                  <select
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="">Select color</option>

                    {colors.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Location
                </label>

                <input
                  type="text"
                  placeholder="e.g. Central Library, Block A"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Date and time
                </label>

                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(event) => setTimestamp(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Item photo
                  {type === "found" && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-teal-400 hover:bg-teal-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">
                    ↑
                  </div>

                  <p className="mt-4 font-semibold text-slate-800">
                    {photoName || "Upload a photo"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    PNG, JPG or JPEG
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setPhoto(file);
                      setPhotoName(file ? file.name : "");
                      setMessage("");
                    }}
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">
                <p className="text-sm font-semibold text-teal-900">
                  Privacy & verification
                </p>

                <p className="mt-1 text-sm leading-6 text-teal-800">
                  Only provide information that helps identify the item. Your
                  secret answer is used later during ownership verification.
                </p>
              </div>

              {message && (
                <div
                  className={`rounded-xl p-4 text-sm font-semibold ${
                    message.startsWith("Error")
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Submitting..."
                  : type === "lost"
                    ? "Submit Lost Report"
                    : "Submit Found Report"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}