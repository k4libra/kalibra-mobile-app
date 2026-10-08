/**
 * Tests for the mastery and plural helpers.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { masteryTone } from './mastery';
import { plural } from './plural';

describe('masteryTone', () => {
  it('maps mastery levels to tones', () => {
    expect(masteryTone(null)).toBe('neutral');
    expect(masteryTone(33)).toBe('danger');
    expect(masteryTone(62)).toBe('warning');
    expect(masteryTone(81)).toBe('success');
  });
});

describe('plural', () => {
  it('chooses the singular or plural noun', () => {
    expect(plural(1, 'invitación', 'invitaciones')).toBe('1 invitación');
    expect(plural(0, 'invitación', 'invitaciones')).toBe('0 invitaciones');
  });
});
