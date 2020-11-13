export default class CacheService {
    public static setCacheItem(key: string, value: any, ttl: number) {
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };

        localStorage.setItem(key, JSON.stringify(item));
    }

    public static getCacheItem(key: string) {
        const itemJson = localStorage.getItem(key);

        if (!itemJson) {
            return null;
        }

        const item = JSON.parse(itemJson);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }

        return item.value;
    }
}