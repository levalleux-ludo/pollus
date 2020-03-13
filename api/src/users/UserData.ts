import { eTorusVerifier, TorusID } from './TorusID';

export class UserData {
  public torusID: TorusID = { verifier: eTorusVerifier.none, verifierId: '' };
  public account: string = '';
}
