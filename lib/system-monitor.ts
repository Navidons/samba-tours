import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { SystemStat, ServiceStatus, SystemLog } from "@/types/system";
import { Cpu, Database, HardDrive, MemoryStickIcon as Memory } from "lucide-react";

// Ensure Supabase client is initialized with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Fetch IP address from a public API
async function getIPAddress(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('IP fetch failed');
    
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('IP address fetch error:', error);
    return null;
  }
}

// Detect device type and browser
function detectDeviceAndBrowser() {
  if (typeof window === 'undefined') return { deviceType: 'server', browser: 'unknown' };

  const userAgent = window.navigator.userAgent.toLowerCase();
  const deviceType = /mobile|android|touch|tablet/i.test(userAgent) ? 'mobile' : 'desktop';
  
  let browser = 'unknown';
  if (userAgent.includes('chrome')) browser = 'Chrome';
  else if (userAgent.includes('firefox')) browser = 'Firefox';
  else if (userAgent.includes('safari')) browser = 'Safari';
  else if (userAgent.includes('edge')) browser = 'Edge';
  else if (userAgent.includes('opera')) browser = 'Opera';
  else if (userAgent.includes('trident') || userAgent.includes('msie')) browser = 'Internet Explorer';

  return { deviceType, browser };
}

// Get geolocation information
async function getGeolocation(): Promise<{
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('Geolocation fetch failed');
    
    const data = await response.json();
    return {
      country: data.country_name,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone
    };
  } catch (error) {
    console.warn('Geolocation fetch error:', error);
    return {};
  }
}

// Generate or retrieve unique identifier
function getUniqueIdentifier(): string {
  if (typeof window === 'undefined') return '';
  
  let uniqueId = localStorage.getItem('visitor_unique_id');
  if (!uniqueId) {
    uniqueId = uuidv4();
    localStorage.setItem('visitor_unique_id', uniqueId);
  }
  return uniqueId;
}

// Main visitor tracking function
export async function trackVisitor(pageVisited: string) {
  if (typeof window === 'undefined') return;

  try {
    const uniqueIdentifier = getUniqueIdentifier();
    const { deviceType, browser } = detectDeviceAndBrowser();
    const geolocation = await getGeolocation();
    const ipAddress = await getIPAddress();

    const visitorData = {
      unique_identifier: uniqueIdentifier,
      ip_address: ipAddress,
      user_agent: window.navigator.userAgent,
      device_type: deviceType,
      browser: browser,
      operating_system: window.navigator.platform,
      country: geolocation.country,
      city: geolocation.city,
      page_visited: pageVisited,
      is_mobile: deviceType === 'mobile',
      latitude: geolocation.latitude,
      longitude: geolocation.longitude,
      timezone: geolocation.timezone,
      language: window.navigator.language,
      referrer: document.referrer || null
    };

    // Upsert visitor record
    const { error } = await supabase
      .from('visitors')
      .upsert(
        [visitorData], 
        { 
          onConflict: 'unique_identifier'
        }
      );

    if (error) console.warn('Visitor tracking error:', error);
  } catch (error) {
    console.warn('Visitor tracking failed:', error);
  }
}

export async function incrementVisitorCount(uniqueIdentifier: string) {
  try {
    const { error } = await supabase.rpc('increment_visitor_count', { 
      p_unique_identifier: uniqueIdentifier 
    });

    if (error) console.warn('Increment visitor count error:', error);
  } catch (error) {
    console.warn('Increment visitor count failed:', error);
  }
}

// Mock system logs for compatibility
export async function getSystemLogs(): Promise<SystemLog[]> {
  return [
    {
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "System initialized",
      component: "System Monitor",
    },
    {
      timestamp: new Date().toISOString(),
      level: "WARNING",
      message: "Potential performance bottleneck detected",
      component: "Performance Monitor",
    }
  ];
}

// Existing system stats and services functions
export async function getSystemStats(): Promise<SystemStat[]> {
  return [
    {
      name: "CPU Usage",
      value: 45,
      status: "good",
      icon: Cpu,
      color: "text-green-600",
    },
    {
      name: "Memory Usage",
      value: 60,
      status: "warning",
      icon: Memory,
      color: "text-yellow-600",
    },
    {
      name: "Disk Usage",
      value: 30,
      status: "good",
      icon: HardDrive,
      color: "text-green-600",
    },
    {
      name: "Database Size",
      value: 45,
      status: "good",
      icon: Database,
      color: "text-green-600",
    },
  ];
}

export async function getSystemServices(): Promise<ServiceStatus[]> {
  return [
    {
      name: "Web Server",
      status: "running",
      uptime: "99.9%",
      lastRestart: new Date().toISOString(),
    },
    {
      name: "Database",
      status: "running",
      uptime: "99.8%",
      lastRestart: new Date().toISOString(),
    }
  ];
}
