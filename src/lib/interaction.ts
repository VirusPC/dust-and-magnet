import { Layer } from "./render";
import * as d3 from "d3";

export type Command = (event?: Event, layer?: Layer, store?: Store) => void;

// export class Command {
//   event: string;
//   callback: Function;
//   constructor(event: string, callback: Function) {
//     this.event = event;
//     this.callback = callback;
//   }
// }

export interface Selection {
  type: string;
  query: () => SVGElement[];
}

export type Store = {
  [prop: string]: unknown;
}; //Map<string, unknown>;

export class Interactor {
  private name: string;
  private activeEvent: string;
  private frameEvent: string;
  private terminateEvent: string;

  prepareCommand: (layer?: Layer, store?: Store) => void;
  activeCommand: Command;
  frameCommand: Command;
  terminateCommand: Command;

  constructor(name: string) {
    this.name = name;
    this.activeEvent = "";
    this.frameEvent = "";
    this.terminateEvent = "";
    this.prepareCommand = () => {};
    this.activeCommand = () => {};
    this.frameCommand = () => {};
    this.terminateCommand = () => {};
  }
  // setActiveEvent(event: string): this {
  //   this.activeEvent = event;
  //   return this;
  // }
  // setFrameEvent(event: string): this {
  //   this.frameEvent = event;
  //   return this;
  // }
  // setTerminateEvent(event: string): this {
  //   this.terminateEvent = event;
  //   return this;
  // }
  // setActiveCommond(command: Command): this {
  //   this.activeCommand = command;
  //   return this;
  // };
  // setFrameCommond(command: Command): this {
  //   this.frameCommand = command;
  //   return this;
  // };
  // setTerminateCommond(command: Command): this {
  //   this.terminateCommand = command;
  //   return this;
  // };
  prepare(command: (layer: Layer, store: Store) => void): this {
    this.prepareCommand = command;
    return this;
  }
  active(event: string, command: Command = () => {}): this {
    this.activeEvent = event;
    this.activeCommand = command;
    return this;
  }
  frame(event: string, command: Command = () => {}): this {
    this.frameEvent = event;
    this.frameCommand = command;
    return this;
  }
  terminate(event: string, command: Command = () => {}): this {
    this.terminateEvent = event;
    this.terminateCommand = command;
    return this;
  }

  bindTo(layer: Layer) {
    const { name } = this;
    const { activeEvent, frameEvent, terminateEvent } = this;
    const {
      prepareCommand,
      activeCommand,
      frameCommand,
      terminateCommand,
    } = this;

    let state = State.TERMINATE;
    const store: Store = {};
    let timer: null | NodeJS.Timeout = null;
    const threshold = 1000;

    prepareCommand(layer, store);

    layer.node().on(`${activeEvent}.${name}`, function (event) {
      console.log("----ative----");
      activeCommand(event, layer, store);
      state = State.ACTIVE;
      timer = setTimeout(() => {
        state = State.TERMINATE;
      }, threshold);
    });
    layer.node().on(`${frameEvent}.${name}`, function (event) {
      if (state === State.ACTIVE || state === State.FRAME) {
        console.log("----frame----");
        clearTimeout(timer);
        frameCommand(event, layer, store);
        state = State.FRAME;
        timer = setTimeout(() => {
          state = State.TERMINATE;
        }, threshold);
      }
    });
    layer.node().on(`${terminateEvent}.${name}`, function (event) {
      if (state === State.FRAME) {
        console.log("----terminate----");
        clearTimeout(timer);
        terminateCommand(event, layer, store);
        state = State.TERMINATE;
      }
    });
  }
}

export class Tool {
  // precondition: Function;
  private selection: Selection;
  private interactors: Interactor[];

  constructor(interactors: Interactor[]) {
    this.interactors = interactors;
  }

  public getInteractors(){
    return this.interactors;
  }
}

enum State {
  ACTIVE,
  FRAME,
  TERMINATE,
}
