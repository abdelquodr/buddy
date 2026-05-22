import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/dynamic
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (...args: any[]) => {
    const dynamicActualComp = jest.requireActual('next/dynamic');
    const dynamicActualComp2 = dynamicActualComp.default;
    const RequiredComponent = dynamicActualComp2(args[0]);
    RequiredComponent.preload
      ? RequiredComponent.preload()
      : RequiredComponent.render.preload();
    return RequiredComponent;
  },
}));
