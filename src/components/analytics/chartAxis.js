// Shared axis maths for the Analytics bar + line charts (Figma Analytics-with-AI: 1:6286)
export const Y_AXIS = ['2.5K', '2.0K', '1.5K', '1.0K', '0.5K', '0']
export const Y_MAX = 2500
export const PLOT_LEFT = 56   // y-axis label column
export const PLOT_TOP = 7     // bars start 7px below the graph top
export const X_AXIS_H = 26    // date labels under the plot

// The top label (2.5K) is centred 13px from the graph top, so the scale tops out there
export const valueToPx = (value, plotH) => (value / Y_MAX) * (plotH - (13 - PLOT_TOP))

export const formatK = (v) => (v / 1000).toFixed(2) + 'K'

export function changeAt(values, i) {
  if (i === null || i === 0) return null
  return Math.round(((values[i] - values[i - 1]) / values[i - 1]) * 100)
}
