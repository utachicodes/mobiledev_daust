# Lab Test 3: Hydration Reminder

Create a React Native app using Expo that monitors the time in the background and sends a hydration reminder, but `only` if the current time is within the time intervall that the defined as it's "Working Hours" interval (e.g., 9:00 AM to 5:00 PM).

## Requirements

The application must meet the following criteria:

- `Define Working Hours` : Provide a UI (using a Time Picker or simple inputs) that allows the user to define their start and end work hours.
- `Respect Working Hours : The background task must check the current system time against the user's stored "Working Hours" before triggering an alert.
- `Background Execution` : Leverage the [Expo BackgroundTask](https://docs.expo.dev/versions/latest/sdk/background-task/) library to run logic even when the app is closed or the device is locked.
- `Local Notifications` : Use `expo-notifications` to send a "Time to drink water!" alert immediately if the time condition is met.
- `Task Management` :  Include a `Switch` UI to register or unregister the background task.
- Set the `minimumInterval` to `3 minutes` for testing purposes.

- `Persistent Settings` : Use `AsyncStorage` to save the user’s Working Hours and the "On/Off" toggle state so they persist after the app restarts.
- `Permission Guardrails`: The app must verify and request both `NOTIFICATIONS` and `BACKGROUND TASKS` permissions before allowing the user to activate the reminder.