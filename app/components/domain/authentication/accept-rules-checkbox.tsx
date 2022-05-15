import { useState } from 'react';
import { Link } from 'react-router-dom';

type AcceptRulesCheckboxProps = {
  checked: boolean;
  setChecked: (checked: boolean) => void;
};

export const AcceptRulesCheckbox = ({ checked, setChecked }: AcceptRulesCheckboxProps) => {
  const [displayWarning, setDisplayWarning] = useState(false);

  const handleCheck = () => {
    if (!displayWarning) {
      setDisplayWarning(true);
    } else {
      setChecked(!checked);
    }
  };

  return (
    <div>
      <input required id="accept-rules" type="checkbox" checked={checked} onChange={handleCheck} />
      <label htmlFor="accept-rules" className="inline-block ml-2">
        J'accept{' '}
        <Link to="/charte" target="_blank">
          la charte
        </Link>
      </label>

      {displayWarning && (
        <div className="my-2">
          Il est important que chaque membre ait pris connaissance de la charte. Si ce n'est pas encore fait,
          accordez <strong>5 minutes</strong> à sa lecture avant de vous inscrire.
        </div>
      )}
    </div>
  );
};
