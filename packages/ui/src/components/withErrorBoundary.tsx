import * as React from "react";

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
      this.setState({ error });
    }

    render() {
      const { error } = this.state;

      if (!!error) {
        return !!CustomErrorScreen ? (
          <CustomErrorScreen error={error} />
        ) : (
          <h1 className="error">{error.message}</h1>
        );
      }

      return <Component {...this.props} />;
    }
  };

export default withErrorBoundary;
