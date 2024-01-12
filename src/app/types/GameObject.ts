import { Position } from "./Position";
import { CSSProperties } from "react";

export interface GameObject {
  name: string;
  style: CSSProperties;
  pos: Position;
  freezed: boolean;
}

export default GameObject;
