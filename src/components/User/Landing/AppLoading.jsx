// App.jsx or main.jsx
import AppLoader from "./AppLoader";
import LandingPage from "./LandingPage"; 

export default function AppLoading() {
  return (
    <AppLoader>
      <LandingPage />
    </AppLoader>
  );
}