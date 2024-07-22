import React from 'react';
import { render, screen } from '@testing-library/react';

import Home from './home';

describe('Home Component', () => {
  it('renders Home component correctly', () => {
    render(<Home />);
    screen.debug();

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
