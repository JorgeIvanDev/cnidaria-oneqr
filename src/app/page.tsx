import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full border rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Cnidaria · One-QR Donate</h1>
        <p className="opacity-80">
          Share a single QR that routes supporters to the right wallet on their chain.
        </p>

        <div className="flex gap-3">
          <Link
            href="/p/mike"
            className="px-4 py-2 rounded-xl border font-medium hover:bg-gray-50"
          >
            View Mike’s QR Page
          </Link>

          <Link
            href="/api/profile/mike"
            className="px-4 py-2 rounded-xl border font-medium hover:bg-gray-50"
          >
            API JSON
          </Link>
        </div>

        <p className="text-sm opacity-70">
          Tip: add <code className="font-mono">?chain=sol</code> or{" "}
          <code className="font-mono">?chain=btc</code> to the URL to force a chain.
        </p>
      </div>
    </main>
  );
}