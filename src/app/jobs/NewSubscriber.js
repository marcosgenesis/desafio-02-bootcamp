import pt from 'date-fns/locale/pt';
import { format, parseISO } from 'date-fns';
import Mail from '../../lib/Mail';
class NewSubscriber {
  get key() {
    return 'NewSubscriber';
  }
  async handle({ data }) {
    const { meetup, organizer, user } = data;

    await Mail.sendMail({
      to: `${organizer.name} <${organizer.email}>`,
      subject: 'Novo inscrito no seu Meetup',
      template: 'NewSubscriber',
      context: {
        organizer: organizer.name,
        meetup: meetup.title,
        user: user.name,
        date: format(
          parseISO(meetup.date),
          "'dia' dd 'de' MMMM', ás' H:mm'h' ",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}
export default new NewSubscriber();
