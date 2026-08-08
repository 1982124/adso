/**
 * React Error Boundary for the ADSO platform.
 *
 * Catches unhandled errors in its child tree and renders a French-language
 * fallback UI with a "Réessayer" (retry) button. Supports a custom fallback
 * and an optional `onError` callback for external error reporting.
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ViewErrorBoundaryProps {
  children: React.ReactNode;
  /** Optional custom fallback rendered when an error is caught. */
  fallback?: React.ReactNode;
  /** Optional callback invoked when an error is caught (e.g. for logging). */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ViewErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// ─── Component ──────────────────────────────────────────────────────────────

class ViewErrorBoundary extends React.Component<
  ViewErrorBoundaryProps,
  ViewErrorBoundaryState
> {
  constructor(props: ViewErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * React lifecycle — derive error state from a caught error.
   * Returning updated state triggers a re-render with the fallback UI.
   */
  static getDerivedStateFromError(error: Error): ViewErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * React lifecycle — side-effect after an error is caught.
   * Logs the error and invokes the optional `onError` callback.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('[ViewErrorBoundary] Caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  /** Reset the error state so children re-render. */
  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default French fallback UI
      return (
        <div
          className={cn(
            'flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center',
          )}
          role="alert"
        >
          <p className="text-sm font-medium text-destructive">
            Une erreur est survenue. Veuillez réessayer.
          </p>
          {this.state.error && (
            <p className="max-w-md text-xs text-muted-foreground">
              {this.state.error.message}
            </p>
          )}
          <button
            type="button"
            onClick={this.handleRetry}
            className={cn(
              'inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            )}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ViewErrorBoundary;
