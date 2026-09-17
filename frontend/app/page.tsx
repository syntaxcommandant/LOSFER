const features = [
  {
    title: "Report Lost or Found",
    description:
      "Quickly submit an item with its photo, category, location, and date.",
    icon: "＋",
  },
  {
    title: "Smart Matching",
    description:
      "Find possible matches using item details and AI-powered similarity.",
    icon: "⌕",
  },
  {
    title: "Verified Claims",
    description:
      "Protect ownership with private verification before an item is claimed.",
    icon: "✓",
  },
];

export default function Home() {
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

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#features"
              className="text-slate-600 hover:text-slate-900"
            >
              Features
            </a>
          </div>

          <button className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            Sign In
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-700">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              Built for university campuses
            </div>

            <h2 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-slate-950 md:text-6xl">
              Lost something?
              <span className="block text-teal-600">Let&apos;s find it.</span>
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              LOSFER connects students with lost and found items through
              intelligent matching, secure ownership verification, and simple
              campus-based reporting.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/report"
                className="rounded-xl bg-slate-900 px-6 py-3.5 text-center font-semibold text-white transition hover:bg-slate-700"
              >
                Report an Item
              </a>

              <a
                href="/browse"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Browse Found Items
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 border-t border-slate-200 pt-7">
              <div>
                <p className="text-2xl font-bold">24/7</p>
                <p className="text-sm text-slate-500">Campus access</p>
              </div>

              <div>
                <p className="text-2xl font-bold">AI</p>
                <p className="text-sm text-slate-500">Smart matching</p>
              </div>

              <div>
                <p className="text-2xl font-bold">Secure</p>
                <p className="text-sm text-slate-500">Claim verification</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Recent activity
                  </p>

                  <h3 className="mt-1 text-xl font-bold">Found items</h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  Live
                </span>
              </div>

              <div className="space-y-4 pt-5">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                    ⌚
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">Silver Watch</p>

                    <p className="text-sm text-slate-500">
                      Library • Today
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-teal-600">
                    Match
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                    🎒
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">Black Backpack</p>

                    <p className="text-sm text-slate-500">
                      Block A • Yesterday
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Found
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                    🎧
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">Wireless Earbuds</p>

                    <p className="text-sm text-slate-500">
                      Cafeteria • 2 days ago
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-slate-500">
                    Found
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-lg">
              <p className="text-xs text-slate-500">Matching powered by</p>

              <p className="mt-1 font-bold text-teal-600">
                AI + Item Details
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-teal-600">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              A simpler way to recover lost belongings.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              From reporting an item to securely completing a handoff, LOSFER
              brings the complete recovery process into one platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-xl font-bold text-teal-700">
                  {feature.icon}
                </div>

                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <span className="text-sm font-bold text-teal-400">01</span>

              <h3 className="mt-3 text-2xl font-bold">Report</h3>

              <p className="mt-3 leading-7 text-slate-400">
                Submit the details of your lost or found item.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-teal-400">02</span>

              <h3 className="mt-3 text-2xl font-bold">Match</h3>

              <p className="mt-3 leading-7 text-slate-400">
                LOSFER compares item information to identify possible matches.
              </p>
            </div>

            <div>
              <span className="text-sm font-bold text-teal-400">03</span>

              <h3 className="mt-3 text-2xl font-bold">Verify & Recover</h3>

              <p className="mt-3 leading-7 text-slate-400">
                Complete ownership verification and securely recover the item.
              </p>
            </div>
          </div>
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