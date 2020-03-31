export enum eTorusVerifier {
  none = 'none',
  google = 'google',
  reddit = 'reddit',
  discord = 'discord',
}

export class TorusID {
  public verifier: eTorusVerifier = eTorusVerifier.none;
  public verifierId: string = '';
}
