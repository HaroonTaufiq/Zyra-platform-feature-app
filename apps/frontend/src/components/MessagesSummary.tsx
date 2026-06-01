import type { Message } from "../types";
import { formatDate } from "../lib/format";

export function MessagesSummary({
  messages,
  unreadCount,
}: {
  messages: Message[];
  unreadCount: number;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
        <span
          data-testid="unread-count"
          className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-800"
        >
          {unreadCount} unread
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {messages.map((msg) => (
          <li
            key={msg.id}
            className={`rounded-lg border p-3 ${
              msg.read
                ? "border-slate-200 bg-white"
                : "border-brand-200 bg-brand-50/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                {!msg.read && (
                  <span
                    aria-label="unread"
                    className="h-2 w-2 rounded-full bg-brand-500"
                  />
                )}
                {msg.from}
              </span>
              <span className="text-xs text-slate-400">
                {formatDate(msg.receivedAt)}
              </span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {msg.subject}
            </p>
            <p className="truncate text-sm text-slate-500">{msg.preview}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
