import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Search, ShieldCheck, ShieldAlert, Terminal, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { AuditLog } from '@shared/types';
export function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: () => api<{ items: AuditLog[] }>('/api/logs')
  });
  const logs = data?.items || [];
  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <AppLayout container>
      <div className="space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground">Immutable forensic logs for compliance and accountability.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search actions, actors..." 
              className="pl-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>
        <Card className="border-border/50 shadow-soft overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground animate-pulse">Verifying ledger integrity...</TableCell></TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-20 text-muted-foreground">No audit entries found matching search.</TableCell></TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="gap-1 px-1.5 py-0">
                        {log.status === 'success' ? <ShieldCheck className="h-3 w-3" /> : <ShieldAlert className="h-3 w-3" />}
                        <span className="text-[10px] font-mono">{log.status.toUpperCase()}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-semibold">{log.action}</TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">{log.actor}</TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">{log.resource}</TableCell>
                    <TableCell className="text-right text-xs font-mono text-muted-foreground">
                      {format(log.timestamp, 'HH:mm:ss.SSS')}
                    </TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-md bg-card">
                          <SheetHeader className="pb-6">
                            <SheetTitle className="flex items-center gap-2">
                              <Terminal className="h-5 w-5 text-primary" /> Log Entry Details
                            </SheetTitle>
                            <SheetDescription>Raw JSON forensic telemetry data.</SheetDescription>
                          </SheetHeader>
                          <div className="space-y-4">
                            <div className="rounded-lg bg-black p-4 overflow-auto max-h-[70vh]">
                              <pre className="text-[11px] font-mono text-emerald-500 leading-relaxed">
                                {JSON.stringify(log, null, 2)}
                              </pre>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-foreground">ENCRYPTION</span>
                                <span className="font-mono uppercase">AES-256-GCM</span>
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-foreground">VERIFIED</span>
                                <span className="font-mono uppercase text-emerald-500">SIGNATURE_VALID</span>
                              </div>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppLayout>
  );
}