import './HomePage.css'; 

export default function HomePage() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our App</h1>
        <p>A simple and elegant solution for your needs</p>

      </header>

      <main className="home-main">
        <section className="home-section">
          <h2>Features</h2>
          <div className="features">
            <div className="feature-card">
              <h3>Fast</h3>
              <p>Lightning-speed performance.</p>
            </div>
            <div className="feature-card">
              <h3>Simple</h3>
              <p>Easy to use and intuitive.</p>
            </div>
            <div className="feature-card">
              <h3>Secure</h3>
              <p>Your data is always protected.</p>
            </div>
        
          </div>
        </section>
      </main>
 
      <footer className="home-footer">
        <p>© 2024 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
}