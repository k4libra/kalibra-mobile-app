/**
 * Tests for account initials formatting.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { initials } from './identity';
test.each([['Student Example Person', 'SE'], ['  student   example ', 'SE'], ['Student', 'S'], ['', ''], ['   ', '']])('formats initials for %s', (name, expected) => { expect(initials(name)).toBe(expected); });
