export default async function generateManifestFile(OS: string): Promise<string> {
  const EXE = OS === 'windows' ? 'bat' : 'sh'
  const response = await fetch('/manifest.json')
  const manifest = await response.json()
  const manifestString = JSON.stringify(manifest)
  const manifestFile = manifestString.replace(/%%EXTENSION%%/g, EXE)
  const manifestJson = JSON.parse(manifestFile)
  return manifestJson
}
