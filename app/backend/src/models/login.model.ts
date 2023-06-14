import IUser from '../Interfaces/User';
import SequelizeUser from '../database/models/SequelizeUser';

export default class LoginModel {
  private model = SequelizeUser;

  findByEmail(email: string): Promise<IUser | null> {
    const user = this.model.findOne({ where: { email } });
    return user;
  }
}
