import React, { type JSX } from "react";

type Notifier = () => void;
type Notified<T> = (value: T) => void;

interface Watchable {
  watch(notifier: Notifier): void;
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
  state: WatchState = {
    update: () => {
      this.forceUpdate();
    },
  }

  /** initState */
  componentDidMount() {
    this.props.signal.watch(this.state.update);
  }

  /** didUpdateWidget */
  componentDidUpdate(old: WatchProps, oldState: WatchState) {
    if (old.signal !== this.props.signal) {
      old.signal.remove(oldState.update);
      this.props.signal.watch(this.state.update);
    }
  }

  /** dispose */
  componentWillUnmount() {
    this.props.signal.remove(this.state.update);
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

  update(cb: Notified<T>) {
    cb(this.#value);
    this.notify();
  }

  set(newValue: T) {
    if (this.#value == newValue) {
      return; // optimization
    }
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

  effect(cb: Notifier) {
    return new Effect(this, cb)
  }

  toString() {
    return `Signal { value: ${this.#value}, watching: ${this.#listeners.size} }`;
  }
}

export function marge(...watchables: Watchable[]) {
  return new MergedSignal(watchables);
}

export class MergedSignal implements Watchable {
  #signals: Iterable<Watchable>;
  constructor(signals: Iterable<Watchable>) {
    this.#signals = signals;
  }
  watch(notifier: Notifier) {
    for (const signal of this.#signals) {
      signal.watch(notifier);
    }
  }
  remove(notifier: Notifier) {
    for (const signal of this.#signals) {
      signal.remove(notifier);
    }
  }

  effect(cb: Notifier) {
    return new Effect(this, cb)
  }
}

export class Effect {
  #signal: Watchable;
  #effect: Notifier;

  constructor(signal: Watchable, cb: Notifier) {
    this.#signal = signal;
    this.#effect = cb;
    this.#signal.watch(cb)
  }
  
  [Symbol.dispose]() {
    this.drop()
  }

  drop() {
    this.#signal.remove(this.#effect)
  }
}
