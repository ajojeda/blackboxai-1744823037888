import '@types/jest';

declare global {
  namespace NodeJS {
    interface Global {
      beforeAll: typeof beforeAll;
      afterAll: typeof afterAll;
      beforeEach: typeof beforeEach;
      afterEach: typeof afterEach;
      describe: typeof describe;
      it: typeof it;
      expect: typeof expect;
      jest: typeof jest;
    }
  }
}
