# RepFlow

> Train with intention. A free, offline-first gym planning and workout tracking app.

## Features

- Create and manage workout plans (Push/Pull/Legs/Full Body/Custom)
- Track active sessions with live timer and set logging
- Rest timer with visual countdown ring
- Progress charts and streak tracking
- Full workout history with session details
- Schedule gym days and set reminders
- Dark/light/system theme
- kg/lbs toggle
- Haptic feedback and reduce motion support
- Export all data as JSON
- Works on iOS, Android, and as a PWA in the browser
- No login required — all data stored locally

## Tech Stack

- React Native + Expo ~51
- TypeScript
- React Navigation v6
- React Native Reanimated v3 + Moti
- Zustand (state management)
- AsyncStorage (local-first persistence)
- React Native SVG (rest timer ring)
- date-fns

## Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm start

# Web (PWA)
npx expo start --web

# Android
npx expo start --android

# iOS
npx expo start --ios
```

## Build

### Android APK (no EAS account needed)
```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Android/iOS via EAS
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview   # APK
eas build --platform android --profile production # AAB
eas build --platform ios --profile production
```

### PWA / Web Deploy

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
npx expo export --platform web
netlify deploy --prod --dir dist
```

## Project Structure
```
├── App.tsx                  # Entry point
├── index.js                 # Expo root component registration
├── src/
│   ├── types/               # TypeScript interfaces
│   ├── constants/           # Theme, colors, exercises
│   ├── store/               # Zustand global state
│   ├── hooks/               # useTheme, useHaptics, useWorkoutTimer
│   ├── utils/               # Stats, formatting, quotes
│   ├── navigation/          # Tab + stack navigator
│   ├── components/
│   │   ├── common/          # Button, Card, Screen, PressableScale
│   │   ├── workout/         # SetRow, RestTimer, WorkoutPlanCard
│   │   └── charts/          # WeeklyChart
│   └── screens/             # All 11 screens
└── assets/                  # Icons and splash images
```

## Sample Data

Three workout plans are seeded on first launch:
- **Push Day** (Mon/Thu) — Bench Press, OHP, Lateral Raise, Tricep Pushdown
- **Pull Day** (Tue/Fri) — Deadlift, Lat Pulldown, Barbell Curl
- **Leg Day** (Wed/Sat) — Squat, RDL, Leg Extension, Calf Raise

## License

Free to use and modify. No warranties.