# 📍 Review Button Location Guide

## Where Students Click "Request Manual Review"

### 🎯 Test Results Page (Regular Certification Tests)
**File:** `apps/web-frontend/src/components/certification/TestResults.jsx`  
**Route:** `/certification/results/:attemptId`

#### Visual Location:
```
┌──────────────────────────────────────────────────────────┐
│                    🏆 Test Completed                      │
│                   Congratulations!                        │
│     You have successfully passed the certification        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│                    Final Score                            │
│                       68%                                 │
│              Required to pass: 70%                        │
│                   [NOT PASSED]                            │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 📈 Eligible for Manual Review                    │    │
│  │                                                   │    │
│  │ You scored 68%, just 2% below the pass           │    │
│  │ threshold. Your test can be reviewed by an       │    │
│  │ administrator for potential score adjustment.    │    │
│  │                                                   │    │
│  │     [Request Manual Review]  ← CLICK HERE        │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**After Clicking:**
```
┌─────────────────────────────────────────────────────┐
│ ✓ Review Requested - Admin will review your test   │
└─────────────────────────────────────────────────────┘
```

---

### 💻 Coding Test Results Page
**File:** `apps/web-frontend/src/pages/CodingTestResults.jsx`  
**Route:** `/coding-test-results/:attemptId`

#### Visual Location:
```
┌──────────────────────────────────────────────────────────┐
│                  LearnQuest Certifications                │
│                                                           │
│                   Test Results                            │
│   You have successfully completed the certification      │
│                                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│                       68%                                 │
│                    Grade: D                               │
│           Keep practicing to improve your score!          │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 📊 Eligible for Manual Review                    │    │
│  │                                                   │    │
│  │ You scored 68%, just 2% below the pass           │    │
│  │ threshold. Your test can be reviewed by an       │    │
│  │ administrator for potential score adjustment.    │    │
│  │                                                   │    │
│  │     [Request Manual Review]  ← CLICK HERE        │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## When Does the Button Appear?

### Eligibility Criteria:
1. ✅ **Student did NOT pass** (score < pass percentage)
2. ✅ **Score is close to passing** (score >= 90% of pass threshold)
3. ✅ **Not already requested** (review not yet requested)

### Examples:

#### Pass Percentage: 70%
- **Review Threshold:** 63% (90% of 70%)
- **Shows button if score:** 63%, 64%, 65%, 66%, 67%, 68%, 69%
- **Does NOT show if score:** < 63% (too low) or >= 70% (already passed)

#### Pass Percentage: 80%
- **Review Threshold:** 72% (90% of 80%)
- **Shows button if score:** 72%, 73%, 74%, 75%, 76%, 77%, 78%, 79%
- **Does NOT show if score:** < 72% (too low) or >= 80% (already passed)

#### Pass Percentage: 60%
- **Review Threshold:** 54% (90% of 60%)
- **Shows button if score:** 54%, 55%, 56%, 57%, 58%, 59%
- **Does NOT show if score:** < 54% (too low) or >= 60% (already passed)

---

## Button States

### 1. Initial State (Eligible & Not Requested)
```jsx
<Button
  onClick={requestReview}
  disabled={false}
  className="bg-blue-600 hover:bg-blue-700"
>
  Request Manual Review
</Button>
```

### 2. Loading State (Clicking...)
```jsx
<Button
  onClick={requestReview}
  disabled={true}
  className="bg-blue-600 hover:bg-blue-700"
>
  Requesting...
</Button>
```

### 3. Success State (Already Requested)
```jsx
<Badge className="bg-green-50 text-green-700 border-green-300">
  ✓ Review Requested - Admin will review your test
</Badge>
```

---

## How to Test

### Step 1: Create a Test with Custom Pass Percentage
In admin panel, create a test with:
- **Pass Percentage:** 70%
- **Duration:** 10 minutes

### Step 2: Take the Test as Student
1. Answer questions to achieve **63-69%** score
2. Complete the test

### Step 3: View Results
1. You'll be redirected to results page
2. Look for the **blue box** with "Eligible for Manual Review"
3. Click **"Request Manual Review"** button

