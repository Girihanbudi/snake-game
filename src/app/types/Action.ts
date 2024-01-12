export interface Action<T> {
  name: string;
  func: T;
}

export default Action;
