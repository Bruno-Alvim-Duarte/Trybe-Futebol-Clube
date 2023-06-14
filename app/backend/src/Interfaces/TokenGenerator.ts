import { JwtPayload } from 'jsonwebtoken';

export default interface ITokenGenerator {
  generateToken(payload: { email: string }): string
  verifyToken(token: string): JwtPayload | string
}
