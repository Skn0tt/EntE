import * as React from "react";
import { ErrorReporting } from "../ErrorReporting";

interface WithErrorBoundaryState {
  error: Error | null;
}

export const withErrorBoundary = <C extends { error: Error }>(
  CustomErrorScreen?: React.ComponentType<C>
) => <P extends object>(Component: React.ComponentType<P>) =>
  class WithErrorBoundary extends React.Component<P, WithErrorBoundaryState> {
    state: WithErrorBoundaryState = {
      error: null
    };

    componentDidCatch(error, info) {
      console.error(error);
      ErrorReporting.report(error);
      this.setState({ error });
    }

    render() {
      const { error } = this.state;

      if (!!error) {
        return !!CustomErrorScreen ? (
          <CustomErrorScreen error={error} />
        ) : (
          <p id="error">{error.message}</p>
        );
      }

      return <Component {...this.props} />;
    }
  };

export default withErrorBoundary;
