/**
 * Sorts a categories array according to a saved order.
 * Categories in savedOrder come first (in that order).
 * Any categories not in savedOrder are appended at the end.
 *
 * @param {string[]} categories - The dynamically derived category list
 * @param {string[]|undefined} savedOrder - The admin-defined order from meta
 * @returns {string[]} The sorted category list
 */
export function applyCategoryOrder(categories, savedOrder) {
  if (!savedOrder || !Array.isArray(savedOrder) || savedOrder.length === 0) {
    return categories;
  }

  const ordered = [];
  for (const cat of savedOrder) {
    if (categories.includes(cat)) {
      ordered.push(cat);
    }
  }
  for (const cat of categories) {
    if (!ordered.includes(cat)) {
      ordered.push(cat);
    }
  }
  return ordered;
}
