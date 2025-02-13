import IPackageRepository from './IPackageRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';

class PackageRepository extends IPackageRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async save(pkg) {
    const result = await this.db.query(
      'INSERT INTO packages (weight, length, width, height, product_type) VALUES (?, ?, ?, ?, ?)',
      [pkg.weight, pkg.length, pkg.width, pkg.height, pkg.productType]
    );
    return result.insertId;
  }
}

export default new PackageRepository();