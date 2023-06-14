import * as bcrypt from 'bcryptjs';
import IEncrypter from '../Interfaces/Encrypter';

export default class Encrypter implements IEncrypter {
  private crypter = bcrypt;
  encrypt(value: string): Promise<string> {
    return this.crypter.hash(value, 10);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return this.crypter.compare(value, hash);
  }
}
