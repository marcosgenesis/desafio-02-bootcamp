import { Model, Sequelize } from "sequelize";

class Meetup extends Model{
  static init(sequelize){
    super.init({
      title: Sequelize.STRING,
      description:Sequelize.STRING,
      location:Sequelize.STRING,
      date:Sequelize.DATE,
      canceled_at:Sequelize.STRING,
      
    },
    {
      sequelize
    })
  }
  static associate(models){
    this.belongsTo(models.User, {foreignKey:'user_id',as:'user'})
    this.belongsTo(models.File, {foreignKey:'banner_id',as:'banner'})
  }
}
export default Meetup