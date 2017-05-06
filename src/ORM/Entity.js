class Entity {
  get(key) {
    return this[key];
  }

  set(key, value) {
    if (typeof key === "object") {
      Object.keys(key).map(() => {
        console.log(this);
      });
    }

    this[key] = value;
  }
}
