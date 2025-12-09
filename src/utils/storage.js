const STORAGE_KEYS = {
  FEEDBACK: 'voc_feedback_items',
  WEB_SIGNALS: 'voc_web_signals',
  BRIEFS: 'voc_product_briefs'
};

// Feedback Items
export function saveFeedbackItem(item) {
  const items = getFeedbackItems();
  items.unshift(item);
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(items));
  return items;
}

export function getFeedbackItems() {
  const stored = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
  return stored ? JSON.parse(stored) : [];
}

export function deleteFeedbackItem(id) {
  const items = getFeedbackItems().filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(items));
  return items;
}

export function clearAllFeedback() {
  localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
}

// Web Signals
export function saveWebSignal(signal) {
  const signals = getWebSignals();
  signals.unshift(signal);
  localStorage.setItem(STORAGE_KEYS.WEB_SIGNALS, JSON.stringify(signals));
  return signals;
}

export function getWebSignals() {
  const stored = localStorage.getItem(STORAGE_KEYS.WEB_SIGNALS);
  return stored ? JSON.parse(stored) : [];
}

export function clearWebSignals() {
  localStorage.removeItem(STORAGE_KEYS.WEB_SIGNALS);
}

// Product Briefs
export function saveBrief(brief) {
  const briefs = getBriefs();
  briefs.unshift(brief);
  localStorage.setItem(STORAGE_KEYS.BRIEFS, JSON.stringify(briefs));
  return briefs;
}

export function getBriefs() {
  const stored = localStorage.getItem(STORAGE_KEYS.BRIEFS);
  return stored ? JSON.parse(stored) : [];
}

export function deleteBrief(id) {
  const briefs = getBriefs().filter(brief => brief.id !== id);
  localStorage.setItem(STORAGE_KEYS.BRIEFS, JSON.stringify(briefs));
  return briefs;
}

// Generate unique ID
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
