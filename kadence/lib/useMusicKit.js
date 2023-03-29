import { createContext, useContext } from 'react';

export const MusicKitContext = createContext(null);

export default function useMusicKit() {
    return useContext(MusicKitContext);
}
