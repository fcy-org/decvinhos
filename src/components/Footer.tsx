import logo from "@/assets/logo-rio-piranhas.png";

const Footer = () => {
  return (
    <footer className="py-10 bg-card border-t border-border">
      <div className="container text-center">
        <img src={logo} alt="Rio Piranhas" className="h-10 mx-auto mb-4" />
        <p className="text-muted-foreground text-sm mb-1">
          Rio Piranhas Distribuidora — Vinhos de giro para o seu negócio
        </p>
        <p className="text-muted-foreground text-xs mb-4">
          Atendimento: Maranhão (MA) e Piauí (PI)
        </p>
        <div className="border-t border-border pt-4">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Rio Piranhas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
