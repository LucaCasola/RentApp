const generateConfirmationCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";

  let code = "";

  for (let i = 0; i < 5; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return code;
};

export default generateConfirmationCode;
