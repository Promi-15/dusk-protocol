export type GestureLabel = 'GRAB' | 'DROP' | 'IDLE' | 'UNKNOWN';

export interface GestureTestCase {
  id: number;
  expected: GestureLabel;
  predicted: GestureLabel;
  confidence: number;        // 0.0 - 1.0 from ml5/MediaPipe
  latencyMs: number;
  timestamp: string;
  correct: boolean;
}

export interface ConfusionMatrix {
  [expected: string]: {
    [predicted: string]: number;
  };
}

export interface AccuracyReport {
  total: number;
  correct: number;
  percent: number;
  averageConfidence: number;
  averageLatencyMs: number;
  perGestureAccuracy: Record<GestureLabel, {
    total: number;
    correct: number;
    percent: number;
  }>;
  confusionMatrix: ConfusionMatrix;
  cases: GestureTestCase[];
  generatedAt: string;
}

export class GestureTester {
  private cases: GestureTestCase[] = [];
  private counter: number = 0;
  private inferenceStart: number | null = null;

  readonly labels: GestureLabel[] = ['GRAB', 'DROP', 'IDLE', 'UNKNOWN'];

  // Call this just before gesture model runs
  markInferenceStart(): void {
    this.inferenceStart = performance.now();
  }

  // Call this when model returns a prediction
  record(expected: GestureLabel, predicted: GestureLabel, confidence: number): void {
    const latencyMs = this.inferenceStart
      ? parseFloat((performance.now() - this.inferenceStart).toFixed(2))
      : 0;

    this.inferenceStart = null;

    const testCase: GestureTestCase = {
      id: ++this.counter,
      expected,
      predicted,
      confidence: parseFloat(confidence.toFixed(4)),
      latencyMs,
      timestamp: new Date().toISOString(),
      correct: expected === predicted
    };

    this.cases.push(testCase);

    console.log(
      `[GestureTester] #${testCase.id} | ` +
      `Expected: ${expected} | ` +
      `Got: ${predicted} | ` +
      `${testCase.correct ? '✓' : '✗'} | ` +
      `Conf: ${(confidence * 100).toFixed(1)}% | ` +
      `${latencyMs}ms`
    );
  }

  // Build confusion matrix
  private _buildConfusionMatrix(): ConfusionMatrix {
    const matrix: ConfusionMatrix = {};

    // Initialize all cells to 0
    for (const exp of this.labels) {
      matrix[exp] = {};
      for (const pred of this.labels) {
        matrix[exp][pred] = 0;
      }
    }

    // Fill matrix
    for (const c of this.cases) {
      if (matrix[c.expected]) {
        matrix[c.expected][c.predicted] =
          (matrix[c.expected][c.predicted] ?? 0) + 1;
      }
    }

    return matrix;
  }

  // Per-gesture breakdown
  private _perGestureAccuracy(): AccuracyReport['perGestureAccuracy'] {
    const result = {} as AccuracyReport['perGestureAccuracy'];

    for (const label of this.labels) {
      const subset = this.cases.filter(c => c.expected === label);
      const correct = subset.filter(c => c.correct).length;
      result[label] = {
        total: subset.length,
        correct,
        percent: subset.length
          ? parseFloat(((correct / subset.length) * 100).toFixed(1))
          : 0
      };
    }

    return result;
  }

  getReport(): AccuracyReport {
    const total = this.cases.length;
    const correct = this.cases.filter(c => c.correct).length;

    const avgConf = this.cases.reduce((s, c) => s + c.confidence, 0) / total;
    const avgLat = this.cases.reduce((s, c) => s + c.latencyMs, 0) / total;

    return {
      total,
      correct,
      percent: parseFloat(((correct / total) * 100).toFixed(1)),
      averageConfidence: parseFloat((avgConf * 100).toFixed(1)),
      averageLatencyMs: parseFloat(avgLat.toFixed(2)),
      perGestureAccuracy: this._perGestureAccuracy(),
      confusionMatrix: this._buildConfusionMatrix(),
      cases: this.cases,
      generatedAt: new Date().toISOString()
    };
  }

  reset(): void {
    this.cases = [];
    this.counter = 0;
    console.log('[GestureTester] Reset');
  }
}

