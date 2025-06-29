import { SystemLog } from "@/types/system"

export class SystemMonitorError extends Error {
  code: string
  component: string

  constructor(message: string, code: string, component: string) {
    super(message)
    this.name = 'SystemMonitorError'
    this.code = code
    this.component = component
  }
}

export function createSystemLog(
  error: Error, 
  defaultComponent: string = 'System Monitor'
): SystemLog {
  if (error instanceof SystemMonitorError) {
    return {
      timestamp: new Date().toISOString(),
      level: "ERROR",
      message: error.message,
      component: error.component,
      errorCode: error.code
    }
  }

  return {
    timestamp: new Date().toISOString(),
    level: "ERROR",
    message: error.message || 'Unknown system monitoring error',
    component: defaultComponent,
    errorCode: 'UNKNOWN_ERROR'
  }
}

export function logSystemError(
  error: Error, 
  defaultComponent: string = 'System Monitor'
): void {
  const systemLog = createSystemLog(error, defaultComponent)
  console.error(
    `[${systemLog.component}] ${systemLog.level}: ${systemLog.message}`,
    { errorCode: systemLog.errorCode }
  )
}

export function wrapSystemOperation<T>(
  operation: () => Promise<T>, 
  component: string = 'System Monitor'
): Promise<T> {
  return operation().catch(error => {
    logSystemError(error, component)
    throw error
  })
} 