import { TorusID } from '../users/TorusID';

export class Voter {
  constructor(private _torusId: TorusID) {}

  public get torusId() {
    return this._torusId;
  }
}
