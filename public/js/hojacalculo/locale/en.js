! function (e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function (e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }, n.r = function (e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function (t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function (e) {
        var t = e && e.__esModule ? function () {
            return e.default
        } : function () {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 1)
}([, function (e, t, n) {
    "use strict";
    n.r(t);
    const r = {
        toolbar: {
            undo: "Atras",
            redo: "Adelante",
            print: "Imprimir",
            paintformat: "Dibujar formato",
            clearformat: "Limpiar formato",
            format: "Formatear",
            fontName: "Fuente",
            fontSize: "Tamaño fuente",
            fontBold: "Fuente negrita",
            fontItalic: "Fuente italica",
            underline: "Subrayado",
            strike: "Tachado",
            color: "Color texto",
            bgcolor: "Relleno color",
            border: "Bordes",
            merge: "Juntar celdas",
            align: "Alineacion horizontal",
            valign: "Alineacion vertical",
            textwrap: "Envoltura Texto",
            freeze: "Liberar celda",
            autofilter: "Filtrar",
            formula: "Funciones",
            more: "Mas"
        },
        contextmenu: {
            copy: "Copiar",
            cut: "Cortar",
            paste: "Pegar",
            pasteValue: "Pegar solo valores",
            pasteFormat: "Pegar solo formato",
            hide: "Ocultar",
            insertRow: "Insertar fila",
            insertColumn: "Insertar columna",
            deleteSheet: "Borrar",
            deleteRow: "Borrar fila",
            deleteColumn: "Borrar columna",
            deleteCell: "Borrar celda",
            deleteCellText: "Borrar celda texto",
            validation: "Validaciones",
            cellprintable: "Permitir exportar",
            cellnonprintable: "Denegar exportar",
            celleditable: "Permitir editar",
            cellnoneditable: "Denegar editar"
        },
        print: {
            size: "Paper size",
            orientation: "Page orientation",
            orientations: ["Landscape", "Portrait"]
        },
        format: {
            normal: "Normal",
            text: "Texto plano",
            number: "Numero",
            percent: "Porcentaje",
            rmb: "RMB",
            usd: "USD",
            eur: "EUR",
            date: "Fecha",
            time: "Tiempo",
            datetime: "Fecha tiempo",
            duration: "Duracion"
        },
        formula: {
            sum: "Suma",
            average: "Media",
            max: "Maximo",
            min: "Minimo",
            _if: "SI",
            and: "Y",
            or: "O",
            concat: "Concat"
        },
        validation: {
            required: "it must be required",
            notMatch: "it not match its validation rule",
            between: "it is between {} and {}",
            notBetween: "it is not between {} and {}",
            notIn: "it is not in list",
            equal: "it equal to {}",
            notEqual: "it not equal to {}",
            lessThan: "it less than {}",
            lessThanEqual: "it less than or equal to {}",
            greaterThan: "it greater than {}",
            greaterThanEqual: "it greater than or equal to {}"
        },
        error: {
            pasteForMergedCell: "Unable to do this for merged cells"
        },
        calendar: {
            weeks: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        },
        button: {
            next: "Siguiente",
            cancel: "Cancelar",
            remove: "Quitar",
            save: "Guardar",
            ok: "OK"
        },
        sort: {
            desc: "Ordenar Z -> A",
            asc: "Ordenar A -> Z"
        },
        filter: {
            empty: "vacio"
        },
        dataValidation: {
            mode: "Modo",
            range: "Rango celdas",
            criteria: "Criteria",
            modeType: {
                cell: "Cell",
                column: "Colun",
                row: "Row"
            },
            type: {
                list: "Lista",
                number: "Numero",
                date: "Fecha",
                phone: "Telefono",
                email: "Email"
            },
            operator: {
                be: "entre",
                nbe: "no entre",
                lt: "menor que",
                lte: "menor que o igual que",
                gt: "mas grande que",
                gte: "mas grande que o igual que",
                eq: "igual que",
                neq: "no igual que"
            }
        }
    };
    window && window.x_spreadsheet && (window.x_spreadsheet.$messages = window.x_spreadsheet.$messages || {}, window.x_spreadsheet.$messages.en = r), t.default = r
}]);