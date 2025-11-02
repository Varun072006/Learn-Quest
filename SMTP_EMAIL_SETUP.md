# SMTP Email Setup Guide

## Current Status
✅ Certificate system is working perfectly!
✅ Email templates are generated
✅ System marks certificates as sent in database
⚠️ **Emails are NOT actually sent** (Development mode - prints to console)

## To Send Real Emails

You need to configure SMTP settings in your environment variables.

### Option 1: Gmail (Recommended for Testing)

#### Step 1: Create Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click **Security** in the left menu
3. Enable **2-Step Verification** if not already enabled
4. Search for "App passwords" or go to: https://myaccount.google.com/apppasswords
5. Select **Mail** as the app and **Other** as the device
6. Name it "LearnQuest" and click **Generate**
7. **Copy the 16-character password** (it will be shown only once)
kivy dfcw vjzf eatl
#### Step 2: Update .env File

Create or edit the `.env` file in your project root:

```env
# Gmail SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=LearnQuest Certifications
```

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=gokul9942786@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM_EMAIL=gokul9942786@gmail.com
SMTP_FROM_NAME=LearnQuest Certifications
```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com/ (Free tier: 100 emails/day)
2. Create an API Key
3. Configure:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=LearnQuest Certifications
```

### Option 3: AWS SES (For High Volume)

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-smtp-username
SMTP_PASSWORD=your-aws-smtp-password
SMTP_FROM_EMAIL=noreply@yourdomain.com
SMTP_FROM_NAME=LearnQuest Certifications
```

## After Configuration

### Step 1: Update Docker Environment

Add these variables to your `docker-compose.yml` under the `api` service:

```yaml
api:
  build:
    context: .
    dockerfile: services/api/Dockerfile
  env_file:
    - .env  # This will load your .env file
  environment:
    - SMTP_HOST=${SMTP_HOST}
    - SMTP_PORT=${SMTP_PORT}
    - SMTP_USER=${SMTP_USER}
    - SMTP_PASSWORD=${SMTP_PASSWORD}
    - SMTP_FROM_EMAIL=${SMTP_FROM_EMAIL}
    - SMTP_FROM_NAME=${SMTP_FROM_NAME}
```

### Step 2: Restart API Container

```powershell
docker compose restart api
```

### Step 3: Test Sending

1. Go to http://localhost:5174/certificate-management
2. Select a user and click "Send Certificates"
3. **Check the recipient's email inbox!** 📧

## Verification

### Check if SMTP is Working

Watch the logs:
```powershell
docker logs learnquest-api-1 -f
```

**Before SMTP config:**
```
EMAIL WOULD BE SENT (SMTP not configured):
To: user@example.com
```

**After SMTP config:**
```
[Certificate] Attempting to send certificate to user@example.com (username)
[Certificate] Email sent result: True
```

And the email will **actually arrive** in the inbox! ✅

### If Email Doesn't Arrive

1. **Check spam folder**
2. **Verify SMTP credentials** are correct
3. **Check logs** for errors:
   ```powershell
   docker logs learnquest-api-1 | Select-String -Pattern "error|Error|ERROR"
   ```

## Gmail Troubleshooting

### Error: "Username and Password not accepted"
- Make sure you're using an **App Password**, not your regular password
- Enable 2-Step Verification first
- Remove spaces from the app password

### Error: "Authentication failed"
- Double-check the app password
- Make sure SMTP_USER is your full Gmail address

### Error: "Daily sending quota exceeded"
- Gmail limits: 500 emails/day for free accounts
- Upgrade to Google Workspace or use SendGrid

## Email Template

The email being sent includes:

✅ Beautiful HTML design with gradient header
✅ User's name and achievement details
✅ Score, difficulty level, and completion date
✅ Certificate ID
✅ Social sharing message
✅ Professional formatting

**Subject:** 🎉 Congratulations! Your [Cert Name] Certificate

## Security Notes

⚠️ **Never commit .env file to Git!**
- Add `.env` to `.gitignore`
- Use environment variables in production
- Rotate credentials regularly

## Quick Start (Gmail)

1. Get Gmail App Password (16 characters)
2. Create `.env` file:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=youremail@gmail.com
   SMTP_PASSWORD=your app password here
   SMTP_FROM_EMAIL=youremail@gmail.com
   SMTP_FROM_NAME=LearnQuest Certifications
   ```
3. Add to `docker-compose.yml`:
   ```yaml
   api:
     env_file:
       - .env
   ```
4. Run: `docker compose restart api`
5. Test sending certificates!

## Current Implementation

The email system (`services/api/src/email_utils.py`) automatically detects:
- **No SMTP configured** → Prints to console (development mode)
- **SMTP configured** → Sends real emails via SMTP

No code changes needed - just add environment variables!
