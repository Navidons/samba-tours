import { LucideIcon } from "lucide-react"

export type SystemStatStatus = "good" | "warning" | "error"
export type ServiceStatusType = "running" | "warning" | "error" | "stopped"
export type SystemLogLevel = "INFO" | "WARNING" | "ERROR"

export interface SystemStat {
  name: string
  value: number
  status: SystemStatStatus
  icon: LucideIcon
  color: string
}

export interface ServiceStatus {
  name: string
  status: ServiceStatusType
  uptime: string
  lastRestart: string
  details?: string
}

export interface SystemLog {
  timestamp: string
  level: SystemLogLevel
  message: string
  component: string
  errorCode?: string
} 