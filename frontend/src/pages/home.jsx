import React, { useContext, useState, useEffect } from 'react';
import withAuth from '../utils/withAuth';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  IconButton,
  TextField,
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState('');
  const [history, setHistory] = useState([]);
  const { addToUserHistory, getHistoryOfUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistoryOfUser();
        // Take only top 5 recent meetings
        setHistory(data.slice(-5).reverse());
      } catch (err) {
        console.error("Error fetching history: ", err);
      }
    };
    fetchHistory();
  }, [getHistoryOfUser]);

  const handleJoinVideoCall = async (codeToJoin) => {
    const finalCode = codeToJoin || meetingCode;
    if (!finalCode || !finalCode.trim()) return;
    await addToUserHistory(finalCode);
    navigate(`/${finalCode}`);
  };

  const generateMeetingCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let p1 = '', p2 = '', p3 = '';
    for (let i = 0; i < 3; i++) p1 += chars[Math.floor(Math.random() * 26)];
    for (let i = 0; i < 4; i++) p2 += chars[Math.floor(Math.random() * 26)];
    for (let i = 0; i < 3; i++) p3 += chars[Math.floor(Math.random() * 26)];
    return `${p1}-${p2}-${p3}`;
  };

  const handleStartInstantMeeting = async () => {
    const code = generateMeetingCode();
    await addToUserHistory(code);
    navigate(`/${code}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #181b3d 0%, #070814 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
      }}
    >
      {/* Premium Glassmorphic Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 6 },
          py: 2,
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 10px rgba(255, 152, 57, 0.2))' }}>
            <defs>
              <linearGradient id="logoGradHome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF9839" />
                <stop offset="100%" stopColor="#FF5E62" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="28" fill="url(#logoGradHome)" />
            <rect x="25" y="33" width="32" height="32" rx="6" fill="white" />
            <polygon points="56,41 72,31 72,67 56,57" fill="white" />
            <path d="M30,49 L36,49 L39,39 L43,59 L46,49 L52,49" stroke="#FF5E62" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '0.5px' }}>
            Vibe<span style={{ color: '#FF9839' }}>Connect</span>
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="text"
            startIcon={<HistoryIcon />}
            onClick={() => navigate('/history')}
            sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none', '&:hover': { color: '#fff' } }}
          >
            History
          </Button>
          <IconButton
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/auth');
            }}
            sx={{
              color: '#FF5E62',
              bgcolor: 'rgba(255, 94, 98, 0.1)',
              border: '1px solid rgba(255, 94, 98, 0.2)',
              borderRadius: '10px',
              padding: '10px',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: '#FF5E62',
                color: '#fff',
                transform: 'scale(1.05)',
              }
            }}
            title="Logout"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 4, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Grid container spacing={4} alignItems="center">
          
          {/* Left Side: Dynamic Controls */}
          <Grid item xs={12} md={7}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography
                variant="h2"
                fontWeight="900"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  background: 'linear-gradient(45deg, #FF9839 30%, #FF5E62 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Connect, Collaborate, & Celebrate from anywhere.
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontWeight: '400', mb: 5, lineHeight: 1.6 }}>
                High-quality video meetings designed for everyone. Host meetings, share screen, and record calls with one click.
              </Typography>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2.5,
                  alignItems: 'stretch',
                  mb: 4
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<VideoCallIcon />}
                  onClick={handleStartInstantMeeting}
                  sx={{
                    bgcolor: '#FF9839',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1.05rem',
                    borderRadius: '12px',
                    px: 3.5,
                    py: 1.8,
                    boxShadow: '0 8px 24px rgba(255, 152, 57, 0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: '#ff7f00',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 30px rgba(255, 152, 57, 0.4)',
                    }
                  }}
                >
                  New Meeting
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    flexGrow: 1,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    px: 2,
                    py: 0.5,
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    '&:focus-within': {
                      borderColor: '#FF9839',
                      boxShadow: '0 0 10px rgba(255,152,57,0.2)',
                    }
                  }}
                >
                  <KeyboardIcon sx={{ color: 'rgba(255,255,255,0.4)', mr: 1.5 }} />
                  <TextField
                    placeholder="Enter meeting code"
                    variant="standard"
                    value={meetingCode}
                    onChange={(e) => setMeetingCode(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      style: { color: 'white', fontSize: '1rem', width: '100%' }
                    }}
                    sx={{ flexGrow: 1 }}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinVideoCall()}
                  />
                  <IconButton
                    onClick={() => handleJoinVideoCall()}
                    disabled={!meetingCode.trim()}
                    sx={{
                      color: meetingCode.trim() ? '#FF9839' : 'rgba(255,255,255,0.2)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', my: 4 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                Learn more about <span style={{ color: '#FF9839', cursor: 'pointer', textDecoration: 'underline' }}>security</span> and <span style={{ color: '#FF9839', cursor: 'pointer', textDecoration: 'underline' }}>privacy</span> terms.
              </Typography>
            </Box>
          </Grid>

          {/* Right Side: Glassmorphic History Card */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <HistoryIcon style={{ color: '#FF9839' }} />
                  Recent Activity
                </Typography>

                {history.length > 0 ? (
                  <List sx={{ width: '100%', p: 0 }}>
                    {history.map((item, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          sx={{
                            px: 0,
                            py: 1.8,
                            transition: 'all 0.2s',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.02)',
                            }
                          }}
                        >
                          <ListItemText
                            primary={`Meeting: ${item.meetingCode}`}
                            secondary={`Date: ${formatDate(item.date)}`}
                            primaryTypographyProps={{ style: { fontWeight: 600, color: '#fff', fontSize: '0.95rem' } }}
                            secondaryTypographyProps={{ style: { color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.8rem' } }}
                          />
                          <ListItemSecondaryAction>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleJoinVideoCall(item.meetingCode)}
                              sx={{
                                color: '#FF9839',
                                borderColor: 'rgba(255, 152, 57, 0.3)',
                                textTransform: 'none',
                                borderRadius: '8px',
                                '&:hover': {
                                  borderColor: '#FF9839',
                                  bgcolor: 'rgba(255, 152, 57, 0.05)',
                                }
                              }}
                            >
                              Rejoin
                            </Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < history.length - 1 && (
                          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                    <MeetingRoomIcon sx={{ fontSize: 48, mb: 1, color: 'rgba(255,255,255,0.2)' }} />
                    <Typography variant="body1">No recent meetings found.</Typography>
                    <Typography variant="caption">Start a new meeting to see activity here.</Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
      </Container>
    </Box>
  );
}

export default withAuth(HomeComponent);
