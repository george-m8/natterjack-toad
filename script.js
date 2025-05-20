document.addEventListener('DOMContentLoaded', () => {
    const debug = true; // Toggle this flag to enable/disable debug logs

    const log = (...args) => {
      if (debug) console.log(...args);
    };

    const container    = document.querySelector('.natterjack-container');
    const mainFrame    = document.getElementById('natterjack-animation-1');
    const blinkFrame1  = document.getElementById('natterjack-animation-2');
    const blinkFrame2  = document.getElementById('natterjack-animation-3');
    const soundEls    = Array.from(document.querySelectorAll('.frog-sound'));
    const defaultSound= document.getElementById('default-sound');
    const allSounds = [...soundEls, defaultSound];

    let currentSound = null;
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
        log('Container clicked. Triggering blink + random sound.');

        // stop any sound still going
        if (currentSound) {
            currentSound.pause();
            currentSound.currentTime = 0;
        }

        // blink as before
        blink();
        clearTimeout(blinkTimeout);

        // pick one at random (or fallback)
        let chosen = soundEls.length
            ? soundEls[Math.floor(Math.random() * soundEls.length)]
            : defaultSound;

        // build a pool that excludes the last sound (if there are at least 2)
        const pool = soundEls.length > 1
            ? soundEls.filter(s => s !== currentSound)
            : soundEls;

        // pick one (or fallback if nothing in pool)
        const selectedSound = pool.length
            ? pool[Math.floor(Math.random() * pool.length)]
            : defaultSound;

        // play it & remember it
        selectedSound.currentTime = 0;
        selectedSound.play().catch(e => log('Sound play failed:', e));
        currentSound = selectedSound;
    });

    // JS (add this after your existing script)
    const volumeSlider = document.getElementById('volume-slider');

    // set initial CSS var so the track is filled correctly on page-load
    volumeSlider.style.setProperty('--value', volumeSlider.value);

    // on input, update the CSS var and the audio volume
    volumeSlider.addEventListener('input', e => {
        const v = e.target.value;
        e.target.style.setProperty('--value', v);
        // update every sound element:
        soundEls.forEach(s => s.volume = v);
        defaultSound.volume = v;
      });

    // Stop sound button
    const stopBtn = document.getElementById('stop-button-wrapper');

    stopBtn.addEventListener('click', () => {
        // feedback animation
        stopBtn.classList.add('feedback');
        stopBtn.addEventListener('animationend', () => {
            stopBtn.classList.remove('feedback');
        }, { once: true });
      
        // stop only the current sound
        if (currentSound) {
          currentSound.pause();
          currentSound.currentTime = 0;
          currentSound = null;
          log('Blink sound stopped.');
        }
    });   

    const controls = document.querySelector('.controls');

    // fire only once, on first play
    allSounds.forEach(aud => {
        aud.addEventListener('play', () => {
          controls.classList.add('visible');
          controls.classList.remove('hidden');
          log('Controls made visible.');
        }, { once: true });
      });
  });