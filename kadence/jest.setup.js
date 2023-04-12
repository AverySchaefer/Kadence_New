import { TextEncoder, TextDecoder } from 'util';
import { setConfig } from 'next/config';
import config from './next.config';
import '@testing-library/jest-dom';

// Polyfill TextEncoder/TextDecoder because the jest-dom environment doesn't have it
// https://github.com/inrupt/solid-client-authn-js/issues/1676
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock next's router in tests
// eslint-disable-next-line global-require
jest.mock('next/router', () => require('next-router-mock'));

class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }
}

// Replace the localStorage object with our mock
global.localStorage = new LocalStorageMock();

setConfig(config);
