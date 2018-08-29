import { CacheItem } from "./CacheItem";
import { Buffer } from 'buffer';

export interface Imethod {
  get(key: string): any;
  set(key: string, value: Object): void;
  empty(): void;
  showInfo(): void;
}

export interface configParam {
  maxLength: number;
}

export class SimpleCache implements Imethod {
    private maxLength = 10;
    private cacheMap = {};
    private lastResetTime = new Date();
    private baseDate = 1000 * 60 * 24;

    constructor(param: configParam) {
      const { maxLength = 10 } = param;
      this.maxLength = maxLength;
    }

    public get(key: string) {
      try {
        if (this.cacheMap[key] !== undefined) {
          this.resetPriority();
          this.resetItem(this.cacheMap[key], new Date(), 1);
          return JSON.parse(this.cacheMap[key].value.toString());
        } else {
          throw new Error('no such key');
        }
      } catch(e) {
        this.handleError(e);
      }
    }

    public set(key: string, value: Object) {
      try {
        if (this.cacheMap[key] === undefined) {
          const item = this.formatItem(key, value);

          if (this.isOverflow()) {
            this.lastResetTime = new Date();
            this.resetPriority();
          }

          if (!this.isOverflow()) {
            this.cacheMap[key] = item;
          }
        } else {
          this.cacheMap[key].value = Buffer.from(JSON.stringify(value));
          this.resetItem(this.cacheMap[key], new Date(), 1);
        }
      } catch(e) {
        this.handleError(e);
      }
    }

    public empty() {
      this.lastResetTime = new Date();
      this.cacheMap = {};
    }

    public showInfo() {
      console.log(JSON.stringify(this.cacheMap));
    }

    private formatItem(key: string, value: Object): CacheItem {
      return new CacheItem(key, value);
    }

    private resetPriority(): CacheItem | undefined {
      const keys = Object.keys(this.cacheMap);
      if (keys.length <= 0) {
        return undefined;
      }

      let removeItem = this.cacheMap[keys[0]];

      keys.forEach((key: string) => {
        this.resetItem(this.cacheMap[key], this.lastResetTime);
        if (removeItem.priority > this.cacheMap[key].priority) {
          removeItem = this.cacheMap[key];
        }
      });

      return removeItem;
    }

    private resetItem(item: any, now: Date = new Date(), up: number = 0) {
      const { createTime, lastModify, priority } = item;
      const x = Math.floor((lastModify.getTime() - createTime.getTime()) / this.baseDate) + 1;
      const y = Math.floor((now.getTime() - createTime.getTime()) / this.baseDate) + 1;

      item.priority = priority * x / y + up;
      item.lastModify = now;
    }

    private handleError(e: Error) {
      console.error(e);
    }

    private isOverflow() {
      return Object.keys(this.cacheMap).length >= this.maxLength;
    }
}

