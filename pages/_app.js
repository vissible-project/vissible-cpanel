import "../styles/globals.css";
import { MantineProvider, createEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

const customCache = createEmotionCache({
  key: "mantine",
  prepend: false,
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        /** Put your mantine theme override here */
        colorScheme: "light",
      }}
      emotionCache={customCache}
    >
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
