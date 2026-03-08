const Footer = () => (
  <footer className="py-8 border-t border-border">
    <div className="container mx-auto px-4 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Naimur Safi. Built with React & Tailwind CSS.
      </p>
    </div>
  </footer>
);

export default Footer;
