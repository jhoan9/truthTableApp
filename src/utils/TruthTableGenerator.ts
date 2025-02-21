import { validateExpression } from "./validateExpression";

export const generateTruthTable = (expression: string): string[][] => {

    const errorMsg = validateExpression(expression);
    if (errorMsg) {
        throw new Error(errorMsg);
    }
    const variables = Array.from(new Set(expression.match(/[A-Z]/g) || [])).sort();

    const numRows = 2 ** variables.length;
    const table: string[][] = [];

    for (let i = 0; i < numRows; i++) {
        const row: string[] = [];
        const values: Record<string, boolean> = {};

        // Asignar valores a cada variable
        variables.forEach((variable, index) => {
            values[variable] = Boolean(i & (1 << (variables.length - index - 1)));
            row.push(values[variable] ? "F" : "V"); // Se usa "V" para verdadero y "F" para falso
        });

        // Evaluar la expresión y agregar el resultado a la fila
        const result: string = evaluateExpression(expression, values) ? "V" : "F";
        row.push(result);

        table.push(row);
    }

    const result: string[] = table.map(row => row[row.length - 1]);

    for (let index = 0; index < table.length; index++) {
        const element = table[index];
        element.pop();
    }
    for (let index = 0; index < table.length; index++) {
        const element = table[index];
        element.push(result[table.length - index - 1]);

    }

    // Agregar encabezado en la primera fila
    const header: string[] = variables.concat([expression]);
    table.unshift(header);

    return table;
};


const evaluateExpression = (expression: string, values: Record<string, boolean>): boolean => {

    let result: string = expression.replace(/[A-Z]/g, match => (values[match] ? "true" : "false"));

    let operation = result
        .replaceAll("~", "!")    // Negación
        .replaceAll("∧", "&&")   // Conjunción
        .replaceAll("∨", "||")   // Disyunción
        .replaceAll("⊻", "!==")  // Disyunción exclusiva: (A ⊻ B) equivale a (A !== B)
        .replaceAll("→", "<=") // Implicación: (A → B) equivale a (!A || B)
        .replaceAll("↔", "===") // Bicondicional: (A ↔ B) equivale a (A === B)
        .replaceAll("[", "")    // Convierte corchetes en paréntesis
        .replaceAll("]", "");   // Convierte corchetes en paréntesis

    console.log("Operation: ", operation);


    try {
        const resultOperation: boolean = Function('"use strict";return (' + operation + ')')();
        return resultOperation;
    } catch (error) {
        throw new Error("Error en Sintaxys");
        console.error("Error evaluating expression:", error);
        return false;
    }
};
