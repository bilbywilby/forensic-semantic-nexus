import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Zap, Cpu, Server, Globe, ShieldCheck } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api-client';
import type { MetricPoint } from '@shared/types';
export function HealthMonitor() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['health-extended'],
    queryFn: () => api<{
      status: string;
      apiLatency: number;
      memoryUsage: number;
      uptime: number;
      metrics: MetricPoint[]
    }>('/api/health/extended'),
    refetchInterval: 5000
  });
  const metrics = health?.metrics || [];
  return (
    <AppLayout container>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Deep-dive observability into the Nexus Edge fabric.</p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" /> Latency Over Time (ms)
              </CardTitle>
              <CardDescription>Average response distribution across edge nodes.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--background)/0.8)', backdropFilter: 'blur(8px)', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Edge Distribution
              </CardTitle>
              <CardDescription>Global node map status.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className={`h-6 w-6 rounded-md ${i === 7 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'} shadow-sm border border-white/10`} />
                    <span className="text-[8px] font-mono uppercase text-muted-foreground">NODE-{i + 1}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-mono">{health?.uptime || 0}s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Replication</span>
                  <span className="font-mono text-emerald-500">SYNCED</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Active Streams</span>
                  <span className="font-mono">14.2k</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" /> Memory Pressure (%)
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background)/0.8)', backdropFilter: 'blur(8px)', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Area type="step" dataKey="errors" stroke="#06b6d4" fillOpacity={1} fill="url(#colorMem)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Security Baseline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Data-at-rest Encryption</span>
                  </div>
                  <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">AES-256</span>
                </div>
                <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">Access Control Policy</span>
                  </div>
                  <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">RBAC v2</span>
                </div>
                <div className="flex items-center justify-between p-4 px-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium">TLS Termination</span>
                  </div>
                  <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded">TLS 1.3</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}