# 🕒 BeetTheClock - Seasonal Produce Tracker

![BeetTheClock Icon](./assets/icon.png)

## Overview

**BeetTheClock** is a mobile application built with React Native and Expo (TypeScript) designed to help users track seasonal fruits and vegetables. The goal is to encourage sustainable eating by notifying users when produce is at its peak and allowing them to share this info with friends.

## Key Features

- **Seasonal Dashboard:** See what's currently in season based on the current month.
- **SMS Integration (`expo-sms`):** Instantly share seasonal picks with a pre-configured contact.
- **Local Notifications (`expo-notifications`):** Receive daily reminders to check for new seasonal items.
- **Persistent Settings (`AsyncStorage`):** Save your favorite contact number and notification preferences locally.
- **Fully Typed:** Built 100% with TypeScript for reliability.

## Tech Stack

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack)
- **Storage:** AsyncStorage
- **Native Modules:** SMS, Notifications, Sharing API.

## Installation & Setup

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the project:
   ```bash
   npx expo start
   ```
4. Use Expo Go on Android/iOS to scan the QR code.