### Step 4: Verify Request
1. Button changes to **"Requesting..."**
2. Toast notification: **"Review request submitted successfully!"**
3. Badge appears: **"✓ Review Requested"**

### Step 5: Check Admin Panel
1. Login as admin
2. Navigate to **"Test Review"** page
3. Your request should appear in pending reviews

---

## API Endpoint Called

When student clicks the button:

```javascript
POST /api/cert-tests/attempts/{attempt_id}/request-review

Headers:
  Authorization: Bearer {student_token}
  Content-Type: application/json

Body:
{
  "reason": "Score 68% is within review threshold (pass: 70%)",
  "student_comment": "Requesting manual review for score adjustment consideration"
}

Response (Success):
{
  "message": "Review request submitted successfully",
  "status": "pending"
}
```

---

## UI Design Details

### Colors:
- **Box Background:** Blue gradient (`bg-blue-500/10` or `bg-blue-50`)
- **Border:** Blue (`border-blue-200` or `border-blue-500/30`)
- **Icon:** Activity/TrendingUp icon in blue
- **Button:** Blue (`bg-blue-600 hover:bg-blue-700`)
- **Success Badge:** Green (`bg-green-500/20 text-green-300`)

### Icons Used:
- **Regular Test:** `TrendingUp` (from lucide-react)
- **Coding Test:** `Activity` (from lucide-react)

### Positioning:
- Appears **directly below** the pass/fail badge
- **Centered** in the score card
- **Maximum width:** 2xl (max-w-2xl)
- **Margin top:** 6 (mt-6)

---

## Troubleshooting

### "Button doesn't appear"
**Check:**
1. Score is between 90-99% of pass threshold
2. Student has NOT already passed
3. Review not already requested
4. `isEligibleForReview` calculation is correct

**Debug Console:**
```javascript
console.log('Score:', finalScore);
console.log('Pass %:', passPercentage);
console.log('Threshold:', reviewThreshold);
console.log('Eligible:', isEligibleForReview);
```

### "Request fails"
**Check:**
1. Backend endpoint implemented
2. Token is valid in localStorage
3. Network tab for actual error
4. CORS settings if different domains

### "Badge doesn't show after request"
**Check:**
1. `setReviewRequested(true)` is called
2. State update is working
3. Backend returns `review_requested` field
4. Results are re-fetched after request

---

## Code References

### TestResults.jsx (Lines 148-178)
```jsx
{isEligibleForReview && (
  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200">
    <div className="flex items-start gap-3">
      <TrendingUp className="w-5 h-5 text-blue-600" />
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-blue-900">
          Eligible for Manual Review
        </p>
        <p className="text-xs text-blue-700 mb-3">
          You scored {finalScore}%, just {pointsNeeded.toFixed(1)}% below...
        </p>
        {!reviewRequested && !testData.review_requested && (
          <Button onClick={requestReview}>
            Request Manual Review
          </Button>
        )}
      </div>
    </div>
  </div>
)}
```

### CodingTestResults.jsx (Lines 265-290)
```jsx
{isEligibleForReview && (
  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
    <div className="flex items-start gap-3">
      <Activity className="w-5 h-5 text-blue-400" />
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold text-blue-300">
          Eligible for Manual Review
        </p>
        <p className="text-xs text-blue-200 mb-3">
          You scored {score}%, just {pointsNeeded.toFixed(1)}% below...
        </p>
        {!reviewRequested && !results.review_requested && (
          <Button onClick={requestReview}>
            Request Manual Review
          </Button>
        )}
      </div>
    </div>
  </div>
)}
```

---

## Summary

✅ **Regular Tests:** Blue notice box appears below final score card  
✅ **Coding Tests:** Blue notice box appears below grade display  
✅ **Visibility:** Automatic when score is 90-99% of pass threshold  
✅ **Button Text:** "Request Manual Review"  
✅ **Success State:** Shows green "Review Requested" badge  
✅ **Backend:** Calls POST endpoint to submit review request  

**Status:** ✅ Fully Implemented in Both Test Result Pages
