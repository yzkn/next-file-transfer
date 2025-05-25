import StoreProvider from './store/SProvider';
import App from './app';

export default function Home() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
