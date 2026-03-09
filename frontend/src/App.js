import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ChatWidget from "./components/ChatWidget";

import Home from "./pages/Home";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Nav />
      <main className="pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/za-nas" element={<About />} />
          <Route path="/nasoki" element={<Programs />} />
          <Route path="/kontakt" element={<Contact />} />
        </Routes>
      </main>

      <ChatWidget />

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} ОСТУ „Гостивар“</span>
        </div>
      </footer>
    </div>
  );
}