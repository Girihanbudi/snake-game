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

  generateSpawnLocation(): Position {
    const x = randomRangeInteger(0, this.boundaryX - 1);
    const y = randomRangeInteger(0, this.boundaryY - 1);
    return { x, y };
  }

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

  setLocation(pos: Position) {
    this.pos = pos;
  }

  setNewBoundary(width: number, height: number) {
    this.boundaryX = width;
    this.boundaryY = height;
  }

  setNewStyle(style: CSSProperties) {
    this.style = style;
  }
}
