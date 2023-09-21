import { useCallback } from 'react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from '@chakra-ui/react';

import { RadioButtonMode } from './components/RadioButtonMode';
import {
  DisplayMode,
  Options,
  useOptions,
} from './useOptions';

const OptionDescription: Record<string, string> = {
  dm: "Display mode",
};

const validationSchema = yup.object({
  dm: yup
    .string()
    .notRequired()
    .oneOf(["default", "slide"] as DisplayMode[])
    // j dev.optional()
    ,
});
interface FormType extends yup.InferType<typeof validationSchema> {}

export const PanelOptions: React.FC = () => {
  const [options, setOptions] = useOptions({});

  const onSubmit = useCallback(
    (values: FormType) => {
      const newOptions = (values || {}) as Options;
      if (newOptions.dm === "default") {
        delete newOptions.dm;
      }
      setOptions(newOptions);
    },
    [setOptions]
  );

  const formik = useFormik({
    initialValues: options,
    onSubmit,
    validationSchema,
  });

  return (
    <VStack
      maxW="700px"
      gap="1rem"
      justifyContent="flex-start"
      alignItems="stretch"
    >
      <RadioButtonMode />

      <form onSubmit={formik.handleSubmit}>
        <FormControl pb="1rem">
          <FormLabel fontWeight="bold">
            Persist changes to the menu configuration to:
          </FormLabel>
          <RadioGroup
            id="dm"
            onChange={(e: string) => {
              // currently RadioGroup needs this to work
              formik.setFieldValue("dm", e);
              formik.handleSubmit();
            }}
            value={formik?.values?.dm || "default"}
          >
            <Stack
              pl="30px"
              pr="30px"
              spacing={5}
              direction="column"
              borderWidth="1px"
              borderRadius="lg"
            >
              <Radio value="default" defaultChecked>
                Default display, show markdown as a scrollable page
              </Radio>
              <Radio value="slide">
                Presentation mode: attempt to fit all content on a single page, center headings
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {Object.keys(validationSchema.fields as any)
          .filter(
            (fieldName) =>
              (validationSchema.fields as any)[fieldName].type === "boolean"
          )
          .map((fieldName) => (
            <FormControl pb="1rem" key={fieldName}>
              <FormLabel fontWeight="bold" htmlFor={fieldName}>
                {OptionDescription[fieldName]}
              </FormLabel>
              <Checkbox
                name={fieldName}
                size="lg"
                bg="gray.100"
                spacing="1rem"
                onChange={(e) => {
                  // currently checkbox needs this to work
                  formik.setFieldValue(fieldName, e.target.checked);
                  formik.handleSubmit();
                }}
                isChecked={(formik.values as any)[fieldName]}
              />
            </FormControl>
          ))}

        <Button type="submit" display="none">
          submit
        </Button>
      </form>
    </VStack>
  );
};
