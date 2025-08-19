module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation updates
        "style", // Code formatting, UI changes
        "refactor", // Code improvement without changing functionality
        "perf", // Performance optimization
        "test", // Adding or modifying tests
        "build", // Changes related to the build system
        "ci", // Changes related to CI/CD
        "chore", // Miscellaneous tasks (not affecting runtime code)
        "revert", // Reverting a previous commit
      ],
    ],
    "subject-case": [2, "always", "sentence-case"], // The first letter of the commit message must be capitalized
    "header-max-length": [2, "always", 100], // Limit commit message length to a maximum of 100 characters
  },
};
