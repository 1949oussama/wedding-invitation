// Fictional demo details. Change this date and the text in index.html for your own invitation.
const WEDDING_DATE = new Date("2027-05-24T16:00:00-07:00");

const openButton = document.getElementById("openInvitation");
const envelopeScreen = document.getElementById("envelopeScreen");
const invitation = document.getElementById("invitation");
const music = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
const musicIcon = document.getElementById("musicIcon");

openButton.addEventListener("click", async () => {
  openButton.classList.add("opened");
  // Music is attempted only after a visitor taps, as browsers block autoplay.
  try {
    await music.play();
    setMusicState(true);
  } catch {
    setMusicState(false);
  }
  window.setTimeout(() => {
    envelopeScreen.classList.add("hidden");
    invitation.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    revealObserver.observeAll?.();
  }, 850);
});

function setMusicState(isPlaying) {
  musicLabel.textContent = isPlaying ? "Music on" : "Music off";
  musicIcon.textContent = isPlaying ? "♫" : "♪";
  musicToggle.setAttribute("aria-label", isPlaying ? "Pause music" : "Play music");
}
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      setMusicState(true);
    } catch {
      setMusicState(false);
      alert("To enable music, add an MP3 file at assets/music.mp3. Use music you have permission to share.");
    }
  } else {
    music.pause();
    setMusicState(false);
  }
});

function updateCountdown() {
  const now = new Date();
  let remaining = WEDDING_DATE.getTime() - now.getTime();
  if (remaining <= 0) {
    document.getElementById("days").textContent = "♡";
    document.getElementById("hours").textContent = "♡";
    document.getElementById("minutes").textContent = "♡";
    document.getElementById("seconds").textContent = "♡";
    document.getElementById("countdownMessage").textContent = "Today is the beginning of forever!";
    return;
  }
  const days = Math.floor(remaining / 86400000); remaining %= 86400000;
  const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
  const minutes = Math.floor(remaining / 60000); remaining %= 60000;
  const seconds = Math.floor(remaining / 1000);
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// Smoothly reveal sections as they scroll into view.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Gallery lightbox.
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
document.querySelectorAll(".gallery-image").forEach(button => {
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.full;
    lightboxImage.alt = button.querySelector("img").alt;
    lightbox.showModal();
  });
});
document.getElementById("closeLightbox").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", event => {
  if (event.target === lightbox) lightbox.close();
});

// Front-end demo only: shows a confirmation, but does not send/store RSVP responses.
document.getElementById("rsvpForm").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const thanks = document.getElementById("rsvpThanks");
  thanks.hidden = false;
  thanks.textContent = `Thank you, ${name}! Your demo response is “${attendance}.” .`;
  document.getElementById("rsvpForm").reset();
});
