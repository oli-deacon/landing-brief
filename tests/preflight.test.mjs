import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readPreflight, setPreflight, PREFLIGHT_KEY } from '../src/lib/preflight-storage.ts';
const data = new Map();
let events = 0;
globalThis.window = { localStorage: {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},dispatchEvent:()=>events++ };
beforeEach(()=>{data.clear();events=0;});
test('checklist persists per country and unticking preserves other items and countries',()=>{
  setPreflight('SG','documents',true); setPreflight('sg','entry',true); setPreflight('th','data',true);
  assert.deepEqual(readPreflight('sg'),['documents','entry']);
  setPreflight('SG','documents',false);
  assert.deepEqual(readPreflight('sg'),['entry']); assert.deepEqual(readPreflight('th'),['data']);
});
test('malformed storage and obsolete IDs do not break checklist',()=>{
  data.set(PREFLIGHT_KEY,'broken'); assert.deepEqual(readPreflight('sg'),[]);
  data.set(PREFLIGHT_KEY,JSON.stringify({sg:['entry','obsolete','entry']})); assert.deepEqual(readPreflight('sg'),['entry']);
});
test('failed save leaves progress unchanged and emits no success event',()=>{
  const original=window.localStorage.setItem;
  window.localStorage.setItem=()=>{throw new Error('quota');};
  try { assert.throws(()=>setPreflight('sg','entry',true)); assert.equal(events,0); assert.deepEqual(readPreflight('sg'),[]); }
  finally {window.localStorage.setItem=original;}
});
