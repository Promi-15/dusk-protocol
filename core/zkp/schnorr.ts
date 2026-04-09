export interface Keypair {
  privateKey: bigint;
  publicKey: bigint;
}

export interface Commitment {
  r: bigint;
  R: bigint;
}

export interface ZKProof {
  R: bigint;
  challenge: bigint;
  response: bigint;
  publicKey: bigint;
}

const P = 2147483647n;
const G = 7n;

export function generateKeypair(): Keypair {
  const privateKey = BigInt(Math.floor(Math.random() * 1000000) + 100000);
  const publicKey = modPow(G, privateKey, P);
  return { privateKey, publicKey };
}

export function createCommitment(): Commitment {
  const r = BigInt(Math.floor(Math.random() * 100000) + 10000);
  const R = modPow(G, r, P);
  return { r, R };
}

export function createChallenge(
  R: bigint,
  publicKey: bigint,
  sessionId: string
): bigint {
  const input = `${R}-${publicKey}-${sessionId}`;
  let hash = 0n;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31n + BigInt(input.charCodeAt(i))) % P;
  }
  return hash;
}

export function createResponse(
  r: bigint,
  challenge: bigint,
  privateKey: bigint
): bigint {
  return (r + challenge * privateKey) % (P - 1n);
}

export function verify(proof: ZKProof): boolean {
  const { R, challenge, response, publicKey } = proof;
  const lhs = modPow(G, response, P);
  const rhs = (R * modPow(publicKey, challenge, P)) % P;
  return lhs === rhs;
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) result = (result * base) % mod;
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
}