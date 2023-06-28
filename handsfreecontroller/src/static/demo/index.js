import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('app');
const root = ReactDOM.reateRoot(domNode);
root.render(<NavigationBar />);
