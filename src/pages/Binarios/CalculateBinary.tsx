import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonInput,
    IonCard,
    IonCardContent,
    IonIcon
} from "@ionic/react";
import React, { useState } from "react";
import { arrowUpCircleOutline, arrowDownCircleOutline, caretBackCircleOutline, closeCircleOutline } from 'ionicons/icons';

const CalculateBinary: React.FC = () => {
    const [binaryInput1, setBinaryInput1] = useState("");
    const [binaryInput2, setBinaryInput2] = useState("");
    const [resultBinary, setResultBinary] = useState("0");
    const [resultDecimal, setResultDecimal] = useState("0");
    const [activeInput, setActiveInput] = useState<"input1" | "input2">("input1");
    const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
    const [isEditable, setIsEditable] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleOperation = (operation: string) => {
        if (!binaryInput1) return; // Solo permitir seleccionar operación si el primer input tiene un valor
        
        if (selectedOperation === operation) {
            setSelectedOperation(null);
            return;
        }
        setSelectedOperation(operation);
        setActiveInput("input2");
        setIsEditable(true);
    };

    const calculateResult = () => {
        setErrorMessage(null); // Limpiar mensajes de error antes de calcular

        const num1 = parseInt(binaryInput1, 2) || 0;
        const num2 = parseInt(binaryInput2, 2) || 0;
        let result = 0;

        try {
            switch (selectedOperation) {
                case "add":
                    result = num1 + num2;
                    break;
                case "subtract":
                    result = num1 - num2;
                    break;
                case "multiply":
                    result = num1 * num2;
                    break;
                case "divide":
                    if (num2 === 0) {
                        throw new Error("No se puede dividir entre cero.");
                    }
                    result = Math.floor(num1 / num2);
                    break;
                default:
                    return;
            }

            setResultDecimal(result.toString());
            setResultBinary(result.toString(2));
        } catch (error: any) {
            setErrorMessage(error.message);
            setResultDecimal("0");
            setResultBinary("0");
        }
    };

    const handleArrowUp = () => {
        setActiveInput("input1");
        setIsEditable(true);
    };

    const handleArrowDown = () => {
        setActiveInput("input2");
        setIsEditable(true);
    };

    const handleNumberInput = (num: string) => {
        if (activeInput === "input1") {
            setBinaryInput1((prev) => prev + num);
        } else {
            setBinaryInput2((prev) => prev + num);
        }
    };

    const handleBackspace = () => {
        if (activeInput === "input1") {
            setBinaryInput1((prev) => prev.slice(0, -1));
        } else {
            setBinaryInput2((prev) => prev.slice(0, -1));
        }
    };

    const handleClear = () => {
        setBinaryInput1("");
        setBinaryInput2("");
        setResultBinary("0");
        setResultDecimal("0");
        setSelectedOperation(null);
        setErrorMessage(null);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Calculadora de Binarios</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                value={binaryInput1}
                                placeholder="Ingrese primer número binario"
                                readonly={!isEditable || activeInput !== "input1"}
                                style={{ border: activeInput === "input1" ? "2px solid blue" : "none" }}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonInput
                                value={binaryInput2}
                                placeholder="Ingrese segundo número binario"
                                readonly={!isEditable || activeInput !== "input2"}
                                style={{ border: activeInput === "input2" ? "2px solid blue" : "none" }}
                            />
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonIcon color="primary" size="large" icon={arrowUpCircleOutline} onClick={handleArrowUp} /></IonCol>
                        <IonCol></IonCol>
                        <IonCol><IonIcon color="primary" size="large" icon={caretBackCircleOutline} onClick={handleBackspace} /></IonCol>
                        <IonCol><IonIcon color="primary" size="large" icon={closeCircleOutline} onClick={handleClear} /></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonIcon color="primary" size="large" icon={arrowDownCircleOutline} onClick={handleArrowDown} /></IonCol>
                        <IonCol></IonCol>
                        <IonCol><IonButton disabled={!binaryInput1 || (!!selectedOperation && selectedOperation !== "multiply")} onClick={() => handleOperation("multiply")} color={selectedOperation === "multiply" ? "tertiary" : "primary"}>x</IonButton></IonCol>
                        <IonCol><IonButton disabled={!binaryInput1 || (!!selectedOperation && selectedOperation !== "divide")} onClick={() => handleOperation("divide")} color={selectedOperation === "divide" ? "tertiary" : "primary"}>/</IonButton></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonButton onClick={() => handleNumberInput("1")}>1</IonButton></IonCol>
                        <IonCol><IonButton onClick={() => handleNumberInput("0")}>0</IonButton></IonCol>
                        <IonCol><IonButton disabled={!binaryInput1 || (!!selectedOperation && selectedOperation !== "add")} onClick={() => handleOperation("add")} color={selectedOperation === "add" ? "tertiary" : "primary"}>+</IonButton></IonCol>
                        <IonCol><IonButton disabled={!binaryInput1 || (!!selectedOperation && selectedOperation !== "subtract")} onClick={() => handleOperation("subtract")} color={selectedOperation === "subtract" ? "tertiary" : "primary"}>-</IonButton></IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol><IonButton expand="full" onClick={calculateResult}>=</IonButton></IonCol>
                    </IonRow>
                </IonGrid>

                {errorMessage && (
                    <IonCard color="danger">
                        <IonCardContent>
                            <p>{errorMessage}</p>
                        </IonCardContent>
                    </IonCard>
                )}

                <IonCard>
                    <IonCardContent>
                        <p>Resultado Decimal: {resultDecimal}</p>
                        <p>Resultado Binario: {resultBinary}</p>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default CalculateBinary;
