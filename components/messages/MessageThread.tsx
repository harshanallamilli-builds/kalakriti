"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Image from "next/image";
import { sendMessage, markConversationRead } from "@/lib/actions/messages";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  conversationId: string;
  messages: Message[];
  currentUserId: string;
  hasOrderBanner?: boolean;
};

type OptimisticMessage = Message & { optimistic?: boolean; failed?: boolean };

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return formatTime(iso);
}

export function MessageThread({
  conversationId,
  messages: initialMessages,
  currentUserId,
  hasOrderBanner = false,
}: Props) {
  const [messages, setMessages] = useState<OptimisticMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendingCount, setSendingCount] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [atBottom, setAtBottom] = useState(true);
  const optimisticIdRef = useRef(0);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => { scrollToBottom(false); }, [scrollToBottom]);

  useEffect(() => {
    if (atBottom) scrollToBottom();
  }, [messages.length, atBottom, scrollToBottom]);

  // Mark conversation as read on open and when new messages arrive
  useEffect(() => {
    markConversationRead(conversationId);
  }, [conversationId]);

  // Mark read when new messages arrive and user is at bottom
  useEffect(() => {
    if (atBottom) {
      markConversationRead(conversationId);
    }
  }, [messages.length, atBottom, conversationId]);

  function handleScroll() {
    const el = listRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(isAtBottom);
    if (isAtBottom) {
      markConversationRead(conversationId);
    }
  }

  // Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    let isMounted = true;
    const supabase = createClient();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (!isMounted) return;
          const newMsg = payload.new as Message;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            const optIdx = prev.findIndex(
              (m) =>
                m.optimistic &&
                m.sender_id === newMsg.sender_id &&
                m.body === newMsg.body
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
      // Listen for read_at updates on messages (read receipts)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          if (!isMounted) return;
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? { ...m, read_at: updated.read_at } : m))
          );
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          supabase.removeChannel(channel);
        }
      });

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Only JPG, PNG, and WEBP images are supported.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
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
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("chat-images")
      .upload(path, file, { contentType: file.type });

    if (error) return null;

    const { data } = supabase.storage.from("chat-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSend() {
    const body = inputValue.trim();
    if ((!body && !imageFile) || sendingCount > 0) return;
    setError(null);

    const tempId = `opt-${++optimisticIdRef.current}`;
    const optimisticMsg: OptimisticMessage = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: body || "",
      image_url: imagePreview,
      read_at: null,
      created_at: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    const capturedBody = body;
    const capturedFile = imageFile;
    const capturedPreview = imagePreview;
    setInputValue("");
    setSendingCount((c) => c + 1);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }

    try {
      let uploadedUrl: string | null = null;
      if (capturedFile) {
        setUploading(true);
        uploadedUrl = await uploadImage(capturedFile);
        setUploading(false);
        if (!uploadedUrl) {
          setError("Image upload failed. Please try again.");
          setMessages((prev) =>
            prev.map((m) => (m.id === tempId ? { ...m, optimistic: false, failed: true } : m))
          );
          return;
        }
        // Update optimistic message with real URL
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, image_url: uploadedUrl } : m))
        );
      }

      const fd = new FormData();
      fd.set("body", capturedBody);
      if (uploadedUrl) fd.set("image_url", uploadedUrl);

      const result = await sendMessage(conversationId, {}, fd);

      if (result.error) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, optimistic: false, failed: true } : m
          )
        );
        setError(result.error);
        setInputValue(capturedBody);
        if (capturedFile) {
          setImageFile(capturedFile);
          setImagePreview(capturedPreview);
        }
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, optimistic: false, failed: false } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId ? { ...m, optimistic: false, failed: true } : m
        )
      );
      setError("Failed to send. Please try again.");
      setInputValue(capturedBody);
    } finally {
      setUploading(false);
      setSendingCount((c) => Math.max(0, c - 1));
    }
  }

  function retryMessage(msg: OptimisticMessage) {
    setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    setInputValue(msg.body);
    inputRef.current?.focus();
  }

  // Find the last message sent by current user
  const myMessages = messages.filter(
    (m) => m.sender_id === currentUserId && !m.optimistic && !m.failed
  );
  const lastMyMsg = myMessages[myMessages.length - 1];

  const isSending = sendingCount > 0 || uploading;

  return (
    <>
      {/* Lightbox */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxSrc(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSrc}
              alt="Full size"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxSrc(null)}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-charcoal shadow-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="relative flex flex-1 flex-col overflow-hidden">{/* inner content */}
        {/* Message list */}
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-5"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
              <span className="text-4xl opacity-25">✦</span>
              <p className="max-w-[200px] text-sm leading-relaxed text-warm-gray">
                Send your first message — the artisan will reply shortly.
              </p>
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
                    {showDate && (
                      <div className="flex items-center gap-3 py-5">
                        <div className="flex-1 border-t border-linen" />
                        <span className="rounded-full bg-sand px-3 py-1 text-[11px] tracking-wide text-warm-gray">
                          {formatDateLabel(msg.created_at)}
                        </span>
                        <div className="flex-1 border-t border-linen" />
                      </div>
                    )}

                    <div
                      className={cn(
                        "flex",
                        mine ? "justify-end" : "justify-start",
                        isFirst ? "mt-4" : "mt-0.5"
                      )}
                    >
                      <div
                        className={cn(
                          "group flex max-w-[82%] flex-col",
                          mine ? "items-end" : "items-start"
                        )}
                      >
                        {/* Image attachment */}
                        {msg.image_url && (
                          <button
                            type="button"
                            onClick={() => msg.image_url && setLightboxSrc(msg.image_url)}
                            className={cn(
                              "mb-1 overflow-hidden rounded-2xl",
                              mine ? "rounded-br-md" : "rounded-bl-md",
                              msg.optimistic && "opacity-75"
                            )}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={msg.image_url}
                              alt="Attachment"
                              className="max-h-64 max-w-full rounded-2xl object-cover"
                              style={{ minWidth: "120px", minHeight: "80px" }}
                            />
                          </button>
                        )}

                        {/* Text body */}
                        {msg.body && (
                          <div
                            className={cn(
                              "px-4 py-2.5 text-sm leading-relaxed",
                              mine
                                ? "rounded-2xl rounded-br-md bg-charcoal text-cream"
                                : "rounded-2xl rounded-bl-md bg-sand/80 text-charcoal",
                              !isFirst && mine && "rounded-tr-md",
                              !isFirst && !mine && "rounded-tl-md",
                              msg.optimistic && "opacity-75",
                              msg.failed && "opacity-50 ring-1 ring-terracotta/40"
                            )}
                          >
                            {msg.body}
                          </div>
                        )}

                        {isLast && (
                          <div
                            className={cn(
                              "mt-1 flex items-center gap-1.5 px-1",
                              mine ? "justify-end" : "justify-start"
                            )}
                          >
                            <span className="text-[10px] text-warm-gray/60">
                              {msg.failed
                                ? "Failed"
                                : msg.optimistic
                                ? uploading ? "Uploading…" : "Sending…"
                                : formatTime(msg.created_at)}
                            </span>
                            {msg.failed && (
                              <button
                                type="button"
                                onClick={() => retryMessage(msg)}
                                className="text-[10px] text-terracotta underline"
                              >
                                Retry
                              </button>
                            )}
                            {/* Read receipts — only for sender, only on last sent message */}
                            {mine && !msg.optimistic && !msg.failed && isLastMyMsg && (
                              <span
                                className={cn(
                                  "text-[10px]",
                                  msg.read_at ? "text-saffron" : "text-warm-gray/40"
                                )}
                                title={msg.read_at ? `Seen ${timeAgo(msg.read_at)}` : "Sent"}
                              >
                                {msg.read_at ? "✓✓" : "✓"}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Seen label for last message with read_at */}
                        {mine && isLast && isLastMyMsg && !msg.optimistic && !msg.failed && msg.read_at && (
                          <p className="mt-0.5 px-1 text-[10px] text-saffron/80">
                            Seen {timeAgo(msg.read_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Scroll-to-bottom button */}
        {!atBottom && messages.length > 0 && (
          <div className="absolute bottom-[4.5rem] right-4 z-10">
            <button
              type="button"
              onClick={() => scrollToBottom()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-linen bg-white shadow-[var(--shadow-soft)] text-warm-gray transition-colors hover:text-charcoal"
              aria-label="Scroll to latest"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Sticky input */}
        <div className="chat-input-safe shrink-0 border-t border-linen bg-white px-4 pt-3">
          {error && <p className="mb-2 text-xs text-terracotta">{error}</p>}

          {/* Image preview */}
          {imagePreview && (
            <div className="mb-2 flex items-center gap-2">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-linen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-linen bg-white text-xs text-warm-gray hover:bg-sand"
              >
                ×
              </button>
            </div>
          )}

          <div className="flex items-end gap-2 pb-1">
            {/* Image attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-linen bg-sand/30 text-warm-gray transition-colors hover:bg-sand hover:text-charcoal"
              aria-label="Attach image"
              disabled={isSending}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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

            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              autoComplete="off"
              className="flex-1 resize-none overflow-hidden rounded-2xl border border-linen bg-sand/30 px-4 py-2.5 text-sm leading-relaxed transition-colors focus:border-clay focus:bg-white focus:outline-none focus:ring-2 focus:ring-clay/20"
              style={{ minHeight: "42px", maxHeight: "120px" }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || (!inputValue.trim() && !imageFile)}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-cream transition-all hover:bg-terracotta disabled:opacity-40"
            >
              {isSending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
          <p className="pb-2 pt-1 text-center text-[10px] text-warm-gray/40">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
