exports.name = "greet";
exports.description = "Greets a user by name.";
exports.run = async ({ name }) => {
  const whom = name || "friend";
  return `Hello, ${whom}. I am Ellie.`;
};