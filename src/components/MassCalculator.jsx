import React, { useState, useEffect } from "react";
import ShapeSelector from "./ShapeSelector";
import PropTypes from "prop-types";
import GenericForm from "./GenericForm";
import { getFormErrors } from "./formValidation";
import { getMassCalculatorFields } from "./MassCalculator.form";
import useSharedShape from "../hooks/useSharedShape";

export default function MassCalculator({
  onMassUpdate,
  onThicknessUpdate,
  thickness: parentThickness = "",
  isCutting = false,
  showRodShape = false,
  clearSignal = 0,
}) {
  const [shape, setShape] = useSharedShape();
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [outerDiameter, setOuterDiameter] = useState("");
  const [innerDiameter, setInnerDiameter] = useState("");
  const [totalLength, setTotalLength] = useState("");
  const [thickness, setThickness] = useState(parentThickness || "");
  const [rodDiameter, setRodDiameter] = useState("");
  const [rodLength, setRodLength] = useState("");
  const [calculatedMass, setCalculatedMass] = useState(null);
  const density = 7.86;

  useEffect(() => {
    setThickness(parentThickness || "");
  }, [parentThickness]);

  useEffect(() => {
    handleClearInternal();
  }, [clearSignal]);

  useEffect(() => {
    if (onThicknessUpdate) {
      onThicknessUpdate(thickness);
    }
  }, [thickness, onThicknessUpdate]);

  useEffect(() => {
    calculateAndNotify();
  }, [
    shape,
    length,
    width,
    outerDiameter,
    innerDiameter,
    totalLength,
    thickness,
    rodDiameter,
    rodLength,
  ]);

  const fields = getMassCalculatorFields({
    shape,
    length,
    setLength,
    width,
    setWidth,
    outerDiameter,
    setOuterDiameter,
    innerDiameter,
    setInnerDiameter,
    totalLength,
    setTotalLength,
    thickness,
    setThickness,
    rodDiameter,
    setRodDiameter,
    rodLength,
    setRodLength,
    showRodShape,
  });
  const { errors } = getFormErrors(fields);

  const calculateAndNotify = () => {
    let mass = 0;
    let valid = true;

    if (shape === "rectangle") {
      const lengthVal = parseFloat(length);
      const widthVal = parseFloat(width);
      const thicknessVal = parseFloat(thickness);

      if (
        isNaN(lengthVal) ||
        isNaN(widthVal) ||
        isNaN(thicknessVal) ||
        lengthVal <= 0 ||
        widthVal <= 0 ||
        thicknessVal <= 0
      ) {
        valid = false;
      } else {
        mass =
          ((lengthVal / 10) * (widthVal / 10) * (thicknessVal / 10) * density) /
          1000;
      }
    } else if (shape === "circle" || shape === "semicircle") {
      const outerDiameterVal = parseFloat(outerDiameter);
      const innerDiameterVal = parseFloat(innerDiameter) || 0;
      const thicknessVal = parseFloat(thickness);

      if (
        isNaN(outerDiameterVal) ||
        isNaN(thicknessVal) ||
        outerDiameterVal <= 0 ||
        thicknessVal <= 0
      ) {
        valid = false;
      } else {
        const outerRadius = outerDiameterVal / 2;
        const innerRadius = innerDiameterVal / 2;

        let area =
          Math.PI * (outerRadius * outerRadius - innerRadius * innerRadius);
        if (shape === "semicircle") {
          area /= 2;
        }
        mass = ((area / 100) * (thicknessVal / 10) * density) / 1000;
      }
    } else if (shape === "totalLength") {
      const totalLengthVal = parseFloat(totalLength);
      const thicknessVal = parseFloat(thickness);
      if (
        isNaN(totalLengthVal) ||
        isNaN(thicknessVal) ||
        totalLengthVal <= 0 ||
        thicknessVal <= 0
      ) {
        valid = false;
      } else {
        mass =
          ((totalLengthVal / 10) * (thicknessVal / 10) * 0.1 * density) / 1000;
      }
    } else if (shape === "rod") {
      const rodDiameterVal = parseFloat(rodDiameter);
      const rodLengthVal = parseFloat(rodLength);
      if (
        isNaN(rodDiameterVal) ||
        isNaN(rodLengthVal) ||
        rodDiameterVal <= 0 ||
        rodLengthVal <= 0
      ) {
        valid = false;
      } else {
        const rodRadius = rodDiameterVal / 2;
        const rodArea = Math.PI * rodRadius * rodRadius;
        mass = ((rodArea / 100) * (rodLengthVal / 10) * density) / 1000;
      }
    }

    if (!valid) {
      setCalculatedMass(null);

      return;
    }

    const calculatedValue = mass.toFixed(2);
    setCalculatedMass(`Masa detalu: ${calculatedValue} kg`);
    onMassUpdate?.(calculatedValue);
  };

  const handleClearInternal = () => {
    setLength("");
    setWidth("");
    setOuterDiameter("");
    setInnerDiameter("");
    setTotalLength("");
    setThickness("");
    setRodDiameter("");
    setRodLength("");
    setCalculatedMass(null);

    if (onThicknessUpdate) onThicknessUpdate("");

    onMassUpdate?.("");
  };

  return (
    <>
      <h2>Kalkulator do obliczania masy detalu</h2>
      <ShapeSelector
        shape={shape}
        setShape={setShape}
        isCutting={isCutting}
        showRodShape={showRodShape}
      />

      <GenericForm fields={fields} errors={errors} />

      {calculatedMass && <p>{calculatedMass}</p>}
    </>
  );
}

MassCalculator.propTypes = {
  onMassUpdate: PropTypes.func.isRequired,
  onThicknessUpdate: PropTypes.func,
  thickness: PropTypes.string,
  isCutting: PropTypes.bool,
  showRodShape: PropTypes.bool,
  clearSignal: PropTypes.number,
};
