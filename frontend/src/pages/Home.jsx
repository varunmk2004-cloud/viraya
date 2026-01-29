import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';
import { useScrollAnimation } from '../utils/scrollAnimation';
import { FiSearch, FiPercent, FiGift, FiStar, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [productsRef, productsVisible] = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    setLoading(true);
    axios
      .get('/products')
      .then((r) => {
        setProducts(r.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'rental' && product.isRental) ||
      (filterType === 'purchase' && !product.isRental);

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <>
      <div>
      {/* Hero Section */}
      <div
        className="mb-4 text-white position-relative overflow-hidden slow-motion"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
          padding: '40px 40px',
          minHeight: '300px',
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
            <span 
              className="d-inline-block"
              style={{
                padding: '0.5rem 1.5rem',
                marginBottom: '0.75rem',
                background: 'linear-gradient(135deg, #d4af37 0%, #f4e4bc 100%)',
                color: '#1a1a1a',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Luxury Event Production
            </span>
          </div>
          <h1 
            className="display-2 fw-bold mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              lineHeight: 1.1,
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            }}
          >
            Welcome to Viraya Productions
          </h1>
          <p 
            className="lead mb-0"
            style={{ 
              opacity: 0.95,
              fontSize: '1.25rem',
              fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: '0.05em',
            }}
          >
            Discover premium event equipment and luxury rentals for your most elegant occasions
          </p>
        </div>
      </div>



      {/* Search and Filter */}
      <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="row g-3" style={{ marginLeft: 0, marginRight: 0, alignItems: 'center' }}>
          <div className="col-md-8" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
            <div className="position-relative">
              <FiSearch
                className="position-absolute translate-middle-y"
                style={{ color: '#d4af37', left: '0.75rem', top: '50%', zIndex: 1 }}
              />
              <input
                type="text"
                className="form-control"
                style={{ 
                  paddingLeft: '3rem', 
                  paddingRight: '1rem',
                  paddingTop: '0.875rem',
                  paddingBottom: '0.875rem',
                  border: '1px solid #e8e0d1', 
                  fontSize: '1rem',
                  height: '48px'
                }}
                placeholder="Search premium products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
            <div className="d-flex w-100" style={{ gap: 0, height: '48px' }}>
              <button
                className={`btn ${filterType === 'all' ? 'btn-primary' : 'btn-outline-primary'} text-uppercase`}
                onClick={() => setFilterType('all')}
                style={{ fontSize: '0.875rem', letterSpacing: '0.05em', flex: 1, height: '100%', borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                All
              </button>
              <button
                className={`btn ${filterType === 'purchase' ? 'btn-primary' : 'btn-outline-primary'} text-uppercase`}
                onClick={() => setFilterType('purchase')}
                style={{ fontSize: '0.875rem', letterSpacing: '0.05em', flex: 1, height: '100%', borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
              >
                Purchase
              </button>
              <button
                className={`btn ${filterType === 'rental' ? 'btn-primary' : 'btn-outline-primary'} text-uppercase`}
                onClick={() => setFilterType('rental')}
                style={{ fontSize: '0.875rem', letterSpacing: '0.05em', flex: 1, height: '100%', borderTopRightRadius: '0.375rem', borderBottomRightRadius: '0.375rem', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                Rental
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div 
          className="alert alert-info text-center py-5"
          style={{
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(244, 228, 188, 0.05))',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          <div className="display-1 mb-3" style={{ fontSize: '4rem' }}>✨</div>
          <h3 
            className="h4 fw-bold mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No products found
          </h3>
          <p 
            className="mb-0"
            style={{ 
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              color: '#2d2d2d'
            }}
          >
            {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new premium products'}
          </p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 gold-accent">
            <h2 
              className="h2 fw-bold"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {filterType === 'all' ? 'Premium Collection' : filterType === 'rental' ? 'Luxury Rentals' : 'Exclusive Items'}
            </h2>
            <span 
              className="text-uppercase"
              style={{ 
                color: '#d4af37',
                fontSize: '0.875rem',
                fontWeight: 600,
                letterSpacing: '0.1em'
              }}
            >
              {filteredProducts.length} items
            </span>
          </div>
          
          {/* Promotional Tag */}
          <div 
            className="rounded p-3 mb-4 text-center animate-fade-in-up"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(244, 228, 188, 0.1))',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            }}
          >
            <div className="d-flex align-items-center justify-content-center gap-2">
              <FiStar style={{ color: '#d4af37' }} />
              <span 
                className="fw-semibold"
                style={{ 
                  color: '#1a1a1a',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem'
                }}
              >
                Premium Quality Equipment • Professional Setup • 24/7 Support
              </span>
              <FiStar style={{ color: '#d4af37' }} />
            </div>
          </div>

          <div 
            className="products-grid" 
            ref={productsRef}
          >
            {filteredProducts.map((p, index) => (
              <div 
                key={p._id} 
                className={`product-item ${productsVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  transition: 'opacity 0.6s ease-out',
                  opacity: productsVisible ? 1 : 0
                }}
              >
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </>
      )}
      </div>
      <Footer />
    </>
  );
}
