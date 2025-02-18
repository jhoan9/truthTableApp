// Función para validar la expresión lógica
export const validateExpression = (expression: string): string | null => {
  // Quitar espacios
  const expr = expression.replace(/\s+/g, "");
  
  // Verificar que la expresión tenga más de 1 caracter
  if (expr.length < 2) {
    return "La expresión es demasiado corta.";
  }
  
  const operators = ["~", "∧", "∨", "⊻", "→", "↔"];
  
  // La expresión debe tener al menos una variable y un operador
  if (!/[A-Z]/.test(expr) || !operators.some(op => expr.includes(op))) {
    return "La expresión debe contener al menos una variable y un operador.";
  }
  
  // No permitir que la expresión termine con un operador
  if (operators.includes(expr[expr.length - 1])) {
    return "La expresión no puede terminar con un operador.";
  }
  
  // No permitir dos operadores consecutivos
  for (let i = 0; i < expr.length - 1; i++) {
    if (operators.includes(expr[i]) && operators.includes(expr[i + 1])) {
      return "No se permiten dos operadores consecutivos.";
    }
  }
  
  // Verificar que cada paréntesis o corchete abierto tenga su cierre correspondiente
  const stack: string[] = [];
  for (let i = 0; i < expr.length; i++) {
    const char = expr[i];
    if (char === "(" || char === "[") {
      stack.push(char);
    } else if (char === ")" || char === "]") {
      if (stack.length === 0) return `Falta símbolo de apertura para '${char}'.`;
      const last = stack.pop();
      if ((char === ")" && last !== "(") || (char === "]" && last !== "[")) {
        return "Los símbolos de agrupación no coinciden.";
      }
    }
  }
  if (stack.length > 0) return "Falta un símbolo de cierre para un agrupador.";
  
  // Verificar que el símbolo de negación (~) esté correctamente posicionado:
  // Debe estar al inicio o después de un operador o de un agrupador (no detrás de una variable).
  for (let i = 0; i < expr.length; i++) {
    if (expr[i] === "~") {
      // Si no es el primer carácter, el anterior debe ser un operador o un agrupador de apertura.
      if (i > 0 && !operators.includes(expr[i - 1]) && expr[i - 1] !== "(" && expr[i - 1] !== "[") {
        return "El símbolo de negación '~' debe ir al inicio o después de un operador o agrupador de apertura.";
      }
      // El siguiente carácter debe ser una variable o un agrupador de apertura.
      if (i === expr.length - 1) {
        return "El símbolo de negación '~' debe estar seguido de una variable o agrupador.";
      }
      const next = expr[i + 1];
      if (!/[A-Z([]/.test(next)) {
        return "El símbolo de negación '~' debe estar seguido de una variable o agrupador.";
      }
    }
  }
  
  // No permitir que una variable seguida inmediatamente de "~" (ej: P~Q o P~P)
  for (let i = 0; i < expr.length - 1; i++) {
    if (/[A-Z]/.test(expr[i]) && expr[i + 1] === "~") {
      return "No se permite que una variable niegue a otra directamente (ejemplo: P~Q).";
    }
  }
  // No permitir que una variable sea seguida inmediatamente de un agrupador de apertura (ej: P( o P[)
  for (let i = 0; i < expr.length - 1; i++) {
    if (/[A-Z]/.test(expr[i]) && (expr[i + 1] === "(" || expr[i + 1] === "[")) {
      return "Si 𝑝 representa una proposición, no puede aplicarse a otra proposición de la forma 𝑝(𝑥), porque las proposiciones son valores de verdad (V o F) y no funciones.";
    }
  }

  // Definir los operadores binarios (excluimos '~' que es unario)
  const binaryOperators = ["∧", "∨", "⊻", "→", "↔"];
  
  // No permitir que la expresión comience con un operador binario
  if (binaryOperators.includes(expr[0])) {
    return "La expresión no puede comenzar con un operador binario.";
  }
  
  // No permitir que un agrupador de apertura sea seguido inmediatamente de un operador binario
  for (let i = 0; i < expr.length - 1; i++) {
    if ((expr[i] === "(" || expr[i] === "[") && binaryOperators.includes(expr[i + 1])) {
      return "No se permite que un agrupador se siga inmediatamente de un operador binario.";
    }
  }
  
  // No permitir agrupadores vacíos: "()" o "[]"
  if (/\(\)/.test(expr) || /\[\]/.test(expr)) {
    return "No se permiten agrupadores vacíos.";
  }
  
  return null; // Expresión válida
};
