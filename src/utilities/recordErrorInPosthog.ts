// Function to record errors in PostHog

type RecordErrorInPosthogProps = ({ errorMessage: string, errorDetails: Record<string, any> });

export const recordErrorInPosthog = ({ errorMessage, errorDetails }: RecordErrorInPosthogProps) => {
  if (window.posthog) {
    window.posthog.capture('Error Message', {
      error: errorMessage,
      details: errorDetails
    });
  } else {
    console.error('PostHog not initialized', { errorMessage, errorDetails });
  }
};
