"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: "Space / K", action: "Play/Pause" },
    { key: "←", action: "Rewind 10 seconds" },
    { key: "→", action: "Forward 10 seconds" },
    { key: "↑", action: "Increase volume" },
    { key: "↓", action: "Decrease volume" },
    { key: "F", action: "Toggle fullscreen" },
    { key: "M", action: "Mute/Unmute" },
    { key: "0-9", action: "Jump to 0%-90% of video" },
    { key: "?", action: "Show this help" },
  ];

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-white hover:text-indigo-400 transition p-2"
        title="Keyboard Shortcuts (?)"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <span className="text-gray-700">{shortcut.action}</span>
                  <kbd className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
