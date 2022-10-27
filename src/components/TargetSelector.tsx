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
type TargetSelectorProps = PropsWithChildren<{ row: any }>;
const TargetSelector = ({row}: TargetSelectorProps) => {
  const [editEnabled, enableEdit] = useState(false);

  return (
    <chakra.span display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
      <NumberInput size='md' maxW={100} defaultValue={50} min={0} isDisabled={!editEnabled}>
        <NumberInputField/>
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </NumberInput>
      <EditButton onClick={enableEdit} enabled={editEnabled}/>
    </chakra.span>
  )
}

type EditButtonProps = PropsWithChildren<{ enabled: boolean, onClick: CallableFunction }>;
const EditButton = ({enabled, onClick}: EditButtonProps) => (
  enabled ?
    <CheckIcon marginLeft="12px" onClick={() => onClick(!enabled)} cursor="pointer"/> :
    <EditIcon marginLeft="12px" onClick={() => onClick(!enabled)} cursor="pointer"/>
)

export default TargetSelector;