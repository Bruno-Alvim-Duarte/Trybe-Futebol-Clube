import Encrypter from '../utils/Encrypter';
import LoginModel from '../models/login.model';
import IUser from '../Interfaces/User';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import TokenGenerator from '../utils/TokenGenerator';

export default class LoginService {
  private encrypter = new Encrypter();
  private tokenGenerator = new TokenGenerator();

  constructor(
    private loginModel = new LoginModel(),
  ) {}

  async login(email: string, password: string): Promise<ServiceResponse<{ token: string }>> {
    const user: IUser | null = await this.loginModel.findByEmail(email);
    console.log(user);
    console.log(password);
    if (!user) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }
    const isPasswordValid = await this.encrypter.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return { status: 'UNAUTHORIZED', data: { message: 'Invalid email or password' } };
    }
    return { status: 'SUCCESSFUL',
      data: { token: this.tokenGenerator.generateToken({ email, role: user.role }) } };
  }
}
