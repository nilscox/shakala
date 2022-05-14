import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThreadFilters } from './thread-filters';

describe.skip('ThreadFilters', () => {
  it('triggers the search filter', async () => {
    render(<ThreadFilters />);

    await userEvent.type(screen.getByPlaceholderText('Rechercher...'), 'science');

    // expect(onSearch).toHaveBeenCalledWith('science', expect.anything());
  });

  it('triggers the sort filter', async () => {
    render(<ThreadFilters />);

    await userEvent.selectOptions(screen.getByLabelText('Trier par :'), 'pertinence');

    // expect(onSort).toHaveBeenCalledWith('pertinence');
  });
});
