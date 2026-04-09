export type EventType = "wakeup" | "auth" | "transfer";

export interface LatencyEvent {
  type: EventType;
  latency: number;
  timestamp: string;
}

export interface LatencySummary {
  avg: number | null;
  min: number | null;
  max: number | null;
  samples: number[];
}

export interface LatencyReport {
  wakeup: LatencySummary;
  auth: LatencySummary;
  transfer: LatencySummary;
  allEvents: LatencyEvent[];
}

export class WakeupTimer {
  private events: LatencyEvent[] = [];
  private proximityTime: number | null = null;
  private authStart: number | null = null;
  private transferStart: number | null = null;

  markProximityDetected(): void {
    this.proximityTime = performance.now();
    console.log("[WakeupTimer] Proximity detected");
  }

  markModelActive(): void {
    if (!this.proximityTime) return;
    this._push("wakeup", performance.now() - this.proximityTime);
    this.proximityTime = null;
  }

  markAuthStart(): void {
    this.authStart = performance.now();
  }

  markAuthComplete(): void {
    if (!this.authStart) return;
    this._push("auth", performance.now() - this.authStart);
    this.authStart = null;
  }

  markTransferStart(): void {
    this.transferStart = performance.now();
  }

  markTransferComplete(): void {
    if (!this.transferStart) return;
    this._push("transfer", performance.now() - this.transferStart);
    this.transferStart = null;
  }

  private _push(type: EventType, latency: number): void {
    const entry: LatencyEvent = {
      type,
      latency: parseFloat(latency.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
    this.events.push(entry);
    console.log(`[WakeupTimer] ${type} latency: ${entry.latency}ms`);
  }

  private _summary(type: EventType): LatencySummary {
    const samples = this.events
      .filter((e) => e.type === type)
      .map((e) => e.latency);

    if (!samples.length)
      return { avg: null, min: null, max: null, samples: [] };

    return {
      avg: parseFloat(
        (samples.reduce((a, b) => a + b, 0) / samples.length).toFixed(2),
      ),
      min: Math.min(...samples),
      max: Math.max(...samples),
      samples,
    };
  }

  getReport(): LatencyReport {
    return {
      wakeup: this._summary("wakeup"),
      auth: this._summary("auth"),
      transfer: this._summary("transfer"),
      allEvents: this.events,
    };
  }
}
