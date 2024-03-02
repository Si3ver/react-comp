import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import Toggle from './Toggle';

test('toggle', () => {
  const {container} = render(<Toggle />);

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.querySelector('p')?.textContent).toBe('close');

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  fireEvent.click(container.querySelector('button')!);

  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  expect(container.querySelector('p')?.textContent).toBe('open');
});
