import User from '../models/User';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';
class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ Error: 'User not found' });

    if (!(await user.checkPassword(password)))
      return res.status(400).json({ Error: 'Password doesnt match' });
    const { name, id } = user;
    res.json({
      user: {
        name,
        email,
      },
      token: await jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
