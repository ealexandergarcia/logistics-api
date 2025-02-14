class Carrier {
    constructor(id, name, vehicleType, capacity, status) {
      this.id = id;
      this.name = name;
      this.vehicleType = vehicleType;
      this.capacity = capacity;
      this.status = status;
    }
  
    isAvailable() {
      return this.status === 'AVAILABLE';
    }
  }
  
  export default Carrier;