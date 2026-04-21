import { RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
  ).filter((el) => el.offsetParent !== null);
}

interface UseFocusTrapOptions {
  active?: boolean;
  onEscape?: () => void;
  focusFirstOnMount?: boolean;
  returnFocusOnUnmount?: boolean;
}

function useFocusTrap(
  containerRef: RefObject<HTMLElement>,
  options: UseFocusTrapOptions = {}
) {
  const { active = true, focusFirstOnMount = false, returnFocusOnUnmount = true } = options;
  const onEscapeRef = useRef(options.onEscape);
  useEffect(() => {
    onEscapeRef.current = options.onEscape;
  });

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (focusFirstOnMount) {
      const elements = getFocusableElements(container);
      if (elements.length > 0) {
        elements[0].focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onEscapeRef.current) {
          e.stopPropagation();
          onEscapeRef.current();
        }
        return;
      }

      if (e.key !== 'Tab') return;

      const elements = getFocusableElements(container);
      if (elements.length === 0) return;

      const firstEl = elements[0];
      const lastEl = elements.at(-1)!;
      const activeEl = document.activeElement as HTMLElement;

      if (e.shiftKey) {
        if (!container.contains(activeEl) || activeEl === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else if (!container.contains(activeEl) || activeEl === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (returnFocusOnUnmount && previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
      }
    };
  }, [active, containerRef, focusFirstOnMount, returnFocusOnUnmount]);
}

export default useFocusTrap;
