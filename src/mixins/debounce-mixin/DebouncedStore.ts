import { Application, Id } from "@feathersjs/feathers";
import _debounce from "lodash/debounce";
import { DebouncedFunc } from "lodash";

import {
  MixinDebounceFunctionApp,
  MixinDebounceOptions,
  MixinDebounceStoreOptions
} from "../../types";

export const makeDefaultOptions = (): Partial<MixinDebounceStoreOptions> => {
  return {
    leading: false,
    maxWait: undefined,
    trailing: true,
    wait: 100
  };
};

class DebouncedStore {
    private _app: Application;
    private _options: MixinDebounceStoreOptions;
    private _isRunningById: Record<string, unknown>;
    _queueById: Record<string, DebouncedFunc<((id: Id, action: MixinDebounceFunctionApp) => void | Promise<void>)>>;
    //_waitingById: Record<string, WaitingObject>;
    add;
    constructor(app: Application, options: MixinDebounceStoreOptions) {
      if (!options.idField) {
        throw new Error("'feathers-utils/DebounceStore': options.idField needs to be provided");
      }
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

    private async unbounced(id: Id, action: MixinDebounceFunctionApp): Promise<void> {
      if (this._queueById[id] === undefined) {
        return;
      }
      delete this._queueById[id];
      this._isRunningById[id] = true;
      await action(this._app);
      delete this._isRunningById[id];
    }

    private debounceById(
      func: ((id: Id, action: MixinDebounceFunctionApp) => Promise<void>), 
      wait: number, 
      options?: Partial<MixinDebounceOptions>
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

export default DebouncedStore;