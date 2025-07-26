export function log(message: string): void {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [ObsidianHost] ${message}`;
  console.log(logMessage);
}

export function error(message: string, err?: Error): void {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] [ObsidianHost] ERROR: ${message}`;

  if (err) {
    console.error(errorMessage, err);
  } else {
    console.error(errorMessage);
  }
}

export function warn(message: string): void {
  const timestamp = new Date().toISOString();
  const warnMessage = `[${timestamp}] [ObsidianHost] WARN: ${message}`;
  console.warn(warnMessage);
}
