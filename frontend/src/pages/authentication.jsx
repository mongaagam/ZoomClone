import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Dialog, DialogContent, List, ListItem, ListItemAvatar, ListItemText, ListItemButton, Divider, Typography } from '@mui/material';
import Spline from '@splinetool/react-spline';

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formState, setFormState] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const { handleRegister, handleLogin } = React.useContext(AuthContext);

  const [googleModal, setGoogleModal] = React.useState(false);
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const [customName, setCustomName] = React.useState('');
  const [customEmail, setCustomEmail] = React.useState('');
  const [customPassword, setCustomPassword] = React.useState('');

  const VibeConnectLogo = ({ size = 48, showText = false }) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: 1 }}>
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9839" />
            <stop offset="100%" stopColor="#FF5E62" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <rect width="100" height="100" rx="28" fill="url(#logoGrad)" filter="url(#glow)" />
        <rect x="25" y="33" width="32" height="32" rx="6" fill="white" />
        <polygon points="56,41 72,31 72,67 56,57" fill="white" />
        <path d="M30,49 L36,49 L39,39 L43,59 L46,49 L52,49" stroke="#FF5E62" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {showText && (
        <Typography variant="h5" fontWeight="900" sx={{ color: '#1a1a1a', letterSpacing: '0.5px', mt: 1 }}>
          Vibe<span style={{ color: '#FF9839' }}>Connect</span>
        </Typography>
      )}
    </Box>
  );

  const GoogleLogo = () => (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: 8 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );

  const handleGoogleLogin = async (displayName, emailPrefix, email) => {
    try {
      setGoogleModal(false);
      const cleanUsername = emailPrefix.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      
      try {
        await handleLogin(cleanUsername, "google_oauth_bypass");
      } catch (err) {
        console.log("User does not exist, registering first...");
        await handleRegister(displayName, cleanUsername, "google_oauth_bypass");
        await handleLogin(cleanUsername, "google_oauth_bypass");
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Google Auth simulation failed');
    }
  };

  const handleCustomGoogleAuth = async () => {
    if (!customName || !customEmail || !customPassword) {
      setError("Please fill all fields for Google Auth");
      return;
    }
    const emailPrefix = customEmail.split('@')[0];
    const cleanUsername = emailPrefix.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    try {
      setGoogleModal(false);
      try {
        await handleLogin(cleanUsername, customPassword);
      } catch (err) {
        console.log("User does not exist, registering first...");
        await handleRegister(customName, cleanUsername, customPassword);
        await handleLogin(cleanUsername, customPassword);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Google Auth simulation failed');
    }
  };

  const handleAuth = async () => {
    try {
      if (formState === 0) {
        await handleLogin(username, password);
      } else {
        const result = await handleRegister(name, username, password);
        setUsername('');
        setMessage(result);
        setOpen(true);
        setError('');
        setFormState(0);
        setPassword('');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />

        {/* Left Side: Spline Fullscreen */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{ position: 'relative', overflow: 'hidden' }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Spline scene="https://prod.spline.design/nH8znXlxg-gWC3Bh/scene.splinecode" />
          </Box>
        </Grid>

        {/* Right Side: Glassmorphism Form */}
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 400,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              textAlign: 'center',
            }}
          >
            <VibeConnectLogo size={54} showText={true} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2, mb: 2 }}>
              <Button
                variant={formState === 0 ? 'contained' : 'outlined'}
                onClick={() => setFormState(0)}
                sx={{ flex: 1 }}
              >
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? 'contained' : 'outlined'}
                onClick={() => setFormState(1)}
                sx={{ flex: 1 }}
              >
                Sign Up
              </Button>
            </Box>

            <Box component="form" noValidate>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
              />

              <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                onClick={handleAuth}
              >
                {formState === 0 ? 'Login' : 'Register'}
              </Button>

              <Divider sx={{ my: 2, color: 'rgba(255,255,255,0.7)' }}>or</Divider>

              <Button
                type="button"
                fullWidth
                variant="outlined"
                startIcon={<GoogleLogo />}
                onClick={() => setGoogleModal(true)}
                sx={{
                  color: '#202124',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  '&:hover': {
                    backgroundColor: 'white',
                    borderColor: 'white',
                  }
                }}
              >
                {formState === 0 ? 'Sign in with Google' : 'Sign up with Google'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog 
        open={googleModal} 
        onClose={() => setGoogleModal(false)}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '380px',
            width: '100%',
            fontFamily: 'Roboto, Arial, sans-serif'
          }
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" style={{ margin: 'auto' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 500, fontSize: '1.25rem' }}>
            Choose an account
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            to continue to VibeConnect
          </Typography>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleGoogleLogin("Agam Monga", "mongaagam", "mongaagam@gmail.com")} sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#4285F4', color: 'white' }}>A</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Agam Monga" 
                  secondary="mongaagam@gmail.com" 
                  primaryTypographyProps={{ style: { fontWeight: 500, fontSize: '0.9rem' } }}
                  secondaryTypographyProps={{ style: { fontSize: '0.8rem' } }}
                />
              </ListItemButton>
            </ListItem>
            
            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={() => handleGoogleLogin("Test User", "testuser", "testuser@gmail.com")} sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#34A853', color: 'white' }}>T</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Test User" 
                  secondary="testuser@gmail.com"
                  primaryTypographyProps={{ style: { fontWeight: 500, fontSize: '0.9rem' } }}
                  secondaryTypographyProps={{ style: { fontSize: '0.8rem' } }}
                />
              </ListItemButton>
            </ListItem>

            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={() => setShowCustomInput(!showCustomInput)} sx={{ py: 1.5 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#f1f3f4', color: 'rgba(0,0,0,0.54)' }}>+</Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary="Use another account" 
                  primaryTypographyProps={{ style: { fontWeight: 500, fontSize: '0.9rem', color: '#1a73e8' } }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {showCustomInput && (
            <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField 
                label="Full Name" 
                size="small" 
                fullWidth 
                value={customName}
                onChange={e => setCustomName(e.target.value)}
              />
              <TextField 
                label="Email" 
                size="small" 
                fullWidth 
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
              />
              <TextField 
                label="Password" 
                type="password"
                size="small" 
                fullWidth 
                value={customPassword}
                onChange={e => setCustomPassword(e.target.value)}
              />
              <Button 
                variant="contained" 
                size="small" 
                fullWidth 
                onClick={handleCustomGoogleAuth}
              >
                Sign In / Sign Up
              </Button>
            </Box>
          )}

          <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 3, textAlign: 'center', px: 2 }}>
            To continue, Google will share your name, email address, and profile picture with VibeConnect.
          </Typography>
        </DialogContent>
      </Dialog>

      <Snackbar open={open} autoHideDuration={4000} message={message} />
    </ThemeProvider>
  );
}
