import { render, fireEvent } from '@testing-library/react';
import Button from '@/components/Button';

describe('Button', () => {
    it('renders children and passes props', () => {
        const onClickMock = jest.fn();
        const { getByText } = render(
            <Button onClick={onClickMock} data-testid="test-button">
                Click me!
            </Button>
        );

        const button = getByText('Click me!');
        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('button');
        fireEvent.click(button);
        expect(onClickMock).toHaveBeenCalledTimes(1);
    });
});
