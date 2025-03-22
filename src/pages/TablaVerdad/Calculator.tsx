import React, { useState, useRef } from "react";
import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonAlert,
} from "@ionic/react";
import { generateTruthTable } from "../../utils/TruthTableGenerator";

const Calculator: React.FC = () => {
  const [expression, setExpression] = useState("");
  const [truthTable, setTruthTable] = useState<string[][]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditable, setIsEditable] = useState(false); // Permite mover el cursor
  const inputRef = useRef<HTMLIonInputElement>(null); // Referencia al IonInput

  // Manejar la inserción de caracteres en la posición del cursor
  const handleButtonClick = (symbol: string) => {
    if (inputRef.current) {
      inputRef.current.getInputElement().then((inputElement) => {
        if (inputElement) {
          const start = inputElement.selectionStart || 0;
          const end = inputElement.selectionEnd || 0;

          // Insertar el nuevo símbolo en la posición del cursor
          const newExpression =
            expression.slice(0, start) + symbol + expression.slice(end);
          setExpression(newExpression);

          // Mover el cursor después del nuevo símbolo
          setTimeout(() => {
            inputElement.selectionStart = inputElement.selectionEnd =
              start + symbol.length;
          }, 0);
        }
      });
    }
  };

  // Manejar la eliminación de caracteres en la posición del cursor
  const handleDelete = () => {
    if (inputRef.current) {
      inputRef.current.getInputElement().then((inputElement) => {
        if (inputElement) {
          const start = inputElement.selectionStart || 0;
          const end = inputElement.selectionEnd || 0;

          if (start === 0 && end === 0) return; // Si está al inicio, no hacer nada

          // Si hay selección, borrar toda la selección
          if (start !== end) {
            const newExpression =
              expression.slice(0, start) + expression.slice(end);
            setExpression(newExpression);

            // Mover el cursor al inicio de la selección eliminada
            setTimeout(() => {
              inputElement.selectionStart = inputElement.selectionEnd = start;
            }, 0);
          } else {
            // Si no hay selección, eliminar el carácter anterior al cursor
            const newExpression =
              expression.slice(0, start - 1) + expression.slice(end);
            setExpression(newExpression);

            // Mover el cursor una posición hacia atrás
            setTimeout(() => {
              inputElement.selectionStart = inputElement.selectionEnd =
                start - 1;
            }, 0);
          }
        }
      });
    }
  };

  const handleGenerateTable = () => {
    try {
      const table = generateTruthTable(expression);
      setTruthTable(table);
    } catch (error: any) {
      setErrorMessage(error.message);
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calculadora Lógica</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>
          Instrucciones: Haz clic en los botones para formar la expresión lógica
          y generar la tabla.
        </p>
        <IonInput
          ref={inputRef}
          value={expression}
          className="ion-text-center"
          readonly={!isEditable} // Permite mover el cursor sin abrir teclado
          onIonInput={(e) => setExpression(e.detail.value!)}
        />
        <IonGrid>
          <IonRow>
            {[
              "[",
              "(",
              ")",
              "]",
              "~",
              "∧",
              "∨",
              "⊻",
              "→",
              "↔",
              "P",
              "Q",
              "R",
            ].map((symbol) => (
              <IonCol key={symbol} size="auto">
                <IonButton onClick={() => handleButtonClick(symbol)}>
                  {symbol}
                </IonButton>
              </IonCol>
            ))}
            {/* Botón para borrar un solo carácter */}
            <IonCol size="auto">
              <IonButton color="danger" onClick={handleDelete}>
                ←
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonButton color="primary" onClick={handleGenerateTable}>
          Generar Tabla
        </IonButton>
        <IonButton color="medium" onClick={() => setExpression("")}>
          Limpiar
        </IonButton>
        {/* Botón para activar la edición del input */}
        <IonButton color="secondary" onClick={() => setIsEditable(!isEditable)}>
          {isEditable ? "Bloquear" : "Editar"}
        </IonButton>

        {truthTable.length > 0 && (
          <IonCard className="ion-padding">
            <IonGrid>
              {truthTable.map((row, rowIndex) => (
                <IonRow key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <IonCol
                      key={colIndex}
                      className={rowIndex === 0 ? "header" : "data"}
                    >
                      {cell}
                    </IonCol>
                  ))}
                </IonRow>
              ))}
            </IonGrid>
          </IonCard>
        )}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Error"
          message={errorMessage || "Expresión inválida."}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Calculator;
