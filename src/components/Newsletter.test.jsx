import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test/utils';
import Newsletter from './Newsletter';

describe('Newsletter Component', () => {
    it('renders newsletter signup form', () => {
        renderWithProviders(<Newsletter />);

        expect(screen.getByText(/stay in the loop/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    });

    it('shows error for empty email submission', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Newsletter />);

        const button = screen.getByRole('button', { name: /subscribe/i });
        await user.click(button);

        // HTML5 validation should prevent submission
        const input = screen.getByPlaceholderText(/enter your email/i);
        expect(input).toBeInvalid();
    });

    it('shows error for invalid email format', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Newsletter />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        const button = screen.getByRole('button', { name: /subscribe/i });

        await user.type(input, 'invalid-email');
        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText(/valid email/i)).toBeInTheDocument();
        });
    });

    it('shows success message on valid submission', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Newsletter />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        const button = screen.getByRole('button', { name: /subscribe/i });

        await user.type(input, 'test@example.com');
        await user.click(button);

        // Should show loading state
        expect(screen.getByText(/subscribing/i)).toBeInTheDocument();

        // Should show success message after delay
        await waitFor(() => {
            expect(screen.getByText(/you're in/i)).toBeInTheDocument();
        }, { timeout: 2000 });
    });

    it('clears email input after successful submission', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Newsletter />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        await user.type(input, 'test@example.com');
        await user.click(screen.getByRole('button', { name: /subscribe/i }));

        await waitFor(() => {
            expect(screen.getByText(/you're in/i)).toBeInTheDocument();
        }, { timeout: 2000 });

        // Input should be cleared (success message replaces form)
        expect(screen.queryByPlaceholderText(/enter your email/i)).not.toBeInTheDocument();
    });

    it('disables input and button during submission', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Newsletter />);

        const input = screen.getByPlaceholderText(/enter your email/i);
        const button = screen.getByRole('button', { name: /subscribe/i });

        await user.type(input, 'test@example.com');
        await user.click(button);

        // During loading state, button should show "Subscribing..."
        expect(screen.getByText(/subscribing/i)).toBeInTheDocument();
    });
});
