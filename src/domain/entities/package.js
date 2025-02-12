/**
 * Represents a package to be shipped.
 * 
 * This class defines the structure of a package, including its weight, dimensions,
 * and product type.
 * 
 * @class
 */
class Package {
  /**
   * Creates an instance of Package.
   * 
   * @param {Object} params - The package details.
   * @param {number} params.weight - The weight of the package.
   * @param {number} params.length - The length of the package.
   * @param {number} params.width - The width of the package.
   * @param {number} params.height - The height of the package.
   * @param {string} params.productType - The type of product in the package.
   */
  constructor({ weight, length, width, height, productType }) {
    this.weight = weight;
    this.length = length;
    this.width = width;
    this.height = height;
    this.productType = productType;
  }
}

export default Package;