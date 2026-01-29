import React from 'react';
import { FiAward, FiUsers, FiHeart, FiTarget, FiTrendingUp, FiStar, FiTag, FiPercent, FiGift, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AboutUs() {
  return (
    <>
      <div>
      {/* Hero Section */}
      <div
        className="rounded-0 mb-5 text-white position-relative overflow-hidden slow-motion"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          padding: '100px 40px',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div 
          className="position-absolute top-0 left-0 w-100 h-100"
          style={{
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d4af37\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3,
          }}
        ></div>
        <div className="mx-auto text-center animate-fade-in-up" style={{ maxWidth: '900px', position: 'relative', zIndex: 1 }}>
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: '100px',
                height: '100px',
                background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',
              }}
            >
              <FiAward size={50} style={{ color: '#1a1a1a' }} />
            </div>
          </div>
          <h1 
            className="display-3 fw-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            About Viraya Productions
          </h1>
          <p 
            className="lead mb-0"
            style={{ 
              opacity: 0.95,
              fontSize: '1.5rem',
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: '0.05em',
            }}
          >
            Crafting Unforgettable Experiences with Premium Event Solutions
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="row mb-5">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="animate-fade-in-up">
            <h2 
              className="h2 fw-bold mb-4 gold-accent"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Our Story
            </h2>
            <p 
              className="mb-4"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontFamily: "'Cormorant Garamond', serif",
                color: '#2d2d2d'
              }}
            >
              Owner Vishwanath Bhandari started his journey as an event planner. Now, he has expanded into luxury furniture sales, rentals, and production. We are your one-stop solution for all your events.
            </p>
            <p 
              className="mb-0"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontFamily: "'Cormorant Garamond', serif",
                color: '#2d2d2d'
              }}
            >
              From intimate gatherings to grand celebrations, our commitment to excellence, attention to detail, and passion for creating memorable moments has made us a trusted name in the industry.
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="card h-100 shadow-sm" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div className="p-4">
                <h3 
                  className="h4 fw-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Our Mission
                </h3>
                <p 
                  style={{ 
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#2d2d2d'
                  }}
                >
                  To provide exceptional event production services and premium equipment that 
                  transform visions into reality. We believe every event deserves the finest 
                  attention to detail, quality craftsmanship, and personalized service.
                </p>
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)' }}>
                  <h3 
                    className="h4 fw-bold mb-3"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Our Vision
                  </h3>
                  <p 
                    className="mb-0"
                    style={{ 
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      fontFamily: "'Cormorant Garamond', serif",
                      color: '#2d2d2d'
                    }}
                  >
                    To be the leading provider of luxury event solutions, recognized globally 
                    for our innovation, quality, and unwavering commitment to client satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-5">
        <h2 
          className="h2 fw-bold text-center mb-5 gold-accent"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Core Values
        </h2>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center shadow-sm animate-fade-in-up" style={{ border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiAward size={35} style={{ color: '#1a1a1a' }} />
                </div>
                <h4 className="h5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Excellence</h4>
                <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  We strive for perfection in every detail, ensuring the highest quality in all we do.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center shadow-sm animate-fade-in-up" style={{ border: '1px solid rgba(212, 175, 55, 0.2)', animationDelay: '0.1s' }}>
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiHeart size={35} style={{ color: '#1a1a1a' }} />
                </div>
                <h4 className="h5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Passion</h4>
                <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  Our love for creating unforgettable experiences drives everything we do.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center shadow-sm animate-fade-in-up" style={{ border: '1px solid rgba(212, 175, 55, 0.2)', animationDelay: '0.2s' }}>
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiUsers size={35} style={{ color: '#1a1a1a' }} />
                </div>
                <h4 className="h5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Integrity</h4>
                <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  We build lasting relationships through honesty, transparency, and trust.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 text-center shadow-sm animate-fade-in-up" style={{ border: '1px solid rgba(212, 175, 55, 0.2)', animationDelay: '0.3s' }}>
              <div className="p-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiTarget size={35} style={{ color: '#1a1a1a' }} />
                </div>
                <h4 className="h5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Innovation</h4>
                <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                  We continuously evolve and innovate to exceed expectations and set new standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div 
        className="rounded mb-5 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          padding: '60px 40px',
        }}
      >
        <div className="row g-4 text-center">
          <div className="col-md-3 col-sm-6">
            <div className="animate-fade-in-up">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                }}
              >
                <FiTrendingUp size={30} style={{ color: '#1a1a1a' }} />
              </div>
              <h3 className="display-4 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>500+</h3>
              <p className="mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', opacity: 0.9 }}>
                Events Completed
              </p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                }}
              >
                <FiUsers size={30} style={{ color: '#1a1a1a' }} />
              </div>
              <h3 className="display-4 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>1000+</h3>
              <p className="mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', opacity: 0.9 }}>
                Happy Clients
              </p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                }}
              >
                <FiStar size={30} style={{ color: '#1a1a1a' }} />
              </div>
              <h3 className="display-4 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>10+</h3>
              <p className="mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', opacity: 0.9 }}>
                Years of Experience
              </p>
            </div>
          </div>

          <div className="col-md-3 col-sm-6">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{
                  width: '70px',
                  height: '70px',
                  background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                  boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                }}
              >
                <FiAward size={30} style={{ color: '#1a1a1a' }} />
              </div>
              <h3 className="display-4 fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>50+</h3>
              <p className="mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem', opacity: 0.9 }}>
                Awards & Recognition
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="row mb-5">
        <div className="col-lg-12">
          <h2 
            className="h2 fw-bold text-center mb-5 gold-accent"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Why Choose Viraya Productions?
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 animate-fade-in-up">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiStar size={25} style={{ color: '#1a1a1a' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Premium Quality</h5>
                  <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    We source only the finest equipment and materials for your events.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiUsers size={25} style={{ color: '#1a1a1a' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Expert Team</h5>
                  <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    Our experienced professionals ensure flawless execution of every event.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiHeart size={25} style={{ color: '#1a1a1a' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Personalized Service</h5>
                  <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    Every event is unique, and we tailor our services to your specific needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiTarget size={25} style={{ color: '#1a1a1a' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Attention to Detail</h5>
                  <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    We pay meticulous attention to every aspect to ensure perfection.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiTrendingUp size={25} style={{ color: '#1a1a1a' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Reliable & Trusted</h5>
                  <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    Count on us for consistent, reliable service you can trust.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="d-flex gap-3 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                    boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                  }}
                >
                  <FiAward size={25} style={{ color: '#1a1a1a' }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Proven Track Record</h5>
                  <p className="text-muted mb-0" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem' }}>
                    Years of successful events and satisfied clients speak for themselves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      </div>
      <Footer />
    </>
  );
}

