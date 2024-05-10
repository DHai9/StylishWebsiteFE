class TextUtilities {
  textStrimLength = (text, length) => {
    return text
      .slice(0, length)
      .split(" ")
      .slice(0, length - 1)
      .join(" ");
  };

  numberToMenyStr = (number) => {
    if (!number) {
      return "0";
    }
    return number.toLocaleString("vi", { style: "currency", currency: "VND" });
  };

  generateOrderCode = () => {
    const characters_upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const characters_lower =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    const characters_upper_length = characters_upper.length;
    const characters_lower_length = characters_lower.length;

    for (let i = 0; i < 5; i++) {
      result += characters_upper.charAt(
        Math.floor(Math.random() * characters_upper_length)
      );
    }
    result += "-";
    for (let i = 0; i < 5; i++) {
      result += characters_lower.charAt(
        Math.floor(Math.random() * characters_lower_length)
      );
    }
    result += "-";
    // Get current date
    const currentDate = new Date();
    result += `${currentDate.getDay()}${currentDate.getMonth()}${currentDate.getFullYear()}${currentDate.getHours()}${currentDate.getMinutes()}${currentDate.getSeconds()}`;
    return result;
  };
}

export default new TextUtilities();
