import { Button } from '@components/Button';
import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
describe('Button Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders children', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const mockClickHandler = vi.fn();

        render(<Button onClick={mockClickHandler}>Click Me</Button>);
        const button = screen.getByRole('button', { name: 'Click Me' });
        await user.click(button);
        expect(mockClickHandler).toHaveBeenCalled();
    });

    it('renders props', () => {
        render(<Button disabled>Click Me</Button>);
        const button = screen.getByRole('button', { name: 'Click Me' });
        expect(button).toBeDisabled();
    });
});
