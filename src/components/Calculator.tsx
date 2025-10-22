import { useState } from 'react';
import { Button } from '@/components/ui/button';

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const currentValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const ButtonCalc = ({ children, onClick, variant = 'default', className = '' }: any) => (
    <Button
      variant={variant}
      onClick={onClick}
      className={`h-16 text-lg font-medium ${className}`}
    >
      {children}
    </Button>
  );

  return (
    <div className="w-full h-full bg-background p-4 flex flex-col">
      <div className="bg-card rounded-lg p-6 mb-4 text-right">
        <div className="text-4xl font-light break-all">{display}</div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 flex-1">
        <ButtonCalc onClick={handleClear} variant="secondary" className="bg-destructive/10 hover:bg-destructive/20">C</ButtonCalc>
        <ButtonCalc onClick={() => handleOperator('÷')} variant="secondary">÷</ButtonCalc>
        <ButtonCalc onClick={() => handleOperator('×')} variant="secondary">×</ButtonCalc>
        <ButtonCalc onClick={() => setDisplay(String(-parseFloat(display)))} variant="secondary">+/-</ButtonCalc>

        <ButtonCalc onClick={() => handleNumber('7')}>7</ButtonCalc>
        <ButtonCalc onClick={() => handleNumber('8')}>8</ButtonCalc>
        <ButtonCalc onClick={() => handleNumber('9')}>9</ButtonCalc>
        <ButtonCalc onClick={() => handleOperator('-')} variant="secondary">-</ButtonCalc>

        <ButtonCalc onClick={() => handleNumber('4')}>4</ButtonCalc>
        <ButtonCalc onClick={() => handleNumber('5')}>5</ButtonCalc>
        <ButtonCalc onClick={() => handleNumber('6')}>6</ButtonCalc>
        <ButtonCalc onClick={() => handleOperator('+')} variant="secondary">+</ButtonCalc>

        <ButtonCalc onClick={() => handleNumber('1')}>1</ButtonCalc>
        <ButtonCalc onClick={() => handleNumber('2')}>2</ButtonCalc>
        <ButtonCalc onClick={() => handleNumber('3')}>3</ButtonCalc>
        <ButtonCalc onClick={handleEquals} variant="default" className="row-span-2 bg-primary text-primary-foreground hover:bg-primary/90">=</ButtonCalc>

        <ButtonCalc onClick={() => handleNumber('0')} className="col-span-2">0</ButtonCalc>
        <ButtonCalc onClick={handleDecimal}>.</ButtonCalc>
      </div>
    </div>
  );
};
