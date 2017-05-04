Date.prototype.format = function(format) {
  var formattedDate = format;

  // DateFormating
  formattedDate = formattedDate
    .replace("Y", this.getFullYear())
    .replace("m", parseInt(this.getMonth()) + 1)
    .replace(
      "d",
      this.getDate().toString().length < 2
        ? "0" + this.getDate().toString()
        : this.getDate()
    );

  // TimeFormatting
  formattedDate = formattedDate
    .replace("H", this.getHours())
    .replace("i", this.getMinutes())
    .replace(
      "s",
      this.getSeconds().toString().length < 2
        ? "0" + this.getSeconds().toString()
        : this.getSeconds()
    );

  return formattedDate;
};

module.exports = {};
