import * as os from 'os';
import type  { SystemInfo } from '../types/types';

export function getSystemInfo(): SystemInfo {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  return {
    platform: os.platform(),
    arch: os.arch(),
    nodeVersion: process.version,
    hostname: os.hostname(),
    uptime: os.uptime(),
    memory: {
      total: totalMemory,
      free: freeMemory,
      used: totalMemory - freeMemory,
    },
    timestamp: Date.now(),
  };
}

export function getMemoryUsage(): NodeJS.MemoryUsage {
  return process.memoryUsage();
}

export function getCpuInfo(): os.CpuInfo[] {
  return os.cpus();
}

export function getNetworkInterfaces(): NodeJS.Dict<os.NetworkInterfaceInfo[]> {
  return os.networkInterfaces();
}
