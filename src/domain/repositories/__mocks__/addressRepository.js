const mockSave = jest.fn();

const AddressRepository = {
  save: mockSave,
  _reset() {
    mockSave.mockReset();
  }
};

export default AddressRepository;