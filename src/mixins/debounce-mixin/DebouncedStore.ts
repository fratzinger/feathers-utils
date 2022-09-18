import _debounce from "lodash/debounce.js";

import type { DebouncedFunc } from "lodash";
import type { Application, Id } from "@feathersjs/feathers";

import type {
  DebouncedFunctionApp,
  DebouncedStoreOptions
} from "../../types";

export const makeDefaultOptions = (): DebouncedStoreOptions => {
  return {
    leading: false,
    maxWait: undefined,
    trailing: true,
    wait: 100
  };
};

export class DebouncedStore {
  private _app: Application;
  private _options: DebouncedStoreOptions;
  private _isRunningById: Record<string, unknown>;
  _queueById: Record<string, DebouncedFunc<((id: Id, action: DebouncedFunctionApp) => void | Promise<void>)>>;
  //_waitingById: Record<string, WaitingObject>;
  add;
  constructor(app: Application, options?: Partial<DebouncedStoreOptions>) {
    this._app = app;
    this._options = Object.assign(makeDefaultOptions(), options);
    this._queueById = {};
    this._isRunningById = {};
    //this._waitingById = {};

    this.add = this.debounceById(
      this.unbounced, 
      this._options.wait, 
      {
        leading: this._options.leading,
        maxWait: this._options.maxWait,
        trailing: this._options.trailing
      }
    );
  }

  private async unbounced(id: Id, action: DebouncedFunctionApp): Promise<void> {
    if (this._queueById[id] === undefined) {
      return;
    }
    delete this._queueById[id];
    this._isRunningById[id] = true;
    await action(this._app);
    delete this._isRunningById[id];
  }

  private debounceById(
    func: ((id: Id, action: DebouncedFunctionApp) => Promise<void>), 
    wait: number, 
    options?: Partial<DebouncedStoreOptions>
  ) {
    return (id: Id, action: ((app?: Application) => void | Promise<void>)) => {
      if (typeof this._queueById[id] === "function") {
        return this._queueById[id](id, action);
      }
      
      this._queueById[id] = _debounce((id, action) => {
        this.unbounced(id, action);
      }, wait, { ...options, leading: false }); // leading required for return promise
      return this._queueById[id](id, action);
    };
  }

  cancel(id: Id): void {
    delete this._queueById[id];
  }
}