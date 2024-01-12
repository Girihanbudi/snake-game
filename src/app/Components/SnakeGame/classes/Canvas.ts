import { CSSProperties } from "react";
import Tile from "./Tile";
import GameObject from "../../../types/GameObject";

export const DEFAULT_CANVAS_WIDTH = 20;
export const DEFAULT_CANVAS_HEIGHT = 10;
export const DEFAULT_TILE_SIZE = 30;

/** Canvas is used to hold presentation layer */
export default class Canvas {
  private width: number;
  private height: number;
  private tileSize: number;
  private tiles: Tile[] = [];

  /**
   * @param {Number} width the number of tile horizontally or in x axis
   * @param {Number} height the number of tile vertically or in y axis
   * @param {Number} tileSize the presentation size of each tile
   * @param {CSSProperties} emptyStyle the style used to draw empty tile state
   */
  constructor(
    width: number = DEFAULT_CANVAS_WIDTH,
    height: number = DEFAULT_CANVAS_HEIGHT,
    tileSize: number = DEFAULT_TILE_SIZE,
    emptyStyle: CSSProperties
  ) {
    this.width = width;
    this.height = height;
    this.tileSize = tileSize;

    // Init tile formation based on given height and width
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.tiles.push(new Tile({ x, y }, emptyStyle));
      }
    }
  }

  /** Get canvas tile size */
  getTileSize(): number {
    return this.tileSize;
  }

  /** Return canvas width and height size */
  getCanvasSize(): { x: number; y: number } {
    return { x: this.width * this.tileSize, y: this.height * this.tileSize };
  }

  /** Return canvas width size */
  getCanvasWidth(): number {
    return this.width * this.tileSize;
  }

  /** Return canvas height size */
  getCanvasHeight(): number {
    return this.height * this.tileSize;
  }

  /** Return tiles */
  getTiles(): Tile[] {
    return this.tiles;
  }

  /**
   * Draw parsed game objects to canvas. Each game object has position and css property that will be used to draw the game object in canvas
   * @param {String} objectToDraws a list of object to draw in canvas
   */
  drawCanvas(...objectToDraws: GameObject[]) {
    // Draw each tile
    for (let i = 0; i < this.tiles.length; i++) {
      const tilePos = this.tiles[i].getPos();
      // Find game object with match tile position
      const obj = objectToDraws.find(
        (obj) => obj.pos.x === tilePos.x && obj.pos.y === tilePos.y
      );
      // Draw canvas with game object property
      if (obj) this.tiles[i].fill(obj.name, obj.style);
      // Draw an empty tile
      else this.tiles[i].remove();
    }
  }
}
