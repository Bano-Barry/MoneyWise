import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  )
}

export default App
