import { Sequelize } from "sequelize";

const sequelize = new Sequelize("Jumia", "postgres", "08027146369Aos@@@", {
  host: "localhost",
  dialect: "postgres",
});

export default sequelize;