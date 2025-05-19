document.addEventListener('DOMContentLoaded', () => {
    const debug = true; // Toggle this flag to enable/disable debug logs

    const log = (...args) => {
      if (debug) console.log(...args);
    };

    const container    = document.querySelector('.natterjack-container');
    const mainFrame    = document.getElementById('natterjack-animation-1');
    const blinkFrame1  = document.getElementById('natterjack-animation-2');
    const blinkFrame2  = document.getElementById('natterjack-animation-3');
    const sound        = document.getElementById('blink-sound');
    let blinkTimeout;

    log('Initialized DOM elements.');

    // Ensure we start with only the main image visible
    [mainFrame, blinkFrame1, blinkFrame2].forEach(img => {
      img.classList.remove('visible');
      img.classList.add('hidden');
    });
    mainFrame.classList.replace('hidden','visible');
    log('Set initial visibility: mainFrame visible, others hidden.');

    function scheduleNextBlink() {
      const delay = 3000 + Math.random() * 2000; // 3–5 seconds
      log(`Scheduling next blink in ${delay.toFixed(0)}ms.`);
      blinkTimeout = setTimeout(blink, delay);
    }

    const BLINK_FRAME_DURATION = 120; // instead of 100

    function blink() {
    clearTimeout(blinkTimeout);
    log('Blink triggered.');

    // frame 1
    mainFrame.classList.replace('visible','hidden');
    blinkFrame1.classList.replace('hidden','visible');

    setTimeout(() => {
        // frame 2
        blinkFrame1.classList.replace('visible','hidden');
        blinkFrame2.classList.replace('hidden','visible');

        setTimeout(() => {
        // back to main
        blinkFrame2.classList.replace('visible','hidden');
        mainFrame.classList.replace('hidden','visible');
        scheduleNextBlink();
        }, BLINK_FRAME_DURATION);

    }, BLINK_FRAME_DURATION);
    }

    // auto-start the loop
    scheduleNextBlink();
    log('Auto-started blink loop.');

    // click = blink immediately
    container.addEventListener('click', () => {
      log('Container clicked. Triggering blink immediately.');
      blink();
      sound.currentTime = 0;
      sound.play().catch(e => log('Sound play failed:', e));
    });
  });