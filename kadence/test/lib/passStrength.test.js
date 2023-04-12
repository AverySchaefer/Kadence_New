import { passwordIsStrong } from '@/lib/passwordUtils';

test('Null Password', () => {
    expect(passwordIsStrong(null)).toBe(false);
});

test('Password Too Short', () => {
    expect(passwordIsStrong('abc')).toBe(false);
});

test('Password No Lowercase Letters', () => {
    expect(passwordIsStrong('ABC123!@#')).toBe(false);
});

test('Password No Uppercase Letters', () => {
    expect(passwordIsStrong('abc123!@#')).toBe(false);
});

test('Password No Numbers', () => {
    expect(passwordIsStrong('abcABC!@#')).toBe(false);
});

test('Password No Symbols', () => {
    expect(passwordIsStrong('abcABC123')).toBe(false);
});

test('Password Valid w/ All Requirements', () => {
    expect(passwordIsStrong('abcABC123!@#')).toBe(true);
});
