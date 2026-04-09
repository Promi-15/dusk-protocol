import type { EnergyReport } from '../measurements/energy/cpu_logger';
import type { LatencyReport } from '../measurements/latency/wakeup_timer';
import type { AccuracyReport } from '../measurements/accuracy/gesture_tester';

export interface ThesisSummary {
  meta: {
    projectName: string;
    generatedAt: string;
    version: string;
  };
  energyEfficiency: {
    alwaysOnAvgCpu: number;
    proximityWakeAvgCpu: number;
    estimatedSavingPercent: string;
    unit: string;
  };
  latency: {
    wakeupMs: number | null;
    wakeupMin: number | null;
    wakeupMax: number | null;
    authMs: number | null;
    authMin: number | null;
    authMax: number | null;
    transferMs: number | null;
    transferMin: number | null;
    transferMax: number | null;
  };
  gestureAccuracy: {
    overallPercent: number;
    totalTests: number;
    correct: number;
    averageConfidencePercent: number;
    averageInferenceMs: number;
    perGesture: AccuracyReport['perGestureAccuracy'];
    confusionMatrix: AccuracyReport['confusionMatrix'];
  };
  meetsTargets: {
    energySaving: boolean;      // target: 60-70%
    wakeupLatency: boolean;     // target: <500ms
    authLatency: boolean;       // target: <100ms
    gestureAccuracy: boolean;   // target: >90%
  };
}

export function generateSummary(
  energyAlwaysOn: EnergyReport,
  energyProximity: EnergyReport,
  latency: LatencyReport,
  accuracy: AccuracyReport
): ThesisSummary {

  const savingPercent = parseFloat((
    ((energyAlwaysOn.averageCpuTime - energyProximity.averageCpuTime)
    / energyAlwaysOn.averageCpuTime) * 100
  ).toFixed(1));

  const summary: ThesisSummary = {
    meta: {
      projectName: 'Dusk Protocol',
      generatedAt: new Date().toISOString(),
      version: '1.0.0'
    },
    energyEfficiency: {
      alwaysOnAvgCpu: energyAlwaysOn.averageCpuTime,
      proximityWakeAvgCpu: energyProximity.averageCpuTime,
      estimatedSavingPercent: `${savingPercent}%`,
      unit: 'ms (CPU execution time proxy)'
    },
    latency: {
      wakeupMs:     latency.wakeup.avg,
      wakeupMin:    latency.wakeup.min,
      wakeupMax:    latency.wakeup.max,
      authMs:       latency.auth.avg,
      authMin:      latency.auth.min,
      authMax:      latency.auth.max,
      transferMs:   latency.transfer.avg,
      transferMin:  latency.transfer.min,
      transferMax:  latency.transfer.max,
    },
    gestureAccuracy: {
      overallPercent:           accuracy.percent,
      totalTests:               accuracy.total,
      correct:                  accuracy.correct,
      averageConfidencePercent: accuracy.averageConfidence,
      averageInferenceMs:       accuracy.averageLatencyMs,
      perGesture:               accuracy.perGestureAccuracy,
      confusionMatrix:          accuracy.confusionMatrix
    },
    meetsTargets: {
      energySaving:    savingPercent >= 60,
      wakeupLatency:   (latency.wakeup.avg ?? Infinity) < 500,
      authLatency:     (latency.auth.avg ?? Infinity) < 100,
      gestureAccuracy: accuracy.percent >= 90
    }
  };

  // Pretty print to console
  console.log('\n========== DUSK PROTOCOL — THESIS REPORT ==========\n');
  console.log(' Energy Efficiency:');
  console.table(summary.energyEfficiency);
  console.log('\n Latency:');
  console.table({
    wakeup:   { avg: summary.latency.wakeupMs,   min: summary.latency.wakeupMin,   max: summary.latency.wakeupMax },
    auth:     { avg: summary.latency.authMs,     min: summary.latency.authMin,     max: summary.latency.authMax },
    transfer: { avg: summary.latency.transferMs, min: summary.latency.transferMin, max: summary.latency.transferMax }
  });
  console.log('\nGesture Accuracy:');
  console.table(summary.gestureAccuracy.perGesture);
  console.log('\nConfusion Matrix:');
  console.table(summary.gestureAccuracy.confusionMatrix);
  console.log('\nMeets Thesis Targets:');
  console.table(summary.meetsTargets);
  console.log('\n=======================================================\n');

  return summary;
}
