import { ThemeProvider } from './contexts/ThemeContext';
import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
      <Toaster position="bottom-right" reverseOrder={false} />
    </ThemeProvider>
  )
}

export default App;
ggi