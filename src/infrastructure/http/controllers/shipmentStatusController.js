import { getShipmentStatusUseCase } from '../../../application/use-cases/getShipmentStatusUseCase.js';

export const getShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const shipmentData = await getShipmentStatusUseCase(id);
    res.status(200).json(shipmentData);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};