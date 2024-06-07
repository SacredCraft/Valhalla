export function getFormValue(value: any) {
  if (isFormDeletableValue(value)) {
    return value._value;
  } else {
    return value;
  }
}

export function isFormDeletableValue(value: any) {
  if (typeof value === "object") {
    return Object.keys(value).includes("_deleted");
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
