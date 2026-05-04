import React from "react";
import { Container, Divider } from "@mui/material";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import Services from "../components/Services/Services";
import Team from "../components/Team/Team";
import Enterprise from "../components/Enterprise/Enterprise";
import StartSection from "../components/StartSection/StartSection";
import FooterSection from "../components/FooterSection/FooterSection";
import "../css/pages/Home.css";

const Home: React.FC = () => {
  return (
    <Container 
      component="main" 
      className="home-page" 
      maxWidth="xl" 
      // Adicionamos os atributos de acessibilidade para leitores de tela
      role="main"
      aria-label="Conteúdo principal da página inicial"
      sx={{ background: 'linear-gradient(140deg, #D7C4A1 2%, #864A4A 83%)' }}
    >
      {/* Menu de navegação superior */}
      <NavBar />

      {/* Seção de introdução */}
      <section aria-label="Apresentação inicial do Estúdio">
        <StartSection />
      </section>

      <Divider />

      {/* Seção de serviços */}
      <section aria-label="Nossos serviços">
        <Services />
      </section>

      <Divider />

      {/* Seção da equipe */}
      <section aria-label="Nossa equipe">
        <Team />
      </section>

      <Divider />

      {/* Seção sobre a empresa */}
      <section aria-label="Sobre a nossa empresa">
        <Enterprise />
      </section>

      <Divider />

      {/* Seção de contato ou rodapé expandido */}
      <section aria-label="Informações de contato e rodapé">
        <FooterSection />
      </section>

      {/* Rodapé geral */}
      <Footer />
    </Container>
  );
};

export default Home;

