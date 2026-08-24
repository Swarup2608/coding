export default {
  schemaVersion: 1,
  source: "docs/assets/coding-platform-logo.svg",
  staticOutput: "docs/assets/coding-platform-logo-static.png",
  animatedOutput: "docs/assets/coding-platform-logo-animated.gif",
  width: 240,
  height: 240,
  fps: 15,
  frameCount: 30,
  maxFileBytes: 5 * 1024 * 1024,
  gifMaxColors: 128,
  preserveTransparency: true,
  renderFrame({ frameIndex, timeSeconds, width, height, fps, frameCount }) {
    const totalDuration = frameCount / fps;
    const phase = (timeSeconds % totalDuration) / totalDuration;
    const twoPi = Math.PI * 2;

    // #checkmark: scale pulse about its own center (121, 135), matches
    // docs/assets/coding-platform-logo-motion.md "#checkmark" track.
    const checkmarkScale = 1 + 0.05 * (0.5 - 0.5 * Math.cos(twoPi * phase));
    const checkmarkTransform = `translate(121,135) scale(${checkmarkScale.toFixed(5)}) translate(-121,-135)`;

    // #cursor: opacity blink, matches "#cursor" track in the same document.
    const cursorOpacity = 0.12 + 0.88 * (0.5 + 0.5 * Math.cos(twoPi * phase));

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 240 240" role="img" aria-label="Coding Platform mark: two code brackets around a checkmark, with a blinking cursor">
  <title>Coding Platform mark</title>
  <g id="mark">
    <path id="bracket-left" d="M100,68 L46,120 L100,172" fill="none" stroke="#4f46e5" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="bracket-right" d="M140,68 L194,120 L140,172" fill="none" stroke="#4f46e5" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <path id="checkmark" d="M106,138 L118,150 L136,120" fill="none" stroke="#10b981" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" transform="${checkmarkTransform}"/>
    <rect id="cursor" x="200" y="96" width="10" height="48" rx="4" fill="#4f46e5" fill-opacity="${cursorOpacity.toFixed(5)}"/>
  </g>
  <!-- frame ${frameIndex}/${frameCount} at ${timeSeconds.toFixed(4)}s, ${fps}fps, phase ${phase.toFixed(5)} -->
</svg>`;
  },
};
