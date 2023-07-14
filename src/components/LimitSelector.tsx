import {
  chakra,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper, useToast,
} from "@chakra-ui/react";
import * as React from "react";
import {CheckIcon, EditIcon} from "@chakra-ui/icons";
import {PropsWithChildren, useState} from "react";
import axios from "axios";
import {useMutation} from "@tanstack/react-query";

type LimitSelectorProps = PropsWithChildren<{
  workloadName: string,
  value: number,
  editing: boolean,
  onValueChange: CallableFunction,
  onEditChange: CallableFunction
}>;
const LimitSelector = ({workloadName, value, editing, onValueChange, onEditChange}: LimitSelectorProps) => {
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const successToast = useToast();

  const mutateTarget = useMutation((newLimit: object) =>
    axios.patch('http://localhost:8080/api/v1/workload', newLimit), {
    onSuccess: () => {
      successToast({
        title: 'Workload limit set successfully.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const onEdit = async () => {
    if (editing) {
      if (previousValue !== value) {
        // avoid race condition with parent component
        // (when this finishes before parent gets updated values to pass as props)
        await mutateTarget.mutateAsync({"jobName": workloadName, "cpuTarget": value}); // wait before calling
      }
      setPreviousValue(null);
      onEditChange(false);
    } else {
      onEditChange(true);
      setPreviousValue(value);
    }
  }

  return (
    <chakra.span display="flex" flexDirection="row" alignItems="center"  justifyContent="flex-start">
      <NumberInput size='sm' maxW={90} defaultValue={value} min={0} max={100} step={5} isDisabled={!editing}
                   onChange={(value) => onValueChange(value)} height="32px">
        <NumberInputField/>
        <NumberInputStepper>
          <NumberIncrementStepper/>
          <NumberDecrementStepper/>
        </NumberInputStepper>
      </NumberInput>
      <EditButton onClick={() => onEdit()} enabled={editing}/>
    </chakra.span>
  )
}

type EditButtonProps = PropsWithChildren<{ enabled: boolean, onClick: CallableFunction }>;
const EditButton = ({enabled, onClick}: EditButtonProps) => (
  enabled ?
    <CheckIcon marginLeft="12px" onClick={() => onClick()} cursor="pointer" /> :
    <EditIcon marginLeft="12px" onClick={() => onClick()} cursor="pointer"/>
)

export default LimitSelector;