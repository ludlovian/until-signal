import { suite, test } from 'node:test'
import assert from 'node:assert/strict'
import { setTimeout as sleep } from 'node:timers/promises'

import { signal } from '@preact/signals-core'

import untilSignal from '../src/index.mjs'

suite('until', () => {
  test('basic wait', async () => {
    let resolved = false
    const $s = signal(1)
    const test = () => $s.value === 2
    const p = untilSignal(test)
    p.then(() => (resolved = true))

    assert.ok(p instanceof Promise)
    await sleep(1)
    assert.equal(resolved, false)

    $s.value = 2
    await sleep(1)
    assert.equal(resolved, true)
    assert.equal(await p, true)
  })

  test('already true', async () => {
    let resolved = false
    const $s = signal(1)
    const test = () => $s.value === 1
    const p = untilSignal(test)
    p.then(() => (resolved = true))

    await sleep(1)
    assert.ok(p instanceof Promise)
    assert.equal(resolved, true)
    assert.equal(await p, true)
  })

  test('timeout', async () => {
    let resolved = false
    const $s = signal(1)
    const test = () => $s.value === 2
    const p = untilSignal(test, 50)
    p.then(() => (resolved = true))

    await sleep(1)
    assert.ok(p instanceof Promise)
    assert.equal(resolved, false)

    await sleep(75)
    assert.equal(resolved, true)
    assert.equal(await p, false)
  })
})
