# Certificate Email User Lookup Fix

## Issue
The certificate sending was using `user_email` and `user_name` directly from the test attempt document, which only contained the username (e.g., "gokul2") but not the actual email address. The user's email is stored in the `users` collection, not in the test attempts.

## Root Cause
When a test is started, the system stores:
- `user_id`: "68fc854da37a8f24c3241a15" (MongoDB ObjectId)
- `user_name`: "gokul2" (username from test setup)
- `user_email`: "" (empty or not set in attempts collection)

The actual email address is stored in the `users` collection under the document with `_id: ObjectId("68fc854da37a8f24c3241a15")`.

## Solution Applied

### Backend Changes (`services/api/src/routes/cert_tests_admin.py`)

1. **Added bson import** at the top:
   ```python
   from bson import ObjectId
   ```

2. **Implemented user lookup** to fetch email from users collection:
   ```python
   # Get user email from users collection using user_id
   user_id = attempt.get("user_id")
   user_name = attempt.get("user_name", "Student")
   user_email = None
   
   if user_id:
       users_col = get_collection("users")
       try:
           user_doc = users_col.find_one({"_id": ObjectId(user_id)})
           if user_doc:
               user_email = user_doc.get("email", "")
       except Exception as e:
           print(f"Error fetching user email for user_id {user_id}: {e}")
   
   # Fallback to attempt.user_email if available
   if not user_email:
       user_email = attempt.get("user_email", "")
   
   if not user_email:
       # Show error with detailed message
       results["failed"] += 1
       results["details"].append({
           "attempt_id": attempt_id,
           "user_name": user_name,
           "status": "failed",
           "error": "No email address"
       })
       continue
   ```

## How It Works

### Data Flow
1. **Test Attempt** stores: `user_id`, `user_name`, `score`, `cert_id`, etc.
2. **Certificate Sending** needs: User's email address
3. **System looks up**:
   - First: Fetch user document from `users` collection using `user_id`
   - Get email from `user_doc.email`
   - Fallback: Check `attempt.user_email` if user lookup fails
   - Error: Show "No email address" if both are empty

### Example
```javascript
// Test Attempt Document
{
  "attempt_id": "abc123",
  "user_id": "68fc854da37a8f24c3241a15",  // Reference to users collection
  "user_name": "gokul2",                   // Username (not email!)
  "score": 85,
  "status": "completed"
}

// User Document in users collection
{
  "_id": ObjectId("68fc854da37a8f24c3241a15"),
  "username": "gokul2",
  "email": "gokul2@example.com",          // Actual email address
  "full_name": "Gokul Kumar"
}

// Result: Certificate will be sent to gokul2@example.com ✅
```

## Benefits

1. ✅ **Correct Email Lookup**: Fetches email from the authoritative source (users collection)
2. ✅ **Handles Missing Data**: Graceful fallback if user lookup fails
3. ✅ **Better Error Messages**: Clear indication when email is not found
4. ✅ **Data Consistency**: Uses user_id as the primary reference
5. ✅ **Maintains Display Name**: Still shows username for better UX

## Testing

1. **Navigate** to http://localhost:5174/certificate-management
2. **Select users** including "gokul2" (user_id: 68fc854da37a8f24c3241a15)
3. **Click** "Send Certificates"
4. **Expected Result**: 
   - If user has email in users collection → ✅ Certificate sent successfully
   - If user doesn't have email → ❌ Shows "gokul2: No email address"

## Database Collections

### cert_test_attempts
```javascript
{
  "attempt_id": "unique_id",
  "user_id": "68fc854da37a8f24c3241a15",  // MongoDB ObjectId as string
  "user_name": "gokul2",                  // Display name
  "cert_id": "python-basics",
  "difficulty": "medium",
  "score": 85,
  "status": "completed"
}
```

### users
```javascript
{
  "_id": ObjectId("68fc854da37a8f24c3241a15"),
  "username": "gokul2",
  "email": "gokul2@example.com",  // ← Source of truth for email
  "full_name": "Gokul Kumar",
  "created_at": "2025-01-15T10:30:00Z"
}
```

## Error Handling

The system handles multiple scenarios:

| Scenario | Behavior |
|----------|----------|
| ✅ User has email in users collection | Fetches email, sends certificate |
| ⚠️ user_id not found in attempt | Falls back to attempt.user_email |
| ⚠️ User document not found | Falls back to attempt.user_email |
| ❌ No email in both locations | Shows error: "No email address" |
| ❌ Invalid ObjectId format | Catches exception, shows error |

## Files Modified

1. **services/api/src/routes/cert_tests_admin.py**
   - Added: `from bson import ObjectId` import
   - Modified: `send_bulk_certificates()` function
   - Added: User lookup from users collection
   - Added: Fallback logic for email retrieval

## Next Steps (Optional Improvements)

1. **Pre-validate emails** before showing users in Certificate Management UI
2. **Add email indicator** in the passed users table (✓ Has Email / ⚠️ No Email)
3. **Disable selection** for users without email
4. **Bulk email sync** job to populate user_email in attempts
5. **Email validation** in user profile updates

## Impact

- **Before**: Certificate sending failed for users because username was used instead of email
- **After**: System correctly looks up email from users collection using user_id
- **User Experience**: Clear error messages when email is missing, successful delivery when email exists
