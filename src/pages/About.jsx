import 'react';
import './About.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const stats = [
    { number: "10K+", label: "Books Available" },
    { number: "50K+", label: "Happy Customers" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Customer Support" }
  ];

  const team = [
    {
      name: "John Smith",
      position: "Founder & CEO",
      image: "/assets/harry-potter-card.jpg"
    },
    {
      name: "Sarah Johnson",
      position: "Head of Operations",
      image: "/assets/harry-potter-card.jpg"
    },
    {
      name: "Michael Chen",
      position: "Chief Librarian",
      image: "/assets/harry-potter-card.jpg"
    }
  ];

  return (
    <>
    <Navbar />
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About Wisdom Books</h1>
          <p>Empowering minds through literature since 2010</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="content-wrapper">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>At Wisdom Books, we believe in the transformative power of knowledge. Our mission is to make quality books accessible to everyone, fostering a love for reading and lifelong learning in our community.</p>
          </div>
          <div className="mission-image">
            <img src="/assets/harry-potter.jpg" alt="Library interior" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card-about">
              <h3>{stat.number}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="content-wrapper">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p>{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="content-wrapper">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>Curating the finest collection of books across all genres.</p>
            </div>
            <div className="value-card">
              <h3>Accessibility</h3>
              <p>Making knowledge accessible to readers of all backgrounds.</p>
            </div>
            <div className="value-card">
              <h3>Community</h3>
              <p>Building a vibrant community of book lovers and learners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="contact-cta">
        <div className="content-wrapper">
          <h2>Get in Touch</h2>
          <p>Have questions? We&rsquo;d love to hear from you.</p>
          <button className="cta-button">Contact Us</button>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default About;