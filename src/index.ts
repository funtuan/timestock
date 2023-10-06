
interface TimePeriod {
  start: Date
  end: Date
  volume: number
}

export class Timestock {
  public periods: TimePeriod[] = [];
  constructor ({
    periods = [],
  }: {
    periods: TimePeriod[]
  }) {
    this.periods = periods
  }

  public serialize (): {
    periods: TimePeriod[]
  } {
    return {
      periods: this.periods,
    }
  }

  public addPeriod (period: TimePeriod): void {
    // 如果 volume 為 0，則不加入
    if (period.volume === 0) {
      return
    }
    for (let i = 0; i < this.periods.length; i++) {
      if (period.start < this.periods[i].start) {
        // 檢查是否有重疊
        if (period.end > this.periods[i].start) {
          throw new Error('periods overlapped')
        }
        // 如果有前一個，檢查是否有重疊
        if (i > 0) {
          if (period.start < this.periods[i - 1].end) {
            throw new Error('periods overlapped')
          }
        }

        this.periods.splice(i, 0, period)
        return
      }
    }
  }

  // 運算 - 位移
  public offset (ms: number): Timestock {
    return new Timestock({
      periods: this.periods.map((period) => {
        return {
          ...period,
          start: new Date(period.start.getTime() + ms),
          end: new Date(period.end.getTime() + ms),
        }
      }),
    })
  }

  private _calculatePeriods (timestock: Timestock, calcFunction = (a: number, b: number) => a + b): Timestock {
    const aPeriods = this.periods
    const bPeriods = timestock.periods
    const newPeriods: TimePeriod[] = []

    // index 為 periods 長度的兩倍（start 為奇數，end 為偶數）
    let aIndex = 0
    let bIndex = 0
    let aValue = 0
    let bValue = 0

    let prevPoint = new Date(0)
    let nextPoint = new Date(0)

    while (aIndex < aPeriods.length * 2 || bIndex < bPeriods.length * 2) {
      // console.log(aIndex, bIndex, aValue, bValue, prevPoint, nextPoint);
      // 決定 nextPoint
      prevPoint = nextPoint
      let aPoint = aIndex >= aPeriods.length * 2 ? null : (aIndex % 2 === 0 ? aPeriods[Math.floor(aIndex / 2)].start : aPeriods[Math.floor(aIndex / 2)].end)
      let bPoint = bIndex >= bPeriods.length * 2 ? null : (bIndex % 2 === 0 ? bPeriods[Math.floor(bIndex / 2)].start : bPeriods[Math.floor(bIndex / 2)].end)
      nextPoint = new Date(Math.min((aPoint != null) ? aPoint.getTime() : Infinity, (bPoint != null) ? bPoint.getTime() : Infinity))

      // 產生新的 period
      const newValues = calcFunction(aValue, bValue)
      if (newValues !== 0) {
        newPeriods.push({
          start: prevPoint,
          end: nextPoint,
          volume: newValues,
        })
      }

      // 更新 index
      while ((aPoint != null) && aPoint <= nextPoint) {
        aIndex++
        if (aIndex >= aPeriods.length * 2) {
          aValue = 0
          break
        }
        aValue = aIndex % 2 === 0 ? 0 : aPeriods[Math.floor(aIndex / 2)].volume
        aPoint = aIndex % 2 === 0 ? aPeriods[Math.floor(aIndex / 2)].start : aPeriods[Math.floor(aIndex / 2)].end
      }
      while ((bPoint != null) && bPoint <= nextPoint) {
        bIndex++
        if (bIndex >= bPeriods.length * 2) {
          bValue = 0
          break
        }
        bValue = bIndex % 2 === 0 ? 0 : bPeriods[Math.floor(bIndex / 2)].volume
        bPoint = bIndex % 2 === 0 ? bPeriods[Math.floor(bIndex / 2)].start : bPeriods[Math.floor(bIndex / 2)].end
      }
    }

    if (newPeriods.length === 0) {
      return new Timestock({
        periods: [],
      })
    }

    return new Timestock({
      periods: newPeriods,
    })
  }

  // 運算子 - 減法
  public subtract (timestock: Timestock): Timestock {
    return this._calculatePeriods(timestock, (a, b) => a - b)
  }

  // 運算子 - 交集
  public intersect (timestock: Timestock): Timestock {
    return this._calculatePeriods(timestock, (a, b) => Math.min(a, b))
  }

  // 運算子 - 聯集
  public union (timestock: Timestock): Timestock {
    return this._calculatePeriods(timestock, (a, b) => Math.max(a, b))
  }
}
