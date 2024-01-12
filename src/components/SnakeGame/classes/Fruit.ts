import { CSSProperties } from "react";
import GameObject from "@/types/GameObject";
import Position, { initialPosition } from "@/types/Position";
import { randomRangeInteger } from "@/utils/number";
import Snake from "./Snake";

/** Fruit game object */
export default class Fruit implements GameObject {
  public name: string;
  public style: CSSProperties;
  public pos: Position;
  public freezed: boolean = false;

  private snakeRef: Snake;
  private boundaryX: number;
  private boundaryY: number;

  /**
   * @param {string} name the name of the object name
   * @param {CSSProperties} style the snake style
   * @param {Number} boundaryX the width of our canvas
   * @param {Number} boundaryY the height of our canvas
   * @param {Snake} snakeRef the ref to the snake object
   */
  constructor(
    name: string,
    style: CSSProperties,
    boundaryX: number,
    boundaryY: number,
    snakeRef: Snake
  ) {
    this.name = name;
    this.style = style;
    this.pos = { ...initialPosition };
    this.boundaryX = boundaryX;
    this.boundaryY = boundaryY;
    this.snakeRef = snakeRef;
  }

  /** Generate new location for the fruit in the canvas range position */
  generateSpawnLocation(): Position {
    const x = randomRangeInteger(0, this.boundaryX - 1);
    const y = randomRangeInteger(0, this.boundaryY - 1);
    return { x, y };
  }

  /** Set the fruit position, keep generating new position if the position already filled by the snake */
  setNewSpawnLocation() {
    let collideObj: GameObject | undefined = undefined;

    do {
      const newPos = this.generateSpawnLocation();
      const snakeObjects = this.snakeRef.getWholeBodiesAsGameObject();
      collideObj = snakeObjects.find(
        (obj) => obj.pos.x === newPos.x && obj.pos.y === newPos.y
      );
      if (!collideObj) this.pos = this.generateSpawnLocation();
    } while (collideObj !== undefined);
  }

  /** Set the fruit location */
  setLocation(pos: Position) {
    this.pos = pos;
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
