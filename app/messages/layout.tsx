"use client";

import { usePathname } from "next/navigation";

/**
 * Messages layout — wraps all /messages/* routes.
 * On /messages (the list page) → renders normally inside the app shell.
 * On /messages/[id] (a conversation) → renders full-screen, no navbar/footer.
 * The full-screen shell is 100dvh so it doesn't rely on knowing the navbar height.
 */
export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConversation = /^\/messages\/[^/]+/.test(pathname);

  if (isConversation) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col bg-[#ece5dd]"
        style={{ height: "100dvh" }}
      >
        {children}
      </div>
    );
  }

  // Messages list page — use normal flow inside the app shell
  return <>{children}</>;
}