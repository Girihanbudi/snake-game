import Action from "@/types/Action";

export interface ControllerAction<T> {
  [key: string]: Action<T>;
}

/** Controller is storing map of key and the action attached to it */
export default class Controller<T> {
  private actions: ControllerAction<T> = {};

  /** Bind key code with action associated when that key are pressed */
  bindAction(action: Action<T>, ...keys: string[]) {
    keys.forEach((key) => (this.actions[key] = action));
  }

  /** Get the associated action function from the given key code */
  getActionFunc(key: string): T | undefined {
    const action = this.actions[key];
    if (action) return action.func;
    else return undefined;
  }
}
