
import { Timestock } from './index'

describe('Timestock', () => {
  test('basic calculate', () => {
    const aTimestock = new Timestock({
      periods: [
        {
          start: new Date('2023-10-01T00:00:00.000Z'),
          end: new Date('2023-10-04T00:00:00.000Z'),
          volume: 2,
        },
        {
          start: new Date('2023-10-04T00:00:00.000Z'),
          end: new Date('2023-10-06T00:00:00.000Z'),
          volume: 3,
        },
      ],
    })

    const bTimestock = new Timestock({
      periods: [
        {
          start: new Date('2023-10-01T00:00:00.000Z'),
          end: new Date('2023-10-02T00:00:00.000Z'),
          volume: 5,
        },
        {
          start: new Date('2023-10-03T00:00:00.000Z'),
          end: new Date('2023-10-05T00:00:00.000Z'),
          volume: 2,
        },
        {
          start: new Date('2023-10-05T00:00:00.000Z'),
          end: new Date('2023-10-06T00:00:00.000Z'),
          volume: 1,
        },
        {
          start: new Date('2023-10-06T00:00:00.000Z'),
          end: new Date('2023-10-08T00:00:00.000Z'),
          volume: 2,
        },
      ],
    })

    expect(aTimestock.subtract(bTimestock).serialize().periods).toEqual([
      {
        start: new Date('2023-10-01T00:00:00.000Z'),
        end: new Date('2023-10-02T00:00:00.000Z'),
        volume: -3,
      },
      {
        start: new Date('2023-10-02T00:00:00.000Z'),
        end: new Date('2023-10-03T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-04T00:00:00.000Z'),
        end: new Date('2023-10-05T00:00:00.000Z'),
        volume: 1,
      },
      {
        start: new Date('2023-10-05T00:00:00.000Z'),
        end: new Date('2023-10-06T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-06T00:00:00.000Z'),
        end: new Date('2023-10-08T00:00:00.000Z'),
        volume: -2,
      },
    ])

    expect(aTimestock.intersect(bTimestock).serialize().periods).toEqual([
      {
        start: new Date('2023-10-01T00:00:00.000Z'),
        end: new Date('2023-10-02T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-03T00:00:00.000Z'),
        end: new Date('2023-10-04T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-04T00:00:00.000Z'),
        end: new Date('2023-10-05T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-05T00:00:00.000Z'),
        end: new Date('2023-10-06T00:00:00.000Z'),
        volume: 1,
      },
    ])

    expect(aTimestock.union(bTimestock).serialize().periods).toEqual([
      {
        start: new Date('2023-10-01T00:00:00.000Z'),
        end: new Date('2023-10-02T00:00:00.000Z'),
        volume: 5,
      },
      {
        start: new Date('2023-10-02T00:00:00.000Z'),
        end: new Date('2023-10-03T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-03T00:00:00.000Z'),
        end: new Date('2023-10-04T00:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-04T00:00:00.000Z'),
        end: new Date('2023-10-05T00:00:00.000Z'),
        volume: 3,
      },
      {
        start: new Date('2023-10-05T00:00:00.000Z'),
        end: new Date('2023-10-06T00:00:00.000Z'),
        volume: 3,
      },
      {
        start: new Date('2023-10-06T00:00:00.000Z'),
        end: new Date('2023-10-08T00:00:00.000Z'),
        volume: 2,
      },
    ])
  })
  test('extendMin', () => {
    const timestock = new Timestock({
      periods: [
        {
          start: new Date('2023-10-01T00:00:00.000Z'),
          end: new Date('2023-10-01T01:00:00.000Z'),
          volume: 2,
        },
        {
          start: new Date('2023-10-01T01:00:00.000Z'),
          end: new Date('2023-10-01T02:00:00.000Z'),
          volume: 1,
        },
        {
          start: new Date('2023-10-01T02:00:00.000Z'),
          end: new Date('2023-10-01T02:30:00.000Z'),
          volume: 2,
        },
        {
          start: new Date('2023-10-01T04:00:00.000Z'),
          end: new Date('2023-10-01T07:00:00.000Z'),
          volume: 1,
        },
        {
          start: new Date('2023-10-01T07:30:00.000Z'),
          end: new Date('2023-10-01T10:00:00.000Z'),
          volume: 2,
        },
      ],
    })

    expect(timestock.extendMin(2 * 60 * 60 * 1000).serialize().periods).toEqual([
      {
        start: new Date('2023-10-01T00:00:00.000Z'),
        end: new Date('2023-10-01T01:00:00.000Z'),
        volume: 2,
      },
      {
        start: new Date('2023-10-01T01:00:00.000Z'),
        end: new Date('2023-10-01T02:30:00.000Z'),
        volume: 1,
      },
      {
        start: new Date('2023-10-01T04:30:00.000Z'),
        end: new Date('2023-10-01T07:00:00.000Z'),
        volume: 1,
      },
      {
        start: new Date('2023-10-01T09:00:00.000Z'),
        end: new Date('2023-10-01T10:00:00.000Z'),
        volume: 2,
      },
    ])
  })
  // 可用時間範例
  test('available time', () => {
    const timestock = new Timestock({
      periods: [
        {
          start: new Date('2023-10-01T00:00:00.000Z'),
          end: new Date('2023-10-01T05:00:00.000Z'),
          volume: 1,
        },
        {
          start: new Date('2023-10-01T06:00:00.000Z'),
          end: new Date('2023-10-01T10:00:00.000Z'),
          volume: 1,
        },
      ],
    })

    const diffMs = 2 * 60 * 60 * 1000

    expect(
      timestock.intersect(
        timestock.offset(-diffMs),
      ).serialize().periods,
    ).toEqual([
      {
        start: new Date('2023-10-01T00:00:00.000Z'),
        end: new Date('2023-10-01T03:00:00.000Z'),
        volume: 1,
      },
      {
        start: new Date('2023-10-01T04:00:00.000Z'),
        end: new Date('2023-10-01T05:00:00.000Z'),
        volume: 1,
      },
      {
        start: new Date('2023-10-01T06:00:00.000Z'),
        end: new Date('2023-10-01T08:00:00.000Z'),
        volume: 1,
      },
    ])
    expect(
      timestock.intersect(
        timestock.extendMin(diffMs).offset(-diffMs),
      ).serialize().periods,
    ).toEqual([
      {
        start: new Date('2023-10-01T00:00:00.000Z'),
        end: new Date('2023-10-01T03:00:00.000Z'),
        volume: 1,
      },
      {
        start: new Date('2023-10-01T06:00:00.000Z'),
        end: new Date('2023-10-01T08:00:00.000Z'),
        volume: 1,
      },
    ])
  })
})
