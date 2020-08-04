// Conver Hour to second function
export default function f(time: string) {
  const [h, m] = time.split(":").map(Number)
  return (h * 3600) + (m * 60)
}
