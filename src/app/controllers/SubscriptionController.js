import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import User from '../models/User';
import { isBefore, isSameHour, format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import NewSubscriber from '../jobs/NewSubscriber';
import Queue from '../../lib/Queue';
import { Op } from 'sequelize';
class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
        },
      ],
    });
    if (!subscriptions)
      return res.status(400).json({
        error: 'Subscriptions not found for the futures dates',
      });
    return res.json(subscriptions);
  }
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupId);
    if (!meetup)
      return res.status(400).json({
        error: 'Meetup not found',
      });
    /*
     * Check meetup past
     */
    if (isBefore(meetup.date, new Date()))
      return res.status(401).json({
        error: 'you can not subscribe past meetups',
      });

    const alrealdySub = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id,
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          attributes: ['date'],
        },
      ],
    });
    if (alrealdySub) {
      if (isSameHour(alrealdySub.meetup.date, meetup.date)) {
        return res.status(401).json({
          Error: 'You cant subscribe in two meetups qith the same hour',
        });
      }
      return res
        .status(400)
        .json({ error: 'You already subscribed in this meetup' });
    }
    const organizer = await User.findByPk(meetup.user_id);
    const user = await User.findByPk(req.userId);
    const sub = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });
    await Queue.add(NewSubscriber.key, {
      meetup,
      organizer,
      user,
    });
    return res.json(sub);
  }
}
export default new SubscriptionController();
