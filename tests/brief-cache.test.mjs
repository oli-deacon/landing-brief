import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getCountryByCode } from '../src/data/countries/index.ts';
const data=new Map();
globalThis.window={localStorage:{getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)}};
const brief={countryCode:'sg',countryName:'Singapore',lastReviewedDate:'2026-05-09'};
test('stored-copy date remains distinct from review date and survives offline fallback',async()=>{
  globalThis.fetch=async()=>({ok:true,json:async()=>brief});
  const online=await getCountryByCode('sg');
  assert.ok(online.cachedAt); assert.equal(online.data.lastReviewedDate,'2026-05-09');
  globalThis.fetch=async()=>{throw new Error('offline');};
  const offline=await getCountryByCode('sg');
  assert.equal(offline.cachedAt,online.cachedAt); assert.equal(offline.source,'cache');
});
test('storage failure still displays fetched brief without claiming persistence',async()=>{
  globalThis.fetch=async()=>({ok:true,json:async()=>brief});
  const original=window.localStorage.setItem; window.localStorage.setItem=()=>{throw new Error('quota');};
  try {const result=await getCountryByCode('sg'); assert.equal(result.cachedAt,null); assert.equal(result.data.countryCode,'sg');}
  finally {window.localStorage.setItem=original;}
});
