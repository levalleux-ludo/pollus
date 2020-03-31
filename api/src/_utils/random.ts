const MAX_UINT32: number = 0xffffffff;

export function randomUint32() {
  return Math.floor(Math.random() * MAX_UINT32);
}

export function randomUintMax() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
