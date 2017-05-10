class Numeral {
  rules() {
    return {
      id: { type: "integer", key: "primary" },
      number: { min: 0 },
      other_number: { max: 100 }
    };
  }
}

module.exports = Numeral;
