export const isSeller = (req, res, next) => {
  if (req.user && req.user.role === 'seller') return next();
  return res.status(403).json({ msg: 'Requires seller role' });
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ msg: 'Requires admin role' });
};
