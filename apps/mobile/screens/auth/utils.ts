export const sanitizeCognitoErrorMessage = (message: string): string => {
  let sanitized = message.slice();
  sanitized = sanitized.replace('phone_number', 'phone number');
  return sanitized;
};
