/**Obtenemos express */
const express = require('express');

/**Declaramos una constante app y traemos todo lo que se ejecuta en express */
const app = express();

/**Importamos morgan */
const morgan = require('morgan');

/**Importo las rutas */
const router = require('../routes/index');

/**Permite manipular json con express */
app.use(express.json());

/**Lo de encoding se debe poner en false para poder interpretar json con express */
app.use(express.urlencoded(({extended: false})));

/**Agregamos morgan a partir de express. Permite ver los logs de diferente forma en consola */
app.use(morgan('dev'));

/**Le indico a express que voy a utilizar esas rutas 
 * Trae las rutas desde index.js de route
*/
app.use(router);

/**Le damos de alta al servidor. Hacemos que escuche en el puesto 3000 */
app.listen(3000, ()=>{
    console.log(`Server Listen on port ${3000}`);
});