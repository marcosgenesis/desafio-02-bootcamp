class OrganizerController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      attributes: ['date', 'title', 'description', 'location'],
      include: [
        {
          model: File,
          as: 'banner',
          attributes: ['id', 'url', 'path'],
        },
      ],
    });
    if (!meetups)
      return res.status(400).json({
        error: 'Not found meetups organized by you',
      });
    return res.json(meetups);
  }
}
export default new OrganizerController();
