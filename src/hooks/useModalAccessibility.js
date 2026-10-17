import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export const useModalAccessibility = (isOpen, onClose) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    const getFocusableElements = () =>
      Array.from(dialog?.querySelectorAll(FOCUSABLE_SELECTOR) || []).filter(
        (element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true'
      );
    const initialFocus = dialog?.querySelector('[data-dialog-initial-focus]') || getFocusableElements()[0];
    (initialFocus || dialog)?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog?.focus();
        return;
      }

      const activeIndex = focusableElements.indexOf(document.activeElement);
      if (activeIndex === -1) {
        event.preventDefault();
        (event.shiftKey ? focusableElements[focusableElements.length - 1] : focusableElements[0]).focus();
      } else if (event.shiftKey && activeIndex === 0) {
        event.preventDefault();
        focusableElements[focusableElements.length - 1].focus();
      } else if (!event.shiftKey && activeIndex === focusableElements.length - 1) {
        event.preventDefault();
        focusableElements[0].focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [isOpen]);

  return dialogRef;
};
