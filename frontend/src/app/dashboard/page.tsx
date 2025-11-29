'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/api-client';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  AppBar, 
  Toolbar, 
  Button,
  CircularProgress
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Example data fetch
  const { data: stats, error } = useSWR(user ? '/dashboard/stats' : null, fetcher, {
    shouldRetryOnError: false
  });

  if (authLoading) {
    return (
      <Box className="flex h-screen items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box className="flex flex-col min-h-screen">
      <AppBar position="static">
        <Toolbar>
          <DashboardIcon className="mr-2" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Enterprise Dashboard
          </Typography>
          <Typography className="mr-4">Hello, {user.name}</Typography>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box component="main" className="flex-grow p-8 bg-gray-50">
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Paper className="p-6">
              <Typography variant="h5" gutterBottom className="font-bold">
                Overview
              </Typography>
              <Typography paragraph color="textSecondary">
                This is a protected route. Only authenticated users can see this.
                The frontend is using Next.js App Router, while the backend is Express connected to MySQL.
              </Typography>
            </Paper>
          </Grid>

          {/* Dummy Stats Cards */}
          <Grid item xs={12} md={4}>
            <Paper className="p-6 text-center h-full border-t-4 border-blue-500">
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h3" className="text-blue-600 my-4">
                {stats?.userCount || 1}
              </Typography>
              <Typography variant="caption" color="textSecondary">Active in database</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="p-6 text-center h-full border-t-4 border-green-500">
              <Typography variant="h6">System Status</Typography>
              <Typography variant="h3" className="text-green-600 my-4">
                OK
              </Typography>
              <Typography variant="caption" color="textSecondary">All systems operational</Typography>
            </Paper>
          </Grid>
           <Grid item xs={12} md={4}>
            <Paper className="p-6 text-center h-full border-t-4 border-purple-500">
              <Typography variant="h6">API Latency</Typography>
              <Typography variant="h3" className="text-purple-600 my-4">
                24ms
              </Typography>
              <Typography variant="caption" color="textSecondary">Average response time</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}