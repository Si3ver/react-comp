import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Toggle from './Toggle';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders learn react link 2', () => {
  const { container } = render(<App />);
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const linkElement = container.querySelector('.App-link');

  expect(linkElement?.textContent).toMatch(/learn react/i)
});

test('toggle', () => {
  const {container} = render(<Toggle />);

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.querySelector('p')?.textContent).toBe('close');

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  fireEvent.click(container.querySelector('button')!);

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.querySelector('p')?.textContent).toBe('open');
});
