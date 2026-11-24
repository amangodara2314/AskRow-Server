export function getRedisKey(...args: string[]) {
  return args.join(":");
}
