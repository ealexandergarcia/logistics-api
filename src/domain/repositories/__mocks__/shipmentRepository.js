const mockSave = jest.fn();

const ShipmentRepository = {
  save: mockSave,
  _reset() {
    mockSave.mockReset();
  }
};

export default ShipmentRepository;