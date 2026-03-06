// Suppress web-specific warnings that don't affect functionality
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString?.() || '';

    // Suppress these specific web warnings
    if (
      message.includes('shadow*" style props are deprecated') ||
      message.includes('expo-notifications') ||
      message.includes('Listening to push token') ||
      message.includes('Cannot record touch end') ||
      message.includes('Throttling navigation')
    ) {
      return;
    }

    originalWarn.apply(console, args);
  };
}
