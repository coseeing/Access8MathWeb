import { vi } from 'vitest';
import React, { useRef, useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Tooltip from './tooltip';

const Harness = () => {
  const [hasSibling, setHasSibling] = useState(true);
  const targetRef = useRef(null);
  return (
    <>
      {hasSibling && <button type="button">sibling</button>}
      <Tooltip label="target tip">
        <button ref={targetRef} type="button">
          target
        </button>
      </Tooltip>
      <button
        type="button"
        onClick={() => {
          setHasSibling(false);
          targetRef.current.focus();
        }}
      >
        remove sibling
      </button>
    </>
  );
};

describe('<Tooltip />', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('points at the trigger after a handler that focuses it also moves it', () => {
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      if (this.getAttribute('role') === 'tooltip') {
        return { left: 0, top: 0, width: 60, height: 20 };
      }
      if (this.textContent === 'target') {
        return { left: this.previousElementSibling ? 100 : 0, top: 50, width: 40, height: 30 };
      }
      return { left: 0, top: 0, width: 0, height: 0 };
    });
    render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: 'remove sibling' }));

    expect(screen.getByRole('button', { name: 'target' })).toHaveFocus();
    expect(screen.getByRole('tooltip')).toHaveStyle({ left: '20px', top: '22px' });
  });
});
