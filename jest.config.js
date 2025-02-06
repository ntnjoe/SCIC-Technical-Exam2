const nextJest = require("next/jest");

const createJestConfig = nextJest({
	dir: "./",
});

const customJestConfig = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	testEnvironment: "jest-environment-jsdom",
	coverageProvider: "v8",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	collectCoverage: true,
	coverageDirectory: "coverage",
	transformIgnorePatterns: ["/node_modules/(?!react-markdown)/"],
};

module.exports = createJestConfig(customJestConfig);
