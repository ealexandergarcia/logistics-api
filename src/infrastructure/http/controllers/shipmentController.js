import { assignShipmentUseCase } from '../../../application/use-cases/assignShipmentUseCase.js';
import PackageRepository from '../../../domain/repositories/packageRepository.js';
import ShipmentRepository from '../../../domain/repositories/shipmentRepository.js';
import AddressRepository from '../../../domain/repositories/addressRepository.js';
import ShipmentStatusRepository from '../../../domain/repositories/shipmentStatusRepository.js';
import Package from '../../../domain/entities/package.js';
import Address from '../../../domain/entities/address.js';
import Shipment from '../../../domain/entities/shipment.js';
import { validateAddress } from '../../../services/addressValidationService.js'; // Import the validation function

/**
 * Registers a new shipment.
 * 
 * This controller handles the registration of a new shipment, including:
 * - Validating the destination and return addresses.
 * - Creating and saving the addresses, package, and shipment.
 * - Storing shipment data in Redis.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const registerShipment = async (req, res) => {
  try {
    const { weight, length, width, height, productType, streetAddress, city, department, postalCode, country, details, returnStreetAddress, returnCity, returnDepartment, returnPostalCode, returnCountry, returnDetails } = req.body;
    const userId = req.user.userId;

    const fullAddress = `${streetAddress}, ${city}, ${country}`;
    const fullReturnAddress = `${returnStreetAddress}, ${returnCity}, ${returnCountry}`;

    // Validate destination address
    if (!streetAddress || !(await validateAddress(fullAddress))) {
      return res.status(400).json({ message: 'Invalid destination address' });
    }

    // Validate return address
    if (!returnStreetAddress || !(await validateAddress(fullReturnAddress))) {
      return res.status(400).json({ message: 'Invalid return address' });
    }

    // Create and save the shipping address
    const address = new Address({ streetAddress, city, department, postalCode, country, details });
    const addressId = await AddressRepository.save(address);

    // Create and save the return address
    const returnAddress = new Address({ streetAddress: returnStreetAddress, city: returnCity, department: returnDepartment, postalCode: returnPostalCode, country: returnCountry, details: returnDetails });
    const returnAddressId = await AddressRepository.save(returnAddress);

    // Create and save the package
    const pkg = new Package({ weight, length, width, height, productType });
    const packageId = await PackageRepository.save(pkg);

    // Create and save the shipment
    const shipment = new Shipment({ userId, packageId, addressId, returnAddressId });
    const shipmentId = await ShipmentRepository.save(shipment);

    // Store shipment data in Redis
    const shipmentData = {
      userId,
      packageId,
      addressId,
      returnAddressId,
      status: 'Pending'
    };
    await ShipmentStatusRepository.setShipmentData(shipmentId, shipmentData);

    res.status(201).json({ message: 'Shipment registered successfully!', shipmentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Assigns a shipment to a carrier and route.
 * 
 * This controller handles the assignment of a shipment to a carrier and route, including:
 * - Updating the shipment status in Redis.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
export const assignShipment = async (req, res, next) => {
  try {
    const { shipmentId, routeId, carrierId } = req.body;
    const userId = req.user.userId;
    const shipment = await assignShipmentUseCase({ userId, shipmentId, routeId, carrierId });

    // Update shipment status in Redis
    await ShipmentStatusRepository.setStatus(shipmentId, 'In Transit');

    res.status(200).json({ message: 'Shipment assigned successfully', shipment });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};