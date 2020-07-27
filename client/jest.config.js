module.exports = {
	moduleNameMapper: {
		'\\.(css|less|sass|scss)$': '<rootDir>/src/lib/__mocks__/styleMock.js',
	},
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js'],
	globals: {
		'ts-jest': {
			diagnostics: true,
		},
	},
};
