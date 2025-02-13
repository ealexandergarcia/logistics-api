import bcrypt from 'bcrypt';
import User from '../../domain/entities/user.js';
import IUserRepository from '../../domain/repositories/IUserRepository.js';

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User(email, hashedPassword);
    await this.userRepository.save(user);
    return user;
  }
}

export { RegisterUserUseCase };