# 📊 Score Meanings in Exam Violations Dashboard

## Overview
The Exam Violations Dashboard tracks multiple scores to help administrators make informed decisions about exam results.

---

## Score Types Explained

### 1. **Test Score** (Displayed in "SCORE" Column)
**What it means:** The candidate's actual exam performance  
**How it's calculated:**
```
Test Score = (Correct Answers / Total Questions) × 100
```

**Components:**
- **Coding Questions:** Pass/Fail based on code execution
- **MCQ Questions:** Correct answer match

**Example:**
- 8 out of 10 questions correct = **80%**
- 15 out of 20 questions correct = **75%**

**Color Coding:**
- 🟢 Green (≥80%): Excellent performance
- 🟡 Yellow (60-79%): Passing performance
- 🔴 Red (<60%): Needs improvement

**Important:** This score is NOT affected by proctoring violations. It purely reflects knowledge and understanding of the material.

---

### 2. **Violation Count**
**What it means:** Total number of proctoring violations detected  
**How it's calculated:**
```
Total Violations = Sum of all violation types
```

**Example:**
- 2 × Looking Away
- 1 × No Face Detected  
- 1 × Tab Switch
- **Total: 4 violations**

---

### 3. **Violation Score** (Weighted Penalty)
**What it means:** Severity-weighted penalty based on violation types  
**How it's calculated:**

```javascript
Violation Score = Σ (violation_count × weight)

Weights:
- Phone Detected: 4 points
- Multiple Faces: 3 points
- Tab Switch: 3 points
- No Face: 2 points
- Noise Detected: 2 points
- Copy/Paste: 2 points
- Looking Away: 1 point
```

**Example:**
- 2 × Looking Away (1 point each) = 2
- 1 × Multiple Faces (3 points) = 3
- 1 × Tab Switch (3 points) = 3
- **Violation Score: 8**

---

### 4. **Category** (Risk Level)
**What it means:** Overall assessment of exam integrity  
**How it's calculated:**

```javascript
Behavior Score = 100 - (Total Violations × 2)
Risk Level = 100 - Behavior Score

✅ Safe: < 5 points
⚠️ Warning: 5-9 points
🚫 Violation: ≥ 10 points
```

---

## Dashboard Columns Explained

| Column | Displays | Purpose |
|--------|----------|---------|
| **Candidate** | Name & User ID | Identify the test taker |
| **Exam** | Test name & difficulty | Which test was taken |
| **Duration** | Time spent | How long they took |
| **Violations** | Count of incidents | Quick severity indicator |
| **Test Score** | Exam performance (%) | How well they know the material |
| **Category** | Safe/Warning/Violation | Risk assessment |
| **Action** | View Details button | Review full information |

---

## Real-World Examples

### Example 1: Good Student with Minor Issues
```
Candidate: John Doe
Test Score: 95% ✅
Violations: 2 (looking away)
Violation Score: 2
Category: Safe ✅

Decision: Accept results - minor violations, excellent knowledge
```

### Example 2: Suspicious High Score
```
Candidate: Jane Smith  
Test Score: 98% 
Violations: 8 (multiple faces, tab switches)
Violation Score: 18
Category: Violation 🚫

Decision: Investigate - high score but serious violations may indicate cheating
```

### Example 3: Struggling Student
```
Candidate: Bob Johnson
Test Score: 45%
Violations: 1 (noise)
Violation Score: 2
Category: Safe ✅

Decision: Failed due to low score, not violations - may need remediation
```

---

## Key Insights

### 🎯 Test Score tells you: 
"Do they know the material?"

### 🚨 Violations tell you:
"Did they follow the rules?"

### ⚖️ Category tells you:
"Should we trust this result?"

---

## Decision Making Guide

| Test Score | Violations | Recommended Action |
|-----------|-----------|-------------------|
| High (≥80%) | Low (0-2) | ✅ Accept |
| High (≥80%) | High (5+) | 🔍 Investigate for cheating |
| Medium (60-79%) | Low (0-2) | ✅ Accept |
| Medium (60-79%) | High (5+) | ⚠️ Review manually |
| Low (<60%) | Low (0-2) | ❌ Failed (honest attempt) |
| Low (<60%) | High (5+) | ❌ Failed (with violations) |

---

## Changes Made (Nov 2, 2025)

### Before:
- **SCORE** column showed "Violation Score" (confusing!)
- No clear explanation of what the score meant

### After:
- **TEST SCORE** column now shows exam performance percentage
- Added tooltip: "Exam Performance Score (% correct)"
- Added 📝 icon with tooltip explaining it's the test score
- Updated CSV export to say "Test Score (%)"
- Color coding based on performance levels (80%/60% thresholds)

---

## For Administrators

When reviewing exam results:

1. **Check Test Score first** - Did they pass the knowledge threshold?
2. **Review Violations** - Are there integrity concerns?
3. **Consider Category** - What's the overall risk level?
4. **View Details** - Look at violation timeline and patterns
5. **Make Decision** - Accept, reject, or require retest

---

## Technical Notes

- Test Score comes from backend: `attempt.score`
- Calculated during exam submission in `cert_tests_runtime.py`
- Stored in database with attempt record
- Independent of proctoring system
- Can be used even if proctoring is disabled

---

**Last Updated:** November 2, 2025  
**Dashboard Version:** 2.0  
**Backend API:** LearnQuest v1.0
