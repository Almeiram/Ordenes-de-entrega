import sequelize from './database';

export const syncDB = async () => {
  try {
    await sequelize.sync({ force: false }); 
    // force: falso → no borra tablas existentes
    // force: true → borra y vuelve a crear todo desde 0

    console.log("Base de datos sincronizada correctamente");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
};
