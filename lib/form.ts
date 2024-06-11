import { isArray } from "lodash";

type FormDeletableValue = {
  _value: any;
  _deleted: boolean;
  _temp: boolean;
  _index?: number;
};

export function getFormValue(value: any) {
  if (isFormDeletableValue(value)) {
    return value._value;
  } else {
    return value;
  }
}

export function isFormDeletableValue(value: any): value is FormDeletableValue {
  if (value && typeof value === "object") {
    return Object.keys(value).includes("_deleted");
  } else {
    return false;
  }
}

export function containFormDeletableValueArray(value: any) {
  if (isArray(value)) {
    return value.some((item) => {
      return isFormDeletableValue(item);
    });
  } else {
    return false;
  }
}

export function isFormValue(value: any) {
  if (typeof value === "object") {
    return Object.keys(value).includes("_deleted");
  } else {
    return true;
  }
}

export function setFormDeleteValue(
  value: any,
  deleted: boolean = true,
  temp: boolean = false,
  index?: number,
) {
  return {
    _value: value,
    _deleted: deleted,
    _temp: temp,
    _index: index != undefined ? index : undefined,
  };
}
