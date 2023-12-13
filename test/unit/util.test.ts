import { describe, expect, test } from 'vitest';

import { composeComment } from '../../src/utils';

describe('Unit tests of general utilities', () => {
  describe('composeComment()', () => {
    test('single message', () => {
      expect(composeComment('Hello, world!')).toMatchInlineSnapshot(
        `"Hello, world!"`
      );
    });

    test('multiple messages', () => {
      expect(composeComment('Hello, world!\nHello, universe!'))
        .toMatchInlineSnapshot(`
        "Hello, world!

        ---

        Hello, universe!"
      `);
    });

    test('single JSON string message', () => {
      expect(
        composeComment(JSON.stringify('Hello, world!'))
      ).toMatchInlineSnapshot(`"Hello, world!"`);
    });

    test('multiple JSON string messages', () => {
      expect(
        composeComment(
          `${JSON.stringify('Hello, world!')}\n${JSON.stringify(
            'Hello, universe!'
          )}`
        )
      ).toMatchInlineSnapshot(`
        "Hello, world!

        ---

        Hello, universe!"
      `);
    });
  });
});
