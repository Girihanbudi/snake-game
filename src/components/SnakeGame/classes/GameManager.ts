/** GameManager is used to manage the game's flow */
export default class GameManager {
  private playing: boolean = false;
  private paused: boolean = false;

  //** Start the game */
  start() {
    this.playing = true;
  }

  /** Pause the game */
  pause() {
    this.paused = !this.paused;
  }

  /** Finish the game */
  gameOver() {
    this.playing = false;
  }

  /** Is currently playing */
  isPlaying(): boolean {
    return this.playing;
  }

  /** Is paused */
  isPaused(): boolean {
    return this.paused;
  }
}
