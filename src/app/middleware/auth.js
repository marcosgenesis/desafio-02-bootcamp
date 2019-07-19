import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
export default async (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders)
    return res.status(400).json({ error: 'Token not provided' });
  const [, token] = authHeaders.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(400).json({ Error: 'Token Invalid' });
  }
};
