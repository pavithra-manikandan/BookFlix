/**
 * ContactPage Component
 *
 * This component displays the "Contact Us" page, showcasing the team behind the application.
 * Each team member is highlighted with their name, major, email, and profile picture.
 *
 * **Purpose**:
 * - Provide users with information about the team members who built the application.
 * - Allow users to easily contact team members via email links.
 *
 * **Features**:
 * 1. **Dynamic Team Data**:
 *    - Team details (name, email, major, and picture) are stored in the `contactData` array.
 *    - Each team member is dynamically rendered using a map function.
 *
 * 2. **Responsive Layout**:
 *    - The page uses Material-UI’s `Grid` component to create a responsive layout, ensuring proper spacing and alignment across devices.
 *
 * 3. **Team Member Card**:
 *    - Displays:
 *      - **Profile Picture**: Shown as a circular avatar using Material-UI's `Avatar` component.
 *      - **Name and Major**: Highlighted with enlarged and styled typography.
 *      - **Email**: Clickable email link (`mailto:`) styled with hover effects for user convenience.
 *    - Each card is styled with a white background, rounded corners, and a subtle shadow for a clean and modern look.
 */
import React from 'react';
import { Box, Typography, Avatar, Grid, Link } from '@mui/material';

// Importing pictures from the 'src/Pictures' folder
import IshiPic from './Pictures/Ishita.jpeg';
import rashi from './Pictures/Rashi.jpeg';
import nam from './Pictures/Nam.jpeg';
import pavi from './Pictures/Pavi.jpeg';

const contactData = [
  {
    name: 'Ishita Agarwal',
    email: 'iagarwal@seas.upenn.edu',
    major: 'Computer Science',
    picture: IshiPic,
  },
  {
    name: 'Rashi Agrawal',
    email: 'agrras@seas.upenn.edu',
    major: 'Computer Science',
    picture: rashi,
  },
  {
    name: 'Namrata Elamaran',
    email: 'namratae@seas.upenn.edu',
    major: 'Data Science',
    picture: nam,
  },
  {
    name: 'Pavithra Manikandan',
    email: 'pavi20@seas.upenn.edu',
    major: 'Computer Science',
    picture: pavi,
  },
];

function ContactPage() {
  return (
    <Box sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#f3f3f3' }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>
      <Typography variant="h5" gutterBottom>
        Meet the Team Behind BOOKFLIX
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ marginTop: '20px' }}>
        {contactData.map((contact, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '30px',
                backgroundColor: '#fff',
                borderRadius: '15px',
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Avatar
                src={contact.picture}
                alt={contact.name}
                sx={{ width: 200, height: 200, marginBottom: '20px' }}
              />
              <Typography variant="h5" gutterBottom>
                {contact.name} {/* Enlarged text */}
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ fontSize: '18px' }}>
                {contact.major}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: '15px', fontSize: '16px' }}>
                <Link href={`mailto:${contact.email}`} underline="hover">
                  {contact.email}
                </Link>
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ContactPage;
