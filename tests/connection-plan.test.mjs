import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildConnectionPlan, newConnection } from '../src/lib/connection-plan.ts';
const base = { ...newConnection('Singapore Changi (SIN)'), arrivalTerminal: 'T3', departureTerminal: 'T4', onward: 'international', booking: 'one', bags: 'through', boardingPass: 'yes' };
test('T4 transit uses transit pickup and does not send traveller through immigration', () => {
  const p = buildConnectionPlan(base, 'sg');
  assert.match(p.steps.join(' '), /T3 Arrival Immigration Hall A/);
  assert.match(p.steps.join(' '), /remain in the transit area/);
  assert.doesNotMatch(p.steps.join(' '), /clear arrival immigration/);
});
test('separate bookings and bag collection each require landside planning', () => {
  for (const change of [{ booking: 'separate' }, { bags: 'collect' }]) {
    const p = buildConnectionPlan({ ...base, ...change }, 'sg');
    assert.match(p.title, /landside/);
    assert.match(p.steps.join(' '), /entry requirements/);
    assert.match(p.steps.join(' '), /public.*T4 shuttle/);
  }
});
test('unresolved eligibility does not provide an assumed transit route', () => {
  const p = buildConnectionPlan({ ...base, bags: 'unknown' }, 'sg');
  assert.match(p.title, /Confirm/);
  assert.doesNotMatch(p.steps.join(' '), /T4 shuttle/);
});
test('missing boarding pass and same terminal retain required next steps', () => {
  const p = buildConnectionPlan({ ...base, departureTerminal:'T3', boardingPass:'no' }, 'sg');
  assert.match(p.steps.join(' '), /transfer desk/);
  assert.match(p.steps.join(' '), /Stay in T3/);
  assert.doesNotMatch(p.steps.join(' '), /shuttle/);
});
test('unsupported airports and impossible domestic Singapore route are explicit', () => {
  assert.match(buildConnectionPlan(base, 'th').note, /currently available for Singapore Changi only/);
  assert.match(buildConnectionPlan({...base, onward:'domestic'}, 'sg').steps[0], /no domestic flights/);
  assert.match(buildConnectionPlan({...base, airport:'Other airport / airport change'}, 'sg').title, /Confirm/);
});
