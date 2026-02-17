import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useAdmin } from "@/contexts/AdminContext";
import { BASE_URL } from "@/config/api";
import { applyCategoryOrder } from "@/utils/categoryOrder";

/**
 * Admin-only component for reordering filter categories.
 * Saves the order as `categoryOrder` in the page's meta document.
 *
 * @param {string} pageIdentifier - Meta page key (e.g. "team-current", "news")
 * @param {string[]} categories - Current dynamically derived category list
 * @param {string[]|undefined} savedOrder - Previously saved order from meta
 * @param {function} onSave - Callback after successful save (to refetch meta)
 */
const CategoryOrderEditor = ({ pageIdentifier, categories, savedOrder, onSave }) => {
  const { adminToken, isAdmin } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Sync local order when categories or savedOrder change
  useEffect(() => {
    setOrder(applyCategoryOrder(categories, savedOrder));
  }, [categories, savedOrder]);

  const moveUp = useCallback((index) => {
    if (index === 0) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index) => {
    setOrder((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`${BASE_URL}/api/meta/${pageIdentifier}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ categoryOrder: order }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to save category order.");
      }
      setMessage("Order saved!");
      if (onSave) onSave();
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setOrder(applyCategoryOrder(categories, savedOrder));
    setMessage(null);
  };

  if (!isAdmin) return null;

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1.5 transition-colors bg-white hover:bg-gray-50"
      >
        {isOpen ? "Close Reorder" : "Reorder Categories"}
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <p className="text-xs text-gray-500 mb-3">
            Use the arrows to reorder how filter categories appear. Click Save when done.
          </p>
          <ul className="space-y-1.5">
            {order.map((cat, index) => (
              <li
                key={cat}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <span className="text-gray-400 font-mono text-xs w-5 text-right">{index + 1}</span>
                <span className="flex-grow font-medium text-gray-800">{cat}</span>
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0 || isSaving}
                  className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === order.length - 1 || isSaving}
                  className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Order"}
            </button>
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-300 rounded transition-colors disabled:opacity-50"
            >
              Reset
            </button>
            {message && (
              <span className={`text-xs ${message.includes("saved") ? "text-green-600" : "text-red-500"}`}>
                {message}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

CategoryOrderEditor.propTypes = {
  pageIdentifier: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  savedOrder: PropTypes.arrayOf(PropTypes.string),
  onSave: PropTypes.func,
};

export default CategoryOrderEditor;
