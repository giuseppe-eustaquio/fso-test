import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Note from './Note';

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true,
  };

  const mockHandler = vi.fn();

  // expect tobedefined
  // render(<Note note={note} />);
  // const element = screen.getByText(
  //   'Component testing is done with react-testing-library'
  // );
  // expect(element).toBeDefined();

  // using querySelector
  // const { container } = render(<Note note={note} />);

  // const div = container.querySelector('.note');
  // expect(div).toHaveTextContent(
  //   'Component testing is done with react-testing-library'
  // );

  // screen debug part
  // const element = screen.getByText(
  //   'Component testing is done with react-testing-library'
  // );
  // screen.debug(element);
  // expect(element).toBeDefined();

  // userEvent click
  render(<Note note={note} toggleImportance={mockHandler} />);
  const user = userEvent.setup();
  const button = screen.getByText('make not important');
  await user.click(button);

  expect(mockHandler.mock.calls).toHaveLength(1);
});
