"use client"

import { useState } from "react"
import { Check, AlertTriangle, Sun, Moon, Palette, Shield, Monitor, Badge } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

// Sample security alerts
const securityAlerts = [
  {
    id: 1,
    type: "warning",
    message: "Unusual login activity detected from new IP address",
    date: "2024-02-19T10:30:00",
    status: "unresolved",
  },
  {
    id: 2,
    type: "critical",
    message: "Multiple failed login attempts",
    date: "2024-02-19T09:15:00",
    status: "resolved",
  },
]

// Theme presets
const themePresets = [
  {
    name: "Default",
    colors: {
      primary: "#2563eb",
      secondary: "#6b7280",
      accent: "#f59e0b",
    },
  },
  {
    name: "Ocean",
    colors: {
      primary: "#0891b2",
      secondary: "#64748b",
      accent: "#06b6d4",
    },
  },
  {
    name: "Forest",
    colors: {
      primary: "#059669",
      secondary: "#4b5563",
      accent: "#10b981",
    },
  },
  {
    name: "Sunset",
    colors: {
      primary: "#db2777",
      secondary: "#71717a",
      accent: "#f43f5e",
    },
  },
]

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  label: string
}

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-20 rounded border bg-white p-1"
      />
      <Input value={color} onChange={(e) => onChange(e.target.value)} className="w-32" />
    </div>
  </div>
)

export default function SettingsPage({organisationDetails}: any) {
  const [activeTheme, setActiveTheme] = useState("Default")
  const [customColors, setCustomColors] = useState({
    primary: "#2563eb",
    secondary: "#6b7280",
    accent: "#f59e0b",
  })
  const [appearance, setAppearance] = useState("system")
  const [autoTheme, setAutoTheme] = useState(true)

  const handleThemeChange = (themeName: string) => {
    setActiveTheme(themeName)
    const theme = themePresets.find((t) => t.name === themeName)
    if (theme) {
      setCustomColors(theme.colors)
      // In a real app, you would apply these colors to your CSS variables
      document.documentElement.style.setProperty('--primary', theme.colors.primary)
      document.documentElement.style.setProperty('--secondary', theme.colors.secondary)
      document.documentElement.style.setProperty('--accent', theme.colors.accent)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-900">Settings</h1>
        <p className="text-gray-600">Customize your workspace and manage security</p>
      </div>

      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          {/* Theme Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Mode</CardTitle>
              <CardDescription>Choose your preferred theme mode</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic theme switching</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically switch between light and dark mode based on system preferences
                  </p>
                </div>
                <Switch
                  checked={autoTheme}
                  onCheckedChange={setAutoTheme}
                />
              </div>
              
              {!autoTheme && (
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={appearance === "light" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setAppearance("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={appearance === "dark" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setAppearance("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={appearance === "system" ? "default" : "outline"}
                    className="w-full"
                    onClick={() => setAppearance("system")}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Theme Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Presets</CardTitle>
              <CardDescription>Choose from predefined color themes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themePresets.map((theme) => (
                  <TooltipProvider key={theme.name}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full h-24 relative ${
                            activeTheme === theme.name ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => handleThemeChange(theme.name)}
                        >
                          <div className="absolute inset-2 grid grid-rows-3 gap-1">
                            <div style={{ backgroundColor: theme.colors.primary }} className="rounded" />
                            <div style={{ backgroundColor: theme.colors.secondary }} className="rounded" />
                            <div style={{ backgroundColor: theme.colors.accent }} className="rounded" />
                          </div>
                          {activeTheme === theme.name && (
                            <div className="absolute top-1 right-1">
                              <Check className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{theme.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Colors</CardTitle>
              <CardDescription>Fine-tune your theme colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <ColorPicker
                  color={customColors.primary}
                  onChange={(color) => setCustomColors({ ...customColors, primary: color })}
                  label="Primary Color"
                />
                <ColorPicker
                  color={customColors.secondary}
                  onChange={(color) => setCustomColors({ ...customColors, secondary: color })}
                  label="Secondary Color"
                />
                <ColorPicker
                  color={customColors.accent}
                  onChange={(color) => setCustomColors({ ...customColors, accent: color })}
                  label="Accent Color"
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button variant="outline">Reset</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Recent security-related notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={alert.type === "critical" ? "destructive" : "default"}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="flex items-center gap-2">
                    {alert.type === "critical" ? "Critical Alert" : "Warning"}
                    {alert.status === "resolved" && (
                      <Badge className="text-green-600 bg-green-50">
                        Resolved
                      </Badge>
                    )}
                  </AlertTitle>
                  <AlertDescription className="mt-1">
                    <p>{alert.message}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(alert.date).toLocaleString()}
                    </p>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-factor authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Login notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new login attempts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Session timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Select timeout duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
