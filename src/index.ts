

type TimePeriod = {
  start: Date,
  end: Date,
  volume: number,
}

export class Timestock {
  public periods: TimePeriod[] = [];
  public start: Date;
  public end: Date;
  constructor({
    periods = [],
    start,
    end,
  }: {
    periods: TimePeriod[],
    start: Date,
    end: Date,
  }) {
    this.periods = periods;
    this.start = start;
    this.end = end;
  }

  public serialize() {
    return {
      periods: this.periods,
      start: this.start,
      end: this.end,
    }
  }

  public addPeriod(period: TimePeriod) {
    // 如果 volume 為 0，則不加入
    if (period.volume === 0) {
      return;
    }
    for (let i = 0; i < this.periods.length; i++) {
      if (period.start < this.periods[i].start) {
        // 檢查是否有重疊
        if (period.end > this.periods[i].start) {
          throw new Error('periods overlapped');
        }
        // 如果有前一個，檢查是否有重疊
        if (i > 0) {
          if (period.start < this.periods[i - 1].end) {
            throw new Error('periods overlapped');
          }
        }

        // 如果是頭尾，則改變 start 或 end
        if (i === 0) {
          this.start = period.start;
        }
        if (i === this.periods.length - 1) {
          this.end = period.end;
        }
        this.periods.splice(i, 0, period);
        return;
      }
    }
  }

  // 運算 - 位移
  public offset(ms: number) {
    this.start = new Date(this.start.getTime() + ms);
    this.end = new Date(this.end.getTime() + ms);
    this.periods = this.periods.map((period) => {
      return {
        ...period,
        start: new Date(period.start.getTime() + ms),
        end: new Date(period.end.getTime() + ms),
      }
    })
  }

  // 運算子 - 減法
  public subtract(timestock: Timestock) {
    // TODO
  }
}  