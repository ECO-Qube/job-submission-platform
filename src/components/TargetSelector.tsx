import {
  chakra,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper
} from "@chakra-ui/react";
import * as React from "react";
import {EditIcon} from "@chakra-ui/icons";
import {PropsWithChildren} from "react";

type TargetSelectorProps = PropsWithChildren<{row: any}>;
const TargetSelector = ({row}: TargetSelectorProps) => {
  // const [edit, enableEdit] = React.useState(false);

  return (
    <chakra.span display="flex" flexDirection="row" alignItems="center" justifyContent="flex-end">
      <NumberInput size='md' maxW={100} defaultValue={50} min={0} isDisabled={true}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {/*<EditIcon marginLeft="10px" onClick={() => enableEdit(!edit)}/>*/}
    </chakra.span>
  )
}

export default TargetSelector;