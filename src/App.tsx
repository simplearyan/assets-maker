import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';

// Placeholder Pages
const LogoStudio = () => <div className="text-2xl font-bold p-10">Logo Studio (Coming Soon)</div>;
const Vectorizer = () => <div className="text-2xl font-bold p-10">Vector Pro (Coming Soon)</div>;
const Converter = () => <div className="text-2xl font-bold p-10">Batch Converter (Coming Soon)</div>;
const Editor = () => <div className="text-2xl font-bold p-10">Image Editor (Coming Soon)</div>;

function App() {
  return (
    <BrowserRouter>
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
