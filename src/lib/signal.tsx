import React, { type JSX } from "react";

type Notifier = () => void;

interface Watchable {
  watch(notifier: Notifier);
  remove(notifier: Notifier): void;
}

type WatchProps = {
  signal: Watchable;
  children(): JSX.Element;
};

interface WatchState {
  update(): void;
}

export class Watch extends React.Component<WatchProps, WatchState> {
  update = () => {
    this.forceUpdate();
  };

  /** initState */
  componentDidMount() {
    this.props.signal.watch(this.update);
  }

  /** didUpdateWidget */
  componentDidUpdate(old: WatchProps, oldState: WatchState) {
    if (old.signal !== this.props.signal) {
      old.signal.remove(oldState.update);
      this.props.signal.watch(this.update);
    }
  }

  /** dispose */
  componentWillUnmount() {
    this.props.signal.remove(this.update);
  }

  render() {
    return <React.Fragment>{this.props.children()}</React.Fragment>;
  }
}

export class Signal<T> implements Watchable {
  #value: T;
  #listeners = new Set<Notifier>();

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  get value(): T {
    return this.#value;
  }

  set value(newValue: T) {
    this.#value = newValue;
  }

  update(cb: (value: T) => void) {
    cb(this.#value);
    this.notify();
  }

  set(newValue: T) {
    this.#value = newValue;
    this.notify();
  }

  notify() {
    for (const notifer of this.#listeners) {
      notifer();
    }
  }

  watch(notifier: Notifier) {
    this.#listeners.add(notifier);
  }

  remove(notifier: Notifier) {
    this.#listeners.delete(notifier);
  }

  toString() {
    return `State(${this.#value})`;
  }
}

export function marge(...watchables: Watchable[]) {
  return new MergedSignal(watchables);
}

export class MergedSignal implements Watchable {
  children: Iterable<Watchable>;
  constructor(children: Iterable<Watchable>) {
    this.children = children;
  }
  watch(notifier: Notifier) {
    for (const child of this.children) {
      child.watch(notifier);
    }
  }
  remove(notifier: Notifier) {
    for (const child of this.children) {
      child.remove(notifier);
    }
  }
}
