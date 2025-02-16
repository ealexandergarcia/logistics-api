import { getShipmentStatusUseCase } from '../../../application/use-cases/getShipmentStatusUseCase.js';

/**
 * Retrieves the status of a shipment by its ID.
 * 
 * This controller handles the retrieval of a shipment's status using its ID.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const getShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const shipmentData = await getShipmentStatusUseCase(id);
    res.status(200).json(shipmentData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};