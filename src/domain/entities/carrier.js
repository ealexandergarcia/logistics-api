/**
 * Represents a carrier responsible for transporting shipments.
 * 
 * This class defines the structure of a carrier, including its ID, name, vehicle type,
 * capacity, and status. It also provides a method to check if the carrier is available.
 * 
 * @class
 */
class Carrier {
  /**
   * Creates an instance of Carrier.
   * 
   * @param {string} id - The unique identifier of the carrier.
   * @param {string} name - The name of the carrier.
   * @param {string} vehicleType - The type of vehicle used by the carrier.
   * @param {number} capacity - The maximum weight capacity of the carrier's vehicle.
   * @param {string} status - The current status of the carrier (e.g., 'AVAILABLE').
   */
  constructor(id, name, vehicleType, capacity, status) {
    this.id = id;
    this.name = name;
    this.vehicleType = vehicleType;
    this.capacity = capacity;
    this.status = status;
  }

  /**
   * Checks if the carrier is available for transporting shipments.
   * 
   * @returns {boolean} - True if the carrier is available, otherwise false.
   */
  isAvailable() {
    return this.status === 'AVAILABLE';
  }
}

export default Carrier;