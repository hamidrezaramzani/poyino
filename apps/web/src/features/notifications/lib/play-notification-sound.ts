import notificationSoundUrl from "../../../assets/notification-sound.wav";

let audio: HTMLAudioElement | null = null;

function getAudio() {
  if (!audio) {
    audio = new Audio(notificationSoundUrl);
    audio.preload = "auto";
    audio.volume = 0.55;
  }
  return audio;
}

export function playNotificationSound() {
  try {
    const instance = getAudio();
    instance.currentTime = 0;
    void instance.play().catch(() => {
      // Autoplay may be blocked until a user gesture; ignore quietly.
    });
  } catch {
    // Ignore audio failures.
  }
}
