import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import Meetup from '../models/Meetup';
import * as Yup from 'yup';
import File from '../models/File';
import { Op } from 'sequelize';
class MeetupsController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if (req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url', 'path'],
        },
      ],
      attributes: ['date', 'title', 'description', 'location'],
      limit: 10,
      offset: 10 * page - 10,
    });
    console.log(meetups);
    if (!meetups)
      return res.status(400).json({
        error: 'Not found meetups organized by you',
      });
    return res.json(meetups);
  }
  async store(req, res) {
    /**
     * Schema validation
     */
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      banner_id: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({
        error: 'Validation fails',
      });

    const { date, title, description, location, banner_id } = req.body;
    const parsedDate = parseISO(date);
    const user_id = req.userId;

    /**
     * Check past dates
     */
    if (isBefore(parsedDate, new Date()))
      return res.status(400).json({
        error: 'You cant create a meetup with past dates',
      });
    const isBanner = await File.findOne({
      where: { id: banner_id },
    });
    if (!isBanner)
      return res.status(400).json({ error: 'File does not exists' });
    const meetup = await Meetup.create({
      date,
      title,
      description,
      location,
      banner_id,
      user_id,
    });
    return res.json({ date, title, description, location });
  }
  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      location: Yup.string(),
      description: Yup.string(),
      date: Yup.date(),
    });
    if (!(await schema.isValid(req.body)))
      return res.status(400).json({
        error: 'Validation Fails',
      });

    const user_id = req.userId;
    const meetup = await Meetup.findByPk(req.params.id);
    if (!meetup)
      return res.status(400).json({
        error: 'Meetup not found',
      });
    if (meetup.user_id !== user_id)
      return res.status(401).json({
        error: 'You are not organizator of this meetup',
      });
    /**
     * Check past dates of meetups
     */
    if (isBefore(meetup.date, new Date()))
      return res.status(400).json({
        error: "you can't change past dates",
      });
    if (isBefore(parseISO(req.body.date), new Date()))
      return res.status(400).json({
        error: "you can't  change past dates",
      });
    const { title, location, description, date } = await meetup.update(
      req.body
    );
    return res.json({
      title,
      location,
      description,
      date,
    });
  }
  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);
    if (!meetup)
      return res.status(400).json({
        error: 'Meetup not found',
      });
    if (isBefore(meetup.date, new Date()))
      return res.status(401).json({
        error: 'You can not delete past meetups',
      });
    await meetup.destroy();
    return this;
  }
}
export default new MeetupsController();
