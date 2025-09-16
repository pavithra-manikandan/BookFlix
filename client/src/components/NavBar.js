import { AppBar, Container, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

function NavText({ href, text, isMain }) {
  return (
    <Typography
      variant={isMain ? 'h5' : 'subtitle1'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.2rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  );
}

export default function NavBar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in

  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem('token');
    console.log('Logged out successfully');

    // Redirect to the login page
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Branding */}
          <NavText href="/" text="BOOKFLIX" isMain />

          {/* Navigation Links */}
          {isAuthenticated ? (
            <>
              <NavText href="/search/books" text="Search Books" />
              <NavText href="/search/movies" text="Search Movies" />
              <NavText href="/dashboard" text="Dashboard" />
              <NavText href="/bing" text="Search" />
              <NavText href="/contact-us" text="Contact-Us" />
            </>
          ) : (
            <>
              <NavText href="/" text="Login" />
              <NavText href="/signup" text="Sign Up" />
            </>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <Box sx={{ marginLeft: 'auto' }}>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
