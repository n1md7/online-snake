jest.mock('ioredis', () => {
  return {
    __esModule: true,
    Redis: jest.requireActual('ioredis-mock'),
    default: jest.requireActual('ioredis-mock'),
  };
});
