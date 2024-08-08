import React, { HTMLInputTypeAttribute, ReactElement } from "react";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";

import { Control, FieldPath, FieldValues } from "react-hook-form";
// import { authFormSchema } from "@/lib/utils";

// const formSchema = authFormSchema("sign-up");

// interface CustomInput {
//   control: Control<z.infer<typeof formSchema>>;
//   name: FieldPath<z.infer<typeof formSchema>>;
//   label: string;
//   placeholder: string;
// }

type CustomInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder?: string;
  itemClass?: string;
  labelClass?: string;
  labelSlot?: ReactElement;
  inputSlot?: ReactElement;
};

const CustomInput = <T extends FieldValues>({
  control,
  name,
  type,
  label,
  placeholder,
  itemClass,
  labelClass,
  labelSlot,
  inputSlot,
}: CustomInputProps<T>) => {
  function computedInputType(type: undefined | string, field: any) {
    switch (type) {
      case "textarea":
        return (
          <Textarea
            placeholder={placeholder}
            className="input-class"
            {...field}
          />
        );
      default:
        return (
          <Input
            placeholder={placeholder}
            className="input-class"
            type={type}
            {...field}
          />
        );
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className={itemClass ? itemClass : "form-item"}>
          {labelSlot ? (
            labelSlot
          ) : (
            <FormLabel className={labelClass ? labelClass : "form-label"}>
              {label}
            </FormLabel>
          )}
          <div className="flex w-full flex-col">
            <FormControl>
              {inputSlot ? inputSlot : computedInputType(type, field)}
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
