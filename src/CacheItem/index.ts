import { Buffer } from 'buffer';

interface ICacheItem {
  key: string;
  value: Buffer;
  priority: number;
  createTime: Date;
  lastModify: Date;
}

export default class CacheItem implements ICacheItem {
  public key: string;
  public value: Buffer;
  public priority: number;
  public createTime: Date;
  public lastModify: Date;
  
  constructor(key: string, value: Object) {
    this.key = key;
    this.value = Buffer.from(JSON.stringify(value));
    this.priority = 1;
    this.lastModify = this.createTime = new Date();
  }
}
