const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2025 Juguetería Cósmica. Todos los derechos reservados.</p>
      <p>
        Contacto: <a href="mailto:contacto@jugueteriacosmica.com">contacto@jugueteriacosmica.com</a>
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#0c2c2c',
    color: '#ade7ee',
    textAlign: 'center',
    fontSize: '0.9rem',
  }
};

export default Footer;
