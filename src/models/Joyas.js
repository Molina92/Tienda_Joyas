const { DB } = require("../config/db");
const format = require("pg-format");

const prepareHATEOAS = (joyas) => {
    const results = joyas.map((j) => ({
        name: j.nombre,
        href: `/joyas/${j.id}`,
    }));
    const total = joyas.length;
    return { total, results };
};

const getJoyas = async ({ limit = 10, order_by = "id_ASC", page = 1 }) => {
    try {
        const [campo, direccion] = order_by.split("_");
        const offset = Math.abs((page - 1) * limit);

        const SQLQuery = format(`
            SELECT * FROM inventario
            ORDER BY %s %s 
            LIMIT %s
            OFFSET %s`,
            campo,
            direccion,
            limit,
            offset
        );

        const SQLSubQueryStock = format(` 
            SELECT SUM(stock) AS total_stock FROM 
            (SELECT stock FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s)`,
            campo,
            direccion,
            limit,
            offset
        );

        const { rows: results, rowCount: totalJoyas } = await DB.query(SQLQuery);
        const { rowCount: count } = await DB.query('SELECT * FROM inventario');
        const result = await DB.query(SQLSubQueryStock);
        const stockTotal = result.rows[0].total_stock;

        // Preparar respuesta según estructura de datos HATEOAS
        const HATEOAS = prepareHATEOAS(results);

        return {
            totalJoyas,
            stockTotal,
            pages: Math.ceil(count / limit),
            HATEOAS
        };

    } catch (error) {
        throw error;
    }
};

module.exports = {
    getJoyas
};
