export interface CPUSample {
  timestamp: number;
  cpuTime: number;
  label: string;
}

export interface EnergyReport {
  label: string;
  samples: CPUSample[];
  averageCpuTime: number;
  totalSamples: number;
  duration: number;
}

export class CPULogger {
  private label: string;
  private samples: CPUSample[] = [];
  private running: boolean = false;
  private startTime: number = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(label: string = 'session') {
    this.label = label;
  }

  start(): void {
    this.running = true;
    this.startTime = performance.now();
    this._sample();
    console.log(`[CPULogger] Started: ${this.label}`);
  }

  private _sample(): void {
    if (!this.running) return;

    const t0 = performance.now();
    let x = 0;
    for (let i = 0; i < 50000; i++) x += Math.sqrt(i);
    const cpuTime = performance.now() - t0;

    this.samples.push({
      timestamp: Math.round(performance.now() - this.startTime),
      cpuTime: parseFloat(cpuTime.toFixed(4)),
      label: this.label
    });

    this.timer = setTimeout(() => this._sample(), 1000);
  }

  stop(): EnergyReport {
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    return this.getReport();
  }

  getReport(): EnergyReport {
    const avg = this.samples.reduce((s, x) => s + x.cpuTime, 0) / this.samples.length;
    return {
      label: this.label,
      samples: this.samples,
      averageCpuTime: parseFloat(avg.toFixed(4)),
      totalSamples: this.samples.length,
      duration: this.samples[this.samples.length - 1]?.timestamp ?? 0
    };
  }
}