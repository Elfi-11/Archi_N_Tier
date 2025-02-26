import { NextUIProvider } from "@nextui-org/react";
import Quiz from './components/Quiz';

function App() {
  return (
    <NextUIProvider>
      <Quiz/>
    </NextUIProvider>
  );
}

export default App;
