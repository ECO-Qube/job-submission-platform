import {
  chakra,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import * as React from "react";
import {CheckIcon, EditIcon} from "@chakra-ui/icons";
import {PropsWithChildren, useState} from "react";
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

  const mutateTarget = useMutation((newTarget: object) =>
    axios.post('http://localhost:8080/api/v1/targets', {
      targets: newTarget
    }), {
    onSuccess: () => {
      // console.log('success')
    },
  });

  const onClick = (wattRef: any) => {
    enableEdit(!editEnabled);
    // console.log("currentValue: " + currentValue);
    // console.log("previousValue: " + previousValue);

    if (editEnabled && previousValue !== currentValue) {
      onChange(currentValue);
      setPreviousValue(currentValue);
      // console.log(nodeName);
      mutateTarget.mutate({[nodeName]: currentValue});
      // TODO: Toast for confirmation or error
    }
  }

  function onNumberInputChange(value: string) {
    setCurrentValue(Number(value));
    // notify parent of change and pass the new value to the parent
  }

  return (
    <chakra.span display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
      <NumberInput size='md' maxW={90} defaultValue={initialValue} min={0} max={100} step={5} isDisabled={!editEnabled}
                   onChange={(value) => onNumberInputChange(value)}>
        <NumberInputField/>
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </NumberInput>
      <EditButton onClick={onClick} enabled={editEnabled}/>
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