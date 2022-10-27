import {
  chakra,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react";
import * as React from "react";
import {CheckIcon, EditIcon} from "@chakra-ui/icons";
import {PropsWithChildren, useState} from "react";

// TODO: Change any
// type TargetSelectorProps = PropsWithChildren<{ currentValue: number, onTrigger: CallableFunction }>;
type TargetSelectorProps = PropsWithChildren<{ currentValue: number }>;
// const TargetSelector = ({onTrigger}: TargetSelectorProps) => {
const TargetSelector = ({currentValue}: TargetSelectorProps) => {
  const [editEnabled, enableEdit] = useState(false);

  const onClick = () => {
    enableEdit(!editEnabled);
    console.log(currentValue);
    if (!editEnabled) {
      // TODO: update value in backend if value has changed
      // if value was changed, dispatch a POST request to update the value
      // will be lifted up to the parent component in order to update the line chart
    }
  }

  return (
    <chakra.span display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
      <NumberInput size='md' maxW={90} defaultValue={currentValue} min={0} max={100} step={5} isDisabled={!editEnabled}>
        <NumberInputField />
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