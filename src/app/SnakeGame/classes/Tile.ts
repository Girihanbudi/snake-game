import { CSSProperties } from "react";
import { Position } from "../../types/Position";

/** Tile is an individual tile that form a canvas */
export default class Tile {
  private empty: boolean;
  private objectName?: string;
  private pos: Position;
  private currentStyle: CSSProperties;
  private emptyStyle: CSSProperties;

  /**
   * @param {[type]} pos the position of the tile in canvas
   * @param {[type]} emptyStyle the style used to draw empty tile state
   * @param {[type]} filled the number of tile vertically or in y axis
   * @param {[type]} initialStyle the style used to draw initial tile state
   * @param {[type]} objectName the object name that filling in this tile
   */
  constructor(
    pos: Position,
    emptyStyle: CSSProperties,
    filled: boolean = false,
    initialStyle?: CSSProperties,
    objectName?: string
  ) {
    this.empty = filled;
    this.pos = pos;
    this.objectName = objectName;
    this.emptyStyle = emptyStyle;
    this.currentStyle = initialStyle || emptyStyle;
  }

  /** Checking if tile is empty */
  isEmpty() {
    return this.empty;
  }

  /** Get current tile position */
  getPos() {
    return this.pos;
  }

  /** Get current tile style */
  getStyle() {
    return this.currentStyle;
  }

  /** Get current tile object name */
  getObjectName() {
    return this.objectName;
  }

  /**
   * Fill tile with object
   * @param {String} objectName an object name to fill
   * @param {String} style an object style to fill
   */
  fill(objectName: string, style: CSSProperties) {
    this.empty = false;
    this.objectName = objectName;
    this.currentStyle = style;
  }

  /** Remove object from current tile and set as empty */
  remove() {
    this.empty = true;
    this.objectName = undefined;
    this.currentStyle = this.emptyStyle;
  }
}
