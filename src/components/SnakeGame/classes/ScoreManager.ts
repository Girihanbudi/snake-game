import Player from "@/types/Player";
import { secondAsTimer } from "@/utils/time";

export default class ScoreManager {
  private score: number;
  private startTime: number;
  private currentTime: number;
  private userName: string;
  private defaultPoints: number;

  constructor(userName: string = "", point: number = 10) {
    this.userName = userName;
    this.defaultPoints = point;
    this.score = 0;
    this.startTime = 0;
    this.currentTime = 0;
  }

  startScoring() {
    this.score = 0;
    this.startTime = Date.now();
    this.currentTime = this.startTime;
  }

  setPlayer(userName: string) {
    this.userName = userName;
    this.score = 0;
  }

  addScore(point?: number): number {
    this.score += point || this.defaultPoints;
    return this.score;
  }

  updateGameTime(): string {
    this.currentTime = Date.now();
    return this.getGameTime();
  }

  setUserName(name: string) {
    this.userName = name;
  }

  getUserName(): string {
    return this.userName;
  }

  getScore(): number {
    return this.score;
  }

  calculateGameTime(): number {
    return (this.currentTime - this.startTime) / 1000;
  }

  getGameTime(): string {
    return secondAsTimer(this.calculateGameTime());
  }

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
