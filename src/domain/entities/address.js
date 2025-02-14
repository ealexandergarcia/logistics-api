class Address {
    constructor({ streetAddress, city, department, postalCode, country,details = null  }) {
      this.streetAddress = streetAddress;
      this.city = city;
      this.department = department;
      this.postalCode = postalCode;
      this.country = country;
      this.details = details;
    }
  }
  
  export default Address;