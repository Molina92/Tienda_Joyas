const { DB } = require("../config/db");

const prepareHATEOAS = (joyas) => {
    const results = joyas.map((j) => ({
        name: j.nombre,
        category: j.categoria,
        metal: j.metal,
        price: j.precio,
        stock: j.stock,
        href: `/joyas/${j.id}`,
    }));
    const total = joyas.length;
    return { total, results };
};

const getJoyas = async ({ limit = 10, order_by = "id_ASC", page = 1 }) => {
    try {
        const validCampos = ['id', 'nombre', 'precio', 'stock', 'categoria', 'metal'];
        const validDirecciones = ['ASC', 'DESC'];
        const [campo, direccion] = order_by.split("_");

        if (!validCampos.includes(campo) || !validDirecciones.includes(direccion)) {
            throw new Error('Invalid_Query_Parameters');
        }

        const offset = Math.abs((page - 1) * limit);

        const SQLQuery = `
            SELECT * FROM inventario
            ORDER BY ${campo} ${direccion}
            LIMIT $1 OFFSET $2`;

        const SQLSubQueryStock = `
            SELECT SUM(stock) AS total_stock 
            FROM (SELECT stock FROM inventario ORDER BY ${campo} ${direccion} LIMIT $1 OFFSET $2) AS subquery`;

        const { rows: results, rowCount: totalJoyas } = await DB.query(SQLQuery, [limit, offset]);
        const { rows: [{ total_stock: stockTotal }] } = await DB.query(SQLSubQueryStock, [limit, offset]);
        const { rows: countResult } = await DB.query('SELECT COUNT(*) AS total FROM inventario');
        const count = parseInt(countResult[0].total, 10);
        const { results: resultsHateoas } = prepareHATEOAS(results);

        return {
            totalJoyas,
            stockTotal,
            pages: Math.ceil(count / limit),
            resultsHateoas
        };

    } catch (error) {
        throw error;
    }
};

const getJoyasFiltered = async ({ limit = 10, order_by = "id_ASC", page = 1, precio_min = '', precio_max = '', categoria = '', metal = '' }) => {
    try {
        
        const validCampos = ['id', 'nombre', 'precio', 'stock', 'categoria', 'metal'];
        const validDirecciones = ['ASC', 'DESC'];
        const [campo, direccion] = order_by.split("_");

        if (!validCampos.includes(campo) || !validDirecciones.includes(direccion)) {
            throw new Error('Invalid_Query_Parameters');
        }

        const offset = Math.abs((page - 1) * limit);

        const SQLQuery = handleGetFilters({ limit, precio_min, precio_max, categoria, metal, campo, direccion, offset });

        const { rows, rowCount } = await DB.query(SQLQuery.text, SQLQuery.values);
        const { rows: countResult } = await DB.query('SELECT COUNT(*) FROM inventario');
        const count = parseInt(countResult[0].count, 10);

        return {
            rows,
            rowCount,
            pages: Math.ceil(count / limit),
        };
    } catch (error) {
        throw error;
    }
};

const handleGetFilters = ({ limit, precio_min, precio_max, categoria, metal, campo, direccion, offset }) => {
    let filtros = [];
    let valores = [];

    if (precio_min) {
        filtros.push(`precio >= $${valores.length + 1}`);
        valores.push(precio_min);
    }
    if (precio_max) {
        filtros.push(`precio <= $${valores.length + 1}`);
        valores.push(precio_max);
    }
    if (categoria) {
        filtros.push(`categoria = $${valores.length + 1}`);
        valores.push(categoria);
    }
    if (metal) {
        filtros.push(`metal = $${valores.length + 1}`);
        valores.push(metal);
    }

    let consulta = 'SELECT * FROM inventario';

    if (filtros.length) {
        consulta += ' WHERE ' + filtros.join(' AND ');
    }

    consulta += ` ORDER BY ${campo} ${direccion}`;
    consulta += ` LIMIT ${limit}`;
    consulta += ` OFFSET ${offset}`;

    return {
        text: consulta,
        values: valores,
    };
};

module.exports = {
    getJoyas,
    getJoyasFiltered
};
