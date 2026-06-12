"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { markConversationRead } from "@/lib/actions/messages";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  hasOrderBanner?: boolean;
};

type OptimisticMessage = Message & { optimistic?: boolean; failed?: boolean };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

// ─── Read receipts ────────────────────────────────────────────────────────────

function DoubleCheck({ read }: { read: boolean }) {
  return (
    <svg
      className={cn(
        "h-4 w-4 transition-colors duration-300",
        read ? "text-[#53bdeb]" : "text-white/40"
      )}
      viewBox="0 0 16 11"
      fill="none"
    >
      <path
        d="M1 5.5L4.5 9L9 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 9L10.5 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={read ? "1" : "0.4"}
      />
      <path
        d="M11 5.5L14.5 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={read ? "1" : "0"}
        className="transition-all duration-300"
      />
    </svg>
  );
}

function SingleCheck() {
  return (
    <svg
      className="h-3.5 w-3.5 text-white/40"
      viewBox="0 0 14 11"
      fill="none"
    >
      <path
        d="M1 5.5L4.5 9L13 1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex items-end gap-2 px-4 py-1">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="block h-1.5 w-1.5 animate-bounce rounded-full bg-warm-gray/50"
            style={{ animationDelay: `${delay}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Full size"
          className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-charcoal shadow-xl transition-transform hover:scale-110 active:scale-95"
          aria-label="Close"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Chat wallpaper background ────────────────────────────────────────────────
// Subtle warm dot pattern matching the Kalakriti brand

const WallpaperBg = () => (
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backgroundImage: `radial-gradient(circle, rgba(180,140,100,0.12) 1px, transparent 1px)`,
      backgroundSize: "20px 20px",
      backgroundColor: "#ece5dd",
    }}
  />
);

// ─── Main Component ───────────────────────────────────────────────────────────

export function MessageThread({
  conversationId,
  messages: initialMessages,
  currentUserId,
  hasOrderBanner = false,
}: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [messages, setMessages] = useState<OptimisticMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [isTyping] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const optimisticIdRef = useRef(0);
  const selfScrollRef = useRef(false);

  // ─── Scroll ─────────────────────────────────────────────────────────────────

  const scrollToBottom = useCallback((smooth = true) => {
    const el = listRef.current;
    if (!el) return;
    selfScrollRef.current = true;
    if (smooth) {
      const start = el.scrollTop;
      const end = el.scrollHeight - el.clientHeight;
      const distance = end - start;
      if (Math.abs(distance) < 2) return;
      const duration = 180;
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.scrollTop = start + distance * ease;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } else {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, []); // eslint-disable-line

  const prevLengthRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      if (atBottom) scrollToBottom(true);
      selfScrollRef.current = false;
    }
    prevLengthRef.current = messages.length;
  }, [messages.length, atBottom, scrollToBottom]);

  // ─── Mark read on open & when new messages arrive ───────────────────────────

  const markReadNow = useCallback(async () => {
    // Call the server action — this guarantees the DB write completes
    // before Next.js serves the /messages page on back-navigation.
    await markConversationRead(conversationId);
    // Optimistically clear the unread dot in ConversationList
    window.dispatchEvent(
      new CustomEvent("kk:messages-read", { detail: { conversationId } })
    );
  }, [conversationId]);

  // Run on mount (opening the chat)
  useEffect(() => {
    void markReadNow();
    // Signal to ConversationList that this conversation is no longer active on unmount
    return () => {
      window.dispatchEvent(
        new CustomEvent("kk:messages-left", { detail: { conversationId } })
      );
    };
  }, [markReadNow, conversationId]);

  // Also re-run whenever new messages arrive while this chat is open,
  // so incoming messages from the other party are immediately marked read.
  const messageCount = messages.length;
  useEffect(() => {
    if (messageCount > 0) void markReadNow();
  }, [messageCount, markReadNow]);

  // ─── Scroll tracking ─────────────────────────────────────────────────────────

  const handleScroll = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(bottom);
  }, []);

  // ─── Realtime ───────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    let mounted = true;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (!mounted) return;
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            // Match optimistic message: same sender + body, created within 30s of the real message
            const optIdx = prev.findIndex(
              (m) =>
                m.optimistic &&
                m.sender_id === newMsg.sender_id &&
                m.body === newMsg.body &&
                Math.abs(new Date(m.created_at).getTime() - new Date(newMsg.created_at).getTime()) < 30000
            );
            if (optIdx !== -1) {
              const next = [...prev];
              next[optIdx] = { ...newMsg, optimistic: false, failed: false };
              return next;
            }
            return [...prev, newMsg];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (!mounted) return;
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === updated.id ? { ...m, read_at: updated.read_at } : m
            )
          );
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, atBottom, supabase]);

  // ─── Input ──────────────────────────────────────────────────────────────────

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
    if (error) setError(null);
    const el = e.target;
    requestAnimationFrame(() => {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  // ─── Image ──────────────────────────────────────────────────────────────────

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(file: File): Promise<string | null> {
    if (!isSupabaseConfigured()) return null;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${currentUserId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("chat-images")
      .upload(path, file, { contentType: file.type });
    if (error) return null;
    const { data } = supabase.storage.from("chat-images").getPublicUrl(path);
    return data.publicUrl;
  }

  // ─── Send ────────────────────────────────────────────────────────────────────

  async function handleSend() {
    const body = inputValue.trim();
    if ((!body && !imageFile) || isSending) return;
    setError(null);

    const tempId = `opt-${++optimisticIdRef.current}`;
    const now = new Date().toISOString();

    const optimisticMsg: OptimisticMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: body || "",
      image_url: imagePreview,
      read_at: null,
      created_at: now,
      optimistic: true,
    };

    selfScrollRef.current = true;
    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom(true);

    const capturedBody = body;
    const capturedFile = imageFile;
    const capturedPreview = imagePreview;

    setInputValue("");
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.focus({ preventScroll: true });
      }
    });

    if (capturedFile) setIsSending(true);

    try {
      let uploadedUrl: string | null = null;

      if (capturedFile) {
        setUploading(true);
        uploadedUrl = await uploadImage(capturedFile);
        setUploading(false);
        setIsSending(false);

        if (!uploadedUrl) {
          setError("Image upload failed. Please try again.");
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, optimistic: false, failed: true } : m
            )
          );
          return;
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, image_url: uploadedUrl } : m
          )
        );
      }

      void Promise.resolve(
        supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          body: capturedBody || "",
          image_url: uploadedUrl ?? null,
        })
      )
        .then(({ error: insertError }) => {
          if (insertError) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, optimistic: false, failed: true } : m
              )
            );
            setError(insertError.message);
            setInputValue(capturedBody);
            if (capturedFile && capturedPreview) {
              setImageFile(capturedFile);
              setImagePreview(capturedPreview);
            }
          } else {
            // Insert succeeded — clear "Sending…" immediately without waiting for realtime
            setMessages((prev) =>
              prev.map((m) =>
                m.id === tempId ? { ...m, optimistic: false } : m
              )
            );
            void supabase
              .from("conversations")
              .update({ updated_at: new Date().toISOString() })
              .eq("id", conversationId);
          }
        })
        .catch(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, optimistic: false, failed: true } : m
            )
          );
          setError("Failed to send. Please try again.");
          setInputValue(capturedBody);
        });
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, optimistic: false, failed: true } : m
        )
      );
      setError("Failed to send. Please try again.");
      setInputValue(capturedBody);
      setIsSending(false);
    } finally {
      setUploading(false);
    }
  }

  function retryMessage(msg: OptimisticMessage) {
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    setInputValue(msg.body);
    inputRef.current?.focus({ preventScroll: true });
  }

  const lastMyMsg = messages.findLast(
    (m) => m.sender_id === currentUserId && !m.optimistic && !m.failed
  );

  const canSend = (inputValue.trim().length > 0 || !!imageFile) && !isSending;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      {/* This component fills the remaining space below the ChatHeader.
          The parent (ConversationPage) is a fixed full-screen flex column.
          We are the flex-1 child, so we get all remaining height. */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Wallpaper */}
        <WallpaperBg />

        {/* ── Message list ── */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto overscroll-none px-3 py-3 sm:px-4"
          style={{
            scrollbarWidth: "none",
            overscrollBehavior: "none",
            touchAction: "pan-y",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/80 shadow-sm ring-4 ring-white/40">
                <svg className="h-7 w-7 text-charcoal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-charcoal/70">Start the conversation</p>
                <p className="mt-1 max-w-[200px] text-sm leading-relaxed text-charcoal/50">
                  Send your first message — the artisan will reply shortly.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              {messages.map((msg, i) => {
                const mine = msg.sender_id === currentUserId;
                const prev = messages[i - 1];
                const next = messages[i + 1];
                const showDate = !prev || !isSameDay(prev.created_at, msg.created_at);
                const isFirst = !prev || prev.sender_id !== msg.sender_id || showDate;
                const isLast =
                  !next ||
                  next.sender_id !== msg.sender_id ||
                  !isSameDay(msg.created_at, next.created_at);
                const isLastMyMsg = mine && msg.id === lastMyMsg?.id;

                return (
                  <div key={msg.id}>
                    {/* ── Date separator ── */}
                    {showDate && (
                      <div className="flex items-center justify-center py-4">
                        <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium tracking-wide text-charcoal/60 shadow-sm backdrop-blur-sm">
                          {formatDateLabel(msg.created_at)}
                        </span>
                      </div>
                    )}

                    {/* ── Message row ── */}
                    <div
                      className={cn(
                        "flex items-end gap-1",
                        mine ? "flex-row-reverse justify-start" : "flex-row justify-start",
                        isFirst ? "mt-2" : "mt-0.5"
                      )}
                    >
                      {/* ── Bubble wrapper ── */}
                      <div
                        className={cn(
                          "group flex max-w-[78%] flex-col sm:max-w-[70%]",
                          mine ? "items-end" : "items-start"
                        )}
                      >
                        {/* Image attachment */}
                        {msg.image_url && (
                          <button
                            type="button"
                            onClick={() =>
                              msg.image_url && setLightboxSrc(msg.image_url)
                            }
                            className={cn(
                              "mb-1 overflow-hidden rounded-2xl transition-opacity active:opacity-80",
                              mine ? "rounded-br-[6px]" : "rounded-bl-[6px]",
                              msg.optimistic && "opacity-70"
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={msg.image_url}
                              alt="Attachment"
                              className="max-h-60 max-w-full object-cover"
                              style={{ minWidth: "120px", minHeight: "80px" }}
                            />
                          </button>
                        )}

                        {/* Text bubble */}
                        {msg.body && (
                          <div
                            className={cn(
                              "relative px-3 py-2 text-[14.5px] leading-relaxed shadow-sm",
                              // Mine: charcoal (brand) / theirs: white
                              mine
                                ? "rounded-2xl rounded-br-[6px] bg-charcoal text-cream"
                                : "rounded-2xl rounded-bl-[6px] bg-white text-charcoal",
                              // Stacked bubble corner tightening
                              !isFirst && mine && "rounded-tr-[6px]",
                              !isFirst && !mine && "rounded-tl-[6px]",
                              // States
                              msg.optimistic && "opacity-75",
                              msg.failed && "opacity-50 ring-1 ring-terracotta/50"
                            )}
                          >
                            {msg.body}
                            {/* Inline time + status */}
                            <span
                              className={cn(
                                "ml-2 inline-flex items-center gap-0.5 align-bottom text-[10px]",
                                mine ? "text-cream/45" : "text-charcoal/40"
                              )}
                            >
                              {msg.failed
                                ? "Failed"
                                : msg.optimistic
                                ? uploading
                                  ? "Uploading…"
                                  : "Sending…"
                                : formatTime(msg.created_at)}
                              {mine && !msg.optimistic && !msg.failed && isLastMyMsg && (
                                <span className="inline-flex items-center">
                                  {msg.read_at ? (
                                    <DoubleCheck read={true} />
                                  ) : (
                                    <DoubleCheck read={false} />
                                  )}
                                </span>
                              )}
                              {mine && msg.optimistic && !msg.failed && (
                                <SingleCheck />
                              )}
                            </span>
                          </div>
                        )}

                        {/* Retry on fail */}
                        {msg.failed && (
                          <button
                            type="button"
                            onClick={() => retryMessage(msg)}
                            className="mt-1 flex items-center gap-1 rounded-full bg-terracotta/10 px-2.5 py-1 text-[11px] font-medium text-terracotta transition-colors hover:bg-terracotta/20"
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Tap to retry
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isTyping && <TypingDots />}
            </div>
          )}

          {/* Bottom anchor + extra breathing room above keyboard */}
          <div className="h-2" id="chat-bottom" />
        </div>

        {/* ── Scroll-to-bottom FAB ── */}
        {!atBottom && messages.length > 0 && (
          <div className="absolute bottom-[72px] right-4 z-10">
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md text-charcoal/60 ring-1 ring-black/5 transition-all hover:scale-105 hover:text-charcoal active:scale-95"
              aria-label="Scroll to latest"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Input bar ── */}
        <div
          className="relative z-10 shrink-0 bg-[#f0ebe3]"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          {/* Error toast */}
          {error && (
            <div className="flex items-center justify-between border-b border-black/5 bg-terracotta/10 px-4 py-2">
              <p className="text-xs text-terracotta">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-terracotta/60 hover:text-terracotta"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Image preview strip */}
          {imagePreview && (
            <div className="flex items-center gap-3 border-b border-black/5 bg-white/60 px-4 py-2.5">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-black/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-charcoal">
                  {imageFile?.name || "Image"}
                </p>
                <p className="text-xs text-charcoal/50">
                  {imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/8 text-charcoal/60 transition-colors hover:bg-black/12"
                aria-label="Remove image"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Input row */}
          <div
            className="flex items-end gap-2 px-3 py-2"
            style={{
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            }}
          >
            {/* Attach */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal/50 transition-all hover:bg-black/8 hover:text-charcoal active:scale-95 disabled:opacity-40"
              aria-label="Attach image"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageSelect}
            />

            {/* Textarea */}
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Message"
              rows={1}
              autoComplete="off"
              className="flex-1 resize-none overflow-hidden rounded-3xl border border-black/8 bg-white px-4 py-2.5 text-[14px] leading-relaxed text-charcoal placeholder:text-charcoal/35 shadow-sm transition-shadow focus:border-black/15 focus:outline-none focus:ring-0"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />

            {/* Send */}
            <button
              type="button"
              onClick={() => void handleSend()}
              disabled={!canSend}
              aria-label="Send message"
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-90",
                canSend
                  ? "bg-charcoal text-cream shadow-sm hover:bg-terracotta"
                  : "bg-charcoal/15 text-charcoal/30 cursor-not-allowed"
              )}
            >
              {isSending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
              ) : (
                <svg
                  className="h-4 w-4 translate-x-px"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                >
                  <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}