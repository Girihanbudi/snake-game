import Player from "@/types/Player";
import { secondAsTimer } from "@/utils/time";

/** ScoreManager is used to manage user score */
export default class ScoreManager {
  private score: number;
  private startTime: number;
  private currentTime: number;
  private userName: string;
  private defaultPoints: number;

  /**
   * @param {string} userName the user name
   * @param {Number} point the point every time snake eat the fruit
   */
  constructor(userName: string = "", point: number = 10) {
    this.userName = userName;
    this.defaultPoints = point;
    this.score = 0;
    this.startTime = 0;
    this.currentTime = 0;
  }

  /** Start scoring. This will be used when the game started */
  startScoring() {
    this.score = 0;
    this.startTime = Date.now();
    this.currentTime = this.startTime;
  }

  /** Set the player name */
  setPlayer(userName: string) {
    this.userName = userName;
    this.score = 0;
  }

  /** Add score. This will be used every time snake each the fruit */
  addScore(point?: number): number {
    this.score += point || this.defaultPoints;
    return this.score;
  }

  /** Update the current time and return formatted time */
  updateGameTime(): string {
    this.currentTime = Date.now();
    return this.getGameTime();
  }

  /** Set the player name */
  setUserName(name: string) {
    this.userName = name;
  }

  /** Get the player name */
  getUserName(): string {
    return this.userName;
  }

  /** Get the score */
  getScore(): number {
    return this.score;
  }

  /** Calculating game time in seconds, how long the game has been started */
  calculateGameTime(): number {
    return (this.currentTime - this.startTime) / 1000;
  }

  /** Get the formatted time */
  getGameTime(): string {
    return secondAsTimer(this.calculateGameTime());
  }

  /** Submit score to leaderboard API */
  submitScore(player: string) {
    if (this.score > 0) {
      const newPlayerScore: Player = {
        name: player,
        time: this.calculateGameTime(),
        score: this.score,
      };
      fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPlayerScore),
      });
    }
  }
}
