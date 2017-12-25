import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface Props {
  children: JSX.Element;
}

interface State {
  el: Element;
}

const portalRoot = document.getElementById('upperRightPortal')!;

class UpperRight extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      el: document.createElement('div')!,
    };
  }

  componentDidMount() {
    portalRoot.appendChild(this.state.el);
  }

  componentWillUnmount() {
    portalRoot.removeChild(this.state.el);
  }

  render() {
    return (
      ReactDOM.createPortal(
        this.props.children,
        this.state.el
      )
    );
  }
}

export default UpperRight;
