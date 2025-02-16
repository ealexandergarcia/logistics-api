/**
 * Represents a route for transporting shipments.
 * 
 * This class defines the structure of a route, including its ID, name, start location,
 * end location, and estimated duration.
 * 
 * @class
 */
class Route {
  /**
   * Creates an instance of Route.
   * 
   * @param {string} id - The unique identifier of the route.
   * @param {string} name - The name of the route.
   * @param {string} startLocation - The starting location of the route.
   * @param {string} endLocation - The ending location of the route.
   * @param {number} estimatedDuration - The estimated duration of the route (in hours).
   */
  constructor(id, name, startLocation, endLocation, estimatedDuration) {
    this.id = id;
    this.name = name;
    this.startLocation = startLocation;
    this.endLocation = endLocation;
    this.estimatedDuration = estimatedDuration;
  }
}

export default Route;