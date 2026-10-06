import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ARRIVAL_CARD_KEY, createArrivalCard, getArrivalCards, saveArrivalCard, clearArrivalCard } from '../src/lib/arrival-card-storage.ts';
const data = new Map();
let events;
globalThis.window = { localStorage: { getItem: k => data.get(k) ?? null, setItem: (k,v) => data.set(k,v) }, dispatchEvent: () => { events++; } };
const brief = { countryCode: 'TH', countryName: 'Thailand', primaryAirport: 'BKK', lastReviewedDate: '2026-10-02' };
const phrase = english => ({ english, local: 'สวัสดี', pronunciation: 'hello', context: 'Greeting' });
beforeEach(() => { data.clear(); events = 0; });
test('persists an independent card per destination and preserves supplied local text', () => {
  saveArrivalCard({ ...createArrivalCard(brief), localAddress: '  ที่อยู่\nกรุงเทพ  ', phrases: [phrase('Hello')] });
  saveArrivalCard(createArrivalCard({ ...brief, countryCode: 'sg' }));
  assert.equal(getArrivalCards().th.localAddress, '  ที่อยู่\nกรุงเทพ  ');
  assert.equal(Object.keys(getArrivalCards()).length, 2);
  assert.equal(events, 2);
});
test('changing transport preserves hotel, reminders and phrases', () => {
  saveArrivalCard({ ...createArrivalCard(brief), hotelName: 'Test hotel', reminder: 'Late arrival', phrases: [phrase('Hello')] });
  const transport = {mode:'Taxi', typicalTime:'30 min', typicalCost:'Varies', bestFor:'Bags', notes:'Use rank'};
  saveArrivalCard({ ...getArrivalCards().th, transport });
  assert.equal(getArrivalCards().th.hotelName, 'Test hotel');
  assert.equal(getArrivalCards().th.phrases.length, 1);
  assert.equal(getArrivalCards().th.transport.mode, 'Taxi');
});
test('enforces three distinct phrases without overwriting on failure', () => {
  saveArrivalCard({ ...createArrivalCard(brief), phrases:[phrase('1'),phrase('1'),phrase('2'),phrase('3')] });
  assert.equal(getArrivalCards().th.phrases.length,3);
  assert.throws(() => saveArrivalCard({...getArrivalCards().th, phrases:[phrase('1'),phrase('2'),phrase('3'),phrase('4')]}));
  assert.equal(getArrivalCards().th.phrases.length,3);
});
test('clearing one card leaves other cards and unrelated notes intact', () => {
  saveArrivalCard(createArrivalCard(brief));
  saveArrivalCard(createArrivalCard({...brief,countryCode:'sg'}));
  data.set('landingbrief.country-notes', 'existing notes');
  clearArrivalCard('TH');
  assert.deepEqual(Object.keys(getArrivalCards()), ['sg']);
  assert.equal(data.get('landingbrief.country-notes'), 'existing notes');
});
test('malformed saved data cannot break the saved page', () => {
  data.set(ARRIVAL_CARD_KEY, '{broken'); assert.deepEqual(getArrivalCards(), {});
  data.set(ARRIVAL_CARD_KEY, JSON.stringify({th:{ hotelName:'incomplete' }})); assert.deepEqual(getArrivalCards(), {});
});
test('storage failures propagate so the UI cannot claim a successful save', () => {
  const original = window.localStorage.setItem;
  window.localStorage.setItem = () => { throw new Error('Quota exceeded'); };
  try { assert.throws(() => saveArrivalCard(createArrivalCard(brief))); assert.equal(events, 0); }
  finally { window.localStorage.setItem = original; }
});
