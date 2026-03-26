import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

beforeAll(() => {
  window.scrollTo = jest.fn();
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
});

beforeEach(() => {
  // Keep async effects pending to avoid noisy act warnings in this smoke test.
  global.fetch = jest.fn(() => new Promise(() => {}));
});

test("renders home page content", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByRole("link", { name: /професори/i })).toBeInTheDocument();
});
