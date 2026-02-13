import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Activity, 
  Cpu, 
  Clock, 
  Database, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { MetricPoint } from '@shared/types';
export function HomePage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['health-extended'],
    queryFn: () => api<{ 
      status: string; 
      apiLatency: number; 
      memoryUsage: number; 
      metrics: MetricPoint[] 
    }>('/api/health/extended'),
    refetchInterval: 10000
  });
  return (
    <AppLayout container>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nexus Dashboard</h1>
            <p className="text-muted-foreground font-mono text-sm">Real-time system observability and forensic status.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={health?.status === 'healthy' ? 'default' : 'destructive'} className="h-6 gap-1 px-2 font-mono">
              <span className={health?.status === 'healthy' ? 'animate-pulse' : ''}>��</span>
              {health?.status?.toUpperCase() || 'OFFLINE'}
            </Badge>
            <span className="text-xs text-muted-foreground font-mono">NODE_ID: 0x9AF4B</span>
          </div>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Avg Latency" 
            value={`${health?.apiLatency ?? '--'}ms`} 
            desc="Global Edge response time" 
            icon={Clock} 
          />
          <StatCard 
            title="Throughput" 
            value="1.2k" 
            desc="Requests per minute" 
            icon={TrendingUp} 
            trend="+12%"
          />
          <StatCard 
            title="Memory Load" 
            value={`${health?.memoryUsage ?? '--'}%`} 
            desc="Durable Object state usage" 
            icon={Database} 
          />
          <StatCard 
            title="Error Rate" 
            value="0.02%" 
            desc="Failed transactions (24h)" 
            icon={AlertCircle} 
            trend="-2%"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4 bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base font-medium">Request Throughput</CardTitle>
              <CardDescription>Real-time API traffic monitoring</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={health?.metrics ?? []}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorReq)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="md:col-span-3 bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-base font-medium">Active Monitoring</CardTitle>
              <CardDescription>System resource distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <HealthItem label="API Runtime" status="Nominal" value="4ms" />
              <HealthItem label="DO Consistency" status="Verified" value="100%" />
              <HealthItem label="Audit Pipeline" status="Active" value="Async" />
              <HealthItem label="Memory Index" status="Optimized" value="O(log n)" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
function StatCard({ title, value, desc, icon: Icon, trend }: any) {
  return (
    <Card className="bg-card/50 border-border/50 hover:bg-card/80 transition-colors shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted-foreground">{desc}</p>
          {trend && (
            <span className={cn("text-[10px] font-bold px-1 rounded", trend.startsWith('+') ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10")}>
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
function HealthItem({ label, status, value }: { label: string; status: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        <p className="text-xs text-muted-foreground">{status}</p>
      </div>
      <div className="text-sm font-mono font-medium text-primary">{value}</div>
    </div>
  );
}
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}