// O ponto de entrada do React. Configura o router e define que a rota / carrega o ClientMenu.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import ClientMenu from "./pages/ClientMenu";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

// É o ficheiro raiz da aplicação React — o primeiro componente que é montado quando a app arranca. 
// É aqui que configuras o BrowserRouter (que permite navegação entre páginas sem recarregar) 
// e defines as rotas com <Routes> e <Route>. Neste caso só tens uma rota — a raiz / que carrega o ClientMenu.