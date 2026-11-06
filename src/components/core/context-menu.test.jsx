import { vi } from 'vitest';
import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import ContextMenu, { getContextMenuPosition } from './context-menu';

const TRIGGER_RECT = { left: 100, top: 50, right: 150, bottom: 100, width: 50, height: 50 };

const Harness = ({ items }) => {
  const [menu, setMenu] = useState(null);
  return (
    <>
      <button
        type="button"
        onContextMenu={(event) => {
          event.preventDefault();
          setMenu({ trigger: event.currentTarget, position: { x: 10, y: 20 } });
        }}
      >
        trigger
      </button>
      <button type="button">outside</button>
      {menu && (
        <ContextMenu
          position={menu.position}
          label="menu label"
          items={items}
          returnFocusTo={menu.trigger}
          onClose={() => setMenu(null)}
        />
      )}
    </>
  );
};

const renderOpenMenu = () => {
  const items = [
    { id: 'first', label: 'First', onSelect: vi.fn() },
    { id: 'second', label: 'Second', onSelect: vi.fn() },
    { id: 'third', label: 'Third', onSelect: vi.fn() },
  ];
  render(<Harness items={items} />);
  const trigger = screen.getByRole('button', { name: 'trigger' });
  trigger.focus();
  fireEvent.contextMenu(trigger);
  return { items, trigger, menu: screen.getByRole('menu', { name: 'menu label' }) };
};

describe('<ContextMenu />', () => {
  it('focuses the first item when it opens', () => {
    renderOpenMenu();
    expect(screen.getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'First',
      'Second',
      'Third',
    ]);
    expect(screen.getByRole('menuitem', { name: 'First' })).toHaveFocus();
  });

  it('moves between items with the arrow, Home and End keys, wrapping around', () => {
    const { menu } = renderOpenMenu();
    const item = (name) => screen.getByRole('menuitem', { name });

    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(item('Third')).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(item('First')).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(item('Second')).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'End' });
    expect(item('Third')).toHaveFocus();
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(item('First')).toHaveFocus();
  });

  it('runs the focused item with Enter, closes and returns focus to the trigger', () => {
    const { items, trigger, menu } = renderOpenMenu();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'Enter' });

    expect(items[1].onSelect).toHaveBeenCalledTimes(1);
    expect(items[0].onSelect).not.toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('runs the focused item with Space on keyup, so the keyup never reaches the trigger', () => {
    const { items, trigger, menu } = renderOpenMenu();
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: ' ' });

    expect(items[1].onSelect).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyUp(menu, { key: ' ' });
    expect(items[1].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('runs an item on click', () => {
    const { items, trigger } = renderOpenMenu();
    fireEvent.click(screen.getByRole('menuitem', { name: 'Third' }));

    expect(items[2].onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes on Escape without running anything and returns focus to the trigger', () => {
    const { items, trigger, menu } = renderOpenMenu();
    fireEvent.keyDown(menu, { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    items.forEach((item) => expect(item.onSelect).not.toHaveBeenCalled());
    expect(trigger).toHaveFocus();
  });

  it('closes on Tab and returns focus to the trigger', () => {
    const { trigger, menu } = renderOpenMenu();
    fireEvent.keyDown(menu, { key: 'Tab' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes when pressing outside, without running anything, and returns focus to the trigger', () => {
    const { items, trigger } = renderOpenMenu();
    fireEvent.mouseDown(screen.getByRole('button', { name: 'outside' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    items.forEach((item) => expect(item.onSelect).not.toHaveBeenCalled());
    expect(trigger).toHaveFocus();
  });

  it('returns focus without scrolling the trigger into view', () => {
    const { trigger, menu } = renderOpenMenu();
    const focus = vi.spyOn(trigger, 'focus');
    fireEvent.keyDown(menu, { key: 'Escape' });

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('stays open, keeping focus, when pressing inside', () => {
    renderOpenMenu();
    const pressed = fireEvent.mouseDown(screen.getByRole('menuitem', { name: 'Second' }));

    expect(pressed).toBe(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it.each([
    ['the page scrolls', () => fireEvent.scroll(window)],
    ['the window resizes', () => fireEvent(window, new Event('resize'))],
  ])('closes when %s', (_, act) => {
    renderOpenMenu();
    act();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes, without taking focus back, when focus leaves the page', () => {
    const { trigger } = renderOpenMenu();
    fireEvent.blur(screen.getByRole('menuitem', { name: 'First' }), { relatedTarget: null });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(trigger).not.toHaveFocus();
  });

  it('stays open when focus moves between its items', () => {
    renderOpenMenu();
    fireEvent.blur(screen.getByRole('menuitem', { name: 'First' }), {
      relatedTarget: screen.getByRole('menuitem', { name: 'Second' }),
    });
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('suppresses the browser context menu on itself', () => {
    const { menu } = renderOpenMenu();
    expect(fireEvent.contextMenu(menu)).toBe(false);
  });

  it('keeps itself inside the viewport', () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 100,
      height: 40,
    });
    render(
      <ContextMenu
        position={{ x: window.innerWidth - 10, y: window.innerHeight - 10 }}
        label="menu label"
        items={[{ id: 'only', label: 'Only', onSelect: vi.fn() }]}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByRole('menu')).toHaveStyle({
      left: `${window.innerWidth - 100 - 8}px`,
      top: `${window.innerHeight - 40 - 8}px`,
    });
    vi.restoreAllMocks();
  });
});

describe('getContextMenuPosition', () => {
  const eventOn = (init) => {
    const currentTarget = { getBoundingClientRect: () => TRIGGER_RECT };
    return { currentTarget, ...init };
  };

  it('opens at the pointer for a right click on the trigger', () => {
    expect(getContextMenuPosition(eventOn({ clientX: 120, clientY: 70 }))).toEqual({
      x: 120,
      y: 70,
    });
  });

  it.each([
    ['a keyboard event', {}],
    ['a contextmenu event without coordinates', { clientX: 0, clientY: 0 }],
    ['coordinates outside the trigger', { clientX: 5, clientY: 5 }],
    [
      'a keyboard-triggered contextmenu at the trigger centre',
      { clientX: 125, clientY: 75, nativeEvent: { pointerType: '' } },
    ],
  ])('opens below the trigger for %s', (_, init) => {
    expect(getContextMenuPosition(eventOn(init))).toEqual({ x: 100, y: 104 });
  });
});
