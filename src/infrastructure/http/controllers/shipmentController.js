import PackageRepository from '../../../domain/repositories/packageRepository.js';
import ShipmentRepository from '../../../domain/repositories/shipmentRepository.js';
import AddressRepository from '../../../domain/repositories/addressRepository.js';
import Package from '../../../domain/entities/package.js';
import Shipment from '../../../domain/entities/shipment.js';
import Address from '../../../domain/entities/address.js';
import { validateAddress } from '../../../services/addressValidationService.js'; // Import the validation function

export const registerShipment = async (req, res) => {
  try {
    const { weight, length, width, height, productType, streetAddress, city, department, postalCode, country, details } = req.body;
    const userId = req.user.userId;

    const fullAddress = `${streetAddress}, ${city}, ${country}`;
    console.log('fullAddress:', fullAddress);
    
    if (!streetAddress || !(await validateAddress(fullAddress))) {
      return res.status(400).json({ message: 'Invalid destination address' });
    }

    // Create and save the address
    const address = new Address({ streetAddress, city, department, postalCode, country, details });
    const addressId = await AddressRepository.save(address);

    // Create and save the package
    const pkg = new Package({ weight, length, width, height, productType });
    const packageId = await PackageRepository.save(pkg);

    // Create and save the shipment
    const shipment = new Shipment({ userId, packageId, addressId });
    const shipmentId = await ShipmentRepository.save(shipment);

    res.status(201).json({ message: 'Shipment registered successfully!', shipmentId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};