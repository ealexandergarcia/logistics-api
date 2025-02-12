/**
 * Represents a physical address.
 * 
 * This class defines the structure of an address, including street, city, department,
 * postal code, country, and optional details.
 * 
 * @class
 */
class Address {
  /**
   * Creates an instance of Address.
   * 
   * @param {Object} params - The address details.
   * @param {string} params.streetAddress - The street address.
   * @param {string} params.city - The city.
   * @param {string} params.department - The department or state.
   * @param {string} params.postalCode - The postal code.
   * @param {string} params.country - The country.
   * @param {string} [params.details=null] - Additional address details (optional).
   */
  constructor({ streetAddress, city, department, postalCode, country, details = null }) {
    this.streetAddress = streetAddress;
    this.city = city;
    this.department = department;
    this.postalCode = postalCode;
    this.country = country;
    this.details = details;
  }
}

export default Address;