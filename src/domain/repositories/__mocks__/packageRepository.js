const mockSave = jest.fn();

const PackageRepository = {
  save: mockSave,
  _reset() {
    mockSave.mockReset();
  }
};

export default PackageRepository;