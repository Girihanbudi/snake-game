import { initialPosition } from "@/types/Position";
import Position from "@/types/Position";
import { Direction } from "../enums";
import GameObject from "@/types/GameObject";
import { CSSProperties } from "react";

/** Head of the snake */
export class Head {
  public pos: Position;
  /**
   * @param {Position} initialPos the initial pos of the head when game started
   */
  constructor(initialPos: Position) {
    this.pos = initialPos;
  }
}

/** Body of the snake */
export class Body {
  public pos: Position;
  /**
   * @param {Position} initialPos the initial pos of the body when game started
   */
  constructor(initialPos: Position) {
    this.pos = initialPos;
  }
}

/** Snake game object */
export default class Snake implements GameObject {
  public name: string;
  public style: CSSProperties;
  public pos: Position = { ...initialPosition };
  public freezed: boolean = false;

  private direction: Direction;
  private head: Head;
  private bodies: Body[] = [];
  private boundaryX: number;
  private boundaryY: number;
  readonly initialLength: number;

  /**
   * @param {string} name the name of the object name
   * @param {CSSProperties} style the snake style
   * @param {Number} boundaryX the width of our canvas
   * @param {Number} boundaryY the height of our canvas
   */
  constructor(
    name: string,
    style: CSSProperties,
    boundaryX: number,
    boundaryY: number
  ) {
    this.name = name;
    this.style = style;
    this.boundaryX = boundaryX;
    this.boundaryY = boundaryY;
    this.direction = "RIGHT";
    this.head = new Head({ ...initialPosition });
    this.initialLength = 3;
  }

  /** Init each of body location based on the head position and direction */
  initBodyLocation(): Body[] {
    let newBodies: Body[] = [];
    for (let i = this.initialLength - 1; i > 0; i--) {
      const newBodyPos = { ...this.head.pos };
      switch (this.direction) {
        case "RIGHT":
          newBodyPos.x = newBodyPos.x - i;
          break;
        case "LEFT":
          newBodyPos.x = newBodyPos.x + i;
          break;
        case "TOP":
          newBodyPos.y = newBodyPos.y - i;
          break;
        case "BOTTOM":
          newBodyPos.y = newBodyPos.y + i;
          break;
      }
      newBodies.push(new Body(newBodyPos));
    }
    return newBodies;
  }

  /** Generate position in the middle of the canvas */
  generateSpawnLocation(): Position {
    const x = Math.floor(this.boundaryX / 2) - 1;
    const y = Math.floor(this.boundaryY / 2);
    return { x, y };
  }

  /** Init head location and place each of snake body in the correct location */
  setNewSpawnLocation() {
    this.pos = this.generateSpawnLocation();
    this.head.pos = this.pos;
    this.bodies = this.initBodyLocation();
  }

  /** Change the snake direction, ignore if new direction is the opposite of current direction */
  changeMovement(newDirection: Direction) {
    if (this.freezed) {
      return;
    }

    // Ignore opposite movement
    if (
      (newDirection === "BOTTOM" && this.direction === "TOP") ||
      (newDirection === "TOP" && this.direction === "BOTTOM") ||
      (newDirection === "RIGHT" && this.direction === "LEFT") ||
      (newDirection === "LEFT" && this.direction === "RIGHT")
    ) {
      return;
    }

    this.direction = newDirection;
  }

  /** Generate next position for the head based on snake direction */
  getNextPos(): Position {
    let nextPos = { ...this.head.pos };
    switch (this.direction) {
      case "RIGHT":
        nextPos.x++;
        break;
      case "LEFT":
        nextPos.x--;
        break;
      case "TOP":
        nextPos.y--;
        break;
      case "BOTTOM":
        nextPos.y++;
        break;
    }

    return nextPos;
  }

  /**
   * Move the snake. It will shift the snake array,
   * add new body with current head position, remove the tail and replace the head position with the new one
   */
  move() {
    this.bodies = [...this.bodies.slice(1), new Body(this.head.pos)];
    this.head.pos = this.getNextPos();
  }

  /**
   * Eat the fruit. It will shift the snake array,
   * add new body with current head position and replace the head position with the new one
   */
  eat() {
    this.bodies = [...this.bodies, new Body(this.head.pos)];
    this.head.pos = this.getNextPos();
  }

  /**
   * Turn head and bodies as GameObject to update the canvas
   */
  getWholeBodiesAsGameObject(): GameObject[] {
    let bodies: GameObject[] = [];

    bodies.push({
      name: this.name,
      style: this.style,
      pos: this.head.pos,
      freezed: this.freezed,
    });
    bodies.push(
      ...this.bodies.map((body) => ({
        name: this.name,
        style: this.style,
        pos: body.pos,
        freezed: this.freezed,
      }))
    );

    return bodies;
  }

  /**
   * Check if head position match with given position.
   * This function will be used to decide to move or to eat
   */
  positionMatch({ x, y }: Position): boolean {
    return this.head.pos.x === x && this.head.pos.y === y;
  }

  /** Check whenever if snake should die */
  isDead(): boolean {
    if (
      this.bodies.find(
        (body) => body.pos.x == this.head.pos.x && body.pos.y == this.head.pos.y
      )
    )
      return true;

    if (
      this.head.pos.x < 0 ||
      this.head.pos.x > this.boundaryX - 1 ||
      this.head.pos.y < 0 ||
      this.head.pos.y > this.boundaryY - 1
    )
      return true;

    return false;
  }

  /** Set new boundary if the canvas size is change */
  setNewBoundary(width: number, height: number) {
    this.boundaryX = width;
    this.boundaryY = height;
  }

  /** Set new style for the snake */
  setNewStyle(style: CSSProperties) {
    this.style = style;
  }
}
