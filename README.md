# 🕒 BeetTheClock - Seasonal Produce Tracker

<p align="center">
  <img src="./assets/icon.png" width="200" alt="BeetTheClock Logo">
</p>

## Overview

**BeetTheClock** is a mobile application built with React Native and Expo (TypeScript) designed to help users track seasonal fruits and vegetables. The goal is to encourage sustainable eating by notifying users when produce is at its peak and allowing them to personalize their experience.

## Key Features

- **Seasonal Dashboard:** Instantly view what is currently in season based on the current month.
- **Custom Gallery Images:** Personalize your list by replacing default product photos with your own images selected from your device's gallery. Changes are saved locally.
- **SMS Integration (`expo-sms`):** Easily share seasonal picks with your friends directly from the app.
- **Customizable Reminders:** Receive daily notifications to check for new seasonal items.
- **Persistent Settings (`AsyncStorage`):**
  - **Notifications:** Toggle reminders on/off and set your preferred time of day for alerts.
  - **Data:** Custom images and user preferences are saved locally between sessions.
- **Fully Typed:** Built 100% with TypeScript for reliability and maintainability.

## Tech Stack

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack)
- **Storage:** AsyncStorage
- **Media:** Expo Image Picker (Gallery Access)
- **Native Modules:** SMS, Notifications, Sharing API

## Installation & Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the project:
   ```bash
   npx expo start
   ```
4. Use Expo Go on Android/iOS to scan the QR code.