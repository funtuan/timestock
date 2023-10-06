
import { Timestock } from './index'

describe('Timestock', () => {
  test('basic', () => {
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
})
