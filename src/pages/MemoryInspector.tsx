import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Search, Database, Fingerprint, Calendar, ArrowRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api-client';
import { format } from 'date-fns';
import type { SemanticMemory } from '@shared/types';
export function MemoryInspector() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['memories'],
    queryFn: () => api<{ items: SemanticMemory[] }>('/api/memory')
  });
  const searchMutation = useMutation({
    mutationFn: (vector: number[]) => api<SemanticMemory[]>('/api/memory/retrieve', {
      method: 'POST',
      body: JSON.stringify({ vector, limit: 3 })
    })
  });
  const handleSimulateSearch = () => {
    // Simulated vector for demonstration (randomized based on query length)
    const mockVector = [query.length / 10, Math.random(), 0.5, 0.2];
    searchMutation.mutate(mockVector);
  };
  const memories = data?.items || [];
  return (
    <AppLayout container>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Memory Inspector</h1>
          <p className="text-muted-foreground">Forensic semantic vector database explorer.</p>
        </header>
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Simulate semantic search query..." 
                  className="pl-9 bg-background"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleSimulateSearch} disabled={searchMutation.isPending}>
                {searchMutation.isPending ? 'Calculating...' : 'Retrieve Vectors'}
              </Button>
            </div>
          </CardContent>
        </Card>
        {searchMutation.data && (
          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="h-4 w-4" /> Semantic Matches
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {searchMutation.data.map((mem) => (
                <Card key={mem.id} className="border-primary/20 bg-primary/5">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-mono truncate">{mem.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-xs line-clamp-3 text-foreground/90">{mem.content}</p>
                    <div className="mt-3 flex justify-end">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1">
                        Inspect <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stored Memories</CardTitle>
            <CardDescription>Transactional history of semantic ingestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">ID</TableHead>
                  <TableHead>Content Preview</TableHead>
                  <TableHead className="w-[120px]">Vectors</TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Loading forensic data...</TableCell></TableRow>
                ) : memories.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No memories recorded.</TableCell></TableRow>
                ) : (
                  memories.map((mem) => (
                    <TableRow key={mem.id} className="font-mono text-xs">
                      <TableCell className="font-bold">{mem.id}</TableCell>
                      <TableCell className="max-w-md truncate font-sans text-sm">{mem.content}</TableCell>
                      <TableCell>
                        <span className="bg-muted px-1 rounded text-[10px]">FLOAT[{mem.vector.length}]</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(mem.createdAt, 'MMM d, HH:mm:ss')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}