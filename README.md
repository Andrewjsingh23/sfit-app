# FitForge — Free Workout & Nutrition App

A React Native (Expo) scaffold for a free, ad-supported fitness app that ships to **both iOS and Android from one codebase**. This covers every feature you listed; the sections below flag exactly which parts are real, working logic and which are UI shells waiting on a real backend/SDK key.

## Why React Native + Expo

You need one app, two app stores, and (as a solo/small founder) limited engineering time. React Native gives you native iOS and Android apps from one TypeScript codebase, and Expo removes most of the native build/config pain (push notifications, over-the-air updates, App Store submission via `eas build`/`eas submit`). This is the same category of stack Freeletics, Fitbod-style apps, and most indie fitness apps use in some form.

## Live preview without installing anything

The fastest way to click around the UI yourself, no local setup:

1. Push this folder to a **public GitHub repo** (drag-and-drop upload works fine on github.com — you don't need git installed locally).
2. Go to **[snack.expo.dev](https://snack.expo.dev)** → click the "..." next to Project in the file explorer → **Import Git Repository** → paste your repo URL.
3. Snack builds it in the browser: you get a live, clickable preview right there, plus a QR code to open the exact same running app in **Expo Go** on your own phone.

`package.json` here only lists packages the code actually imports (React Navigation, AsyncStorage, expo-av, etc.) — all Snack-compatible — so the import should just work. The native-only SDKs mentioned earlier (Google Sign-In, Facebook SDK, AdMob, Apple Auth) are intentionally left out until you're ready to wire them in, since those require a real native build and won't run inside Snack's browser player anyway.

For something closer to a real device test (own device, real gestures, no browser sandbox), skip Snack and instead run `npx expo start` locally, then scan the QR code with the Expo Go app — no GitHub step needed for that path.



```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) to run it on your phone instantly, no native build required for development.

## What's fully implemented (real logic, not mockups)

| Feature | File |
|---|---|
| 30/45/60-day plan generation, beginner/medium/expert, week-over-week variation | `src/utils/workoutGenerator.ts` |
| 60-day diet plan with calorie targets (Mifflin-St Jeor) per goal | `src/utils/dietGenerator.ts` |
| Onboarding: birthday, height, weight, sex, goal (incl. event training w/ event type + date) | `src/screens/OnboardingScreen.tsx` |
| Home/gym toggle threaded through exercise selection | `workoutGenerator.ts`, `OnboardingScreen.tsx` |
| Quick 20-min workout generator | `generateQuickWorkout()` in `workoutGenerator.ts` |
| Set/rep/weight logging, rest timer, form cues shown live during a workout | `src/screens/WorkoutPlayerScreen.tsx` |
| Streak tracking (daily completion, break detection) | `src/utils/streak.ts` |
| Ad-unlock flow: first 14 days free, then unlock 3 workouts / meal days per ad watch | `WorkoutPlanScreen.tsx`, `DietPlanScreen.tsx`, `AdUnlockModal.tsx` |
| Exercise library with search, form pointers, video player wiring | `ExerciseLibraryScreen.tsx`, `ExerciseDetailScreen.tsx` |
| Progress screen: streaks, % plan complete, workout history | `ProgressScreen.tsx` |
| Local persistence (works offline, survives app restarts) | `src/utils/storage.ts` (AsyncStorage) |

## What's a UI shell you need to connect (with exact TODOs in-code)

These need a real account/API key — the UI, state handling, and data flow are already built so you're filling in one function each, not building new screens.

1. **Sign-in (Google / Apple / Facebook / email)** — `src/screens/AuthScreen.tsx`
   Fastest real path: **Firebase Authentication**. It supports all four providers plus email/password out of the box, gives you a user database for free, and each provider's SDK call is already sketched as a comment in the relevant handler (`handleGoogleSignIn`, `handleAppleSignIn`, `handleFacebookSignIn`). Apple requires "Sign in with Apple" if you offer *any* third-party login on iOS — it's already there.

2. **Exercise demo videos** — `src/data/exercises.ts` (`videoUrl` field)
   Currently points at placeholder URLs. Record or license short (5-10 sec) looping clips per exercise, host them on **Mux, Cloudflare Stream, or S3 + CloudFront**, and swap the URLs. The player (`WorkoutPlayerScreen.tsx`, `ExerciseDetailScreen.tsx`) already uses `expo-av`'s `<Video>` component with looping/autoplay/mute configured.

3. **Rewarded ads** — `src/components/AdUnlockModal.tsx`
   Sketch included for `react-native-google-mobile-ads` (Google AdMob — supports rewarded video, works on both platforms, no subscription needed on your end). Create an AdMob account, get your app IDs, drop them into `app.json`, and swap the placeholder `setTimeout` for the real `RewardedAd` calls shown in the comment block.

4. **Spotify / Apple Music** — `src/screens/SettingsScreen.tsx`
   UI toggle is there; wire it to the **Spotify iOS/Android SDK** (`spotify-remote` bridges exist for RN) or **Apple MusicKit** for playback control. This is genuinely one of the harder integrations (native modules on both sides) — budget it as a v1.1 feature rather than launch-blocking, since most competitors (Fitbod, Freeletics) don't have deep music integration either — they just tell you to run Spotify in the background.

5. **Backend sync** — `src/utils/storage.ts`
   Everything currently saves to on-device storage only. That's fine for MVP/testing but means a reinstall wipes progress. When ready, swap these functions for calls to **Firebase Firestore** or **Supabase** (both have generous free tiers, which matters since this is a free, ad-only-revenue app).

## Feature-to-request mapping

Every numbered item in your spec is covered — here's where:

- **1-4 (plan length/levels, diet, personal info, goals incl. Hyrox/marathon)** → `OnboardingScreen.tsx` + generators
- **5-6 (custom plan, feature research)** → see "Market context" below
- **7 (social sign-in)** → `AuthScreen.tsx`
- **8 (ad-unlock after 2 weeks)** → `AdUnlockModal.tsx` + plan/diet screens (14-day free window is a constant you can tune: `FREE_DAYS_BEFORE_LOCK`)
- **9 (week-over-week variety)** → `workoutGenerator.ts` rotates through 4 split templates per goal so week 2 ≠ week 1
- **10 (progress tracking)** → `WorkoutPlayerScreen.tsx` (logging) + `ProgressScreen.tsx` (history)
- **11-12 (form notes, video + pointers)** → `formCues` on every exercise, shown live in the player and on the detail screen
- **13 (home vs gym)** → threaded through onboarding → generator → exercise filtering
- **14 (quick 20-min workout)** → `generateQuickWorkout()`
- **15 (free app, no subscription)** → banner in Settings + this README; monetization is ads-only by design
- **16 (video classes, structured programs, exercise library, AI-generated workouts)** → structured programs and library are built; "on-demand video classes" is a content-production task (see below); the workout generator is the "AI" layer — see the upgrade note in `workoutGenerator.ts` for swapping in a real LLM-based generator later
- **17-18 (streaks, micro-workouts, 1-tap start, low friction, context awareness)** → `HomeScreen.tsx` (time-aware greeting, single-tap start, 5/10-min micro-workout cards), `WorkoutPlayerScreen.tsx` (no navigation away mid-workout)
- **19 (music)** → Settings toggle, see integration note above

## Market context (why these features, and what to expect)

A few real data points worth knowing as you plan roadmap and monetization:

- **Nike Training Club and FitOn** are the closest free/no-subscription comparables — <cite index="4-1">Nike Training Club and FitOn are cited as offering strong value for zero dollars</cite>, which validates that a fully-free model with ads (rather than freemium) is viable in this category, though NTC monetizes via brand halo, not ads, so your ad-unlock mechanic is a genuinely different (and reasonable) approach for an indie app.
- **AI-personalized apps like Fitbod** show the ceiling of engagement in this category: <cite index="5-1">Fitbod has amassed over 15 million downloads and more than 2.5 million active users, with over 157 million workouts logged</cite>. That's a mature, decade-old product — a realistic year-one target for an indie free app is in the thousands to low tens of thousands of MAU, growing with App Store Optimization, content marketing, and retention (your streak/ad mechanics directly target retention).
- **Ad-heavy free tiers can backfire**: one review noted <cite index="8-1">a competing app became so ad-heavy that it disrupted workouts, driving users toward its paid tier instead</cite> — a useful cautionary note for your ad placement. Keeping ads *outside* the workout flow (only in the unlock modal, never mid-set) is why the scaffold is built the way it is.
- **Where free apps typically fall short of paid ones**: <cite index="7-1">a free, non-personalized workout library gives users content but no personalization, AI coaching, or progression system to keep them engaged long-term</cite> — your rule-based generator's week-over-week progression logic directly addresses this gap without requiring a paid tier.

## Publishing to the App Store and Google Play

Once you've connected real auth/video/ads:

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

You'll need an Apple Developer account ($99/year) and a Google Play Developer account ($25 one-time). Both require privacy policy and data-safety disclosures — flag clearly that you collect birthday/height/weight/goal data for personalization and disclose your ad network (AdMob) in both stores' data-safety forms.

## Suggested next steps, in order

1. Wire Firebase Auth (unblocks real accounts).
2. Record/license 10-15 exercise videos to validate the video pipeline before doing all ~40+ you'll eventually want.
3. Set up AdMob and test the rewarded-ad unlock flow end to end.
4. Move storage from AsyncStorage to Firestore/Supabase so testers don't lose data.
5. Get it on real devices via TestFlight / Play Internal Testing before touching Spotify integration — that's the highest-effort, lowest-priority item on your list.
