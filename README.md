# Email Marketing Sequence Builder

A visual flowchart-based email marketing sequence builder that lets you design automated email campaigns with ease.


## 🚀 Features

- **Visual Flowchart Interface**: Drag and drop nodes to create complex email sequences
- **Email Scheduling**: Automatically schedule emails based on your flowchart design
- **Delay Nodes**: Add wait times between emails for better engagement
- **Lead Source Nodes**: Segment your audience based on where they came from
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices

## 💻 Tech Stack

- **Frontend**: React, Next.js, ReactFlow, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Email**: Nodemailer
- **Scheduling**: Agenda.js
- **Authentication**: JWT

## 📋 Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (v21 or higher)
- npm or yarn
- MongoDB (local or Atlas)

\`\`\`
# MongoDB Connection String
MONGODB_URI= Your MongoDB connection string

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server Port
PORT=5000
\`\`\`

3. **Install dependencies**

\`\`\`bash
# Install server dependencies
cd server
npm start

# Install client dependencies
cd ../client
npm run dev
\`\`\`

4. **Start the development servers**

\`\`\`bash
# Start the backend server (from the server directory)
npm start

# Start the frontend (from the client directory, in a new terminal)
npm run dev
\`\`\`

5. **Access the application**

Open your browser and navigate to `http://localhost:3000`

## 🎮 How to Use

### Creating an Email Sequence

1. Register or log in to your account
2. Click "Create New Sequence" on the dashboard
3. Drag nodes from the sidebar onto the canvas:
   - **Cold Email**: For composing email content
   - **Wait/Delay**: For adding time delays between emails
   - **Lead Source**: For segmenting your audience
4. Connect the nodes by dragging from one node's handle to another
5. Configure each node by filling in the required information:
   - For Email nodes: recipient, subject, and body
   - For Delay nodes: time duration and unit (minutes, hours, days)
   - For Lead Source nodes: source type
6. Click "Save Flow" to save your sequence and schedule the emails

### Example Sequence

A simple follow-up sequence might look like:
1. Initial Cold Email → Wait 2 Days → Follow-up Email
2. If using Lead Source: Website Lead → Cold Email → Wait 1 Day → Follow-up

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user data (protected)

### Email Sequence Endpoints

- `POST /api/flows` - Save a flow and schedule emails
- `POST /api/schedule-email` - Schedule a single email


## ⚠️ Troubleshooting

### Email Sending Issues

If you're having trouble with email sending:

1. **Gmail users**: Make sure you're using an App Password, not your regular password
2. **SMTP errors**: Check your EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS in .env
3. **Development mode**: Use Ethereal for testing (see server.js)

### MongoDB Connection Issues

1. Check your connection string in .env
2. Make sure MongoDB is running locally or your Atlas cluster is accessible
3. Check for network restrictions if using Atlas

Sure bro! Here's an extended and more polished version of your **Future Improvements** section with some cool ideas that can really level up your Email Sequence Builder project:

---

## 🚀 Future Improvements

- ** Email Template Library**  
  A collection of pre-designed email templates that users can drag & drop or customize for faster campaign creation.

- ** Analytics Dashboard**  
  Visual insights into campaign performance — open rates, click-through rates, bounce rates, and unsubscribe trends.

- ** Advanced Node Types**  
  Add more logic-based nodes like:
  - Conditional branches (if opened, then →)  
  - Goal completion triggers  
  - Wait for reply / Smart delay nodes

- ** Import Contacts from CSV**  
  Let users bulk upload email lists with CSV support and basic data validation.

- ** Rate Limiting & Smart Throttling**  
  Prevent spam, control email send rate, and add intelligent delays between email sends.

- ** Security Enhancements**  
  - API key/token management  
  - Role-based access controls  
  - Audit logs and suspicious activity alerts

- ** Campaign Scheduler**  
  Let users pick exact start dates & times for sequences, or even sync with timezones.

- ** A/B Testing**  
  Support for testing different subject lines or email bodies to see what performs better.

- ** Sequence Pause/Resume**  
  Allow pausing and resuming email sequences per user or globally.

- ** AI-Assisted Suggestions**  
  Recommend subject lines or email body improvements using OpenAI.

- ** Export Campaign Reports**  
  Let users export campaign analytics as PDF/CSV for sharing with teams or clients.


## 🙏 Acknowledgments

- [ReactFlow](https://reactflow.dev/) for the amazing flowchart library
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Agenda.js](https://github.com/agenda/agenda) for the job scheduling
- [Nodemailer](https://nodemailer.com/) for the email functionality

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by Chaitanya K

If you find any issues or have suggestions, feel free to open an issue or submit a PR!
