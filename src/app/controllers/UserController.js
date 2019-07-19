import User from '../models/User';
import * as Yup from 'yup';
class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({
        Error: 'Validation Fails',
      });
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ Error: 'Email already exists' });
    }
    const { name, email } = await User.create(req.body);
    return res.json({ name, email });
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({
        Error: 'Validation Fails',
      });
    const user = await User.findByPk(req.userId);

    const { email, oldPassword } = req.body;
    if (email !== user.email) {
      const userExistsEmail = await User.findOne({ where: { email } });
      if (userExistsEmail)
        return res.status(400).json({ Error: 'User already exists' });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ Error: 'Password does not match' });
    }

    const { id, name } = await user.update(req.body);
    return res.json({ id, name, email });
  }
}
export default new UserController();
