# Test Review System - Backend API Endpoints

## New Endpoints to Add

### 1. Request Review (Student Side)
```python
@router.post("/attempts/{attempt_id}/request-review")
async def request_test_review(attempt_id: str, payload: Dict[str, Any], current_user=Depends(get_current_user)):
    """
    Student requests manual review of their test result
    """
    attempts = get_collection("cert_test_attempts")
    
    attempt = attempts.find_one({"attempt_id": attempt_id, "user_id": current_user.id})
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    # Check if already passed
    settings = attempt.get("settings", {})
    pass_percentage = settings.get("pass_percentage", 70)
    if attempt.get("score", 0) >= pass_percentage:
        raise HTTPException(status_code=400, detail="You already passed this test")
    
    # Check if eligible for review (within 10% of pass threshold)
    review_threshold = pass_percentage * 0.9
    if attempt.get("score", 0) < review_threshold:
        raise HTTPException(status_code=400, detail="Score too low for review eligibility")
    
    # Update attempt with review request
    attempts.update_one(
        {"attempt_id": attempt_id},
        {"$set": {
            "review_requested": True,
            "review_requested_at": datetime.utcnow(),
            "review_status": "pending",
            "review_reason": payload.get("reason"),
            "student_comment": payload.get("student_comment")
        }}
    )
    
    return {"message": "Review request submitted successfully", "status": "pending"}


### 2. Get All Review Requests (Admin Side)
```python
@router.get("/admin/test-reviews")
async def get_test_reviews(
    status: str = Query(None),
    current_user=Depends(get_current_admin_user)
):
    """
    Get all test review requests for admin dashboard
    """
    attempts = get_collection("cert_test_attempts")
    
    query = {"review_requested": True}
    if status and status != "all":
        query["review_status"] = status
    
    reviews = list(attempts.find(query).sort("review_requested_at", -1))
    
    # Add user information
    users = get_collection("users")
    for review in reviews:
        user = users.find_one({"_id": ObjectId(review["user_id"])})
        if user:
            review["user_name"] = user.get("name", "Unknown")
            review["user_email"] = user.get("email", "")
        
        # Clean up _id for JSON serialization
        review["_id"] = str(review["_id"])
    
    return {"reviews": reviews}


### 3. Submit Review Decision (Admin Side)
```python
@router.put("/admin/test-reviews/{attempt_id}/review")
async def submit_review_decision(
    attempt_id: str,
    payload: Dict[str, Any],
    current_user=Depends(get_current_admin_user)
):
    """
    Admin approves or rejects a test review request
    Can also adjust the score
    """
    attempts = get_collection("cert_test_attempts")
    
    attempt = attempts.find_one({"attempt_id": attempt_id})
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    decision = payload.get("decision")  # "approve" or "reject"
    admin_notes = payload.get("admin_notes")
    new_score = payload.get("new_score")
    
    if not decision or not admin_notes:
        raise HTTPException(status_code=400, detail="Decision and admin notes are required")
    
    update_data = {
        "review_status": "approved" if decision == "approve" else "rejected",
        "reviewed_by": current_user.email,
        "reviewed_at": datetime.utcnow(),
        "admin_notes": admin_notes
    }
    
    # If approving with score change
    if decision == "approve" and new_score is not None:
        old_score = attempt.get("score", 0)
        update_data["score"] = int(new_score)
        update_data["original_score"] = old_score
        update_data["score_adjusted"] = True
        update_data["score_adjustment_reason"] = admin_notes
        
        # Check if new score passes
        settings = attempt.get("settings", {})
        pass_percentage = settings.get("pass_percentage", 70)
        if int(new_score) >= pass_percentage:
            update_data["status"] = "passed"
            update_data["passed"] = True
        
        # Send notification to user about score change
        # TODO: Implement email/notification system
    
    attempts.update_one(
        {"attempt_id": attempt_id},
        {"$set": update_data}
    )
    
    return {
        "message": f"Review {decision}d successfully",
        "new_score": update_data.get("score"),
        "status": update_data.get("status")
    }
```

## File Location
Add these endpoints to: `services/api/src/routes/cert_tests_runtime.py`

## Database Schema Updates

### cert_test_attempts collection - New fields:
```javascript
{
  // ... existing fields ...
  
  // Review System Fields
  "review_requested": Boolean,
  "review_requested_at": ISODate,
  "review_status": "pending" | "approved" | "rejected",
  "review_reason": String,
  "student_comment": String,
  "reviewed_by": String,
  "reviewed_at": ISODate,
  "admin_notes": String,
  "original_score": Number,  // Before adjustment
  "score_adjusted": Boolean,
  "score_adjustment_reason": String
}
```

## Testing the Endpoints

### 1. Student Requests Review:
```bash
POST http://localhost:8000/api/cert-tests/attempts/{attempt_id}/request-review
Headers: Authorization: Bearer {student_token}
Body: {
  "reason": "Score 68% is within review threshold (pass: 70%)",
  "student_comment": "Requesting manual review"
}
```

### 2. Admin Views Reviews:
```bash
GET http://localhost:8000/api/admin/test-reviews?status=pending
Headers: Authorization: Bearer {admin_token}
```

### 3. Admin Approves with Score Change:
```bash
PUT http://localhost:8000/api/admin/test-reviews/{attempt_id}/review
Headers: Authorization: Bearer {admin_token}
Body: {
  "decision": "approve",
  "new_score": 72,
  "admin_notes": "Adjusted score due to ambiguous question #5. Student showed good understanding."
}
```

## Import Statement for Backend
```python
from datetime import datetime
from bson import ObjectId
from fastapi import Query, Depends
```
