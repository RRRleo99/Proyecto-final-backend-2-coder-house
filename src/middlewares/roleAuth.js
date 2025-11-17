export default function roleAuth(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ status: 'error', message: 'Forbidden: insufficient role' });
    }
    next();
  };
}