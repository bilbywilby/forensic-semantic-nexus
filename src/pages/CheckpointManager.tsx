import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, History, Plus, RotateCcw, Hash, Clock, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Checkpoint } from '@shared/types';
export function CheckpointManager() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['checkpoints'],
    queryFn: () => api<{ items: Checkpoint[] }>('/api/checkpoints')
  });
  const createMutation = useMutation({
    mutationFn: (cp: { name: string, description: string }) => api<Checkpoint>('/api/checkpoints', {
      method: 'POST',
      body: JSON.stringify(cp)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkpoints'] });
      toast.success('Checkpoint created successfully');
      setIsDialogOpen(false);
      setNewName('');
      setNewDesc('');
    }
  });
  const rollbackMutation = useMutation({
    mutationFn: (id: string) => api<{ restoredId: string }>('/api/checkpoints/rollback', {
      method: 'POST',
      body: JSON.stringify({ id })
    }),
    onSuccess: (res) => {
      toast.success(`System state restored to ${res.restoredId}`);
    }
  });
  const checkpoints = data?.items || [];
  return (
    <AppLayout container>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Checkpoint Manager</h1>
            <p className="text-muted-foreground font-mono text-sm">Immutable system state versioning and rollbacks.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Checkpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Checkpoint</DialogTitle>
                <DialogDescription>
                  Capture the current system state. This will create an immutable forensic hash.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="v1.2.0 Stable" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Describe the current state..." />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => createMutation.mutate({ name: newName, description: newDesc })} disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Verifying Hash...' : 'Seal Checkpoint'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground font-mono animate-pulse">Scanning state history...</div>
          ) : (
            <AnimatePresence>
              {checkpoints.map((cp, idx) => (
                <motion.div
                  key={cp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-background shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <History className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-soft hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        {cp.name}
                        {idx === 0 && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded border border-emerald-500/20">LATEST</span>}
                      </h3>
                      <time className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {format(cp.createdAt, 'yyyy-MM-dd HH:mm')}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {cp.description || 'No additional telemetry data recorded.'}
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono bg-muted/50 px-2 py-1 rounded truncate flex-1">
                        <Hash className="h-3 w-3 text-primary" />
                        <span className="truncate">{cp.hash}</span>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="h-8 text-[11px] gap-1 px-3" 
                        onClick={() => rollbackMutation.mutate(cp.id)}
                        disabled={rollbackMutation.isPending}
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Rollback
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </AppLayout>
  );
}