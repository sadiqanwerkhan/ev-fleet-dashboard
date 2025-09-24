import { Component, type ErrorInfo, type ReactNode } from 'react';
import Icon from './Icon';
import styles from '../../styles/ErrorBoundary.module.css';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to external service in production
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.icon}>
              <Icon name="error" size="xl" />
            </div>
            <h2 className={styles.title}>
              Something went wrong
            </h2>
            <p className={styles.message}>
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className={styles.button}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
