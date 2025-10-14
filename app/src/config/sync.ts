import sequelize from "./database";
import Access from "../Persistence/accesses/access.model";
import Role from "../Persistence/roles/role.model";
import User from "../Persistence/users/user.model";
import Product from "../Persistence/products/product.model";

import { applyAssociations } from "./associations";

applyAssociations();

// Sincronizar modelos con la base de datos
const syncDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('viva petro')

        await sequelize.sync();
        console.log('Modelos vivos')
    } catch (error) {
        console.log('No se pudo conectar a la base de datos: ', error);
    }
};

export {
    sequelize,
    syncDB,
    Access,
    Role,
    User,
    Product,
};