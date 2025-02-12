const mockFindByEmail = jest.fn();
const mockSave = jest.fn();

const UserRepository = {
  findByEmail: mockFindByEmail,
  save: mockSave,
  _reset() {
    mockFindByEmail.mockReset();
    mockSave.mockReset();
  }
};

export default UserRepository;