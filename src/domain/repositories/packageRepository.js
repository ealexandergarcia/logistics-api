import IPackageRepository from './IPackageRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

/**
 * Repository for managing package data.
 * 
 * This class implements the `IPackageRepository` interface and provides methods
 * for saving and retrieving package data from the database.
 * 
 * @class
 * @extends IPackageRepository
 */
class PackageRepository extends IPackageRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  /**
   * Saves a new package to the database.
   * 
   * @param {Package} pkg - The package object to save.
   * @returns {number} - The ID of the newly created package.
   */
  async save(pkg) {
    const result = await this.db.query(
      'INSERT INTO packages (weight, length, width, height, product_type) VALUES (?, ?, ?, ?, ?)',
      [pkg.weight, pkg.length, pkg.width, pkg.height, pkg.productType]
    );
    return result.insertId;
  }

  /**
   * Finds a package by its ID.
   * 
   * @param {string} packageId - The ID of the package to find.
   * @returns {Object|null} - The package data if found, otherwise null.
   */
  async findById(packageId) {
    const pkg = await this.db.query('SELECT * FROM packages WHERE id = ?', [packageId]);
    return pkg[0];
  }
}

export default new PackageRepository();