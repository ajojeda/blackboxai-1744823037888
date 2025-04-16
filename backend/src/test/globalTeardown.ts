export default async (): Promise<void> => {
  // Clean up any test data or connections
  try {
    // Add cleanup tasks here
    // For example:
    // - Close any global connections
    // - Remove test data
    // - Reset environment variables

    console.log('Global test teardown complete');
  } catch (error) {
    console.error('Error during test teardown:', error);
    throw error;
  }
};
