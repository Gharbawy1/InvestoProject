export class SafeEncoder {
  static encode(str: string): string {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  static decode(encoded: string): string {
    let str = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) {
      str += '===='.slice(0, 4 - pad);
    }
    return atob(str);
  }
}