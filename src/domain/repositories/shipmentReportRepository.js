import IShipmentReportRepository from './IShipmentReportRepository.js';
import { getMySQLInstance } from '../../infrastructure/database/mysql.js';
import redisClient from '../../config/redisClient.js';

class ShipmentReportRepository extends IShipmentReportRepository {
  constructor() {
    super();
    this.db = getMySQLInstance();
  }

  async getAdvancedReport(filters) {
    const { startDate, endDate, status, carrierId, page = 1, limit = 10 } = filters;
  
    // Convertir page y limit a números y evitar valores no válidos
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
  
    const cacheKey = `shipmentReport:${JSON.stringify(filters)}`;
  
    // Verificar en caché antes de hacer la consulta
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  
    let query = `
      SELECT s.id, s.status, s.created_at, s.updated_at, c.name AS carrier_name,
             TIMESTAMPDIFF(HOUR, s.created_at, s.updated_at) AS delivery_time_hours
      FROM shipments s
      LEFT JOIN carriers c ON s.carrier_id = c.id
      WHERE 1=1`;
  
    const params = [];
  
    if (startDate && endDate) {
      query += ' AND s.created_at BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
  
    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }
  
    if (carrierId) {
      query += ' AND s.carrier_id = ?';
      params.push(carrierId);
    }
  
    query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
    params.push(limitNumber, (pageNumber - 1) * limitNumber);
  
    const result = await this.db.query(query, params);
  
    // Cachear el resultado por 1 hora
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
  
    return result;
  }
  
}

export default new ShipmentReportRepository();