import {
  chakra,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper, useCallbackRef, useToast,
} from "@chakra-ui/react";
import * as React from "react";
import {CheckIcon, EditIcon} from "@chakra-ui/icons";
import {PropsWithChildren, useCallback, useState} from "react";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";

// TODO: Lift up for line chart
// type TargetSelectorProps = PropsWithChildren<{ currentValue: number, onTrigger: CallableFunction }>;
type TargetSelectorProps = PropsWithChildren<{ nodeName: string, initialValue: number, onChange: CallableFunction }>;
// const TargetSelector = ({onTrigger}: TargetSelectorProps) => {
const TargetSelector = ({nodeName, initialValue, onChange}: TargetSelectorProps) => {
  const [editEnabled, enableEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState(initialValue);
  // Just to avoid sending a request if the value hasn't actually changed
  const [previousValue, setPreviousValue] = useState(initialValue);
  const successToast = useToast();

  const mutateTarget = useMutation((newTarget: object) =>
    axios.post('http://localhost:8080/api/v1/targets', {
      targets: newTarget
    }), {
    onSuccess: () => {
      successToast({
        title: 'CPU target set successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const onSave = () => {
    enableEdit(!editEnabled);

    if (editEnabled && previousValue !== currentValue) {
      setPreviousValue(currentValue);
      mutateTarget.mutate({[nodeName]: currentValue});
    }
  }

  function onNumberInputChange(value: string) {
    setCurrentValue(Number(value));
    onChange(currentValue);
  }

  return (
    // TODO: Extract styling
    <chakra.span display="flex" flexDirection="row" alignItems="center"  justifyContent="flex-start">
      <NumberInput size='sm' maxW={90} defaultValue={initialValue} min={0} max={100} step={5} isDisabled={!editEnabled}
                   onChange={(value: string) => onNumberInputChange(value)} height="32px">
        <NumberInputField/>
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </NumberInput>
      <EditButton onClick={onSave} enabled={editEnabled}/>
    </chakra.span>
  )
}

type EditButtonProps = PropsWithChildren<{ enabled: boolean, onClick: CallableFunction }>;
const EditButton = ({enabled, onClick}: EditButtonProps) => (
  enabled ?
    <CheckIcon marginLeft="12px" onClick={() => onClick()} cursor="pointer"/> :
    <EditIcon marginLeft="12px" onClick={() => onClick()} cursor="pointer"/>
)

export default TargetSelector;