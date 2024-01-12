export default class GameManager {
  private playing: boolean = false;
  private paused: boolean = false;

  constructor() {}

  start() {
    this.playing = true;
  }

  pause() {
    this.paused = !this.paused;
  }

  gameOver() {
    this.playing = false;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  isPaused(): boolean {
    return this.paused;
  }
}
