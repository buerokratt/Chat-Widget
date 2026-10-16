import "./test-env";
import "@testing-library/jest-dom";
import { Settings } from "luxon";
import { server } from "./mocks/server";
import "./i18n";

const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);


const unhandledRequests: string[] = [];


beforeAll(() => {
  Settings.now = () => new Date(2021, 12, 18, 12).valueOf();

  jest.mock("react-i18next", () => ({
    useTranslation: () => ({
      t: jest.fn(),
    }),
    Trans: ({ children }: { children: React.ReactNode }) => children,
  }));

  server.listen({ onUnhandledRequest: (req) => {
    unhandledRequests.push(`${req.method} ${req.url.pathname}`);
    throw new Error(`Unhandled mock request: ${req.method} ${req.url.pathname}`);
  } });
});

afterEach(() => {
  server.resetHandlers();
  const unhandled = unhandledRequests.splice(0);
  expect(unhandled).toEqual([]);
});

afterAll(() => {
  server.close();
  expect(unhandledRequests).toEqual([]);
});

class TestResizeObserver { observe() {} unobserve() {} disconnect() {} }
global.ResizeObserver = TestResizeObserver;
