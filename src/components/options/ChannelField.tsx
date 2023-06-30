import {
  useCallback,
  useState,
} from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { CheckIcon } from '@chakra-ui/icons';
import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useHashParam } from '@metapages/hash-query';

export type Modes = "visible" | "invisible" | "hidden";

/**
 * Set the device channel (used to generate the QR code for connection)
 */

const validationSchema = yup.object({
  channel: yup.string(),
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const ChannelField: React.FC = () => {
  const [urlKey, setUrlKey] = useHashParam(
    "devicechannel",
    "superslides-output-visualization"
  );
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const onSubmit = useCallback(
    (values: FormType) => {
      setIsTyping(false);
      setUrlKey(values.channel);
    },
    [setUrlKey]
  );

  const formik = useFormik({
    initialValues: {
      channel: urlKey,
    },
    onSubmit,
    validationSchema,
  });
  const handleChangeInteral = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
      setIsTyping(true);
    },
    [formik.handleChange, setIsTyping]
  );

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormControl>
        <FormLabel>Device channel </FormLabel>

        <InputGroup>
          <Input
            id="channel"
            name="channel"
            type="string"
            onChange={handleChangeInteral}
            value={formik.values.channel}
          ></Input>
          {isTyping ? null : (
            <InputRightElement>
              <CheckIcon color="green.500" />
            </InputRightElement>
          )}
        </InputGroup>

        {/* <Button type="submit">Submit</Button> */}
      </FormControl>
    </form>
  );
};
