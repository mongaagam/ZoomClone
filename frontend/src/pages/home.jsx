import React, { useContext, useState } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  TextField,
  Box,
  Container,
  Typography,
  Paper,
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    if (!meetingCode.trim()) return;
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
          py: 2,
          bgcolor: '#1976d2',
          color: 'white',
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
           Video Call
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/history')} sx={{ color: 'white' }}>
            <RestoreIcon />
          </IconButton>
          <Typography sx={{ fontSize: 16 }}>History</Typography>
          <Button
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/auth');
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: 4,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
          }}
        >
          {/* Left Side */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ mb: 3, textAlign: { xs: 'center', md: 'left' } }}
            >
              Quality Video Calls Just Like Quality Education
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                value={meetingCode}
                label="Enter Meeting Code"
                variant="outlined"
                size="medium"
                sx={{ width: { xs: '100%', sm: '300px' } }}
              />
              <Button
                onClick={handleJoinVideoCall}
                variant="contained"
                size="large"
                sx={{ px: 4 }}
              >
                Join
              </Button>
            </Box>
          </Box>

          {/* Right Side Image */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <img
              src="/logo3.png"
              alt="Video Call Logo"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
            />
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default withAuth(HomeComponent);
