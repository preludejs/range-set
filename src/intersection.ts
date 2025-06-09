import * as RangeSet from './range-set.js'
import * as Range from './range.js'

/**
 * Computes the intersection of two range sets, finding overlapping portions.
 *
 * Only the overlapping portions of ranges from both sets are included in the result.
 * When ranges overlap, their values are merged according to the value merge function.
 * Non-overlapping portions are excluded from the result.
 *
 * @template K - The type of range boundaries
 * @template V - The type of range values
 * @param rangeSet - The first range set
 * @param otherRangeSet - The second range set containing ranges to intersect with the first
 * @returns A new range set containing only the overlapping portions of both input range sets
 */
export const intersection = <K, V>(
  rangeSet: RangeSet.T<K, V>,
  otherRangeSet: { ranges: Range.T<K, V>[] }
): RangeSet.T<K, V> => {
  const ranges: Range.T<K, V>[] = []
  let i = 0
  let j = 0

  while (i < rangeSet.ranges.length && j < otherRangeSet.ranges.length) {
    const x = rangeSet.ranges[i]
    const y = otherRangeSet.ranges[j]

    const effectiveXEnd = rangeSet.key.next(x.end)
    const effectiveYEnd = rangeSet.key.next(y.end)

    const start = rangeSet.key.cmp(x.start, y.start) > 0 ? x.start : y.start
    const end = rangeSet.key.cmp(effectiveXEnd, effectiveYEnd) < 0 ? effectiveXEnd : effectiveYEnd

    if (start < end) {
      ranges.push({
        start,
        end: rangeSet.key.prev(end),
        value: rangeSet.value.merge(x.value, y.value)
      })
    }

    if (effectiveXEnd < effectiveYEnd) {
      i++
    } else {
      j++
    }
  }
  return { ...rangeSet, ranges }
}
