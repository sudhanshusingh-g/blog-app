import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom";
import Layout from './components/Layout.jsx';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ThemeProvider from './context/ThemeProvider.jsx';

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <App />
        </Layout>
      </BrowserRouter>
    </Provider>
  </ThemeProvider>
);
