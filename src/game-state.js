Exports:
- createGame({pairs, seed}) -> {seed, pairs, cards:[{id, color, matched, revealed}], moves, matches, startedAt, endedAt, faceUpIndices, pendingHide}
- flipCard(state, index, nowMs) -> {state, effect} where effect is 'flip' | 'match' | 'mismatch' | 'ignored'
- isComplete(state) -> boolean
Rules:
- Ignore flips for matched/revealed cards or when two unmatched cards are already face up.
- Increment moves only when the second card of a pair is flipped.
- On mismatch, set pendingHide=[i,j] so UI can flip them back after a delay.
- Set endedAt when matches==pairs.
Shuffle: implement a tiny seeded RNG (xorshift32) so the same seed yields the same deck order.
