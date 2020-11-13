import LZString from 'lz-string';

export default class CacheService {
    public static setCacheItem(key: string, value: any, ttl: number) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };

        const itemJson = JSON.stringify(item);
        const compressed = LZString.compressToUTF16(itemJson);

        localStorage.setItem(key, compressed);
    }

    public static getCacheItem(key: string) {
        const compressed = localStorage.getItem(key);

        if (!compressed) {
            return null;
        }

        const uncompressedJson = LZString.decompressFromUTF16(compressed);

        if (!uncompressedJson) {
            return null;
        }

        const item = JSON.parse(uncompressedJson);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }
}