import { assignShipmentUseCase } from '../../../application/use-cases/assignShipmentUseCase.js';
import PackageRepository from '../../../domain/repositories/packageRepository.js';
import ShipmentRepository from '../../../domain/repositories/shipmentRepository.js';
import AddressRepository from '../../../domain/repositories/addressRepository.js';
import Package from '../../../domain/entities/package.js';
import Address from '../../../domain/entities/address.js';
import Shipment from '../../../domain/entities/shipment.js';
import { validateAddress } from '../../../services/addressValidationService.js'; // Import the validation function

export const registerShipment = async (req, res) => {
  try {
    const { weight, length, width, height, productType, streetAddress, city, department, postalCode, country, details, returnStreetAddress, returnCity, returnDepartment, returnPostalCode, returnCountry, returnDetails } = req.body;
    const userId = req.user.userId;

    const fullAddress = `${streetAddress}, ${city}, ${country}`;
    const fullReturnAddress = `${returnStreetAddress}, ${returnCity}, ${returnCountry}`;

    if (!streetAddress || !(await validateAddress(fullAddress))) {
      return res.status(400).json({ message: 'Invalid destination address' });
    }

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

    res.status(201).json({ message: 'Shipment registered successfully!', shipmentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignShipment = async (req, res, next) => {
  try {
    const { shipmentId, routeId, carrierId } = req.body;
    const userId = req.user.userId;
    const shipment = await assignShipmentUseCase({ userId, shipmentId, routeId, carrierId });
    res.status(200).json({ message: 'Shipment assigned successfully', shipment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};