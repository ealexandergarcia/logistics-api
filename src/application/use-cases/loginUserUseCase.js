import bcrypt from 'bcrypt';
import JwtService from '../../infrastructure/http/middlewares/jwtService.js';
import UserRepository from '../../domain/repositories/userRepository.js';

class LoginUserUseCase {
  async execute({ email, password }) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    const token = JwtService.generateToken({ userId: user.id, role: user.role });
    return token;
  }
}

export { LoginUserUseCase };