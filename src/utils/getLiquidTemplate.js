const { Liquid } = require('liquidjs');
const path = require('path');

/**
 * Renderiza un template Liquid con los datos dados.
 * @param {string} templatePath - Ruta absoluta o relativa del archivo de plantilla (.liquid o .html).
 * @param {object} data - Objeto con los datos para rellenar el template.
 * @returns {Promise<string>} - HTML generado como string.
 */

const getLiquidTemplate = async (templatePath, data) => {
    const absolutePath = path.resolve(process.cwd(), templatePath); // convierte a ruta absoluta desde la raíz del proyecto
    const templateDir = path.dirname(absolutePath);
    const templateFile = path.basename(absolutePath, path.extname(absolutePath));
    const templateExt = path.extname(absolutePath);

    const engine = new Liquid({
        root: templateDir,
        extname: templateExt
    });

    return await engine.renderFile(templateFile, data);

}
module.exports = getLiquidTemplate;