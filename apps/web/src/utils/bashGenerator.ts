export default async function generateBashScript(
  hostLocation: string,
): Promise<string> {
  const response = await fetch('/linux.sh')
  const linuxbash = await response.text()
  const bashfile = linuxbash.replace(/%%HOSTLOCATION%%/g, hostLocation)
  return bashfile
}
