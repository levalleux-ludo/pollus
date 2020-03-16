import { eTorusVerifier, TorusID } from './TorusID';

export class UserData {
  public torusID: TorusID = { verifier: eTorusVerifier.none, verifierId: '' };
  public account: string = '';
  public isValid() {
    return (
      this.account &&
      this.torusID &&
      this.torusID.verifier !== eTorusVerifier.none &&
      this.torusID.verifierId !== ''
    );
  }
}
