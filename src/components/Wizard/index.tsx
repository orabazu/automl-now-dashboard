import './Wizard.scss';

import { Button, message, Steps, Tooltip } from 'antd';
import React, { ReactNode, useState } from 'react';

const { Step } = Steps;

type StepType = { title: string; content: string | ReactNode };
type WizardProps = {
  steps: StepType[];
  isNextDisabled?: boolean;
  tooltipText: string;
};

export const Wizard: React.FC<WizardProps> = ({ steps, isNextDisabled, tooltipText }) => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="steps">
      <Steps current={current} progressDot>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        <Button onClick={prev} disabled={!(current > 0)}>
          Previous
        </Button>
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current < steps.length - 1 && (
          <Tooltip title={tooltipText}>
            <Button
              type="primary"
              onClick={next}
              className={'steps-next-button'}
              disabled={isNextDisabled}>
              Next
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
