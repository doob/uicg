import assert from 'assert'
import test from 'node:test'

test('synchronous passing test', (t) => {
  assert.strictEqual(1, 1)
})
