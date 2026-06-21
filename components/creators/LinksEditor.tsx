"use client";

import { useState } from "react";
import type { CreatorLink } from "@/lib/types";

const PRESET_LINKS = [
  { label: "Instagram", placeholder: "https://instagram.com/yourstudio", icon: "ig" },
  { label: "WhatsApp",  placeholder: "https://wa.me/919876543210",       icon: "wa" },
  { label: "Facebook",  placeholder: "https://facebook.com/yourpage",    icon: "fb" },
  { label: "Website",   placeholder: "https://yourwebsite.com",          icon: "web" },
];

function LinkIcon({ type }: { type: string }) {
  if (type === "ig") return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
  );
  if (type === "wa") return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 1 8.66 15L22 22l-5.17-1.35A10 10 0 1 1 12 2Z" stroke="currentColor" strokeWidth="1.6"/><path d="M9 10.5c.5-1.8 2.5-2.5 3.5-1.5s1 3 0 3.5l-1 1c.5 1.2 1.8 2.5 3 3l1-1c1-1 3-.5 3.5.5s-.5 3-2 3C12 19 7 15 7 9.5a2.5 2.5 0 0 1 2-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
  );
  if (type === "fb") return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/><path d="M13 21v-8h2.5l.5-3H13V8.5C13 7.7 13.4 7 14.5 7H16V4.5S15 4 13.5 4C11 4 10 5.5 10 7.5V10H7v3h3v8h3Z" fill="currentColor"/></svg>
  );
  // globe / custom
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.3"/></svg>
  );
}

function getIcon(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("instagram")) return "ig";
  if (l.includes("whatsapp"))  return "wa";
  if (l.includes("facebook"))  return "fb";
  return "web";
}

type Props = {
  initialLinks?: CreatorLink[];
  /** name of the hidden input that carries the JSON value to the server action */
  fieldName?: string;
};

export function LinksEditor({ initialLinks = [], fieldName = "links" }: Props) {
  const [links, setLinks] = useState<CreatorLink[]>(initialLinks);
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const presetLabels = new Set(links.map((l) => l.label.toLowerCase()));

  function addPreset(preset: typeof PRESET_LINKS[0]) {
    if (presetLabels.has(preset.label.toLowerCase())) return;
    setLinks((prev) => [...prev, { label: preset.label, url: "" }]);
  }

  function addCustom() {
    const label = newLabel.trim();
    const url = newUrl.trim();
    if (!label) return;
    setLinks((prev) => [...prev, { label, url }]);
    setNewLabel("");
    setNewUrl("");
    setAdding(false);
  }

  function updateUrl(idx: number, url: string) {
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, url } : l));
  }

  function remove(idx: number) {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="links-editor">
      <div className="links-editor__header">
        <span className="links-editor__title">
          Your links
        </span>
        <span className="links-editor__hint">optional — add now or anytime later</span>
      </div>

      {/* Preset quick-add pills */}
      <div className="links-editor__presets">
        {PRESET_LINKS.map((p) => {
          const already = presetLabels.has(p.label.toLowerCase());
          return (
            <button
              key={p.label}
              type="button"
              disabled={already}
              onClick={() => addPreset(p)}
              className={`links-editor__preset-pill ${already ? "links-editor__preset-pill--added" : ""}`}
            >
              <LinkIcon type={p.icon} />
              {p.label}
              {already ? <span className="links-editor__preset-check">✓</span> : <span className="links-editor__preset-plus">+</span>}
            </button>
          );
        })}
      </div>

      {/* Added links */}
      {links.length > 0 && (
        <div className="links-editor__list">
          {links.map((link, idx) => (
            <div key={idx} className="links-editor__row">
              <span className="links-editor__row-icon">
                <LinkIcon type={getIcon(link.label)} />
              </span>
              <span className="links-editor__row-label">{link.label}</span>
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateUrl(idx, e.target.value)}
                placeholder={
                  PRESET_LINKS.find((p) => p.label === link.label)?.placeholder ??
                  "https://..."
                }
                className="links-editor__row-input"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="links-editor__row-remove"
                aria-label={`Remove ${link.label}`}
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Custom link form */}
      {adding ? (
        <div className="links-editor__custom-form">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Link name — e.g. Etsy, Pinterest, Portfolio…"
            className="links-editor__custom-label-input"
            autoFocus
          />
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="links-editor__custom-url-input"
          />
          <div className="links-editor__custom-actions">
            <button type="button" onClick={addCustom} className="links-editor__custom-add-btn">
              Add
            </button>
            <button type="button" onClick={() => setAdding(false)} className="links-editor__custom-cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="links-editor__add-custom-btn"
        >
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Add custom link
        </button>
      )}

      {/* Hidden input carries the JSON to the server action */}
      <input type="hidden" name={fieldName} value={JSON.stringify(links)} />
    </div>
  );
}