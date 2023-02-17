/*
 * Password Requirements:
 * 1. Be at least 8 characters
 * 2. Contain at least one number
 * 3. Contain at least one uppercase letter
 * 4. Contain at least one lowercase letter
 * 5. Contain at least one symbol
 */

const minLength = 8;
const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseLetters = lowercaseLetters.toUpperCase();
const numbers = '0123456789';
const symbols = '!@#$%^&*()-=_+/<>,.~';

const message = `Your password must contain at least ${minLength} characters including one lowercase and uppercase letter, one number, and one symbol.`;

function containsAtLeastOne(password, charset) {
    for (let i = 0; i < charset.length; i++) {
        if (password.includes(charset[i])) return true;
    }
    return false;
}

const Password = {
    isStrong: function (password) {
        if (password === null || password === undefined) return false;
        if (password.length < minLength) return false;
        if (!containsAtLeastOne(password, lowercaseLetters)) return false;
        if (!containsAtLeastOne(password, uppercaseLetters)) return false;
        if (!containsAtLeastOne(password, numbers)) return false;
        if (!containsAtLeastOne(password, symbols)) return false;
        return true;
    },

    errorMessage: message,
};

export default Password;
