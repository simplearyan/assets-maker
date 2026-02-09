import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { LogoStudio } from './pages/LogoStudio';
import { Vectorizer } from './pages/Vectorizer';
import { Converter } from './pages/Converter';
import { Editor } from './pages/Editor';

function App() {
  return (
    <BrowserRouter basename="/assets-maker">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="logo-studio" element={<LogoStudio />} />
          <Route path="vectorizer" element={<Vectorizer />} />
          <Route path="converter" element={<Converter />} />
          <Route path="editor" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
