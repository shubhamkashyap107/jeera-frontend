import { useEffect, useRef, useState } from "react";
import { ArrowLeft, MessageCircle, SendHorizontal } from "lucide-react";
import EmptyState from "../UI/EmptyState";
import { initials } from "../../Utils/helpers";
import { iconButton } from "../../Utils/styles";
import { io } from "socket.io-client"


const formatTime = (value) => {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
};

// Messages only live in this component's state for now — there is no message API yet
const ChatBox = ({ contact, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);




  const socketRef = useRef(null)


  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL)
    socketRef.current = socket


    return () => {
      socketRef.current.disconnect()
    }
  }, [])








  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = text.trim();
    if (!value) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: value, createdAt: new Date().toISOString() }]);
    setText("");
  };

  return (
    <div className="flex h-[calc(100vh-73px-3rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-[calc(100vh-73px-4rem)]">
      {/* Header */}

      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
        <button onClick={onBack} className={iconButton} aria-label="Back to conversations">
          <ArrowLeft size={18} />
        </button>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
          {initials(contact.name)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-950">{contact.name}</p>
          <p className="truncate text-xs capitalize text-slate-500">{contact.role} · {contact.email}</p>
        </div>
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto bg-slate-50/60 px-4 py-5">
        {messages.length == 0 ? (
          <EmptyState icon={MessageCircle} title="No messages yet" description={`Say hello to ${contact.name}.`} />
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-br-md bg-slate-950 px-4 py-2.5 text-sm text-white">
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  <p className="mt-1 text-right text-[10px] text-slate-400">{formatTime(message.createdAt)}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 p-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/5"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
