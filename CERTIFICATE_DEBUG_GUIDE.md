# Certificate Sending Debug Guide

## How to Debug Certificate Sending Issues

### Step 1: Open a Terminal to Watch Logs
In a PowerShell terminal, run:
```powershell
docker logs learnquest-api-1 -f
```
This will show live logs as they happen.

### Step 2: Try Sending Certificates
1. Go to http://localhost:5174/certificate-management
2. Select users to send certificates to
3. Click "Send Certificates"

### Step 3: Check the Logs

You should see detailed output like this:

```
[Certificate] Processing attempt abc123 for user gokul2 (ID: 68fc854da37a8f24c3241a15)
[Certificate] Found email in users collection: gokul2@example.com
[Certificate] Attempting to send certificate to gokul2@example.com (gokul2)
[Certificate] Details - Cert: python-basics, Score: 85%, Pass: 70%

============================================================
EMAIL WOULD BE SENT (SMTP not configured):
To: gokul2@example.com
Subject: 🎉 Congratulations! Your python-basics Certificate
Certificate attached: No
============================================================

[Certificate] Email sent result: True
```

### What to Look For

#### ✅ Success Scenario
```
[Certificate] Found email in users collection: user@example.com
[Certificate] Email sent result: True
```

#### ❌ No Email Found
```
[Certificate] User document not found for ID: 68fc854da37a8f24c3241a15
[Certificate] Error: No email address
```

#### ❌ Invalid User ID
```
[Certificate] Error fetching user email for user_id xyz: invalid ObjectId
```

#### ❌ Email Sending Failed
```
[Certificate] Email sent result: False
Error sending email to user@example.com: [error details]
```

## Common Issues and Solutions

### Issue 1: "No email address" error
**Cause**: User doesn't have email in users collection

**Solution**: 
1. Add email to user profile in the database, OR
2. Update user profile through the admin panel

### Issue 2: Email sending returns False
**Cause**: Error in email_utils or SMTP configuration (if configured)

**Solution**: Check the error message in logs for details

### Issue 3: User document not found
**Cause**: Invalid user_id or user deleted

**Solution**: Verify user exists in users collection

### Issue 4: Nothing happens
**Cause**: Frontend not receiving response or API error

**Solution**: 
1. Check browser console (F12) for errors
2. Check API logs for request coming through
3. Verify API endpoint is accessible

## Quick Test Commands

### View Last 50 Lines of Logs
```powershell
docker logs learnquest-api-1 --tail 50
```

### Search Logs for Certificate-Related Entries
```powershell
docker logs learnquest-api-1 | Select-String -Pattern "Certificate"
```

### Search Logs for Errors
```powershell
docker logs learnquest-api-1 | Select-String -Pattern "error|Error|ERROR"
```

### Follow Logs in Real-Time
```powershell
docker logs learnquest-api-1 -f
```
(Press Ctrl+C to stop)

## Frontend Response Check

Open Browser Console (F12) and look for:
```javascript
// Success response
{
  "total": 2,
  "success": 2,
  "failed": 0,
  "details": [
    {
      "attempt_id": "...",
      "user_email": "user@example.com",
      "user_name": "username",
      "status": "sent"
    }
  ]
}

// Failure response
{
  "total": 1,
  "success": 0,
  "failed": 1,
  "details": [
    {
      "attempt_id": "...",
      "user_name": "username",
      "status": "failed",
      "error": "No email address"
    }
  ]
}
```

## SMTP Configuration (Optional - For Production)

If you want to actually send emails, add to your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@learnquest.com
SMTP_FROM_NAME=LearnQuest Certifications
```

**Note**: For Gmail, you need an App Password (not your regular password)

## What Happens Without SMTP Configuration?

- ✅ System still works in **development mode**
- ✅ Logs show "EMAIL WOULD BE SENT" with details
- ✅ Database marks certificates as sent
- ✅ UI shows success messages
- ❌ No actual emails are sent

This is perfect for testing!
