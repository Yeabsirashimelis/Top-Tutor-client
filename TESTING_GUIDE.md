# 🧪 Gamification Testing Guide

## Quick Test Instructions

### **1. Test Daily Streak (1 minute)**
```bash
# Start the app
npm run dev

# Steps:
1. Sign in to your account
2. Open browser DevTools → Console
3. Look for: "Updating streak for user..."
4. Check localStorage: localStorage.getItem('lastStreakUpdate')
5. Should show today's date

# To test again tomorrow:
- Just sign in again - streak will increment automatically
```

### **2. Test Lecture Completion (2 minutes)**
```bash
# Steps:
1. Go to any course with lectures
2. Watch a lecture until the end
3. The lecture should be marked as completed
4. Open DevTools → Network tab
5. Look for POST request to /api/gamification
6. Should see: { points: 10, type: "lecture_completed" }
7. Go to /dashboard - XP should increase by 10
```

### **3. Test Quiz Completion (2 minutes)**
```bash
# Steps:
1. Take any quiz in a course
2. Submit answers (try to get 100%)
3. Check Network tab for POST to /api/gamification
4. Should see: { points: 50 } for perfect score OR { points: 20 } for passing
5. Go to /dashboard - XP should increase
```

### **4. Test Dashboard Page (1 minute)**
```bash
# Steps:
1. Navigate to /dashboard
2. Verify you see:
   ✓ Welcome message with your name
   ✓ Level card with progress bar
   ✓ Total points card
   ✓ Current streak card
   ✓ Badges card
   ✓ Streak tracker with calendar
   ✓ Badges showcase
3. All data should load without errors
```

### **5. Test Profile Page (1 minute)**
```bash
# Steps:
1. Navigate to /profile
2. Verify you see:
   ✓ Profile header with avatar and level badge
   ✓ Quick stats (Level, XP, Streak, Badges)
3. Click through tabs:
   ✓ Overview - shows learning stats
   ✓ Achievements - shows badges
   ✓ Activity - shows recent XP gains
```

### **6. Test Leaderboard (1 minute)**
```bash
# Steps:
1. Navigate to /leaderboard
2. Verify you see:
   ✓ Leaderboard title with trophy icon
   ✓ Timeframe selector (All Time, Monthly, Weekly)
   ✓ Top 3 podium if enough users exist
   ✓ Full rankings table
   ✓ Your rank highlighted (if in top 50)
3. Try switching timeframes
```

### **7. Test Navigation (30 seconds)**
```bash
# Steps:
1. Check navbar when signed in:
   ✓ "Dashboard" link visible
   ✓ "Leaderboard" link visible
2. Click each link - should navigate correctly
3. Active link should be highlighted in lime color
4. Test on mobile view - links should appear in mobile menu
```

---

## Expected Console Output

### **On Sign In:**
```
Updating streak for user...
Streak updated successfully
```

### **On Lecture Completion:**
```
Awarding 10 points for lecture completion...
Points awarded successfully
```

### **On Quiz Completion:**
```
Awarding 50 points for perfect quiz score...
Points awarded successfully
```

---

## Common Issues & Fixes

### **Issue: Points not awarded**
```bash
# Check:
1. Is backend running? (Check NEXT_PUBLIC_BACKEND_LINK)
2. Is user authenticated? (Check session in DevTools)
3. Check browser console for errors
4. Verify API endpoint is responding: 
   GET http://localhost:3001/api/gamification?userId=YOUR_ID
```

### **Issue: Streak not updating**
```bash
# Fix:
1. Clear localStorage: localStorage.clear()
2. Sign out and sign in again
3. Check if date is stored: localStorage.getItem('lastStreakUpdate')
```

### **Issue: Dashboard/Profile/Leaderboard not loading**
```bash
# Check:
1. User is authenticated (redirect to /auth/signin if not)
2. Backend API is responding
3. Network tab shows successful API calls
4. Console for any React errors
```

### **Issue: Navigation links not showing**
```bash
# Verify:
1. User is signed in (session exists)
2. Dashboard/Leaderboard links only show when authenticated
3. Check navbar component is imported correctly
```

---

## Manual Point Award (For Testing)

If you want to manually award points for testing:

```bash
# Using curl:
curl -X POST http://localhost:3001/api/gamification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "points": 100,
    "type": "test",
    "description": "Test points"
  }'

# Or use Postman/Insomnia
# POST http://localhost:3001/api/gamification
# Body (JSON):
{
  "userId": "YOUR_USER_ID",
  "points": 100,
  "type": "test",
  "description": "Test bonus"
}
```

---

## Verify Database Changes

```javascript
// In MongoDB Compass or shell, check:

// 1. User gamification profile
db.usergamificationprofiles.findOne({ user: ObjectId("YOUR_USER_ID") })

// Should show:
// - totalPoints
// - level
// - currentStreak
// - longestStreak
// - badges array
// - totalLecturesCompleted
// - totalQuizzesPassed

// 2. Point transactions
db.pointtransactions.find({ user: ObjectId("YOUR_USER_ID") }).sort({ createdAt: -1 })

// Should show all point awards with:
// - points amount
// - type (lecture_completed, quiz_passed, etc.)
// - description
// - createdAt timestamp
```

---

## Performance Check

```bash
# Pages should load:
✓ Dashboard: < 2 seconds
✓ Profile: < 2 seconds  
✓ Leaderboard: < 3 seconds (depends on user count)

# API responses should be:
✓ GET /api/gamification: < 500ms
✓ POST /api/gamification: < 300ms
✓ GET /api/gamification/leaderboard: < 1s
```

---

## Success Criteria ✅

Your gamification system is working if:

- [x] Daily streak updates automatically on login
- [x] Points awarded when completing lectures
- [x] Points awarded when passing quizzes  
- [x] Bonus points for perfect quiz scores
- [x] Dashboard displays all gamification stats
- [x] Profile shows user progress and achievements
- [x] Leaderboard shows global rankings
- [x] Navigation includes Dashboard and Leaderboard links
- [x] All pages are responsive on mobile
- [x] No console errors during normal usage

---

## Next Steps After Testing

Once everything works:

1. **Add Toast Notifications**
   ```bash
   npm install react-hot-toast
   # Show "+10 XP" when points earned
   ```

2. **Add Level Up Animation**
   ```bash
   # Create modal that shows when user levels up
   # Confetti animation optional
   ```

3. **Deploy to Production**
   ```bash
   # Ensure environment variables are set
   # Test on staging first
   ```

4. **Monitor Analytics**
   - Track user engagement with gamification
   - Measure completion rates before/after
   - Check leaderboard activity

---

**Good luck testing! 🚀**
