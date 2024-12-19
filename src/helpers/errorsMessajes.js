module.exports = {
    Jewel_Not_Found: {
        id: 'jewelNotFound',
        statusCode: 404,
        message: 'Joya no encontrada',
        description: 'No se encontraron joyas que coincidan con los parámetros de búsqueda proporcionados.',
    },

    Invalid_Query_Parameters: {
        id: 'invalidQueryParameters',
        statusCode: 400,
        message: 'Parámetros de consulta inválidos',
        description: 'Los parámetros proporcionados en la consulta no son válidos. Verifique los valores enviados.',
    },

    Server_Error: {
        id: 'serverError',
        statusCode: 500,
        message: 'Error interno del servidor',
        description: 'Hubo un error interno del servidor. Por favor, inténtelo más tarde.',
    },
};
