package com.autorent.domain.constants;

public final class ErrorMessages {

        private ErrorMessages() {
        }

        /* ==========================
        AUTOS
        ========================== */

        public static final String AUTO_NO_ENCONTRADO =
                "Auto no encontrado";

        public static final String AUTO_DUPLICADO =
                "Ya existe un auto registrado con esa placa";

        public static final String AUTO_NO_DISPONIBLE =
                "El auto no está disponible para alquiler";

        public static final String AUTO_NO_ELIMINABLE =
                "Solo se pueden eliminar autos en estado DISPONIBLE";

        public static final String NO_HAY_AUTOS_REGISTRADOS =
                "No hay actualmente autos registrados";

        public static final String NO_HAY_AUTOS_POR_ESTADO =
                "No hay actualmente autos en estado: ";
        
        public static final String AUTO_NO_EN_TALLER =
                " El vehiculo no se encuentra actualmente en MANTENIMIENTO";

        /* ==========================
        CLIENTES
        ========================== */

        public static final String CLIENTE_NO_ENCONTRADO =
                "Cliente no encontrado";

        public static final String DOCUMENTO_DUPLICADO =
                "Ya existe un cliente con ese documento registrado";

        public static final String TELEFONO_DUPLICADO =
                "Ya existe un cliente registrado con ese teléfono";

        public static final String NO_HAY_CLIENTES_REGISTRADOS =
                "No existen clientes registrados actualmente";

        public static final String CLIENTE_NO_ELIMINABLE =
                "NO se pueden eliminar clientes con alquileres activos";

        /* ==========================
        ALQUILERES
        ========================== */

        public static final String ALQUILER_NO_ENCONTRADO =
                "Alquiler no encontrado";

        public static final String ALQUILER_FINALIZADO =
                "El alquiler ya fue finalizado";

        public static final String NO_HAY_ALQUILERES =
                "No existen alquileres registrados actualmente";

        public static final String NO_HAY_ALQUILERES_ESTADO =
                "No existen alquileres registrados en estado: ";

        public static final String DIAS_INVALIDOS = 
                "La cantidad de días debe ser mayor que cero";
        
        public static final String DIAS_UTILIZADOS_INVALIDOS = 
                "La cantidad de días utilizados no puede ser mayor que la cantidad de días del alquiler";

        /* ==========================
        ALQUILERES (PAGOS) Y OTRAS VALIDACIONES
        ========================== */
                
        public static final String PRECIO_OBLIGATORIO = 
                "El precio es por día es obligatorio";

        public static final String PRECIO_INVALIDO =
                "El precio por día debe ser mayor que cero (0)";

        public static final String PAGO_PENDIENTE =
                "Debe completar el pago antes de finalizar";

        public static final String VALOR_PAGO_INVALIDO = 
                "El valor del pago debe ser mayor que cero";

        public static final String NOMBRE_OBLIGATORIO =
                "El nombre es obligatorio";

        public static final String DOCUMENTO_OBLIGATORIO =
                "El documento es obligatorio";

        public static final String DOCUMENTO_INVALIDO = 
                "El documento debe contener entre 5 y 10 dígitos numéricos";

        public static final String TELEFONO_OBLIGATORIO =
                "El teléfono es obligatorio";

        public static final String TELEFONO_INVALIDO = 
                "El número de teléfono debe empezar por 3 y contener 10 dígitos";

        public static final String EMAIL_OBLIGATORIO =
                "El email es obligatorio";

        public static final String EMAIL_INVALIDO =
                "El email no es válido";

        public static final String PLACA_OBLIGATORIA =
                "La placa es obligatoria";

        public static final String FORMATO_PLACA_INVALIDO = 
                "La placa debe tener el formato: ABC123";

        public static final String MARCA_OBLIGATORIA =
                "La marca es obligatoria";

        public static final String MODELO_OBLIGATORIO =
                "El modelo es obligatorio";

        public static final String ANIO_OBLIGATORIO =
                "El año es obligatorio";

        public static final String ANIO_INVALIDO =
                "El año debe ser mayor que cero (0)";

        public static final String KILOMETRAJE_INVALIDO =
                "El kilometraje debe ser mayor que cero (0): ";

        }