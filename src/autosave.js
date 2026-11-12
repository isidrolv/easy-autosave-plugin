'use strict';

/** Save all dirty, untitled or file-backed text documents without touching binary editors. */
async function saveDirtyDocuments(documents) {
  let saved = 0;
  for (const document of documents) {
    if (!document.isClosed && document.isDirty) {
      const ok = await document.save();
      if (ok) saved += 1;
    }
  }
  return saved;
}

module.exports = { saveDirtyDocuments };
