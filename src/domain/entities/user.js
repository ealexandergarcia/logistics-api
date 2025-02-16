/**
 * Represents a user in the system.
 * 
 * This class defines the structure of a user, including their email and password.
 * 
 * @class
 */
class User {
  /**
   * Creates an instance of User.
   * 
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   */
  constructor(email, password) {
    this.email = email;
    this.password = password;
  }
}

export default User;