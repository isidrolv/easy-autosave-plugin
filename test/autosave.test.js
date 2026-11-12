'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { saveDirtyDocuments } = require('../src/autosave');

test('saves dirty open documents and leaves clean or closed documents alone', async () => {
  const calls = [];
  const docs = [
    { isDirty: true, isClosed: false, save: async () => { calls.push('dirty'); return true; } },
    { isDirty: false, isClosed: false, save: async () => { calls.push('clean'); return true; } },
    { isDirty: true, isClosed: true, save: async () => { calls.push('closed'); return true; } }
  ];
  assert.equal(await saveDirtyDocuments(docs), 1);
  assert.deepEqual(calls, ['dirty']);
});

test('counts only successful saves', async () => {
  const docs = [
    { isDirty: true, save: async () => true },
    { isDirty: true, save: async () => false }
  ];
  assert.equal(await saveDirtyDocuments(docs), 1);
});

test('handles an empty document list', async () => {
  assert.equal(await saveDirtyDocuments([]), 0);
});
