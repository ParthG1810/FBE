'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/api-client';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  Container
} from '@mui/material';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setError(null);
      const response = await apiClient.post('/auth/login', data);
      login(response.data.token, response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <Container maxWidth="sm" className="min-h-screen flex items-center justify-center">
      <Card className="w-full shadow-xl">
        <CardContent className="space-y-6 p-8">
          <Typography variant="h4" component="h1" align="center" gutterBottom className="font-bold text-gray-800">
            Welcome Back
          </Typography>
          
          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                />
              )}
            />
            
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="password"
                  label="Password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  variant="outlined"
                />
              )}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isSubmitting}
              className="mt-4 py-3 font-semibold"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}