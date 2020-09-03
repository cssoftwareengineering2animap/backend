const get = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`missing env key: ${key}`)
  }
  return value
}

const keys = ["NODE_ENV", "APP_KEY", "PORT"] as const

export const env = Object.fromEntries(keys.map(key => [key, get(key)])) as {
  [key in typeof keys[number]]: string
}
