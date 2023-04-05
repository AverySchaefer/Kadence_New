/* eslint-disable no-bitwise */
import { hash } from 'bcryptjs';

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

function containsAtLeastOne(password, charset) {
    for (let i = 0; i < charset.length; i++) {
        if (password.includes(charset[i])) return true;
    }
    return false;
}

export const weakPasswordMessage = `Your password must contain at least ${minLength} characters including one lowercase and uppercase letter, one number, and one symbol.`;

export function passwordIsStrong(password) {
    if (password === null || password === undefined) return false;
    if (password.length < minLength) return false;
    if (!containsAtLeastOne(password, lowercaseLetters)) return false;
    if (!containsAtLeastOne(password, uppercaseLetters)) return false;
    if (!containsAtLeastOne(password, numbers)) return false;
    if (!containsAtLeastOne(password, symbols)) return false;
    return true;
}

export function clientSideHash(username, password) {
    // Shamelessly reused from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    const finalPassword = username + password;
    for (let i = 0, ch; i < finalPassword.length; i++) {
        ch = finalPassword.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 =
        Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
        Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 =
        Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
        Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const result = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return result.toString(16);
}

export async function serverSideHash(password) {
    const hashedPassword = await hash(password, 8);
    return hashedPassword;
}
