document.addEventListener('DOMContentLoaded', () => {
  let currentPage = 0;
  let isTurning = false;

  const pages = document.querySelectorAll('.page');
  const totalPages = pages.length;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageIndicator = document.getElementById('pageIndicator');

  // Page initialization & side assignment
  pages.forEach((page) => {
    const sides = page.querySelectorAll('.page-side');
    if (sides[0]) sides[0].classList.add('left');
    if (sides[1]) sides[1].classList.add('right');
  });

  // Navigation Buttons
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => changePage(-1));
    nextBtn.addEventListener('click', () => changePage(1));
  }

  function changePage(direction) {
    if (isTurning) return;

    const targetIndex = currentPage + direction;
    if (targetIndex < 0 || targetIndex >= totalPages) return;

    isTurning = true;
    const currentSpread = pages[currentPage];
    const targetSpread = pages[targetIndex];

    targetSpread.style.opacity = '1';
    targetSpread.style.zIndex = '1';
    currentSpread.style.zIndex = '2';
    targetSpread.classList.add('active');

    const currentRightPage = currentSpread.querySelector('.page-side.right');
    const currentLeftPage = currentSpread.querySelector('.page-side.left');

    if (direction === 1) {
      if (currentRightPage) currentRightPage.classList.add('turning-right');
    } else {
      if (currentLeftPage) currentLeftPage.classList.add('turning-left');
    }

    const turnDuration = 780;
    const revealAt = turnDuration * 0.28;

    setTimeout(() => {
      currentSpread.classList.remove('active');
      currentSpread.style.opacity = '0';
      currentSpread.style.pointerEvents = 'none';
      currentSpread.style.zIndex = '1';
      targetSpread.classList.add('active');
      targetSpread.style.opacity = '1';
      targetSpread.style.pointerEvents = 'auto';
      targetSpread.style.zIndex = '3';
      currentPage = targetIndex;
    }, revealAt);

    setTimeout(() => {
      if (currentRightPage) currentRightPage.classList.remove('turning-right');
      if (currentLeftPage) currentLeftPage.classList.remove('turning-left');
      currentSpread.style.zIndex = '';
      targetSpread.style.zIndex = '';
      targetSpread.style.opacity = '';

      updateControls();
      isTurning = false;
    }, turnDuration);
  }

  function updateControls() {
    if (prevBtn) prevBtn.disabled = (currentPage === 0);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages - 1);

    if (pageIndicator) {
      const formattedCurrent = String(currentPage + 1).padStart(2, '0');
      const formattedTotal = String(totalPages).padStart(2, '0');
      pageIndicator.textContent = `${formattedCurrent} / ${formattedTotal}`;
    }
  }

  /* --- AUDIO HOVER INTEGRATION --- */

  const vinylPlayers = document.querySelectorAll('.vinyl-player');
  const vinylAudio = document.getElementById('vinylAudio');
  const eqBadge = document.getElementById('equalizer-badge');
  const birthdayAudio = document.getElementById('birthdayAudio');

  let vinylFadeInterval = null;
  let eqFadeInterval = null;

  // Unmute audio context after first user click on the document
  document.addEventListener('click', () => {
    if (vinylAudio) vinylAudio.load();
    if (birthdayAudio) birthdayAudio.load();
  }, { once: true });

  // 1. Vinyl Players Audio (Ambient Track)
  if (vinylAudio && vinylPlayers.length > 0) {
    const maxVinylVolume = 0.5;

    vinylPlayers.forEach((player) => {
      player.addEventListener('mouseenter', () => {
        clearInterval(vinylFadeInterval);
        
        if (vinylAudio.paused) {
          vinylAudio.volume = 0;
          vinylAudio.play().catch((err) => console.log('Click required first:', err));
        }

        vinylFadeInterval = setInterval(() => {
          if (vinylAudio.volume < maxVinylVolume) {
            vinylAudio.volume = Math.min(maxVinylVolume, vinylAudio.volume + 0.05);
          } else {
            clearInterval(vinylFadeInterval);
          }
        }, 40);
      });

      player.addEventListener('mouseleave', () => {
        clearInterval(vinylFadeInterval);
        
        vinylFadeInterval = setInterval(() => {
          if (vinylAudio.volume > 0.05) {
            vinylAudio.volume = Math.max(0, vinylAudio.volume - 0.05);
          } else {
            vinylAudio.volume = 0;
            vinylAudio.pause();
            clearInterval(vinylFadeInterval);
          }
        }, 40);
      });
    });
  }

  // 2. Equalizer Badge Audio (Happy Birthday)
  if (eqBadge && birthdayAudio) {
    const maxEqVolume = 0.6;

    eqBadge.addEventListener('mouseenter', () => {
      clearInterval(eqFadeInterval);

      if (birthdayAudio.paused) {
        birthdayAudio.volume = 0;
        birthdayAudio.play().catch((err) => console.log('Click required first:', err));
      }

      eqFadeInterval = setInterval(() => {
        if (birthdayAudio.volume < maxEqVolume) {
          birthdayAudio.volume = Math.min(maxEqVolume, birthdayAudio.volume + 0.05);
        } else {
          clearInterval(eqFadeInterval);
        }
      }, 40);
    });

    eqBadge.addEventListener('mouseleave', () => {
      clearInterval(eqFadeInterval);

      eqFadeInterval = setInterval(() => {
        if (birthdayAudio.volume > 0.05) {
          birthdayAudio.volume = Math.max(0, birthdayAudio.volume - 0.05);
        } else {
          birthdayAudio.volume = 0;
          birthdayAudio.pause();
          clearInterval(eqFadeInterval);
        }
      }, 40);
    });
  }
});