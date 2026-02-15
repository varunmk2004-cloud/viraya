import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useToast } from '../components/Toast';
import Loading from '../components/Loading';
import { FiUsers, FiPackage, FiDollarSign, FiTrendingUp, FiShield, FiEdit, FiTrash2, FiPlus, FiShoppingBag, FiSave, FiX } from 'react-icons/fi';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    stock: 0,
    minimumStock: 0,
    lowStockThreshold: 10,
    isRental: false,
    image: '',
    rental: { pricePerDay: 0, deposit: 0 }
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showProductModal || showUserModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showProductModal, showUserModal]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/products'),
        axios.get('/admin/orders'),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      if (err.response?.status === 429) {
        showToast('Too many requests. Please wait a moment and try again.', 'error');
      } else {
        showToast('Failed to load dashboard data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/admin/products/${editingProduct._id}`, productForm);
        showToast('Product updated successfully', 'success');
      } else {
        await axios.post('/admin/products', productForm);
        showToast('Product created successfully', 'success');
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        title: '',
        description: '',
        category: '',
        price: 0,
        stock: 0,
        minimumStock: 0,
        lowStockThreshold: 10,
        isRental: false,
        image: '',
        rental: { pricePerDay: 0, deposit: 0 }
      });
      setImagePreview(null);
      setImageFile(null);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    const productImage = product.image || (product.images && product.images[0]) || '';
    setProductForm({
      title: product.title || '',
      description: product.description || '',
      category: product.category || '',
      price: product.price || 0,
      stock: product.stock || 0,
      minimumStock: product.minimumStock || 0,
      lowStockThreshold: product.lowStockThreshold || 10,
      isRental: product.isRental || false,
      image: productImage,
      rental: {
        pricePerDay: product.rental?.pricePerDay || 0,
        deposit: product.rental?.deposit || 0
      }
    });
    setImagePreview(productImage);
    setImageFile(null);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`/admin/products/${id}`);
      showToast('Product deleted successfully', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/users/${editingUser._id}`, { role: editingUser.role });
      showToast('User updated successfully', 'success');
      setShowUserModal(false);
      setEditingUser(null);
      loadData();
    } catch (err) {
      showToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}`);
      showToast('User deleted successfully', 'success');
      loadData();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'error');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setImagePreview(base64String);
        setProductForm({ ...productForm, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setProductForm({ ...productForm, image: '' });
    // Reset file input
    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (loading) {
    return <Loading fullScreen />;
  }

  // Safety checks for undefined arrays
  const safeOrders = orders || [];
  const safeProducts = products || [];
  const safeUsers = users || [];

  const totalRevenue = safeOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const rentalProducts = safeProducts.filter((p) => p.isRental).length;
  const purchaseProducts = safeProducts.length - rentalProducts;

  const stats = [
    {
      title: 'Total Users',
      value: safeUsers.length,
      icon: FiUsers,
      color: 'primary',
    },
    {
      title: 'Total Products',
      value: safeProducts.length,
      icon: FiPackage,
      color: 'success',
    },
    {
      title: 'Total Orders',
      value: safeOrders.length,
      icon: FiShoppingBag,
      color: 'info',
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'warning',
    },
  ];

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded d-flex align-items-center justify-content-center"
            style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
              boxShadow: '0 4px 15px rgba(30, 60, 114, 0.3)',
            }}
          >
            <FiShield style={{ color: '#ffffff' }} size={24} />
          </div>
          <div>
            <h1 
              className="h2 fw-bold mb-0"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Admin Dashboard
            </h1>
            <p className="text-muted mb-0">Manage your platform</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="nav-tabs">
          <button
            className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="row g-4 mb-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="col-xs-12 col-sm-6 col-md-3">
                  <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
                    <div style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '50px',
                            height: '50px',
                            background: 'linear-gradient(135deg, #1E3A8A 0%, #4169E1 50%, #6B9FFF 100%)',
                          }}
                        >
                          <Icon style={{ color: '#ffffff' }} size={24} />
                        </div>
                      </div>
                      <h6 className="text-muted small fw-semibold mb-1">{stat.title}</h6>
                      <h3 className="fw-bold mb-0" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
                <div style={{ padding: '1rem' }}>
                  <h5 className="fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Quick Stats
                  </h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Rental Products:</span>
                    <span className="fw-semibold">{rentalProducts}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Purchase Products:</span>
                    <span className="fw-semibold">{purchaseProducts}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Pending Orders:</span>
                    <span className="fw-semibold">{safeOrders.filter(o => o.paymentStatus === 'pending').length}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
                <div style={{ padding: '1rem' }}>
                  <h5 className="fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Recent Orders
                  </h5>
                  {safeOrders.slice(0, 5).map((order) => (
                    <div key={order._id} className="d-flex justify-content-between align-items-center mb-2 pb-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <div>
                        <div className="fw-semibold small">Order #{order._id.slice(-6)}</div>
                        <div className="text-muted small">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-semibold">₹{order.total?.toLocaleString()}</div>
                        <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                  {safeOrders.length === 0 && (
                    <p className="text-muted text-center py-3">No orders yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h4 fw-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Product Management</h3>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  title: '',
                  description: '',
                  category: '',
                  price: 0,
                  stock: 0,
                  lowStockThreshold: 10,
                  isRental: false,
                  image: '',
                  rental: { pricePerDay: 0, deposit: 0 }
                });
                setImagePreview(null);
                setImageFile(null);
                setShowProductModal(true);
              }}
            >
              <FiPlus style={{ marginRight: '0.5rem' }} /> Add Product
            </button>
          </div>

          <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
            <div style={{ padding: '1rem' }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Type</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeProducts.map((p) => {
                      const productImage = p.image || (p.images && p.images[0]) || null;
                      return (
                        <tr key={p._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              {productImage ? (
                                <img 
                                  src={productImage} 
                                  alt={p.title}
                                  style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    objectFit: 'cover', 
                                    borderRadius: '0.5rem',
                                    border: '1px solid #dee2e6'
                                  }}
                                />
                              ) : (
                                <div 
                                  style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    background: 'linear-gradient(135deg, #f5f1e8, #e8e0d1)',
                                    borderRadius: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#94a3b8'
                                  }}
                                >
                                  📦
                                </div>
                              )}
                              <div>
                                <div className="fw-medium">{p.title}</div>
                                <div className="text-muted small" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {p.description || 'No description'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{p.category || '-'}</td>
                          <td>
                            <span className="fw-semibold">
                              {p.isRental
                                ? `₹${p.rental?.pricePerDay || 0}/day`
                                : `₹${p.price || 0}`}
                            </span>
                          </td>
                          <td>
                            {p.isRental ? (
                              <span className="badge bg-info">Rental</span>
                            ) : (
                              <span className="badge bg-success">Purchase</span>
                            )}
                          </td>
                          <td>
                            {p.stock !== undefined ? (
                              <div>
                                <span className={p.stock === 0 ? 'text-danger fw-bold' : (p.stock <= (p.lowStockThreshold || 10) ? 'text-warning fw-semibold' : '')}>
                                  {p.stock}
                                </span>
                                {p.stock > 0 && p.stock <= (p.lowStockThreshold || 10) && (
                                  <span className="badge bg-warning text-dark ms-2">Low</span>
                                )}
                                {p.stock === 0 && (
                                  <span className="badge bg-danger ms-2">Out</span>
                                )}
                              </div>
                            ) : '-'}
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-primary btn-sm me-2"
                              onClick={() => handleEditProduct(p)}
                            >
                              <FiEdit />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDeleteProduct(p._id)}
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {safeProducts.length === 0 && (
                <p className="text-center text-muted py-5">No products found</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          <h3 className="h4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>User Management</h3>
          <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
            <div style={{ padding: '1rem' }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeUsers.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-medium">{u.name}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              u.role === 'admin'
                                ? 'bg-danger'
                                : u.role === 'seller'
                                ? 'bg-primary'
                                : 'bg-secondary'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => handleEditUser(u)}
                          >
                            <FiEdit />
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={u.role === 'admin'}
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {safeUsers.length === 0 && (
                <p className="text-center text-muted py-5">No users found</p>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <h3 className="h4 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Order Management</h3>
          <div className="card shadow-sm" style={{ border: '1px solid rgba(30, 60, 114, 0.2)' }}>
            <div style={{ padding: '1rem' }}>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeOrders.map((order) => (
                      <tr key={order._id}>
                        <td className="fw-medium">#{order._id.slice(-6)}</td>
                        <td>
                          {order.buyer?.name || 'N/A'}
                          <div className="text-muted small">{order.buyer?.email}</div>
                        </td>
                        <td>
                          <div className="small">
                            {order.items?.slice(0, 2).map((item, idx) => (
                              <div key={idx}>
                                {item.product?.title || 'Product'} x{item.qty}
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <div className="text-muted">+{order.items.length - 2} more</div>
                            )}
                            {order.items?.length === 0 && <span className="text-muted">No items</span>}
                          </div>
                        </td>
                        <td className="fw-semibold">₹{order.total?.toLocaleString() || 0}</td>
                        <td>
                          <span className={`badge ${order.paymentStatus === 'paid' ? 'bg-success' : order.paymentStatus === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {orders.length === 0 && (
                <p className="text-center text-muted py-5">No orders found</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div 
            className="modal-backdrop show" 
            onClick={() => {
              setShowProductModal(false);
              setEditingProduct(null);
            }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          ></div>
          <div className="modal-dialog modal-lg" style={{ position: 'relative', zIndex: 1055, margin: '1.75rem auto', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
              <div className="modal-header">
                <h5 className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                }}>×</button>
              </div>
              <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="modal-body" style={{ overflowY: 'auto', flex: 1 }}>
                  <div className="form-group mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productForm.title}
                      onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Product Image</label>
                    
                    {/* File Upload Option */}
                    <div className="mb-3">
                      <label className="form-label small text-muted">Upload Image File</label>
                      <input
                        id="imageFileInput"
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageFileChange}
                      />
                      <small className="text-muted">Supported formats: JPG, PNG, WebP (Max 5MB)</small>
                    </div>

                    {/* OR Divider */}
                    <div className="d-flex align-items-center my-3">
                      <div style={{ flex: 1, height: '1px', background: '#dee2e6' }}></div>
                      <span className="mx-3 text-muted small">OR</span>
                      <div style={{ flex: 1, height: '1px', background: '#dee2e6' }}></div>
                    </div>

                    {/* URL Input Option */}
                    <div>
                      <label className="form-label small text-muted">Enter Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={productForm.image && !imageFile ? productForm.image : ''}
                        onChange={(e) => {
                          setProductForm({ ...productForm, image: e.target.value });
                          setImagePreview(e.target.value);
                          setImageFile(null);
                          // Reset file input
                          const fileInput = document.getElementById('imageFileInput');
                          if (fileInput) {
                            fileInput.value = '';
                          }
                        }}
                        placeholder="https://example.com/image.jpg or /images/image.jpg"
                        disabled={!!imageFile}
                      />
                    </div>

                    {/* Image Preview */}
                    {(imagePreview || productForm.image) && (
                      <div className="mt-3">
                        <div className="d-flex align-items-center gap-3">
                          <div style={{ position: 'relative' }}>
                            <img 
                              src={imagePreview || productForm.image} 
                              alt="Preview" 
                              style={{ 
                                maxWidth: '200px', 
                                maxHeight: '200px', 
                                objectFit: 'cover', 
                                borderRadius: '0.5rem', 
                                border: '1px solid #dee2e6',
                                display: 'block'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            {(imagePreview || productForm.image) && (
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={handleRemoveImage}
                                style={{
                                  position: 'absolute',
                                  top: '5px',
                                  right: '5px',
                                  borderRadius: '50%',
                                  width: '30px',
                                  height: '30px',
                                  padding: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                ×
                              </button>
                            )}
                          </div>
                          <div className="flex-grow-1">
                            <small className="text-muted d-block">
                              {imageFile ? `File: ${imageFile.name}` : 'Image URL'}
                            </small>
                            {imageFile && (
                              <small className="text-muted d-block">
                                Size: {(imageFile.size / 1024).toFixed(2)} KB
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Category</label>
                        <input
                          type="text"
                          className="form-control"
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          placeholder="e.g., Decor, Audio, Furniture"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Product Type *</label>
                        <select
                          className="form-control"
                          value={productForm.isRental ? 'rental' : 'purchase'}
                          onChange={(e) => setProductForm({ ...productForm, isRental: e.target.value === 'rental' })}
                        >
                          <option value="purchase">Purchase</option>
                          <option value="rental">Rental</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  {productForm.isRental ? (
                    <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Price Per Day (₹) *</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.rental.pricePerDay}
                            onChange={(e) => setProductForm({
                              ...productForm,
                              rental: { ...productForm.rental, pricePerDay: parseFloat(e.target.value) || 0 }
                            })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label">Stock</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label">Minimum Stock</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.minimumStock}
                            onChange={(e) => setProductForm({ ...productForm, minimumStock: parseInt(e.target.value) || 0 })}
                          />
                          <small className="text-muted">Absolute minimum to maintain</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label">Low Stock Threshold</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.lowStockThreshold}
                            onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: parseInt(e.target.value) || 10 })}
                          />
                          <small className="text-muted">Alert when stock falls below this number</small>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Deposit (₹)</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.rental.deposit}
                            onChange={(e) => setProductForm({
                              ...productForm,
                              rental: { ...productForm.rental, deposit: parseFloat(e.target.value) || 0 }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                    </>
                  ) : (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Price (₹) *</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label">Stock</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label">Minimum Stock</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.minimumStock}
                            onChange={(e) => setProductForm({ ...productForm, minimumStock: parseInt(e.target.value) || 0 })}
                          />
                          <small className="text-muted">Absolute minimum to maintain</small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group mb-3">
                          <label className="form-label">Low Stock Threshold</label>
                          <input
                            type="number"
                            className="form-control"
                            min="0"
                            value={productForm.lowStockThreshold}
                            onChange={(e) => setProductForm({ ...productForm, lowStockThreshold: parseInt(e.target.value) || 10 })}
                          />
                          <small className="text-muted">Alert when stock falls below this number</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowProductModal(false);
                    setEditingProduct(null);
                  }}>
                    <FiX style={{ marginRight: '0.5rem' }} /> Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <FiSave style={{ marginRight: '0.5rem' }} /> {editingProduct ? 'Update' : 'Create'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <div className="modal show" style={{ display: 'block', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div 
            className="modal-backdrop show" 
            onClick={() => {
              setShowUserModal(false);
              setEditingUser(null);
            }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1040, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          ></div>
          <div className="modal-dialog" style={{ position: 'relative', zIndex: 1055, margin: '1.75rem auto', maxHeight: '90vh' }}>
            <div className="modal-content" style={{ maxHeight: '90vh' }}>
              <div className="modal-header">
                <h5 className="modal-title">Edit User Role</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}>×</button>
              </div>
              <form onSubmit={handleUpdateUser}>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={editingUser?.name || ''} disabled />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={editingUser?.email || ''} disabled />
                  </div>
                  <div className="form-group mb-3">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-control"
                      value={editingUser?.role || 'customer'}
                      onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    >
                      <option value="customer">Customer</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowUserModal(false);
                    setEditingUser(null);
                  }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
