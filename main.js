/* ==========================================================================
   PREMIUM CINEMATIC DIGITAL WEDDING INVITATION - LOGIC & ANIMATION ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Element References
  const posterImg = document.getElementById('doorPoster');
  const video = document.getElementById('doorVideo');
  const videoSource = document.getElementById('videoSource');
  const staticCanvas = document.getElementById('staticFrameCanvas');
  const canvasCtx = staticCanvas.getContext('2d');
  
  const tapOverlay = document.getElementById('tapOverlay');
  const invitationOverlay = document.getElementById('invitationOverlay');
  
  // Controls & Modals
  const doorSelectBtn = document.getElementById('doorSelectBtn');
  const editDetailsBtn = document.getElementById('editDetailsBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIconOn = document.getElementById('audioIconOn');
  const audioIconOff = document.getElementById('audioIconOff');
  const replayBtn = document.getElementById('replayBtn');
  
  // Modals
  const doorModal = document.getElementById('doorModal');
  const closeDoorModal = document.getElementById('closeDoorModal');
  const editorModal = document.getElementById('editorModal');
  const closeEditorModal = document.getElementById('closeEditorModal');
  const mapModal = document.getElementById('mapModal');
  const openMapBtn = document.getElementById('openMapBtn');
  const closeMapModal = document.getElementById('closeMapModal');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');
  
  // Forms & Inputs
  const editorForm = document.getElementById('editorForm');

  // Application State
  let currentDoorId = 'palace';
  let isAudioMuted = false;
  let isPlaying = false;
  let hasOpened = false;
  let audioCtx = null;

  // --- Audio Context Helper ---
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // --- 3D Depth Floating Sky Lanterns Engine ---
  function initFloatingLanterns() {
    const container = document.getElementById('lanternsContainer');
    if (!container) return;

    container.innerHTML = '';
    const lanternCount = 22;
    const depthTiers = ['depth-far', 'depth-far', 'depth-mid', 'depth-mid', 'depth-near'];

    for (let i = 0; i < lanternCount; i++) {
      const lantern = document.createElement('div');
      const depthClass = depthTiers[Math.floor(Math.random() * depthTiers.length)];
      lantern.className = `lantern-item ${depthClass}`;

      const leftPos = (Math.random() * 92 + 4).toFixed(1);
      const duration = (Math.random() * 14 + 14).toFixed(1);
      const delay = (Math.random() * 20).toFixed(1);
      const swayX = (Math.random() * 24 + 10).toFixed(0);
      const rotDeg = (Math.random() * 6 - 3).toFixed(1);

      lantern.style.left = `${leftPos}%`;
      lantern.style.animationDuration = `${duration}s`;
      lantern.style.animationDelay = `${delay}s`;
      lantern.style.setProperty('--sway-x', `${swayX}px`);
      lantern.style.setProperty('--rot-deg', `${rotDeg}deg`);

      lantern.innerHTML = `
        <div class="lantern-paper">
          <div class="lantern-core-flame"></div>
        </div>
        <div class="lantern-tassel"></div>
      `;

      container.appendChild(lantern);
    }
  }

  // Initialize floating sky lanterns
  initFloatingLanterns();

  // --- Capture Final Video Frame onto Canvas for 100% Static Hold ---
  function freezeFinalFrame() {
    if (video.videoWidth && video.videoHeight) {
      staticCanvas.width = video.videoWidth;
      staticCanvas.height = video.videoHeight;
      canvasCtx.drawImage(video, 0, 0, staticCanvas.width, staticCanvas.height);
      
      staticCanvas.classList.add('active');
      video.pause();
    }
  }

  // --- Helper: Reveal Invitation Content ---
  function revealInvitationContent() {
    freezeFinalFrame();
    hasOpened = true;
    isPlaying = false;

    // Reveal invitation text overlay smoothly over static final door frame
    invitationOverlay.classList.remove('hidden');
    void invitationOverlay.offsetWidth;
    invitationOverlay.classList.add('revealed');

    // Reveal floating sky lanterns DELAYED: after the content/text appears
    setTimeout(() => {
      const lanternsContainer = document.getElementById('lanternsContainer');
      if (lanternsContainer) lanternsContainer.classList.add('revealed');
    }, 1200);

    // Initialize HTML5 Scratch Canvas once overlay is visible
    setTimeout(() => {
      initScratchCanvas();
    }, 150);
  }

  // --- HTML5 Scratch Card Engine ---
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchHint = document.getElementById('scratchHint');
  const quickRevealBtn = document.getElementById('quickRevealBtn');
  let scratchCtx = null;
  let isScratching = false;
  let hasScratchedCleared = false;
  let dragCount = 0;

  function initScratchCanvas() {
    if (!scratchCanvas) return;
    scratchCtx = scratchCanvas.getContext('2d');
    
    const container = document.getElementById('scratchContainer');
    if (!container) return;
    
    scratchCanvas.width = container.offsetWidth || 320;
    scratchCanvas.height = container.offsetHeight || 120;
    
    // Render Metallic Gold Foil Gradient
    const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#E5C158');
    grad.addColorStop(0.35, '#FFF4D0');
    grad.addColorStop(0.7, '#D4A338');
    grad.addColorStop(1, '#A67C1E');
    
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);
    
    // Add shimmering gold foil texture speckles
    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 160; i++) {
      const x = Math.random() * scratchCanvas.width;
      const y = Math.random() * scratchCanvas.height;
      const r = Math.random() * 2 + 0.5;
      scratchCtx.beginPath();
      scratchCtx.arc(x, y, r, 0, Math.PI * 2);
      scratchCtx.fill();
    }
    
    // Add prompt text on foil
    scratchCtx.font = '600 12px Cormorant Garamond, serif';
    scratchCtx.fillStyle = 'rgba(10, 10, 15, 0.75)';
    scratchCtx.textAlign = 'center';
    scratchCtx.fillText('✦ SCRATCH TO UNLOCK DATE ✦', scratchCanvas.width / 2, scratchCanvas.height / 2 + 4);
  }

  function scratchAt(x, y) {
    if (!scratchCtx || hasScratchedCleared) return;
    
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
    scratchCtx.fill();
    
    dragCount++;
    if (dragCount % 10 === 0) {
      checkScratchPercentage();
    }
  }

  function getScratchCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    let clientX = e.clientX;
    let clientY = e.clientY;
    
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function checkScratchPercentage() {
    if (hasScratchedCleared || !scratchCtx) return;
    
    const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    
    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }
    
    const totalSampled = pixels.length / 16;
    const ratio = transparentCount / totalSampled;
    
    if (ratio > 0.35) {
      revealDateFully();
    }
  }

  function revealDateFully() {
    if (hasScratchedCleared) return;
    hasScratchedCleared = true;
    
    if (scratchCanvas) scratchCanvas.classList.add('fade-out');
    if (scratchHint) scratchHint.style.opacity = '0';
    if (quickRevealBtn) quickRevealBtn.style.display = 'none';
    
    triggerConfetti();
  }

  if (scratchCanvas) {
    ['mousedown', 'touchstart'].forEach(evt => {
      scratchCanvas.addEventListener(evt, (e) => {
        isScratching = true;
        const coords = getScratchCoords(e);
        scratchAt(coords.x, coords.y);
      }, { passive: true });
    });

    ['mousemove', 'touchmove'].forEach(evt => {
      scratchCanvas.addEventListener(evt, (e) => {
        if (!isScratching) return;
        const coords = getScratchCoords(e);
        scratchAt(coords.x, coords.y);
      }, { passive: true });
    });

    ['mouseup', 'mouseleave', 'touchend'].forEach(evt => {
      scratchCanvas.addEventListener(evt, () => {
        isScratching = false;
      });
    });
  }

  if (quickRevealBtn) {
    quickRevealBtn.addEventListener('click', revealDateFully);
  }

  // --- Gold Confetti Particle Celebration Engine ---
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function triggerConfetti() {
    if (!confettiCanvas) return;
    confettiCtx = confettiCanvas.getContext('2d');
    
    const container = document.getElementById('invitationOverlay');
    confettiCanvas.width = container ? container.offsetWidth : window.innerWidth;
    confettiCanvas.height = container ? container.offsetHeight : window.innerHeight;
    
    const colors = ['#FFF4D0', '#E5C158', '#D4A338', '#FFFFFF', '#F5D77F'];
    confettiParticles = [];
    
    for (let i = 0; i < 70; i++) {
      confettiParticles.push({
        x: confettiCanvas.width / 2 + (Math.random() * 60 - 30),
        y: confettiCanvas.height * 0.35,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() * -10) - 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }
    
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    let activeParticles = 0;
    
    confettiParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;
      
      if (p.opacity > 0) {
        activeParticles++;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate((p.rotation * Math.PI) / 180);
        confettiCtx.globalAlpha = Math.max(0, p.opacity);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        confettiCtx.restore();
      }
    });
    
    if (activeParticles > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // --- Live Countdown Timer Engine ---
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMins = document.getElementById('cdMins');
  const cdSecs = document.getElementById('cdSecs');
  
  const targetWeddingDate = new Date('January 27, 2027 10:00:00').getTime();

  function updateCountdown() {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    
    const now = new Date().getTime();
    const distance = targetWeddingDate - now;
    
    if (distance < 0) {
      cdDays.innerText = '00';
      cdHours.innerText = '00';
      cdMins.innerText = '00';
      cdSecs.innerText = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    cdDays.innerText = days < 10 ? '0' + days : days;
    cdHours.innerText = hours < 10 ? '0' + hours : hours;
    cdMins.innerText = minutes < 10 ? '0' + minutes : minutes;
    cdSecs.innerText = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- 3D Card Parallax & Tilt Engine ---
  const tiltCards = document.querySelectorAll('.tilt-card');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- Door Opening Handler ---
  function openDoorInvitation() {
    if (isPlaying || hasOpened) return;
    
    isPlaying = true;
    initAudioContext();

    // Trigger YouTube background music (pre-warmed player unmutes instantly;
    // falls back to creating the player on first tap for slow networks)
    playYouTubeBackgroundMusic(getDefaultSongUrl(), true, false);

    // 1. Hide tap callout overlay
    tapOverlay.classList.add('fade-out');
    
    // 2. Hide poster image & clear static canvas
    posterImg.classList.add('fade-out');
    staticCanvas.classList.remove('active');
    
    // 3. Reset video playback to 0 and play continuous single-motion video
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Video playing smoothly to the end
      }).catch(err => {
        console.warn('Video auto-play error fallback:', err);
        // Fallback only if browser blocked video playback entirely
        revealInvitationContent();
      });
    }
  }

  // Forward desktop wheel scrolling to content-scrollable container once revealed
  const contentScrollable = document.getElementById('contentScrollable');
  window.addEventListener('wheel', (e) => {
    if (hasOpened && contentScrollable) {
      contentScrollable.scrollTop += e.deltaY;
    }
  }, { passive: true });

  // --- Video Event Listeners (Dynamic for any video duration) ---
  video.addEventListener('timeupdate', () => {
    const duration = (isFinite(video.duration) && video.duration > 0) ? video.duration : 6.0;

    // Trigger fade-in reveal at end of video playback (0.6s before finish or upon end)
    const revealTime = Math.max(1.0, duration - 0.6);
    if (!hasOpened && (video.currentTime >= revealTime || video.ended)) {
      revealInvitationContent();
    }
  });

  video.addEventListener('ended', () => {
    freezeFinalFrame();
    if (!hasOpened) {
      revealInvitationContent();
    }
  });

  // --- Reset & Replay ---
  function resetDoorState() {
    isPlaying = false;
    hasOpened = false;
    
    video.pause();
    video.currentTime = 0;
    
    staticCanvas.classList.remove('active');
    invitationOverlay.classList.remove('revealed');
    
    const lanternsContainer = document.getElementById('lanternsContainer');
    if (lanternsContainer) lanternsContainer.classList.remove('revealed');

    setTimeout(() => {
      invitationOverlay.classList.add('hidden');
      posterImg.classList.remove('fade-out');
      tapOverlay.classList.remove('fade-out');
    }, 400);
  }

  // --- Custom Door Video Engine ---
  const customVideoInput = document.getElementById('customVideoInput');
  const browseVideoBtn = document.getElementById('browseVideoBtn');
  const editorBrowseVideoBtn = document.getElementById('editorBrowseVideoBtn');
  const customVideoStatus = document.getElementById('customVideoStatus');
  const customVideoFileName = document.getElementById('customVideoFileName');
  const removeCustomVideoBtn = document.getElementById('removeCustomVideoBtn');
  const inputDoorVideoUrl = document.getElementById('inputDoorVideoUrl');

  function loadCustomDoorVideo(videoSrc, displayName = 'Custom Video') {
    currentDoorId = 'custom';
    resetDoorState();

    videoSource.src = videoSrc;
    video.src = videoSrc;
    video.load();

    // Auto-generate poster image from first frame of custom video
    const onLoadedMetadata = () => {
      video.currentTime = 0.1;
    };
    const onSeeked = () => {
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = video.videoWidth || 720;
        offCanvas.height = video.videoHeight || 1280;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(video, 0, 0, offCanvas.width, offCanvas.height);
        posterImg.src = offCanvas.toDataURL('image/jpeg', 0.9);
        posterImg.classList.remove('fade-out');
      } catch (err) {
        console.warn('Canvas poster capture fallback:', err);
      }
      video.currentTime = 0;
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
    video.addEventListener('seeked', onSeeked, { once: true });

    // Update UI status badges
    if (customVideoStatus && customVideoFileName) {
      customVideoFileName.innerText = displayName;
      customVideoStatus.classList.remove('hidden');
    }
    if (inputDoorVideoUrl) {
      inputDoorVideoUrl.value = (typeof videoSrc === 'string' && !videoSrc.startsWith('blob:')) ? videoSrc : displayName;
    }

    // Deselect preset door cards
    document.querySelectorAll('.door-option-card').forEach(c => c.classList.remove('active'));

    // Close modal gently
    if (doorModal) {
      setTimeout(() => doorModal.classList.add('hidden'), 400);
    }
  }

  if (browseVideoBtn && customVideoInput) {
    browseVideoBtn.addEventListener('click', () => customVideoInput.click());
  }

  if (editorBrowseVideoBtn && customVideoInput) {
    editorBrowseVideoBtn.addEventListener('click', () => customVideoInput.click());
  }

  if (customVideoInput) {
    customVideoInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const blobUrl = URL.createObjectURL(file);
        loadCustomDoorVideo(blobUrl, file.name);
      }
    });
  }

  if (removeCustomVideoBtn) {
    removeCustomVideoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (customVideoStatus) customVideoStatus.classList.add('hidden');
      if (customVideoInput) customVideoInput.value = '';
      if (inputDoorVideoUrl) inputDoorVideoUrl.value = '';
      switchDoorStyle('palace');
    });
  }

  // --- Door Selector Logic ---
  function switchDoorStyle(doorId) {
    if (currentDoorId === doorId && currentDoorId !== 'custom') return;
    
    currentDoorId = doorId;
    resetDoorState();

    if (customVideoStatus) customVideoStatus.classList.add('hidden');
    if (inputDoorVideoUrl) inputDoorVideoUrl.value = '';

    // Update Poster & Video source
    let posterPath = '';
    let videoPath = '';

    if (doorId === 'palace') {
      posterPath = '/assets/doors/palace_poster.webp';
      videoPath = '/assets/doors/custom.mp4';
    } else {
      posterPath = `/assets/doors/${doorId}.avif`;
      videoPath = `/assets/doors/${doorId}.mp4`;
    }

    posterImg.onerror = () => {
      if (!posterImg.src.endsWith('.webp') && doorId !== 'palace') {
        posterImg.src = `/assets/doors/${doorId}.webp`;
      }
    };
    posterImg.src = posterPath;
    videoSource.src = videoPath;
    video.src = videoPath;
    video.load();

    // Update active highlight in modal
    document.querySelectorAll('.door-option-card').forEach(card => {
      card.classList.toggle('active', card.dataset.door === doorId);
    });

    doorModal.classList.add('hidden');
  }

  // Event Listener for Tap Overlay
  tapOverlay.addEventListener('click', openDoorInvitation);
  replayBtn.addEventListener('click', resetDoorState);

  // --- Door Modal Controls ---
  if (doorSelectBtn) doorSelectBtn.addEventListener('click', () => doorModal && doorModal.classList.remove('hidden'));
  if (closeDoorModal) closeDoorModal.addEventListener('click', () => doorModal && doorModal.classList.add('hidden'));
  
  document.querySelectorAll('.door-option-card').forEach(card => {
    card.addEventListener('click', () => {
      switchDoorStyle(card.dataset.door);
    });
  });

  // --- Details Editor Controls ---
  if (editDetailsBtn) editDetailsBtn.addEventListener('click', () => editorModal && editorModal.classList.remove('hidden'));
  if (closeEditorModal) closeEditorModal.addEventListener('click', () => editorModal && editorModal.classList.add('hidden'));

  if (editorForm) editorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check if custom door video was entered
    const doorUrlInput = document.getElementById('inputDoorVideoUrl');
    if (doorUrlInput && doorUrlInput.value && doorUrlInput.value.trim() && !doorUrlInput.value.startsWith('blob:')) {
      const customUrl = doorUrlInput.value.trim();
      if (videoSource.src !== customUrl) {
        loadCustomDoorVideo(customUrl, customUrl.split('/').pop() || 'Custom Video');
      }
    }
    
    const groomVal = document.getElementById('inputGroom') ? document.getElementById('inputGroom').value : 'Sainath';
    const brideVal = document.getElementById('inputBride') ? document.getElementById('inputBride').value : 'Nidhi';
    
    if (document.getElementById('displayGroom')) document.getElementById('displayGroom').innerText = groomVal;
    if (document.getElementById('displayBride')) document.getElementById('displayBride').innerText = brideVal;
    if (document.getElementById('displayBismillah')) document.getElementById('displayBismillah').innerHTML = document.getElementById('inputBismillah').value;
    if (document.getElementById('displayGreeting')) document.getElementById('displayGreeting').innerText = document.getElementById('inputGreeting').value;
    if (document.getElementById('displayDateNum')) document.getElementById('displayDateNum').innerText = document.getElementById('inputDateNum').value;
    if (document.getElementById('displayMonth')) document.getElementById('displayMonth').innerText = document.getElementById('inputMonth').value;
    if (document.getElementById('displayYear')) document.getElementById('displayYear').innerText = document.getElementById('inputYear').value;
    if (document.getElementById('displayDay')) document.getElementById('displayDay').innerText = document.getElementById('inputDay').value;
    const saveTheDateInput = document.getElementById('inputSaveTheDate');
    if (saveTheDateInput && document.querySelector('.date-save-the-date')) {
      document.querySelector('.date-save-the-date').innerText = saveTheDateInput.value;
    }
    if (document.getElementById('displayVenue')) document.getElementById('displayVenue').innerText = document.getElementById('inputVenue').value;
    if (document.getElementById('displayLocation')) document.getElementById('displayLocation').innerText = document.getElementById('inputLocation').value;

    // Update Map Modal text as well
    if (document.getElementById('mapVenueTitle')) document.getElementById('mapVenueTitle').innerText = document.getElementById('inputVenue').value;
    if (document.getElementById('mapVenueAddress')) document.getElementById('mapVenueAddress').innerText = document.getElementById('inputLocation').value;

    // Load YouTube Background Music if URL provided
    const ytUrlInput = document.getElementById('inputYoutubeUrl');
    if (ytUrlInput && ytUrlInput.value) {
      playYouTubeBackgroundMusic(ytUrlInput.value, true);
    }

    editorModal.classList.add('hidden');
  });

  // --- YouTube Background Music Player Engine (pre-warmed to remove tap delay) ---
  let currentYoutubeVideoId = '';
  let ytPlayerIframe = null;
  let ytWarmedUpId = '';

  function getDefaultSongUrl() {
    const ytUrlInput = document.getElementById('inputYoutubeUrl');
    return (ytUrlInput && ytUrlInput.value && ytUrlInput.value.trim())
      ? ytUrlInput.value.trim()
      : 'https://youtu.be/e1FFMfdh57w?si=Czb-xkfKOu-amjOf';
  }

  function extractYouTubeId(url) {
    if (!url) return '';
    url = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    if (url.length === 11) return url;
    return '';
  }

  function sendYouTubeCommand(func) {
    if (!ytPlayerIframe || !ytPlayerIframe.contentWindow) return;
    try {
      ytPlayerIframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func,
        args: []
      }), '*');
    } catch (e) {
      console.warn('YouTube audio command postMessage exception:', e);
    }
  }

  function playYouTubeBackgroundMusic(url, autoPlay = true, forceMute = false) {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    // Reuse already-loaded iframe when the song is unchanged: avoids
    // recreating the player on tap, which caused the audible delay.
    if (videoId === currentYoutubeVideoId && ytPlayerIframe) {
      if (autoPlay) sendYouTubeCommand('playVideo');
      if (forceMute || isAudioMuted) {
        sendYouTubeCommand('mute');
      } else {
        sendYouTubeCommand('unMute');
      }
      return;
    }

    currentYoutubeVideoId = videoId;
    const container = document.getElementById('youtubePlayerContainer');
    if (!container) return;

    const mute = (forceMute || isAudioMuted) ? 1 : 0;
    const playParam = autoPlay ? 1 : 0;
    container.innerHTML = `<iframe id="ytIframe" width="200" height="200"
      src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${playParam}&loop=1&playlist=${videoId}&controls=0&mute=${mute}&rel=0&playsinline=1"
      frameborder="0" allow="autoplay; encrypted-media"></iframe>`;

    ytPlayerIframe = document.getElementById('ytIframe');
    if (videoId === ytWarmedUpId) {
      // Warmed-up player replaced (e.g. URL changed) — nothing extra needed.
    }
  }

  // Pre-warm the YouTube player during idle time so tapping the door
  // unmutes an already-buffering player instead of creating one from scratch.
  function warmUpYouTubePlayer() {
    if (ytWarmedUpId) return;
    const songUrl = getDefaultSongUrl();
    const videoId = extractYouTubeId(songUrl);
    if (!videoId) return;
    ytWarmedUpId = videoId;
    // Muted autoplay is allowed by browsers; the tap handler unmutes it.
    playYouTubeBackgroundMusic(songUrl, true, true);
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(warmUpYouTubePlayer, { timeout: 2500 });
  } else {
    setTimeout(warmUpYouTubePlayer, 1500);
  }

  // --- Audio Mute Toggle ---
  audioToggleBtn.addEventListener('click', () => {
    isAudioMuted = !isAudioMuted;
    video.muted = isAudioMuted;

    sendYouTubeCommand(isAudioMuted ? 'mute' : 'unMute');

    if (isAudioMuted) {
      audioIconOn.classList.add('hidden');
      audioIconOff.classList.remove('hidden');
    } else {
      audioIconOn.classList.remove('hidden');
      audioIconOff.classList.add('hidden');
      initAudioContext();
    }
  });

  // --- Map Modal Controls ---
  if (openMapBtn) {
    openMapBtn.addEventListener('click', () => mapModal.classList.remove('hidden'));
  }
  if (closeMapModal) {
    closeMapModal.addEventListener('click', () => mapModal.classList.add('hidden'));
  }

  // Close modals when clicking backdrop
  [doorModal, editorModal, mapModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  });

  // --- Add to Google Calendar ---
  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', () => {
      const groom = document.getElementById('displayGroom') ? document.getElementById('displayGroom').innerText : 'Sainath';
      const bride = document.getElementById('displayBride') ? document.getElementById('displayBride').innerText : 'Nidhi';
      const venue = document.getElementById('displayVenue') ? document.getElementById('displayVenue').innerText : 'Regal Banquet Hall';
      const location = document.getElementById('displayLocation') ? document.getElementById('displayLocation').innerText : 'Goregaon Sports Club, Mumbai';

      const title = encodeURIComponent(`Wedding of ${bride} & ${groom}`);
      const details = encodeURIComponent(`We request your blessings and presence as our children embark on the sacred journey of Saptapadi. Wedding celebration of ${bride} & ${groom} at ${venue}, ${location}.`);
      const loc = encodeURIComponent(`${venue}, ${location}`);

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${loc}&dates=20270127T043000Z/20270127T183000Z`;

      window.open(googleCalendarUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ==========================================================================
  // HIGH-PERFORMANCE IDLE PREFETCH ENGINE & SERVICE WORKER
  // ==========================================================================
  
  // Register Service Worker for 0ms Repeat-Visit Loading
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('Service Worker registration skipped:', err);
      });
    });
  }

  // Prefetch secondary doors & videos in background during idle time
  function prefetchSecondaryAssets() {
    const doorIds = ['1', '2', '3', '4', '6'];
    const prefetch = () => {
      doorIds.forEach(id => {
        // Prefetch AVIF/WebP image
        const img = new Image();
        img.src = `/assets/doors/${id}.avif`;

        // Prefetch MP4 video
        const vid = document.createElement('video');
        vid.preload = 'auto';
        vid.src = `/assets/doors/${id}.mp4`;
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetch, { timeout: 3000 });
    } else {
      setTimeout(prefetch, 2000);
    }
  }

  // --- Constant Floating Order Bar Minimization / Expansion Logic ---
  const floatingOrderBar = document.getElementById('floatingOrderBar');
  const floatingWidgetClose = document.getElementById('floatingWidgetClose');
  const floatingWidgetTrigger = document.getElementById('floatingWidgetTrigger');

  if (floatingOrderBar && floatingWidgetClose && floatingWidgetTrigger) {
    floatingWidgetClose.addEventListener('click', (e) => {
      e.stopPropagation();
      floatingOrderBar.classList.add('collapsed');
      setTimeout(() => {
        floatingOrderBar.classList.add('hidden');
        floatingWidgetTrigger.classList.remove('hidden');
      }, 300);
    });

    floatingWidgetTrigger.addEventListener('click', () => {
      floatingWidgetTrigger.classList.add('hidden');
      floatingOrderBar.classList.remove('hidden');
      void floatingOrderBar.offsetWidth; // Force reflow
      floatingOrderBar.classList.remove('collapsed');
    });
  }

  prefetchSecondaryAssets();
});

