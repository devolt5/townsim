import { messages as defaultMessages, type Message } from "@/data/messages";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SENDER_COLORS: Record<string, string> = {
  Tutor: "bg-amber-500",
};

function senderInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function senderColor(name: string): string {
  return SENDER_COLORS[name] ?? "bg-stone-500";
}

interface MessagesProps {
  items?: Message[];
  onMessageClick?: (dialogId: number) => void;
}

export function Messages({
  items = defaultMessages,
  onMessageClick,
}: MessagesProps) {
  if (items.length === 0) {
    return (
      <div className="text-[11px] text-stone-400 italic text-center pt-8">
        Noch keine Nachrichten in dieser Amtszeit.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 px-1 py-1.5">
      {items.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-1.5 items-start ${msg.dialogId && onMessageClick ? "cursor-pointer hover:opacity-80 active:opacity-60 transition-opacity" : ""}`}
          onClick={() => msg.dialogId && onMessageClick?.(msg.dialogId)}
        >
          {/* Avatar */}
          <div
            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold ${senderColor(msg.sender)}`}
            style={{ fontSize: "9px" }}
            title={msg.sender}
          >
            {senderInitial(msg.sender)}
          </div>

          {/* Bubble */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-[9px] font-semibold text-stone-600 truncate">
                {msg.sender}
              </span>
              <span className="text-[8px] text-stone-400 shrink-0">
                {formatTime(msg.timestamp)}
              </span>
            </div>
            <div className="bg-stone-100 border border-stone-200 rounded-lg rounded-tl-none px-2 py-1 text-[10px] text-stone-700 leading-snug wrap-break-word">
              {msg.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
